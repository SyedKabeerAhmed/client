import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register/register').then(m => m.RegisterComponent) },
  { path: '', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'history', canActivate: [authGuard], loadComponent: () => import('./features/history/pages/history/history').then(m => m.HistoryComponent) },
  { path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: () => import('./features/admin/pages/admin/admin').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' }
];
