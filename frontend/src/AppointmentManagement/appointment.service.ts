import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id: number;
  customerId: number;
  customerName?: string;
  agentId?: number;
  agentName?: string;
  scheduledAt: string;
  status: string;
  reason?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(role: string): Observable<Appointment[]> {
    let url = `${this.baseUrl}/admin/all`;
    if (role === 'CUSTOMER') {
      url = `${this.baseUrl}/my/customer`;
    } else if (role === 'AGENT') {
      url = `${this.baseUrl}/my/agent`;
    }
    return this.http.get<Appointment[]>(url);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { status });
  }
}

