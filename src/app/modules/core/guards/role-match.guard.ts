import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';
import { map } from 'rxjs';

export const roleMatchGuard: CanMatchFn = (route) => {
  const authService = inject(AuthService);
  const allowedRoles = route.data?.['roles'] as UserRole[];

  return authService.user$.pipe(
    map((user) => {
      const currentRole = user?.role;
      return allowedRoles.includes(currentRole as UserRole);
    }),
  );
};
