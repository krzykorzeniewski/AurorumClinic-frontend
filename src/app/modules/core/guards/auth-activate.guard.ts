import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  if (isLoggedIn) return isLoggedIn;

  return authService.autoLogin().pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        return router.createUrlTree(['/auth/login']);
      }
    }),
  );
};
