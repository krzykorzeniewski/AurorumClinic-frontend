import {
  HttpInterceptorFn,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const inj = inject(HttpXsrfTokenExtractor);
  const token = inj.getToken();
  const csrfHeaderName = 'X-XSRF-TOKEN';

  if (token && req.method !== 'GET' && req.method !== 'HEAD') {
    const cloned = req.clone({
      headers: req.headers.set(csrfHeaderName, token),
    });
    return next(cloned);
  }

  return next(req);
};
