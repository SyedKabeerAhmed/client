import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

type Role = 'USER'|'ADMIN';
export type Me = { _id:string; email:string; role:Role };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'cc_token';
  user = signal<Me|null>(null);
  constructor(private http:HttpClient){
    console.log('🔧 AuthService: Environment API:', environment.api);
    console.log('🔧 AuthService: Is ngrok?', environment.api.includes('ngrok-free.app'));
    if (this.getToken()) this.fetchMe().catch(()=>this.logout());
  }
  getToken(){ return localStorage.getItem(this.key); }
  setToken(t:string){ localStorage.setItem(this.key, t); }
  async login(email:string, password:string){
    const r = await lastValueFrom(
      this.http.post<{token:string}>(
        `${environment.api}/auth/login`,
        {email,password},
        { headers: this.getHeaders() }
      )
    );
    this.setToken(r.token); 
    await this.fetchMe();
  }
  
  async register(email:string, password:string){
    await lastValueFrom(
      this.http.post(
        `${environment.api}/auth/register`,
        {email,password},
        { headers: this.getHeaders() }
      )
    );
  }
  
  async fetchMe(){
    const me = await lastValueFrom(
      this.http.get<Me>(
        `${environment.api}/user/me`,
        { headers: this.getHeaders() }
      )
    );
    this.user.set(me);
  }
  logout(){ localStorage.removeItem(this.key); this.user.set(null); location.href='/login'; }

  // Custom headers for ngrok
  private getHeaders(): HttpHeaders {
    const headers: Record<string, string> = {};
    
    // Always add ngrok header if using ngrok
    if (environment.api.includes('ngrok-free.app')) {
      headers['ngrok-skip-browser-warning'] = 'true';
      console.log('🔧 AuthService: Adding ngrok header');
    }
    
    // Add content type for POST requests
    headers['Content-Type'] = 'application/json';
    
    console.log('🔧 AuthService: Headers being sent:', headers);
    return new HttpHeaders(headers);
  }
}
