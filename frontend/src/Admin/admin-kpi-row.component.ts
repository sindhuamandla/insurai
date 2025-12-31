import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-kpi-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-kpi-row.component.html',
  styleUrls: ['./admin-kpi-row.component.css']
})
export class AdminKpiRowComponent {
  @Input() stats: any;
  @Input() loading: boolean = false;
  @Output() cardClick = new EventEmitter<string>();

  get safeStats() {
    return this.stats || {
      appointments: { today: 0, last7Days: 0, allTime: 0 },
      customers: 0,
      agents: 0,
      plans: 0
    };
  }

  handle(key: string) {
    if (!this.loading) {
      this.cardClick.emit(key);
    }
  }
}
