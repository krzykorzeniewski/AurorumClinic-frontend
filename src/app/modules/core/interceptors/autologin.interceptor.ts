import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const autologinInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && req.url.includes('/refresh')) {
        void router.navigate(['/auth/login']);
        return throwError(() => err);
      }

      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((user) => {
            if (user) {
              return next(req);
            } else {
              void router.navigate(['/auth/login']);
              return throwError(() => err);
            }
          }),
          catchError((refreshErr) => {
            void router.navigate(['/auth/login']);
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => err);
    }),
  );
};
