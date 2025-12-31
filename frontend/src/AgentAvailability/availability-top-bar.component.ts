import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-availability-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-top-bar.component.html',
  styleUrls: ['./availability-top-bar.component.css']
})
export class AvailabilityTopBarComponent {
  @Input() view: string = 'week';
  @Output() viewChange = new EventEmitter<string>();

  @Input() weekStart: Date = new Date();
  @Output() weekStartChange = new EventEmitter<Date>();

  @Input() onOpenNotifications?: () => void; // Keeping signature if needed, though usually handled differently in Angular

  formatWeekRange(weekStart: Date): string {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
  }

  goPrevWeek() {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() - 7);
    this.weekStartChange.emit(d);
  }

  goNextWeek() {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() + 7);
    this.weekStartChange.emit(d);
  }

  goToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    this.weekStartChange.emit(d);
  }

  setView(v: string) {
    this.viewChange.emit(v);
  }
}
