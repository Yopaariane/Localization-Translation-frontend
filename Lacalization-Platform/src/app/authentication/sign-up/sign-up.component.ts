import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sign-up.component.html',
  styleUrls: [
    './sign-up.component.css',
    '../authentication.component.css'
  ]
})
export class SignUpComponent {
  signupForm: FormGroup;
  signupError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (data) => {
          console.log('User signed up successfully:', data);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error:', error);
          this.signupError = 'Sign up failed: ' + (error.error || error.message || 'Unknown error');
        }
      });
    }
  }
}
