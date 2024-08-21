import { Component, OnInit, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { TermsServiceService } from './terms-service.service';
import { ProjectService } from '../../dashboard/project-list/project.service';
import { ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../../dashboard/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationListService } from '../../translations/translation-list/translation-list.service';

interface Terms{
  id: number;
  term: string;
  context: string;
  createdAt: Date;
  projectId: number;
  stringNumber: number;
  progress?: number;
}
interface Translations{
  id: number;
  translationText: string;
  termId: number;
  languageId: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [NavBarComponent,CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule],
  templateUrl: './terms.component.html',
  styleUrls: [
    './terms.component.css',
    '../../dashboard/dashboard.component.css',
    '../single-project.component.css'
  ]
})
export class TermsComponent implements OnInit{
  
  @ViewChild('addTermModal', { static: true }) addTermModal!: TemplateRef<any>;

  projectId: number | null = null;
  noTerms = false;

  terms: Terms[] = [];
  termsForm: FormGroup;

  currentPage = 1;
  itemsPerPage = 5;
  paginatedTerms: Terms[] = [];

  constructor(
    private fb: FormBuilder,
    private termsService: TermsServiceService,
    private modalService: NgbModal,
    private translationListService: TranslationListService,
    private route: ActivatedRoute,

  ){

    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log("project id " ,id);
      
        this.projectId = Number(id);
        this.loadTerms(this.projectId);
    });

    this.termsForm = this.fb.group({
      term: ['', Validators.required],
      context:['', Validators.nullValidator],
      projectId:[this.projectId, Validators.nullValidator]
    })
  }

  ngOnInit(): void {
    
  }

  // Load terms in the list
  loadTerms(projectId: number): void {
    this.termsService.getTermsByProjectId(projectId).subscribe(
      (terms: Terms[]) => {
        if (terms.length === 0) {
          this.noTerms = true;
        } else {
          this.noTerms = false;
          this.terms = terms;
          // For each term, calculate the translation progress
        this.terms.forEach(term => {
          this.calculateTranslationProgress(term);
        });
        this.updatePaginatedTerms();
        }
      },
      error => {
        console.error('Error loading project terms', error);
      }
    );
  }

  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedTerms();
  }
  updatePaginatedTerms(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTerms = this.terms.slice(startIndex, endIndex);
  } 
  shouldShowPagination(): boolean {
    return this.terms.length > this.itemsPerPage;
  }

  calculateTranslationProgress(term: Terms): void {
    this.translationListService.getTranslationProgressForTerm(term.id).subscribe(
      (progress: number) => {
        term['progress'] = progress;
      },
      error => {
        console.error(`Error fetching translation progress for term ${term.id}`, error);
      }
    );
  }
  

  getTermsNameById(id: number): string{
    const terms = this.terms.find(term => term.id === id);
    return terms ? terms.term : 'Unknown Term';
  }

  // Delete term
deleteTerm(id: number): void {
  this.termsService.deleteTerm(id).subscribe(
    () => {
      // On success, remove the term from the list
      this.terms = this.terms.filter(term => term.id !== id);
    },
    error => {
      console.error('Error deleting term:');
    }
  );
}


  // Modal logic
  openModal(): void{
    this.modalService.open(this.addTermModal)
  }

  addTerm(): void {
    console.log('projectId', this.projectId);

    if (this.termsForm.valid) {
      const newTerm = this.termsForm.value;
      const projectId = this.projectId;
       
        this.termsService.createTerms(newTerm).subscribe((terms) =>{
          this.terms.push(terms);
          this.modalService.dismissAll();
          this.termsForm.reset();
          this.reloadPage();
        });
      
    }
  }

  reloadPage(): void {
    window.location.reload();
  }
}
