import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroSectionComponent } from './hero-section.component';
import { FeaturesSectionComponent } from './features-section.component';
import { HowItWorksSectionComponent } from './how-it-works-section.component';
import { AboutSectionComponent } from './about-section.component';
import { FooterSectionComponent } from './footer-section.component';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    FeaturesSectionComponent,
    HowItWorksSectionComponent,
    AboutSectionComponent,
    FooterSectionComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnChanges, AfterViewInit {
  @Input() autoScrollToFeatures = false;

  // Use a getter to access the current auth state from the service
  get auth() {
    return this.authService.getAuthData();
  }

  @ViewChild('featuresRef') featuresRef!: ElementRef;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['autoScrollToFeatures'] && this.autoScrollToFeatures) {
      setTimeout(() => this.scrollToFeatures(), 100);
    }
  }

  ngAfterViewInit() {
    if (this.autoScrollToFeatures) {
      setTimeout(() => this.scrollToFeatures(), 100);
    }
  }

  scrollToFeatures() {
    if (this.featuresRef && this.featuresRef.nativeElement) {
      this.featuresRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleLogin() { this.router.navigate(['/login']); }
  handleRegister() { this.router.navigate(['/signup']); }
  handleViewPlans() { this.router.navigate(['/plans']); }
  handleOpenAssistant() { this.router.navigate(['/assistant']); }
  handleOpenAvailability() { this.router.navigate(['/availability']); }
  handleOpenScheduling() { this.router.navigate(['/scheduling']); }
  handleOpenAppointments() { this.router.navigate(['/appointments']); }
  handleOpenNotifications() { this.router.navigate(['/notifications']); }
  handleOpenProfile() { this.router.navigate(['/profile']); }
  handleOpenContact() { this.router.navigate(['/contact']); }
  handleOpenAdmin() { this.router.navigate(['/admin']); }
  handleGoHome() { this.router.navigate(['/']); }
}
