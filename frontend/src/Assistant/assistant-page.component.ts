import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssistantChatPanelComponent } from './assistant-chat-panel.component';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [CommonModule, AssistantChatPanelComponent],
  templateUrl: './assistant-page.component.html',
  styleUrls: ['./assistant-page.component.css']
})
export class AssistantPageComponent {
  constructor(private router: Router) { }

  handleViewPlans() {
    this.router.navigate(['/plans']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
