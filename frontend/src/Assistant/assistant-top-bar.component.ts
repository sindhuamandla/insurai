import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistant-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assistant-top-bar.component.html',
  styleUrls: ['./assistant-top-bar.component.css']
})
export class AssistantTopBarComponent {
  @Output() goHome = new EventEmitter<void>();
}
