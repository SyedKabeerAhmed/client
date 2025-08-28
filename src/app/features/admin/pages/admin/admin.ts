import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatButtonModule, DatePipe, RouterLink, MatIconModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  users:any[]=[]; history:any[]=[];
  
  constructor(private http:HttpClient){}
  
  ngOnInit(){ 
    this.http.get<any[]>(`${environment.api}/admin/users`).subscribe(x=>this.users=x); 
  }
  
  loadHistory(id:string){ 
    this.http.get<any[]>(`${environment.api}/admin/user-history/${id}`).subscribe(x=>this.history=x); 
  }
  
  clearHistory() {
    this.history = [];
  }
  
  getUniqueCurrencies(): number {
    const currencies = new Set<string>();
    this.history.forEach(item => {
      currencies.add(item.from);
      currencies.add(item.to);
    });
    return currencies.size;
  }
  
  trackByUser(index: number, item: any): any {
    return item._id || index;
  }
  
  trackByHistory(index: number, item: any): any {
    return item._id || index;
  }
}
