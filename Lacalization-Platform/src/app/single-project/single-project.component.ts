import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../dashboard/project-list/project.service';
import { Project } from '../models/project.model';
import { SingleProjectService } from './single-project.service';
import { languageService } from './language.service';
import { forkJoin } from 'rxjs';

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
  selector: 'app-single-project',
  standalone: true,
  imports: [NavBarComponent, FormsModule, CommonModule],
  templateUrl: './single-project.component.html',
  styleUrl: './single-project.component.css'
})
export class SingleProjectComponent implements OnInit {
  @Output() languageCountChange = new EventEmitter<number>();

  // popularLanguages: string[] = ['English', 'Spanish', 'French', 'German', 'Chinese'];

  projectLanguages: ProjectLanguage[] = [];
  languages: Language[] = [];
  noLanguages = false;

  selectedLanguages: Language[] = [];
  selectedLanguage: string = '';
  showDropdown: boolean = false;
  projectId: number | null = null;
  projectName: string | undefined;


  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private singleProjectService: SingleProjectService,
    private languageService: languageService
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadProjectDetails(this.projectId);
        this.loadLanguages();
      }
    });
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe((project: Project) => {
      this.projectName = project.name;
    });

    // loading project languages
    this.loadProjectLanguages(id);
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

  saveLanguages(): void {
    if (this.projectId && this.selectedLanguages.length > 0) {
      const projectLanguages: ProjectLanguage[] = this.selectedLanguages.map(lang => ({
        id: 0, // Assuming the backend will generate the ID
        projectId: this.projectId!,
        languageId: lang.id
      }));
      
      const saveRequests = projectLanguages.map(pl => this.singleProjectService.assignLanguageToProject(pl));
      forkJoin(saveRequests).subscribe(() => {
        // Reload the project languages after saving
        this.loadProjectDetails(this.projectId!);
      });
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

  getLanguageNameById(id: number): string {
    const language = this.languages.find(lang => lang.id === id);
    return language ? language.name : 'Unknown Language'; // Handle the case where the language is not found
  }

}
