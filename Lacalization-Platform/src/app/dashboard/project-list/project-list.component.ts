import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { ProjectService } from './project.service';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbPaginationNext } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { SingleProjectComponent } from '../../single-project/single-project.component';
import { TermsServiceService } from '../../single-project/terms/terms-service.service';
import { TranslationListService } from '../../translations/translation-list/translation-list.service';

interface Terms{
  id: number;
  term: string;
  context: string;
  createdAt: Date;
  projectId: number;
  stringNumber: number;
}

interface Language {
  id: number;
  code: string;
  name: string;
}
interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  strings: number;
  languages: Language[];
  progress?: number;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule, SingleProjectComponent, NgbPaginationModule, NgbPaginationModule],
  templateUrl: './project-list.component.html',
  styleUrls: [
    '../dashboard.component.css',
    './project-list.component.css'
  ]
})
export class ProjectListComponent implements OnInit {
  @Output() projectCountChange = new EventEmitter<number>();

  projects: Project[] = [];
  projectForm: FormGroup;
  totalStringCount: number | undefined;

  currentPage = 1;
  itemsPerPage = 5;
  paginatedProjects: Project[] = [];


  @ViewChild('addProjectModal', { static: true }) addProjectModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private termsService: TermsServiceService,
    private translationListService: TranslationListService,
    private cdr: ChangeDetectorRef,
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  }

  getFlagClass(languageCode: string): string {
    return `fi fi-${languageCode}`;
  }

  loadProjects(): void {
    const userId = this.getUserId();
    if (userId !== null) {
      this.projectService.getUserProjects(userId).subscribe((projects) => {
        this.projects = projects;
        this.projectCountChange.emit(projects.length);

        // Fetch total string count and progress for each project
        this.projects.forEach(project => {
          this.getTotalStringCount(project.id);
          this.calculateTranslationProgress(project);
        });
        // Pagination
      this.updatePaginatedProjects();

      });
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedProjects();
    this.cdr.detectChanges();
  }
  updatePaginatedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.projects.slice(startIndex, endIndex);

    this.cdr.detectChanges();
  } 
  shouldShowPagination(): boolean {
    return this.projects.length > this.itemsPerPage;
  }

  calculateTranslationProgress(project: Project): void {
    this.translationListService.getOverallTranslationProgressForProject(project.id).subscribe(
      (progress: number) => {
        project['progress'] = progress;
      },
      error => {
        console.error(`Error fetching translation progress for term ${project.id}`, error);
      }
    );
  }

  getTotalStringCount(projectId: number): void {
    this.termsService.getTotalStringCountByProjectId(projectId)
      .subscribe({
        next: (stringCount: number) => { 
          const project = this.projects.find(p => p.id === projectId);
          if (project) {
            project.strings = stringCount; 
          }
        },
        error: (error) => {
          console.error('Error fetching total string count', error);
        }
      });
  }
  

// Modal
  openModal(): void {
    this.modalService.open(this.addProjectModal);
  }

  addProject(): void {
    if (this.projectForm.valid) {
      const newProject = this.projectForm.value;
      const userId = this.getUserId();
      if (userId !== null) {
        newProject.ownerId = userId;
        this.projectService.createProject(newProject).subscribe((project) => {
          this.projects.push(project);
          this.projectCountChange.emit(this.projects.length);
          this.modalService.dismissAll();
          this.projectForm.reset();

        });
      } else {
        console.error('User ID not found in local storage.');
      }
    }
  }
}
