import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgentAvailabilityRequest {
  date: string;       // yyyy-MM-dd
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  notes?: string;
}

export interface AvailabilitySlot {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentAvailabilityService {
  private baseUrl = 'http://localhost:8080/api/availability/my';

  constructor(private http: HttpClient) { }

  getMyAvailability(): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(this.baseUrl);
  }

  createAvailability(data: AgentAvailabilityRequest): Observable<AvailabilitySlot> {
    return this.http.post<AvailabilitySlot>(this.baseUrl, data);
  }
}

