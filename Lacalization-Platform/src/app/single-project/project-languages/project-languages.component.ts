import { Component, OnInit, ViewChild } from '@angular/core';
import { SingleProjectComponent } from '../single-project.component';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../dashboard/project-list/project.service';
import { SingleProjectService } from '../single-project.service';
import { languageService } from '../language.service';
import { CommonModule } from '@angular/common';

interface ProjectLanguage{
  id: number;
  projectId: number;
  languageId: number;
}
interface Language{
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-project-languages',
  standalone: true,
  imports: [SingleProjectComponent, FormsModule, CommonModule],
  templateUrl: './project-languages.component.html',
  styleUrls: [
    './project-languages.component.css',
    '../single-project.component.css'
  ]
})
export class ProjectLanguagesComponent implements OnInit {
  @ViewChild('yourModalTemplate', { static: true }) yourModalTemplate: any;


  projectLanguages: ProjectLanguage[] = [];
  languages: Language[] = [];
  noLanguages = false;

  selectedLanguages: Language[] = [];
  selectedLanguage: string = '';
  showDropdown: boolean = false;
  projectId: number | null = null;
  projectName: string | undefined;


  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private singleProjectService: SingleProjectService,
    private languageService: languageService
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
        }
      },
      error => {
        console.error('Error loading project languages', error);
      }
    );
  }

  loadLanguages(): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });
  }

  // flag icon method
  getFlagClass(languageCode: string): string {
    return `fi fi-${languageCode.toLowerCase()}`;
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
    this.modalService.open(this.yourModalTemplate);
  }
  
  saveLanguages(modal: NgbModalRef): void {
    if (this.projectId && this.selectedLanguages.length > 0) {
      const projectLanguages: ProjectLanguage[] = this.selectedLanguages.map(lang => ({
        id: 0, // The backend will generate the ID
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
        // On successful deletion, remove the language from the list in the frontend
        this.projectLanguages = this.projectLanguages.filter(lang => lang.id !== id);
      },
      error => {
        console.error('Error deleting project language', error);
      }
    );
  }
}
