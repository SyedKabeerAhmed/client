import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '../../services/loader';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatProgressBarModule, MatIconModule],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss']
})
export class ShellComponent {
  loading = computed(() => this.loader.loading());
  
  constructor(private loader: LoaderService) {}
  
  logout() {
    localStorage.removeItem('cc_token');
    location.href = '/login';
  }
}
