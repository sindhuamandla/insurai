import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
  @Input() auth: any;

  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() viewPlans = new EventEmitter<void>();
  @Output() openAssistant = new EventEmitter<void>();
  @Output() openAvailability = new EventEmitter<void>();
  @Output() openScheduling = new EventEmitter<void>();
  @Output() openAppointments = new EventEmitter<void>();
  @Output() openNotifications = new EventEmitter<void>();
  @Output() openProfile = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();
  @Output() openAdmin = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  get isLoggedIn(): boolean {
    return !!this.auth?.token;
  }

  get isCustomer(): boolean {
    return this.auth?.role === 'CUSTOMER';
  }

  get isAgent(): boolean {
    return this.auth?.role === 'AGENT';
  }

  get isAdmin(): boolean {
    return this.auth?.role === 'ADMIN';
  }
}
