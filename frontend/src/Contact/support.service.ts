import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SupportTicket {
  id: number;
  subject: string;
  category: string;
  message: string;
  status: string; // OPEN, CLOSED, RESOLVED, etc.
  createdAt: string;
  updatedAt?: string;
  attachmentUrl?: string;
  userId?: number;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private baseUrl = 'http://localhost:8080/api/support';

  constructor(private http: HttpClient) { }

  submitTicket(formData: FormData): Observable<SupportTicket> {
    return this.http.post<SupportTicket>(this.baseUrl, formData);
  }

  getMyTickets(): Observable<SupportTicket[]> {
    return this.http.get<SupportTicket[]>(`${this.baseUrl}/my`);
  }

  // Admin endpoints
  getAllTickets(): Observable<SupportTicket[]> {
    return this.http.get<SupportTicket[]>(`${this.baseUrl}/admin`);
  }

  replyToTicket(ticketId: number, message: string, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/${ticketId}/reply`, { message, status });
  }
}
