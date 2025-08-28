import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HistoryService } from '../../../../core/services/history';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss']
})
export class HistoryComponent {
  constructor(public history:HistoryService){}
  
  getUniqueCurrencies(): number {
    const currencies = new Set<string>();
    this.history.items().forEach(item => {
      currencies.add(item.from);
      currencies.add(item.to);
    });
    return currencies.size;
  }
  
  trackByHistory(index: number, item: any): any {
    return item._id || index;
  }
}
