import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from './appointment.service';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-appointment-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-management-page.component.html',
  styleUrls: ['./appointment-management-page.component.css']
})
export class AppointmentManagementPageComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error = '';

  statusFilter = 'ALL';
  agentFilter = 'ALL';
  dateFilter = 'ALL';
  updatingId: number | null = null;

  authRole: string = 'ADMIN';

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    const role = this.authService.getRole();
    if (role) {
      this.authRole = role;
    }
  }

  ngOnInit() {
    this.loadAppointments();
  }

  get agentOptions(): { id: string | number, name: string }[] {
    const map = new Map<string | number, string>();
    this.appointments.forEach((a) => {
      if (a.agentId && a.agentName) {
        map.set(a.agentId, a.agentName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  loadAppointments() {
    this.loading = true;
    this.error = '';

    this.appointmentService.getAppointments(this.authRole).subscribe({
      next: (data) => {
        this.appointments = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.error = 'Could not load appointments. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleStatusChange(appointmentId: number, newStatus: string) {
    this.updatingId = appointmentId;
    this.appointmentService.updateStatus(appointmentId, newStatus).subscribe({
      next: () => {
        this.appointments = this.appointments.map(a =>
          a.id === appointmentId ? { ...a, status: newStatus } : a
        );
        this.updatingId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Could not update status. Please try again.');
        this.updatingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredAppointments(): Appointment[] {
    const now = new Date();

    return this.appointments.filter((a) => {
      // status
      if (this.statusFilter !== 'ALL' && a.status !== this.statusFilter) return false;

      // agent
      // Note: agentId might be number, filter is likely string from select
      if (this.agentFilter !== 'ALL' && String(a.agentId) !== String(this.agentFilter))
        return false;

      // date
      if (this.dateFilter !== 'ALL' && a.scheduledAt) {
        const dt = new Date(a.scheduledAt);

        if (this.dateFilter === 'TODAY') {
          if (isNaN(dt.getTime())) return false;
          const sameDay =
            dt.getFullYear() === now.getFullYear() &&
            dt.getMonth() === now.getMonth() &&
            dt.getDate() === now.getDate();
          if (!sameDay) return false;
        } else if (this.dateFilter === 'NEXT_7') {
          if (isNaN(dt.getTime())) return false;
          const diffMs = dt.getTime() - now.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays < 0 || diffDays > 7) return false;
        } else if (this.dateFilter === 'THIS_MONTH') {
          if (isNaN(dt.getTime())) return false;
          const sameMonth =
            dt.getFullYear() === now.getFullYear() &&
            dt.getMonth() === now.getMonth();
          if (!sameMonth) return false;
        }
      }

      return true;
    });
  }
}
