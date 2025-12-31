import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  data: any;
  read: boolean; // API might return this
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) { }

  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/me`);
  }

  markRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/mark-read`, { notificationId });
  }

  markAllRead(): Observable<any> {
    return this.http.post(`${this.baseUrl}/mark-all-read`, {});
  }
}
