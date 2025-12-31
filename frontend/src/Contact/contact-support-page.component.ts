import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportService } from './support.service';

const CATEGORIES = [
  "Appointment Issue",
  "Plan / Policy Question",
  "Account / Login Problem",
  "Feedback / Suggestion",
  "Other",
];

@Component({
  selector: 'app-contact-support-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-support-page.component.html',
  styleUrls: ['./contact-support-page.component.css']
})
export class ContactSupportPageComponent {
  categories = CATEGORIES;

  form = {
    subject: "",
    category: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  };

  errors: any = {};
  file: File | null = null;
  submitting = false;
  success = false;

  constructor(
    private router: Router,
    private supportService: SupportService,
    private cdr: ChangeDetectorRef
  ) { }

  goHome() { this.router.navigate(['/']); }
  goAppointments() { this.router.navigate(['/appointments']); }
  goPlans() { this.router.navigate(['/plans']); }
  goFaq() { this.router.navigate(['/assistant']); } // Assuming FAQ/Assistant link

  update(field: string, value: string) {
    this.form = { ...this.form, [field]: value };
    this.errors = { ...this.errors, [field]: "" };
  }

  handleFile(event: any) {
    this.file = event.target.files?.[0] || null;
  }

  validate(): boolean {
    const e: any = {};
    if (!this.form.subject.trim()) e.subject = "Subject is required.";
    if (!this.form.category) e.category = "Please select a category.";
    if (!this.form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(this.form.email)) e.email = "Enter a valid email.";
    if (!this.form.message.trim()) e.message = "Please describe your issue or question.";
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  handleSubmit() {
    if (!this.validate()) return;
    this.submitting = true;

    const formData = new FormData();
    formData.append('subject', this.form.subject);
    formData.append('category', this.form.category);
    formData.append('message', this.form.message);
    // Add user details if needed by backend, though backend usually takes from token
    // Assuming backend might use these for anonymous or just for record
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    if (this.form.phone) formData.append('phone', this.form.phone);

    if (this.file) {
      formData.append('attachment', this.file);
    }

    this.supportService.submitTicket(formData).subscribe({
      next: (ticket) => {
        this.submitting = false;
        this.success = true;
        this.clearFormOnly();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to submit ticket", err);
        alert("Could not submit ticket. Please try again.");
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearFormOnly() {
    this.form = {
      subject: "",
      category: "",
      name: "",
      email: "",
      phone: "",
      message: "",
    };
    this.file = null;
    this.errors = {};
    // Do not clear success state immediately
  }

  clearForm() {
    this.form = {
      subject: "",
      category: "",
      name: "",
      email: "",
      phone: "",
      message: "",
    };
    this.file = null;
    this.errors = {};
    this.success = false;
  }
}
