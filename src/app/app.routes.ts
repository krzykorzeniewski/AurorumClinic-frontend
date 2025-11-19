import { Routes } from '@angular/router';
import { roleGuard } from './modules/core/guards/role.guard';
import { UserRole } from './modules/core/models/auth.model';
import { authStateGuard } from './modules/core/guards/auth-state.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRole.ANONYMOUS, UserRole.PATIENT] },
    loadChildren: () =>
      import('./modules/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'internal',
    canActivate: [roleGuard],
    data: { roles: [UserRole.EMPLOYEE, UserRole.DOCTOR, UserRole.ADMIN] },
    loadChildren: () =>
      import('./modules/internal/internal.routes').then(
        (m) => m.INTERNAL_ROUTES,
      ),
  },
  {
    path: 'auth',
    canActivate: [authStateGuard],
    data: { requireAuth: false },
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [roleGuard],
    data: { roles: [UserRole.PATIENT] },
    loadChildren: () =>
      import('./modules/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'appointment',
    canActivate: [roleGuard],
    data: { roles: [UserRole.PATIENT] },
    loadChildren: () =>
      import('./modules/appointment/appointment.routes').then(
        (m) => m.APPOINTMENT_ROUTES,
      ),
  },
  { path: '**', redirectTo: '' },
];
