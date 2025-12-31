import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  showPassword = false;
  error = '';
  fieldError = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }

  handlePhoneChange(value: string) {
    // allow only digits and spaces for UX, validate on submit
    this.phone = value.replace(/[^\d\s]/g, "");
    this.fieldError = "";
  }

  validatePhone(value: string): string {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      return "Phone number must be exactly 10 digits.";
    }
    return "";
  }

  handleSignUp() {
    this.error = "";
    this.fieldError = "";

    const phoneValidationError = this.validatePhone(this.phone);
    if (phoneValidationError) {
      this.fieldError = phoneValidationError;
      return;
    }

    this.loading = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        // Navigate to login after successful signup
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || err.message || "Registration failed. Please try again.";
        this.loading = false;
      }
    });
  }
}
