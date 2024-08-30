import { Component, OnInit, ViewChild } from '@angular/core';
import { SingleProjectComponent } from '../single-project.component';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SingleProjectService } from '../single-project.service';
import { languageService } from '../language.service';
import { CommonModule } from '@angular/common';
import { TermsServiceService } from '../terms/terms-service.service';
import { TranslationListService } from '../../translations/translation-list/translation-list.service';
import { Terms } from '../../models/terms.model';
import { Language } from '../../models/project.model';
import { ProjectLanguage } from '../../models/project-language.model';
import { Translations } from '../../models/tarnslation.model';


@Component({
  selector: 'app-project-languages',
  standalone: true,
  imports: [SingleProjectComponent, FormsModule, CommonModule, RouterModule, NgbPaginationModule],
  templateUrl: './project-languages.component.html',
  styleUrls: [
    './project-languages.component.css',
    '../single-project.component.css'
  ]
})
export class ProjectLanguagesComponent implements OnInit {
  @ViewChild('ModalTemplate', { static: true }) ModalTemplate: any;


  projectLanguages: ProjectLanguage[] = [];
  languages: Language[] = [];
  noLanguages = false;

  selectedLanguages: Language[] = [];
  selectedLanguage: string = '';
  showDropdown: boolean = false;
  projectId: number | null = null;
  projectName: string | undefined;
  translations: Translations[] = [];
  terms: Terms[] = []

  currentPage = 1;
  itemsPerPage = 5;
  paginatedProjectLanguage: ProjectLanguage[] = [];

  sortOrder: string = 'Date Asc';

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private languageService: languageService,
    private translationListService: TranslationListService
  ){}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadProjectLanguages(this.projectId);
        this.loadLanguages();
      }
    });
  }


  loadProjectLanguages(projectId: number): void {
    this.singleProjectService.getLanguageByProjectId(projectId).subscribe(
      (projectLanguages: ProjectLanguage[]) => {
        if (projectLanguages.length === 0) {
          this.noLanguages = true;
        } else {
          this.noLanguages = false;
          this.projectLanguages = projectLanguages;

          this.updatePaginatedProjectLanguage();

         // Fetch and set progress for each language
         projectLanguages.forEach(pl => {
          this.updateLanguageProgress(pl.languageId);
          this.sortTerms();
         }); 
        }
      },
      error => {
        console.error('Error loading project languages', error);
      }
    );
  }

  updateSortOrder(order: string) {
    this.sortOrder = order;
    this.sortTerms();
  }

  sortTerms() {
    switch (this.sortOrder) {
        case 'Name Asc':
            this.languages.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'Name Desc':
            this.languages.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
    this.loadLanguages();
  }

  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedProjectLanguage();
  }
  updatePaginatedProjectLanguage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjectLanguage = this.projectLanguages.slice(startIndex, endIndex);
  } 
  shouldShowPagination(): boolean {
    return this.projectLanguages.length > this.itemsPerPage;
  }

  loadLanguages(): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });
  }

  updateLanguageProgress(languageId: number): void {
    if (this.projectId) {
      this.translationListService.getTranslationProgressForLanguage(languageId, this.projectId).subscribe(
        (progress: number) => {
          // progress
          const projectLanguage = this.projectLanguages.find(pl => pl.languageId === languageId);
          if (projectLanguage) {
            projectLanguage.progress = progress;
          }
        },
        error => {
          console.error(`Error fetching translation progress for language ${languageId}`, error);
        }
      );
    }
  }
  
  // flag icon method
  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }

// Modal management
  addLanguage(): void {
    const language = this.languages.find(lang => lang.name === this.selectedLanguage);
    if (language && !this.selectedLanguages.some(l => l.id === language.id)) {
      this.selectedLanguages.push(language);
    }
    this.selectedLanguage = '';
    this.showDropdown = false;
  }

  selectLanguage(language: Language): void {
    if (!this.selectedLanguages.some(l => l.id === language.id)) {
      this.selectedLanguages.push(language);
    }
    this.selectedLanguage = ''; // Clear the input if necessary
    this.showDropdown = false;
  }

  removeLanguage(language: Language): void {
    this.selectedLanguages = this.selectedLanguages.filter(l => l.id !== language.id);
  }

  openLanguageModal() {
    this.modalService.open(this.ModalTemplate);
  }
  
  saveLanguages(modal: NgbModalRef): void {
    if (this.projectId && this.selectedLanguages.length > 0) {
      const projectLanguages: ProjectLanguage[] = this.selectedLanguages.map(lang => ({
        id: 0,
        projectId: this.projectId!,
        languageId: lang.id
      }));
  
      // Prevent saving a language that is already associated with the project
      const newProjectLanguages = projectLanguages.filter(pl => 
        !this.projectLanguages.some(existing => existing.languageId === pl.languageId)
      );
  
      if (newProjectLanguages.length > 0) {
        const saveRequests = newProjectLanguages.map(pl => this.singleProjectService.assignLanguageToProject(pl));
        forkJoin(saveRequests).subscribe(() => {
          // Reload the project languages after saving
          this.loadProjectLanguages(this.projectId!);
          modal.close(); // Close the modal
        });
      } else {
        modal.close(); // Close the modal even if there are no new languages to save
      }
    } else {
      modal.close(); // Close the modal if no valid selections are made
    }
  }

  filteredLanguages(): Language[] {
    return this.languages.filter(lang => lang.name.toLowerCase().includes(this.selectedLanguage.toLowerCase()));
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  // Modal management


  // Language name and code
  getLanguageNameById(id: number): string {
    const language = this.languages.find(lang => lang.id === id);
    return language ? language.name : 'Unknown Language'; // Handle the case where the language is not found
  }
  getLanguageCodeById(id: number): string {
    const language = this.languages.find(lang => lang.id === id);
    return language ? language.code : 'Unknown Language'; // Handle the case where the language is not found
  }

  // Delete Language from list
  deleteLanguage(id: number): void {
    this.singleProjectService.deleteProjectLanguage(id).subscribe(
      () => {
        this.projectLanguages = this.projectLanguages.filter(lang => lang.id !== id);
        this.loadProjectLanguages(this.projectId!);
      },
      error => {
        console.error('Error deleting project language', error);
      }
    );
  }
}
