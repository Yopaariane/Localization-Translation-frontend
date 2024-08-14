import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { ProjectService } from './project.service';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { SingleProjectComponent } from '../../single-project/single-project.component';

interface ProjectLanguage {
  id: number;
  projectId: number;
  languageId: number;
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
  progress: number;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule, SingleProjectComponent],
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


  @ViewChild('addProjectModal', { static: true }) addProjectModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private projectService: ProjectService,
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
      });
    } else {
      console.error('User ID not found in local storage.');
    }
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
