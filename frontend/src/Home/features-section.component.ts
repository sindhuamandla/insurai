import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  key: string;
  title: string;
  text: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    key: "appointments",
    title: "Book Appointments Instantly",
    text: "Connect with vetted insurance agents in seconds with live availability.",
    accent: "blue",
  },
  {
    key: "voice",
    title: "Ask Queries via Voice",
    text: "Use natural speech to ask complex insurance questions—InsurAI handles the rest.",
    accent: "teal",
  },
  {
    key: "compare",
    title: "Compare Plans Smartly",
    text: "Side‑by‑side comparisons of coverage, exclusions and pricing across providers.",
    accent: "purple",
  },
  {
    key: "availability",
    title: "Agent Availability Hub",
    text: "Agents manage slots, holidays and reschedules from a unified calendar.",
    accent: "yellow",
  },
  {
    key: "secure",
    title: "Secure & Compliant",
    text: "Enterprise‑grade security, audit trails and access control for every role.",
    accent: "green",
  },
];

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css']
})
export class FeaturesSectionComponent {
  @Input() auth: any;

  @Output() openAssistant = new EventEmitter<void>();
  @Output() openAvailability = new EventEmitter<void>();
  @Output() openScheduling = new EventEmitter<void>();
  @Output() openAppointments = new EventEmitter<void>();
  @Output() openPlans = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();

  get visibleFeatures(): Feature[] {
    const role = this.auth?.role;
    return FEATURES.filter((f) => {
      if (role === "CUSTOMER" && f.key === "availability") return false;
      if (role === "AGENT" && f.key === "appointments") return false;
      return true;
    });
  }

  getIconStyle(accent: string): any {
    switch (accent) {
      case "blue": return { background: "radial-gradient(circle at 30% 0,#60a5fa,#0f172a)" };
      case "teal": return { background: "radial-gradient(circle at 30% 0,#2dd4bf,#022c22)" };
      case "purple": return { background: "radial-gradient(circle at 30% 0,#a855f7,#111827)" };
      case "yellow": return { background: "radial-gradient(circle at 30% 0,#facc15,#7c2d12)" };
      case "green": return { background: "radial-gradient(circle at 30% 0,#4ade80,#052e16)" };
      default: return {};
    }
  }

  handleClick(key: string) {
    if (key === 'voice') this.openAssistant.emit();
    if (key === 'availability') this.openAvailability.emit();
    if (key === 'appointments') this.openScheduling.emit();
    if (key === 'compare') this.openPlans.emit();
    if (key === 'secure') this.openContact.emit();
  }

  isClickable(key: string): boolean {
    return ['voice', 'availability', 'appointments', 'compare', 'secure'].includes(key);
  }
}
