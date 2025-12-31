import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssistantChatRequest {
  message: string;
}

export interface AssistantChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private baseUrl = 'http://localhost:8080/api/assistant/chat';

  constructor(private http: HttpClient) { }

  chat(message: string): Observable<AssistantChatResponse> {
    return this.http.post<AssistantChatResponse>(this.baseUrl, { message });
  }
}
