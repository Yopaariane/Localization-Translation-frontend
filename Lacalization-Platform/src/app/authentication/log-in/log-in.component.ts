import { Component } from '@angular/core';
import { AuthService, UserResponse } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StorageServiceService } from '../../storage-service.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './log-in.component.html',
  styleUrls: [
    './log-in.component.css',
    '../authentication.component.css'
  ]
})
export class LogInComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private localStorage: StorageServiceService) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (data: UserResponse) => {
          console.log('User logged in successfully:', data);
          this.localStorage.setitem('user', JSON.stringify(data));
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error:', error);
          this.loginError = 'Login failed: ' + (error.error || error.message || 'Unknown error');
        }
      });
    }
  }
}
