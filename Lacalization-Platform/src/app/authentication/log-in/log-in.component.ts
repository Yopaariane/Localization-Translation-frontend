import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: [
    './log-in.component.css',
    '../authentication.component.css'
  ]
})
export class LogInComponent {
  loginData = { name: '', password: '' };
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe(
      response => {
        console.log('User logged in successfully:', response);
        this.authService.setToken(response.token);
        this.router.navigate(['/app']);
      },
      error => {
        console.error('Error:', error);
        this.loginError = 'Login failed: ' + (error.error?.message || 'Unknown error');
      }
    );
  }
}
