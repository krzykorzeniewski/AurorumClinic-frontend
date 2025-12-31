import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as UserRole[];

  return authService.user$.pipe(
    filter((user) => user !== undefined),
    map((user) => {
      const currentRole = user?.role ?? UserRole.ANONYMOUS;

      if (allowedRoles.includes(currentRole)) {
        return true;
      }

      if (currentRole === UserRole.ANONYMOUS) {
        void router.navigate(['/auth/login']);
      } else if (
        [UserRole.EMPLOYEE, UserRole.DOCTOR, UserRole.ADMIN].includes(
          currentRole,
        )
      ) {
        void router.navigate(['/internal']);
      } else {
        void router.navigate(['']);
      }

      return false;
    }),
  );
};
