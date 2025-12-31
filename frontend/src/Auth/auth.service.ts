import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  token: string;
  role: string;
  userId: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap(data => {
        const authData = {
          token: data.token,
          role: data.role,
          userId: data.userId,
          name: data.name,
          email: data.email
        };
        this.setSession(authData);
      })
    );
  }

  register(userData: { name: string, email: string, password: string, phone: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('insurai_auth');
    localStorage.removeItem('insurai_user');
  }

  private setSession(authResult: any) {
    localStorage.setItem('insurai_auth', JSON.stringify(authResult));
    localStorage.setItem('insurai_user', JSON.stringify(authResult));
  }

  loadAuth() {
    // No-op if just reading from localStorage on demand, 
    // but useful if we implement in-memory state later.
  }

  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  getRole(): string | undefined {
    return this.getCurrentUser()?.role;
  }

  getAuthData(): User | null {
    return this.getCurrentUser();
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('insurai_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) return parsed;
      } catch {
        // fallback
      }
    }
    // Fallback to insurai_user if insurai_auth was just a token string or failed
    const userStr = localStorage.getItem('insurai_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
