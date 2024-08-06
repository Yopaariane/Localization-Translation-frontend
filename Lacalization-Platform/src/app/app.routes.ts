import { Routes } from '@angular/router';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { AuthGuard } from './authentication/auth.guard';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SingleProjectComponent } from './single-project/single-project.component';

export const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LogInComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'project/:id', component: SingleProjectComponent },
  { path: 'app', component: AppComponent, canActivate: [AuthGuard], children: [
    { path: 'dashboard', component: DashboardComponent }
  ] 
    },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // Wildcard route for handling 404
];
