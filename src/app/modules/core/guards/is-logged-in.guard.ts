import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const isLoggedInGuard: CanActivateFn = () => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  return isLoggedIn
    ? isLoggedIn
    : inject(Router).createUrlTree(['/auth/login']);
};
