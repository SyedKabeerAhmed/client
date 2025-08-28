import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

type Role = 'USER'|'ADMIN';
export type Me = { _id:string; email:string; role:Role };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'cc_token';
  user = signal<Me|null>(null);
  constructor(private http:HttpClient){
    if (this.getToken()) this.fetchMe().catch(()=>this.logout());
  }
  getToken(){ return localStorage.getItem(this.key); }
  setToken(t:string){ localStorage.setItem(this.key, t); }
  async login(email:string, password:string){
    const r = await lastValueFrom(this.http.post<{token:string}>(`${environment.api}/auth/login`,{email,password}));
    this.setToken(r.token); await this.fetchMe();
  }
  async register(email:string, password:string){
    await lastValueFrom(this.http.post(`${environment.api}/auth/register`,{email,password}));
  }
  async fetchMe(){
    const me = await lastValueFrom(this.http.get<Me>(`${environment.api}/user/me`));
    this.user.set(me);
  }
  logout(){ localStorage.removeItem(this.key); this.user.set(null); location.href='/login'; }
}
