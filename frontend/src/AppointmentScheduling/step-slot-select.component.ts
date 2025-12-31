import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-slot-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-slot-select.component.html',
  styleUrls: ['./step-slot-select.component.css']
})
export class StepSlotSelectComponent {
  @Input() selectedAgent: any = null;
  @Input() selectedDate: string = '';
  @Input() selectedSlot: any = null;
  @Input() slotsByDate: { [key: string]: any[] } = {};
  @Input() loadingSlots: boolean = false;
  @Input() slotError: string = '';

  @Output() selectedDateChange = new EventEmitter<string>();
  @Output() selectedSlotChange = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  get availableDates(): string[] {
    return Object.keys(this.slotsByDate).sort();
  }

  get slots(): any[] {
    return this.selectedDate ? this.slotsByDate[this.selectedDate] || [] : [];
  }

  formatDateLabel(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    };
    return d.toLocaleDateString(undefined, options);
  }

  onDateSelect(d: string) {
    this.selectedDateChange.emit(d);
    this.selectedSlotChange.emit(null);
  }

  onSlotSelect(s: any) {
    this.selectedSlotChange.emit(s);
  }

  handleNext() {
    if (!this.selectedSlot) {
      alert("Please select a time slot to continue.");
      return;
    }
    this.next.emit();
  }
}
