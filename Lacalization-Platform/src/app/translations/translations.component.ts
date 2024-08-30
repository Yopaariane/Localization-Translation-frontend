import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SingleProjectService } from '../single-project/single-project.service';
import { ProjectService } from '../dashboard/project-list/project.service';
import { TranslationListService } from './translation-list/translation-list.service';
import { Language } from '../models/project.model';
import { languageService } from '../single-project/language.service';
import { ProjectLanguage } from '../models/project-language.model';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [NavBarComponent,FormsModule, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './translations.component.html',
  styleUrls: [
    './translations.component.css',
    '../single-project/single-project.component.css'

  ]
})
export class TranslationsComponent implements OnInit {
  projectId!: number;
  languageId!: number;
  ownerId!: number;
  projectProgress: number | undefined;
  projectName: string | undefined;
  languageName: string | undefined;
  languageCode!: string;

  showDropdown: boolean = false;
  languages: Language[] = [];
  projectLanguage: ProjectLanguage[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private projectService: ProjectService,
    private translationListService: TranslationListService,
    private languageService: languageService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.fetchProjectLanguageDetails(id); 
    });
  }

  backPage(){
    window.history.back();
  }

  fetchProjectLanguageDetails(id: number): void {
    this.singleProjectService.getProjectLanguageById(id).subscribe((projectLanguage) => {
      this.projectId = projectLanguage.projectId;
      this.languageId = projectLanguage.languageId;
      this.fetchProjectDetails(this.projectId);
      this.fetchLanguageDetails(this.languageId);
      this.loadLanguages(this.projectId);
    });
  }

  fetchProjectDetails(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe((project) => {
      this.ownerId = project.ownerId;
      this.projectName = project.name;
    });
    this.translationListService.getOverallTranslationProgressForProject(projectId).subscribe((progress) => {
      this.projectProgress = progress;
    });
  }

  fetchLanguageDetails(languageId: number): void{
    this.languageService.getLanguageById(languageId).subscribe((language) =>{
      this.languageName = language.name;
      this.languageCode = language.code;
    })
  }

  loadLanguages(projectId: number): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });

    this.singleProjectService.getLanguageByProjectId(projectId).subscribe((projectLanguage: ProjectLanguage[]) => {
      this.projectLanguage = projectLanguage;
    });
  }
  filteredLanguages(): Language[] {
    return this.languages
      .filter(lang => this.projectLanguage.some(pl => pl.languageId === lang.id));
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  navigateToProjectLanguage(languageId: number): void {
    const projectId = this.projectId; 
    this.singleProjectService.getProjectLanguageByLanguageIdAndProjectId(projectId, languageId).subscribe((projectLanguage) => {
      const projectLanguageId = projectLanguage.id; 
      this.translationListService.onLanguageChanged$.next(projectLanguageId)
      this.router.navigate(['/projectLanguage', projectLanguageId]);
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }
}
