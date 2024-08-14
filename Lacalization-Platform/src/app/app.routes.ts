import { Routes } from '@angular/router';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { AuthGuard } from './authentication/auth.guard';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SingleProjectComponent } from './single-project/single-project.component';
import { TermsComponent } from './single-project/terms/terms.component';
import { ProjectLanguagesComponent } from './single-project/project-languages/project-languages.component';
import { ContributorsComponent } from './single-project/contributors/contributors.component';
import { ImportsComponent } from './single-project/imports/imports.component';
import { TranslationsComponent } from './translations/translations.component';
import { TranslationListComponent } from './translations/translation-list/translation-list.component';

export const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LogInComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'project/:id', component: SingleProjectComponent, children: [
    { path: 'languages', component: ProjectLanguagesComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'contributors', component: ContributorsComponent },
    { path: 'imports', component: ImportsComponent },
    // Default route for the project page
    { path: '', redirectTo: 'languages', pathMatch: 'full' },
  ]  },
  { path: 'language/:id', component: TranslationsComponent, children: [
    { path: 'translationList', component: TranslationListComponent},
    { path: 'contributors', component: ContributorsComponent},
    { path: 'imports', component: ImportsComponent},

    { path: '', redirectTo: 'translationList', pathMatch: 'full'},
  ]},
  { path: 'projectTerms', component: TermsComponent },
  { path: 'app', component: AppComponent, canActivate: [AuthGuard], children: [
    { path: 'dashboard', component: DashboardComponent }
  ] 
    },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // Wildcard route for handling 404
];
