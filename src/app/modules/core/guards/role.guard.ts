import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserRoleMap } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as UserRoleMap[];

  return authService.user$.pipe(
    filter((user) => user !== undefined),
    map((user) => {
      const currentRole = user?.role ?? UserRoleMap.ANONYMOUS;

      if (allowedRoles.includes(currentRole)) {
        return true;
      }

      if (currentRole === UserRoleMap.ANONYMOUS) {
        void router.navigate(['/auth/login']);
      } else if (
        [UserRoleMap.EMPLOYEE, UserRoleMap.DOCTOR, UserRoleMap.ADMIN].includes(
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
