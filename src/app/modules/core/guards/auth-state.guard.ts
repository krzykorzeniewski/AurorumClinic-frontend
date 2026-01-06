import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserRoleMap } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';

export const authStateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requireAuth = route.data['requireAuth'] as boolean;

  return authService.user$.pipe(
    filter((user) => user !== undefined),
    map((user) => {
      const isAuthenticated = user !== null;

      if (!requireAuth && isAuthenticated) {
        const role = user.role;
        if (
          [
            UserRoleMap.DOCTOR,
            UserRoleMap.EMPLOYEE,
            UserRoleMap.ADMIN,
          ].includes(role)
        ) {
          void router.navigate(['/internal']);
        } else {
          void router.navigate(['']);
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
