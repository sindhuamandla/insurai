import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicAvailabilitySlot {
  id: number;
  date: string;       // yyyy-MM-dd
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
  agentId?: number;
  agentName?: string;
}

export interface ScheduleAppointmentRequest {
  agentId: number;
  availabilityId: number;
  scheduledAt?: string | null;
  reason: string;
  notes: string;
}

export interface ScheduleAppointmentResponse {
  id: number;
  status: string;
  // add other fields if needed
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentSchedulingService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getPublicAvailability(date: string): Observable<PublicAvailabilitySlot[]> {
    return this.http.get<PublicAvailabilitySlot[]>(`${this.baseUrl}/availability/public?date=${date}`);
  }

  scheduleAppointment(body: ScheduleAppointmentRequest): Observable<ScheduleAppointmentResponse> {
    return this.http.post<ScheduleAppointmentResponse>(`${this.baseUrl}/appointments/schedule`, body);
  }
}
