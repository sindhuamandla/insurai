import { Routes } from '@angular/router';
import { HomePageComponent } from '../Home/home-page.component';
import { LoginFormComponent } from '../Auth/login-form.component';
import { SignUpFormComponent } from '../Auth/sign-up-form.component';
import { PlansPageComponent } from '../Plans/plans-page.component';
import { AssistantPageComponent } from '../Assistant/assistant-page.component';
import { AgentAvailabilityPageComponent } from '../AgentAvailability/agent-availability-page.component';
import { AppointmentSchedulingPageComponent } from '../AppointmentScheduling/appointment-scheduling-page.component';
import { AppointmentManagementPageComponent } from '../AppointmentManagement/appointment-management-page.component';
import { NotificationsPageComponent } from '../Notifications/notifications-page.component';
import { ProfilePageComponent } from '../Profile/profile-page.component';
import { ContactSupportPageComponent } from '../Contact/contact-support-page.component';
import { AdminDashboardComponent } from '../Admin/admin-dashboard.component';
import { MainLayoutComponent } from './main-layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // Routes without layout wrapper
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'signup', component: SignUpFormComponent },

  // Admin route (has its own layout logic inside component or use a wrapper if needed)


  // Routes with Main Layout (TopNav)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'plans', component: PlansPageComponent },
      {
        path: 'assistant',
        component: AssistantPageComponent,
        canActivate: [authGuard],
        data: { roles: ['CUSTOMER', 'AGENT', 'ADMIN'] }
      },
      {
        path: 'availability',
        component: AgentAvailabilityPageComponent,
        canActivate: [authGuard],
        data: { roles: ['AGENT'] }
      },
      {
        path: 'scheduling',
        component: AppointmentSchedulingPageComponent,
        canActivate: [authGuard],
        data: { roles: ['CUSTOMER'] }
      },
      {
        path: 'appointments',
        component: AppointmentManagementPageComponent,
        canActivate: [authGuard],
        data: { roles: ['CUSTOMER', 'AGENT', 'ADMIN'] }
      },
      {
        path: 'notifications',
        component: NotificationsPageComponent,
        canActivate: [authGuard],
        data: { roles: ['CUSTOMER', 'AGENT', 'ADMIN'] }
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [authGuard],
        data: { roles: ['CUSTOMER', 'AGENT', 'ADMIN'] }
      },
      { path: 'contact', component: ContactSupportPageComponent },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
