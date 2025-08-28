import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyService, Currency } from '../../../../core/services/currency';
import { HistoryService } from '../../../../core/services/history';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  currencies: Currency[] = [];
  from='USD'; to='PKR'; amount=1; result: number|null = null;

  constructor(private api:CurrencyService, public history:HistoryService){}
  async ngOnInit(){
    const cache = localStorage.getItem('cc_currencies');
    if (cache) this.currencies = JSON.parse(cache);
    const list = await lastValueFrom(this.api.list());
    if (list) { this.currencies = list; localStorage.setItem('cc_currencies', JSON.stringify(list)); }
    await this.history.load();
  }
  async convert(){
    const rec: any = await lastValueFrom(this.api.convert(this.from, this.to, +this.amount));
    this.result = rec.result; this.history.push(rec);
  }
}
