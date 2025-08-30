import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';
import { lastValueFrom } from 'rxjs';

export type Conv = { _id:string; from:string; to:string; amount:number; rate:number; result:number; createdAt:string; userId:string };

@Injectable({ providedIn: 'root' })
export class HistoryService {
  items = signal<Conv[]>([]);
  constructor(private http:HttpClient, private auth:AuthService){}

  private key(){ return `cc_history_${this.auth.user()?.['_id'] ?? 'anon'}`; }

  // Custom headers for ngrok
  private getHeaders(): HttpHeaders {
    const headers: Record<string, string> = {};
    
    // Always add ngrok header if using ngrok
    if (environment.api.includes('ngrok-free.app')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    return new HttpHeaders(headers);
  }

  async load(){
    const local = JSON.parse(localStorage.getItem(this.key()) ?? '[]');
    this.items.set(local);
    const server = await lastValueFrom(
      this.http.get<Conv[]>(
        `${environment.api}/user/history`,
        { headers: this.getHeaders() }
      )
    );
    this.items.set(server);
    localStorage.setItem(this.key(), JSON.stringify(server));
  }

  push(item:Conv){
    const arr = [item, ...this.items()];
    this.items.set(arr);
    localStorage.setItem(this.key(), JSON.stringify(arr));
  }
}
