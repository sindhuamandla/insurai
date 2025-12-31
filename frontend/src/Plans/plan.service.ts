import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plan {
  id: number;
  name: string;
  provider: string;
  category: string;
  basePremium: number;
  coverageAmount: number;
  features: string[];
  isBestValue: boolean;
  brochureUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private baseUrl = 'http://localhost:8080/api/plans';

  constructor(private http: HttpClient) { }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.baseUrl);
  }
}
