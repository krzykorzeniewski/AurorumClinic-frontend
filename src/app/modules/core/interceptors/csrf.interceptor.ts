import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.csrfToken;

  if (
    token &&
    req.method !== 'GET' &&
    req.method !== 'HEAD' &&
    req.method !== 'OPTIONS'
  ) {
    const clonedReq = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', token),
      withCredentials: true,
    });
    return next(clonedReq);
  }

  return next(req);
};
