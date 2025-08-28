import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';
import { lastValueFrom } from 'rxjs';

export type Conv = { _id:string; from:string; to:string; amount:number; rate:number; result:number; createdAt:string; userId:string };

@Injectable({ providedIn: 'root' })
export class HistoryService {
  items = signal<Conv[]>([]);
  constructor(private http:HttpClient, private auth:AuthService){}

  private key(){ return `cc_history_${this.auth.user()?.['_id'] ?? 'anon'}`; }

  async load(){
    const local = JSON.parse(localStorage.getItem(this.key()) ?? '[]');
    this.items.set(local);
    const server = await lastValueFrom(this.http.get<Conv[]>(`${environment.api}/user/history`));
    this.items.set(server);
    localStorage.setItem(this.key(), JSON.stringify(server));
  }

  push(item:Conv){
    const arr = [item, ...this.items()];
    this.items.set(arr);
    localStorage.setItem(this.key(), JSON.stringify(arr));
  }
}
