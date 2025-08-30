import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type Currency = { code:string; name:string };

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  constructor(private http:HttpClient){}
  
  // Custom headers for ngrok
  private getHeaders(): HttpHeaders {
    const headers: Record<string, string> = {};
    
    // Always add ngrok header if using ngrok
    if (environment.api.includes('ngrok-free.app')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    return new HttpHeaders(headers);
  }
  
  list(){ 
    return this.http.get<Currency[]>(
      `${environment.api}/currency/currencies`,
      { headers: this.getHeaders() }
    ); 
  }
  
  convert(from:string, to:string, amount:number){
    return this.http.post<any>(
      `${environment.api}/currency/convert`, 
      { from, to, amount },
      { headers: this.getHeaders() }
    );
  }
}
