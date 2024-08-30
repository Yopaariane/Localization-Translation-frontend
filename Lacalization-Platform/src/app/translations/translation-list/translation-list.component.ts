import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslationListService } from './translation-list.service';
import { SingleProjectService } from '../../single-project/single-project.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TermsServiceService } from '../../single-project/terms/terms-service.service';
import { CommonModule, NgClass } from '@angular/common';
import { ProjectService } from '../../dashboard/project-list/project.service';
import { FormsModule, NgModel } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { Translations } from '../../models/tarnslation.model';
import { Terms } from '../../models/terms.model';
import { filter, Subscription } from 'rxjs';
import { ChatComponent } from "../../chat/chat.component";
import bootstrap from '../../../main.server';

@Component({
  selector: 'app-translation-list',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, NgbPaginationModule, ChatComponent],
  templateUrl: './translation-list.component.html',
  styleUrls: [
    './translation-list.component.css',
    '../../single-project/terms/terms.component.css'
  ]
})
export class TranslationListComponent implements OnInit {
  @ViewChild('modalTemplate', { static: true }) modalTemplate: any;

  @ViewChild('chatModal', {static: true}) chatModal: any;

  translation: Translations[] = [];
  terms: Terms[] = [];
  projectId!: number;
  languageId!: number;
  ownerId!: number;

  draftTranslations: {[termId: number]: string} = {};
  activeInputs: {[termId: number]: boolean} = {};
  routeId!: number;

  formats: string[] = ['json', 'csv', 'pdf', 'xml', 'xls'];
  selectedFormat: string = 'json';
  showDropdown: boolean = false;
  filteredFormats: string[] = [...this.formats];

  currentPage = 1;
  itemsPerPage = 10;
  paginatedTranslation: Terms[] = [];
  routeSubs: Subscription | undefined;
  routerSub: Subscription | undefined;

  sortOrder: string = 'Date Asc';
  
  constructor(
    private route: ActivatedRoute,
    private translationListService: TranslationListService,
    private singleProjectService: SingleProjectService,
    private termsService: TermsServiceService,
    private projectService: ProjectService,
    private modalService: NgbModal,
    private exportService: ExportService,
    private router: Router
  ){}

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateRouteId();
    }); 
    
    
    this.routeId = +this.route.snapshot.parent?.paramMap.get('id')!;
    this.fetchProjectLanguageDetails();
  }
  updateRouteId() {
    this.translationListService.onLanguageChanged$.subscribe(projectLangId => {
       this.routeId = projectLangId
      this.fetchProjectLanguageDetails();
    })
  }

  fetchProjectLanguageDetails(): void {
    
    this.singleProjectService.getProjectLanguageById(this.routeId).subscribe((projectLanguage) => {

      this.languageId = projectLanguage.languageId;
      this.projectId = projectLanguage.projectId;
      this.fetchProjectDetails(this.projectId);
    });
  }

  fetchProjectDetails(projectId: number): void {

    this.projectService.getProjectById(projectId).subscribe((project) => {
      this.ownerId = project.ownerId;
      this.loadTermsAndTranslations();
    })
  }

  // sorting
  updateSortOrder(order: string) {
    this.sortOrder = order;
    this.sortTerms();
  }

  loadTermsAndTranslations(): void {

    this.termsService.getTermsByProjectId(this.projectId).subscribe((terms) => {
      this.terms = terms;
      this.translationListService.getTranslationsByLanguageId(this.languageId).subscribe((translations) => {
        this.translation = translations;
        this.sortTerms();
      });
      this.updatePaginatedTranslation();
    });
  }

  sortTerms() {
    switch (this.sortOrder) {
        case 'Date Asc':
            this.terms.sort((a, b) => {

                return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
            });
            break;
        case 'Date Desc':
            this.terms.sort((a, b) => {
                return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
            });
            break;
        case 'Name Asc':
            this.terms.sort((a, b) => a.term.localeCompare(b.term));
            break;
        case 'Name Desc':
            this.terms.sort((a, b) => b.term.localeCompare(a.term));
            break;
    }
    this.updatePaginatedTranslation();
  }

  // pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedTranslation();
  }
  updatePaginatedTranslation(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.paginatedTranslation = this.terms.slice(startIndex, endIndex);
  } 
  shouldShowPagination(): boolean {
    return this.terms.length > this.itemsPerPage;
  }

  getTranslationForTerm(termId: number): Translations | any {
    return this.translation.find(t => t.termId === termId);
  }

  onInput(termId: number): void {
    this.activeInputs[termId] = !!this.draftTranslations[termId];
  }

  isInputActive(termId: number): boolean {
    return !!this.activeInputs[termId];
  }

  saveTranslation(termId: number): void {
    const translationText = this.draftTranslations[termId];
  
    if (translationText) {
      const translation: Partial<Translations> = {
        translationText: translationText,
        termId: termId,
        languageId: this.languageId,
        creatorId: this.ownerId,
      };
  
      // Logging to check values before sending the request
      console.log('Saving translation with payload:', translation);
  
      this.translationListService.createTranslation(translation as Translations).subscribe(
        (savedTranslation) => {
          this.translation.push(savedTranslation);
          delete this.draftTranslations[termId];
          this.activeInputs[termId] = false;
          this.reloadPage();
        },
        (error) => {
          console.error('Error saving translation:', error);
        }
      );
    } else {
      console.error('No translation text provided for termId:', termId);
    }
  }
  

  reloadPage(): void {
    this.loadTermsAndTranslations()

  }

  updateTranslation(termId: number): void {
    const translation = this.getTranslationForTerm(termId);
    if (translation) {
      translation.translationText = this.draftTranslations[termId] || translation.translationText;

      this.translationListService.updateTranslation(translation.id, translation).subscribe(
        () => {
          this.activeInputs[termId] = false;
          delete this.draftTranslations[termId];
          this.reloadPage();
        },
        (error) => {
          console.error('Error updating translation:', error);
        }
      );
    } else {
      console.error('No existing translation found for termId:', termId);
    }
  }

  deleteTranslation(termId: number): void {
    const translation = this.getTranslationForTerm(termId);
    if (translation) {
      this.translationListService.deleteTranslation(translation.id).subscribe(
        () => {
          this.translation = this.translation.filter(t => t.termId !== termId);
          delete this.draftTranslations[termId];
          this.activeInputs[termId] = false;
          this.reloadPage();
        },
        (error) => {
          console.error('Error deleting translation:', error);
        }
      );
    } else {
      console.error('No translation to delete for termId:', termId);
    }
  }

  // Export Modal
  openExportModal() {
    this.modalService.open(this.modalTemplate);
  }
  openChatModal() {
    this.modalService.open(this.chatModal);
  }

  filterFormats(): void {
    this.filteredFormats = this.formats.filter(format =>
      format.toLowerCase().includes(this.selectedFormat.toLowerCase())
    );
  }

  selectFormat(format: string): void {
    this.selectedFormat = format;
    this.showDropdown = false;
  }

  onBlur(): void {
    setTimeout(() => this.showDropdown = false, 200);
  }

  downloadFile(): void {
    if (this.selectedFormat === 'json') {
      this.exportService.exportTranslationsToJson(this.projectId, this.languageId)
        .subscribe(() => console.log('JSON file downloaded'));
    } else if (this.selectedFormat === 'csv') {
      this.exportService.exportTranslationsToCsv(this.projectId, this.languageId)
        .subscribe(() => console.log('CSV file downloaded'));
    } else {
      console.warn('Unsupported format');
    }
  }
}
