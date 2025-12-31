import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService, UserProfile, UserSettings } from './profile.service';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  tab = "Profile";
  profile: UserProfile | null = null;
  settings: UserSettings | null = {
    notifyApptInApp: true,
    notifyApptEmail: true,
    notifyApptSms: false,
    notifyPromoEmail: false,
    accentColor: 'teal',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24h'
  };

  savingProfile = false;
  savingSettings = false;
  loadError = "";
  saveMessage = "";
  saveError = "";

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initProfileFromAuth();
    this.loadData();
  }

  initProfileFromAuth() {
    const authData = this.authService.getAuthData();
    if (authData) {
      this.profile = {
        name: authData.name,
        email: authData.email,
        role: authData.role
      };
    }
  }

  loadData() {
    this.loadError = "";
    this.profileService.getProfile().subscribe({
      next: (data) => {
        // Merge with existing (auth) data to preserve what we have if API returns partial
        this.profile = { ...this.profile, ...data };
      },
      error: (err) => {
        console.error("Profile load error", err);
        // Don't show critical error if we at least have auth data
        if (!this.profile) {
          this.loadError = err.message || "Failed to load profile";
        }
      }
    });

    this.profileService.getSettings().subscribe({
      next: (data) => {
        if (this.settings) {
          this.settings = { ...this.settings, ...data };
        } else {
          this.settings = data;
        }
      },
      error: (err) => {
        console.error("Settings load error", err);
      }
    });
  }

  get role(): string {
    return this.authService.getRole() || this.profile?.role || "CUSTOMER";
  }

  get roleLabel(): string {
    return this.role === "ADMIN" ? "Admin" : this.role === "AGENT" ? "Agent" : "Customer";
  }

  handleSaveProfile() {
    if (!this.profile) return;
    this.savingProfile = true;
    this.saveError = "";
    this.saveMessage = "";

    this.profileService.updateProfile(this.profile).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saveMessage = "Profile saved successfully.";
        this.savingProfile = false;
      },
      error: (err) => {
        this.saveError = err.message || "Failed to save profile.";
        this.savingProfile = false;
      }
    });
  }

  handleSaveSettings() {
    if (!this.settings) return;
    this.savingSettings = true;
    this.saveError = "";
    this.saveMessage = "";

    this.profileService.updateSettings(this.settings).subscribe({
      next: (updated) => {
        this.settings = updated;
        this.saveMessage = "Preferences saved successfully.";
        this.savingSettings = false;
      },
      error: (err) => {
        console.error("Save settings error", err);
        this.saveError = err.message || "Failed to save preferences.";
        this.savingSettings = false;
      }
    });
  }

  // --- Helpers for settings manipulation via TS ---
  toggleSetting(field: keyof UserSettings) {
    if (this.settings) {
      this.settings[field] = !this.settings[field] as any;
    }
  }

  setAccent(color: string) {
    if (this.settings) {
      this.settings.accentColor = color;
    }
  }

  get isAgent(): boolean { return this.role === 'AGENT'; }
  get isCustomer(): boolean { return this.role === 'CUSTOMER'; }
}
