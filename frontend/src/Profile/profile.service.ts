import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  experienceYears?: number | null;
  companyName?: string;
  specialties?: string;
}

export interface UserSettings {
  notifyApptInApp?: boolean;
  notifyApptEmail?: boolean;
  notifyApptSms?: boolean;
  notifyPromoEmail?: boolean;
  accentColor?: string;
  dateFormat?: string;
  timeFormat?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/me`, profile);
  }

  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.baseUrl}/settings`);
  }

  updateSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.baseUrl}/settings`, settings);
  }
}
