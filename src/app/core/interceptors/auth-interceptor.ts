import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('cc_token');
  const isNgrok = environment.api.includes('ngrok-free.app') && req.url.startsWith(environment.api);
  const setHeaders: Record<string,string> = {};

  if (token) setHeaders['Authorization'] = `Bearer ${token}`;
  if (isNgrok) setHeaders['ngrok-skip-browser-warning'] = 'true';

  return next(Object.keys(setHeaders).length ? req.clone({ setHeaders }) : req);
};