import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentAvailabilityService, AvailabilitySlot, AgentAvailabilityRequest } from './agent-availability.service';
import { AvailabilityTopBarComponent } from './availability-top-bar.component';
import { AvailabilityCalendarComponent } from './availability-calendar.component';
import { AvailabilitySummaryComponent } from './availability-summary.component';

@Component({
  selector: 'app-agent-availability-page',
  standalone: true,
  imports: [
    CommonModule,
    AvailabilityTopBarComponent,
    AvailabilityCalendarComponent,
    AvailabilitySummaryComponent
  ],
  templateUrl: './agent-availability-page.component.html',
  styleUrls: ['./agent-availability-page.component.css']
})
export class AgentAvailabilityPageComponent implements OnInit {
  view = 'week';
  selectedWeekStart = this.getMonday();
  availability: AvailabilitySlot[] = [];
  appointments: any[] = [];
  loading = true;
  error = '';

  constructor(private availabilityService: AgentAvailabilityService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
  }

  getMonday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  }

  load() {
    this.loading = true;
    this.error = '';
    this.availabilityService.getMyAvailability().subscribe({
      next: (data) => {
        // Normalize data if necessary, here we assume API returns matching shape
        // or we map it like React did. React: id, date, startTime, endTime, status, notes
        this.availability = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load availability', err);
        this.error = 'Failed to load your availability. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleCreateSlot(event: { data: AgentAvailabilityRequest, resolve: () => void, reject: (err: any) => void }) {
    this.availabilityService.createAvailability(event.data).subscribe({
      next: (created) => {
        this.availability = [...this.availability, created];
        event.resolve();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Create availability error', err);
        event.reject(err);
      }
    });
  }

  onOpenNotifications() {
    console.log('Open Notifications clicked');
  }
}
