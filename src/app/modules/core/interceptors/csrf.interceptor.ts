import {
  HttpInterceptorFn,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const inj = inject(HttpXsrfTokenExtractor);
  const token = inj.getToken();

  if (token && req.method !== 'GET' && req.method !== 'HEAD') {
    const clonedReq = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', token),
    });
    return next(clonedReq);
  }
  return next(req);
};
