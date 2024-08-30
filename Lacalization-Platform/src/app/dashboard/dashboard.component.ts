import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CommonModule } from '@angular/common';
import { TermsServiceService } from '../single-project/terms/terms-service.service';
import { TranslationListService } from '../translations/translation-list/translation-list.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, ProjectListComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css'
  ]
})
export class DashboardComponent{
  projectCount: number = 0;
  totalStringNumber: number | undefined;
  stringProgress: number | undefined;
  adminId: number | undefined;
  averageProgress: number | undefined;

  constructor(
    private translationService: TranslationListService
  ) {}

  onAdminIdChange(adminId: number): void {
    this.adminId = adminId;
    this.fetchTotalStringNumber(adminId);
    this.fetchStringsTranslationProgress(adminId);
    this.fetchAverageTranslationProgressForUser(adminId);
  }

  updateProjectCount(count: number): void {
    this.projectCount = count;
  }

  fetchTotalStringNumber(adminId: number): void {
    this.translationService.getTotalStringNumber(adminId).subscribe(
      (totalStrings) => {
        this.totalStringNumber = totalStrings;
      },
      (error) => {
        console.error('Error fetching total string number', error);
      }
    );
  }

  fetchStringsTranslationProgress(adminId: number): void {
    this.translationService.getStringsTranslationProgress(adminId).subscribe(
      (progress) => {
        this.stringProgress = progress;
        console.log(progress);
      },
      (error) => {
        console.error('Error fetching strings translation progress', error);
      }
    );
  }

  fetchAverageTranslationProgressForUser(adminId: number): void{
    this.translationService.getAverageTranslationProgressForUser(adminId).subscribe(
      (averageProgress) => {
        this.averageProgress = averageProgress;
      }
    );
  }
}
