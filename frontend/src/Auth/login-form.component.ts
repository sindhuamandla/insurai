import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  email = '';
  password = '';
  showPassword = false;
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onRegisterClick() {
    this.router.navigate(['/signup']);
  }

  handleSubmit() {
    this.error = '';
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (data) => {
        this.loading = false;
        // Navigate to home or intended page
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || err.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
