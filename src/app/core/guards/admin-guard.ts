import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const u = inject(AuthService).user();
  if (u?.role === 'ADMIN') return true;
  inject(Router).navigateByUrl('/');
  return false;
};
