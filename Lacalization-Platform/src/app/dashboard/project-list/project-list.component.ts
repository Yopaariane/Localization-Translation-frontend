import { Component, OnInit} from '@angular/core';
import { ProjectService } from './project.service';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

interface Project {
  name: string;
  description: string;
  strings: number;
  languages: string[];
  progress: number;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: [
    '../../app.component.css',
    './project-list.component.css'
  ]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    // Load projects from backend
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  openModal(): void {
    const modalRef = this.modalService.open(this.openModal);
  }

  addProject(): void {
    if (this.projectForm.valid) {
      const newProject = this.projectForm.value;
      this.projectService.addProject(newProject).subscribe((project) => {
        this.projects.push(project);
        this.modalService.dismissAll();
        this.projectForm.reset();
      });
    }
  }

  getLangIconClass(lang: string): string {
    switch (lang) {
      case 'usa': return 'bi bi-flag-usa';
      case 'germany': return 'bi bi-flag-germany';
      case 'japan': return 'bi bi-flag-japan';
      default: return 'bi bi-gear';
    }
  }
}
