import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistant-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assistant-side-panel.component.html',
  styleUrls: ['./assistant-side-panel.component.css']
})
export class AssistantSidePanelComponent {
  @Output() viewPlans = new EventEmitter<void>();
  @Output() schedule = new EventEmitter<void>();
}
