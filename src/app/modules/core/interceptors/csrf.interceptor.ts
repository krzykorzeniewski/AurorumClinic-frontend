import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.csrfToken;

  if (token && req.method !== 'GET' && req.method !== 'HEAD') {
    const clonedReq = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', token),
    });
    return next(clonedReq);
  }
  return next(req);
};
