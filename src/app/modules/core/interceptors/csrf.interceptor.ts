import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.csrfToken;

  if (token && req.method !== 'GET' && req.method !== 'HEAD') {
    const clonedReq = req.clone({
      params: req.params.set('_csrf', token),
    });
    return next(clonedReq);
  }
  return next(req);
};
