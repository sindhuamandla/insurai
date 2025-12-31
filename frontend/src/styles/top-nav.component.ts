import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent {
  @Input() auth: any;

  @Output() goHome = new EventEmitter<void>();
  @Output() viewPlans = new EventEmitter<void>();
  @Output() openAssistant = new EventEmitter<void>();
  @Output() openAvailability = new EventEmitter<void>();
  @Output() openScheduling = new EventEmitter<void>();
  @Output() openAppointments = new EventEmitter<void>();
  @Output() openNotifications = new EventEmitter<void>();
  @Output() openProfile = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();
  @Output() openAdmin = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  get isLoggedIn(): boolean {
    return !!this.auth?.token;
  }

  get role(): string | undefined {
    return this.auth?.role;
  }

  get isCustomer(): boolean {
    return this.role === 'CUSTOMER';
  }

  get isAgent(): boolean {
    return this.role === 'AGENT';
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }
}
