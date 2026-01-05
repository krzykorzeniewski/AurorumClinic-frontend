import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../models/auth.model';
import { filter, map, take } from 'rxjs';

export const roleMatchGuard: CanMatchFn = (route) => {
  const authService = inject(AuthService);
  const allowedRoles = route.data?.['roles'] as UserRole[];

  return authService.user$.pipe(
    filter((user): user is User => user !== undefined),
    take(1),
    map((user) => {
      const currentRole = user?.role;
      return allowedRoles.includes(currentRole as UserRole);
    }),
  );
};
