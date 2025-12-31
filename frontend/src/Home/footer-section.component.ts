import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.css']
})
export class FooterSectionComponent {
  @Output() viewPlans = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();
  @Output() openAssistant = new EventEmitter<void>();

  currentYear = new Date().getFullYear();
}
