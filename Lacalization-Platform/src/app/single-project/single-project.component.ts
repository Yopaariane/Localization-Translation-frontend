import { Component, OnInit} from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ProjectService } from '../dashboard/project-list/project.service';
import { Project } from '../models/project.model';
import { TranslationListService } from '../translations/translation-list/translation-list.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-single-project',
  standalone: true,
  imports: [NavBarComponent, FormsModule, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './single-project.component.html',
  styleUrl: './single-project.component.css'
})
export class SingleProjectComponent implements OnInit {

  projectId: number | null = null;
  projectName: string | undefined;
  projects: Project[] = [];
  progress: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private translationListService: TranslationListService,
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadProjectDetails(this.projectId);
      }
    });
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe((project: Project) => {
      this.projectName = project.name;

       // progess
      this.calculateTranslationProgress(project);
    });
  }

  calculateTranslationProgress(project: Project): void {
    this.translationListService.getOverallTranslationProgressForProject(project.id).subscribe(
      (progress: number) => {
        project['progress'] = progress;
        console.log(project.progress);
        this.progress = project.progress;
      },
      error => {
        console.error(`Error fetching translation progress for term ${project.id}`, error);
      }
    );
  }
}
