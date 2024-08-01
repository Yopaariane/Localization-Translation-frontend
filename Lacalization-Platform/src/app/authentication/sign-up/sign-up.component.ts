import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: [
    './sign-up.component.css',
    '../authentication.component.css'
  ]
})
export class SignUpComponent {
  signupData = { name: '', email: '', password: '' };
  signupError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.authService.register(this.signupData).subscribe(
      response => {
        console.log('User signed up successfully:', response);
        this.authService.setToken(response.token);
        this.router.navigate(['/app']);
      },
      error => {
        console.error('Error:', error);
        this.signupError = 'Sign up failed: ' + (error.error?.message || 'Unknown error');
      }
    );
  }
}
