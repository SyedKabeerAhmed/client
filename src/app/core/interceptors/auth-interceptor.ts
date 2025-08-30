import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const setHeaders: Record<string, string> = {};
  
  // Always add ngrok header if using ngrok
  if (environment.api.includes('ngrok-free.app')) {
    setHeaders['ngrok-skip-browser-warning'] = 'true';
    console.log('🔧 Interceptor: Added ngrok header for URL:', req.url);
  }

  // Add authorization header if token exists and not auth route
  const token = localStorage.getItem('cc_token');
  const isAuthRoute = /\/auth\/(login|register)$/.test(req.url);
  if (token && !isAuthRoute) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Add content type for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
    setHeaders['Content-Type'] = 'application/json';
  }

  // Log what headers are being added
  if (Object.keys(setHeaders).length > 0) {
    console.log('🔧 Interceptor: Adding headers:', setHeaders);
    return next(req.clone({ setHeaders }));
  }

  return next(req);
};
