import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for type safety
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
  enabled: boolean;
  createdAt: string;
}

export interface Plan {
  id: number;
  name: string;
  category: string;
  premiumAmount: number;
  coverageAmount: number;
  active: boolean;
  description: string;
}

export interface DashboardSummary {
  todaysAppointments: number;
  last7DaysAppointments: number;
  allTimeAppointments: number;
  totalCustomers: number;
  totalAgents: number;
  totalPlans: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/summary`);
  }

  getDailyUserStats(days: number = 14): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stats/users/daily?days=${days}`);
  }

  getDailyAppointmentStats(days: number = 14): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/appointments/daily?days=${days}`);
  }

  getRecentAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/appointments/recent`);
  }

  getLatestUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/latest`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}/role`, { role });
  }

  updateUserStatus(userId: number, enabled: boolean): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}/status`, { enabled });
  }

  createAgent(agent: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/create-agent`, agent);
  }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.baseUrl}/policies/plans`);
  }

  savePlan(plan: Partial<Plan>): Observable<Plan> {
    if (plan.id) {
      return this.http.put<Plan>(`${this.baseUrl}/policies/plans/${plan.id}`, plan);
    } else {
      return this.http.post<Plan>(`${this.baseUrl}/policies/plans`, plan);
    }
  }

  updatePlanStatus(planId: number, active: boolean): Observable<Plan> {
    return this.http.put<Plan>(`${this.baseUrl}/policies/plans/${planId}/status?active=${active}`, {});
  }

  deletePlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/policies/plans/${planId}`);
  }

  getPolicyCategoryStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/policies/stats/categories`);
  }

  getPolicyUsageStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/policies/stats/usage`);
  }
}

