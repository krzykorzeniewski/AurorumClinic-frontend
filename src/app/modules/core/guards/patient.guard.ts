import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

export const patientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.hasRole(UserRole.PATIENT);
};
