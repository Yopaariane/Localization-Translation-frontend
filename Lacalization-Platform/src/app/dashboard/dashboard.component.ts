import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectListComponent } from './project-list/project-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, ProjectListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css'
  ]
})
export class DashboardComponent{
  projectCount: number = 0;

  updateProjectCount(count: number): void {
    this.projectCount = count;
  }
}
