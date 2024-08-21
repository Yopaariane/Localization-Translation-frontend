import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SingleProjectComponent } from '../single-project/single-project.component';
import { SingleProjectService } from '../single-project/single-project.service';
import { ProjectService } from '../dashboard/project-list/project.service';

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
  ownerId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.fetchProjectLanguageDetails(id);
  }

  backPage(){
    window.history.back();
  }

  fetchProjectLanguageDetails(id: number): void {
    this.singleProjectService.getProjectLanguageById(id).subscribe((projectLanguage) => {
      this.projectId = projectLanguage.projectId;
      this.fetchProjectDetails(this.projectId);
    });
  }

  fetchProjectDetails(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe((project) => {
      this.ownerId = project.ownerId;
    })
  }
}
