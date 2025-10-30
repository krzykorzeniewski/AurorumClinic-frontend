import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authStateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requireAuth = route.data['requireAuth'] as boolean;

  return authService.user$.pipe(
    map((user) => {
      const isAuthenticated = user !== null && user !== undefined;

      if (!requireAuth && isAuthenticated) {
        const role = user.role;
        if (
          [UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN].includes(role)
        ) {
          void router.navigate(['/internal']);
        } else {
          void router.navigate(['/']);
        }
        return false;
      }

      if (requireAuth && !isAuthenticated) {
        void router.navigate(['/auth/login']);
        return false;
      }

      return true;
    }),
  );
};
