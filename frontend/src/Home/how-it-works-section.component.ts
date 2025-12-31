import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.css']
})
export class HowItWorksSectionComponent {
  steps = [
    {
      label: "Step 01",
      title: "Sign up as customer or agent",
      text: "Create your InsurAI profile, set your role and basic preferences.",
    },
    {
      label: "Step 02",
      title: "Discover agents & plans",
      text: "Search by expertise, location, insurer or coverage type.",
    },
    {
      label: "Step 03",
      title: "Book and manage appointments",
      text: "Pick a time that works, reschedule in clicks and keep everyone aligned.",
    },
    {
      label: "Step 04",
      title: "Compare & finalize policies",
      text: "Use AI‑driven comparisons and recommendations to select the right cover.",
    },
    {
      label: "Step 05",
      title: "Track everything in one place",
      text: "Keep documents, renewals, queries and history inside your InsurAI hub.",
    },
  ];
}
