import { Component, OnInit} from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ProjectService } from '../dashboard/project-list/project.service';
import { Project } from '../models/project.model';


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


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
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
    });
  }
}
