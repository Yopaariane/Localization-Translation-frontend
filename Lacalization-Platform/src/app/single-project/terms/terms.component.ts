import { Component, OnInit, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { TermsServiceService } from './terms-service.service';
import { ProjectService } from '../../dashboard/project-list/project.service';
import { ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../../dashboard/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

interface Terms{
  id: number;
  term: string;
  context: string;
  createdAt: Date;
  projectId: number;
  stringNumber: number;
}

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [NavBarComponent,CommonModule, FormsModule, ReactiveFormsModule],
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

  constructor(
    private fb: FormBuilder,
    private termsService: TermsServiceService,
    private modalService: NgbModal,
    private projectService: ProjectService,
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
        }
      },
      error => {
        console.error('Error loading project terms', error);
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
        });
      
    }
  }
}
