import { Component } from '@angular/core';
import { ShellComponent } from './core/layout/shell/shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {}
