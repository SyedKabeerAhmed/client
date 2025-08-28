import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const l = inject(LoaderService);
  l.inc();
  return next(req).pipe(finalize(() => l.dec()));
};
