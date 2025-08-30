import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const set: Record<string,string> = {};
  const isNgrok = environment.api.includes('ngrok-free.app') && req.url.startsWith(environment.api);

  if (isNgrok) set['ngrok-skip-browser-warning'] = 'true';

  const token = localStorage.getItem('cc_token');
  const isAuthRoute = /\/auth\/(login|register)$/.test(req.url);
  if (token && !isAuthRoute) set['Authorization'] = `Bearer ${token}`;

  if (['POST','PUT','PATCH'].includes(req.method)) set['Content-Type'] = 'application/json';

  return next(Object.keys(set).length ? req.clone({ setHeaders: set }) : req);
};
