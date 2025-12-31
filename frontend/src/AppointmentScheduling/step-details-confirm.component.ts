import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-details-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-details-confirm.component.html',
  styleUrls: ['./step-details-confirm.component.css']
})
export class StepDetailsConfirmComponent {
  @Input() selectedAgent: any = null;
  @Input() selectedDate: string = '';
  @Input() selectedSlot: any = null;
  @Input() details: any = { reason: '', notes: '' };
  @Input() isConfirming: boolean = false;

  @Output() detailsChange = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get summaryText(): string {
    return this.selectedSlot
      ? `${this.selectedDate} · ${this.selectedSlot.start}–${this.selectedSlot.end}`
      : this.selectedDate || "Not selected";
  }

  handleReasonChange(value: string) {
    this.details.reason = value;
    this.detailsChange.emit(this.details);
  }

  handleConfirmClick() {
    if (!this.details.reason || !this.details.reason.trim()) {
      alert("Please provide a brief reason for the appointment.");
      return;
    }
    this.confirm.emit();
  }
}
