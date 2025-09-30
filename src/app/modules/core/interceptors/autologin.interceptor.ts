import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

const refreshSubject = new BehaviorSubject<boolean>(false);
let isCurrentlyRefreshing = false;

export const autologinInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isRetryReq = req.headers.has('Aurorum-Auth-Retry');

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && req.url.includes('/refresh')) {
        isCurrentlyRefreshing = false;
        return throwError(() => err);
      }

      if (err.status === 401 && !isRetryReq) {
        if (!isCurrentlyRefreshing) {
          isCurrentlyRefreshing = true;
          refreshSubject.next(false);
          return authService.refreshCookies().pipe(
            switchMap((user) => {
              isCurrentlyRefreshing = false;
              refreshSubject.next(true);

              if (user) {
                const retryReq = req.clone({
                  setHeaders: { 'Aurorum-Auth-Retry': 'true' },
                });
                return next(retryReq);
              } else {
                return throwError(() => err);
              }
            }),
            catchError((refreshErr) => {
              isCurrentlyRefreshing = false;
              refreshSubject.next(false);
              return throwError(() => refreshErr);
            }),
          );
        } else {
          return refreshSubject.pipe(
            filter((success) => success),
            take(1),
            switchMap(() => {
              return next(req);
            }),
          );
        }
      }
      return throwError(() => err);
    }),
  );
};
