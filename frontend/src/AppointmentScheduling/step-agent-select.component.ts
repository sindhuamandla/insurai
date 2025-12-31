import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-agent-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-agent-select.component.html',
  styleUrls: ['./step-agent-select.component.css']
})
export class StepAgentSelectComponent {
  @Input() openSlots: any[] = [];
  @Input() selectedSlot: any = null;
  @Input() loadingSlots: boolean = false;
  @Input() slotError: string = '';

  @Output() selectSlot = new EventEmitter<any>();
  @Output() next = new EventEmitter<void>();

  formatDateLabel(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    };
    return d.toLocaleDateString(undefined, options);
  }

  handleNext() {
    if (!this.selectedSlot) {
      alert("Please select an agent and slot to continue.");
      return;
    }
    this.next.emit();
  }
}
