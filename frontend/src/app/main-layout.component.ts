import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { TopNavComponent } from '../styles/top-nav.component';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopNavComponent],
  template: `
    <div class="layout-root">
      <app-top-nav
        [auth]="auth"
        (goHome)="nav('/')"
        (viewPlans)="nav('/plans')"
        (openAssistant)="nav('/assistant')"
        (openAvailability)="nav('/availability')"
        (openScheduling)="nav('/scheduling')"
        (openAppointments)="nav('/appointments')"
        (openNotifications)="nav('/notifications')"
        (openProfile)="nav('/profile')"
        (openContact)="nav('/contact')"
        (openAdmin)="nav('/admin')"
        (login)="nav('/login')"
        (register)="nav('/signup')"
        (logout)="handleLogout()"
      ></app-top-nav>
      <div class="layout-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .layout-root {
      min-height: 100vh;
      background: radial-gradient(circle at top, #020617 0, #020617 45%, #000000 100%);
      color: #f9fafb;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .layout-content {
      padding-top: 0.5rem;
    }
  `]
})
export class MainLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  get auth() {
    return this.authService.getAuthData();
  }

  nav(path: string) {
    this.router.navigate([path]);
  }

  handleLogout() {
    this.authService.logout();
    this.nav('/login');
  }
}
