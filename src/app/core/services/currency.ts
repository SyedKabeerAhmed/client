import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type Currency = { code:string; name:string };

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  constructor(private http:HttpClient){}
  list(){ return this.http.get<Currency[]>(`${environment.api}/currency/currencies`); }
  convert(from:string, to:string, amount:number){
    return this.http.post<any>(`${environment.api}/currency/convert`, { from, to, amount });
  }
}
