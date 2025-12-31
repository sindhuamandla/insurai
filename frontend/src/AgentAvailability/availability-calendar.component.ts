import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentAvailabilityService, AvailabilitySlot } from './agent-availability.service';

@Component({
  selector: 'app-availability-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './availability-calendar.component.html',
  styleUrls: ['./availability-calendar.component.css']
})
export class AvailabilityCalendarComponent {
  @Input() view: string = 'week';
  @Input() weekStart: Date = new Date();
  @Input() availability: AvailabilitySlot[] = [];
  @Input() appointments: any[] = [];
  @Input() loading: boolean = false;

  @Output() createSlot = new EventEmitter<any>();

  modalOpen = false;
  modalData = {
    date: '',
    startTime: '10:00',
    endTime: '12:00',
    notes: ''
  };
  saving = false;
  error = '';

  DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  TIMES = [
    "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30",
    "20:00",
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  getDayDate(dayIndex: number): string {
    const d = new Date(this.weekStart);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + dayIndex);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  findSlotsForCell(dateStr: string, time: string) {
    const avail = this.availability.filter((a) => a.date === dateStr);
    const booked = this.appointments.filter((a) => a.date === dateStr);

    const inAvail = avail.some(
      (a) => a.startTime === time || a.endTime === time
    );
    const inBooked = booked.some(
      (b) => b.start === time && b.end === time
    );

    return { inAvail, inBooked };
  }

  openAddModal(dayIndex: number, time?: string) {
    const dateStr = this.getDayDate(dayIndex);
    const selectedTime = time || '10:00';

    // Compute default end time = start + 30 minutes
    const [h, m] = selectedTime.split(":").map(Number);
    const startDate = new Date(0, 0, 1, h, m);
    startDate.setMinutes(startDate.getMinutes() + 30);
    const endH = String(startDate.getHours()).padStart(2, "0");
    const endM = String(startDate.getMinutes()).padStart(2, "0");
    const defaultEnd = `${endH}:${endM}`;

    this.modalData = {
      date: dateStr,
      startTime: selectedTime,
      endTime: defaultEnd,
      notes: ""
    };
    this.error = "";
    this.modalOpen = true;
  }

  closeModal() {
    if (!this.saving) {
      this.modalOpen = false;
    }
  }

  async handleSave() {
    const { date, startTime, endTime, notes } = this.modalData;
    if (!date || !startTime || !endTime) {
      this.error = "Please fill date and time range.";
      return;
    }

    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (toMin(endTime) <= toMin(startTime)) {
      this.error = "End time must be after start time.";
      return;
    }

    try {
      this.saving = true;
      this.error = "";
      // Emit event and wait for parent to resolve if possible, or just emit.
      // Since EventEmitter is synchronous usually, wrapping in Promise or assuming parent handles it.
      // But parent in React was async. 
      // In Angular Output emit is void.
      // We can pass a callback or just emit. 
      // However the React code waited for completion to close modal.
      // I will implement a simpler approach: Emit and let parent handle it. 
      // BUT to support loading state here, I might converting this to a method call or use a Subject.
      // For simplicity and "closest migration", I will trigger the emit.
      // But verifying success is hard with simple Output.
      // I'll emit the event. The Parent should handle the API call and update the list.
      // I'll assume success for UI purposes or ideally bind 'saving' to a prop?
      // Actually, passing `onCreateSlot` function from parent (like React props) is possible in Angular but less idiomatic.
      // I'll emit `createSlot` with a callback.

      await new Promise<void>((resolve, reject) => {
        this.createSlot.emit({
          data: { date, startTime, endTime, notes },
          resolve,
          reject
        });
      });

      this.modalOpen = false;
    } catch (err: any) {
      this.error = err.message || "Failed to save slot. Try again.";
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }
}
