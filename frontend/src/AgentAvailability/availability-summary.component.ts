import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilitySlot } from './agent-availability.service';

@Component({
  selector: 'app-availability-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-summary.component.html',
  styleUrls: ['./availability-summary.component.css']
})
export class AvailabilitySummaryComponent implements OnChanges {
  @Input() availability: AvailabilitySlot[] = [];
  @Input() loading: boolean = false;

  openSlots: AvailabilitySlot[] = [];
  bookedSlots: AvailabilitySlot[] = [];
  totalHoursOpen: string = '0.0';

  ngOnChanges() {
    this.calculateStats();
  }

  private calculateStats() {
    if (!this.availability) {
      this.openSlots = [];
      this.bookedSlots = [];
      this.totalHoursOpen = '0.0';
      return;
    }

    this.openSlots = this.availability.filter(
      (a) => !a.status || a.status.toUpperCase() === 'OPEN'
    );
    this.bookedSlots = this.availability.filter(
      (a) => a.status && a.status.toUpperCase() === 'BOOKED'
    );

    let minutes = 0;
    this.openSlots.forEach((a) => {
      const [sh, sm] = a.startTime.split(':').map(Number);
      const [eh, em] = a.endTime.split(':').map(Number);
      minutes += (eh * 60 + em) - (sh * 60 + sm);
    });
    this.totalHoursOpen = (minutes / 60).toFixed(1);
  }
}
