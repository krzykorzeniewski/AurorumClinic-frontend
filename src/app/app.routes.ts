import { Routes } from '@angular/router';
import { roleGuard } from './modules/core/guards/role.guard';
import { UserRoleMap } from './modules/core/models/auth.model';
import { authStateGuard } from './modules/core/guards/auth-state.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.ANONYMOUS, UserRoleMap.PATIENT] },
    loadChildren: () =>
      import('./modules/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'about-us',
    canActivate: [roleGuard],
    data: {
      roles: [
        UserRoleMap.ANONYMOUS,
        UserRoleMap.PATIENT,
        UserRoleMap.EMPLOYEE,
        UserRoleMap.DOCTOR,
        UserRoleMap.ADMIN,
      ],
    },
    loadComponent: () =>
      import('./modules/core/components/about-us/about-us.component')
        .then((m) => m.AboutUsComponent),
  },
  {
    path: 'internal',
    canActivate: [roleGuard],
    data: {
      roles: [UserRoleMap.EMPLOYEE, UserRoleMap.DOCTOR, UserRoleMap.ADMIN],
    },
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
    data: {
      roles: [
        UserRoleMap.PATIENT,
        UserRoleMap.EMPLOYEE,
        UserRoleMap.DOCTOR,
        UserRoleMap.ADMIN,
      ],
    },
    loadChildren: () =>
      import('./modules/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'appointment',
    canActivate: [roleGuard],
    data: {
      roles: [UserRoleMap.PATIENT, UserRoleMap.EMPLOYEE, UserRoleMap.ADMIN],
    },
    loadChildren: () =>
      import('./modules/appointment/appointment.routes').then(
        (m) => m.APPOINTMENT_ROUTES,
      ),
  },
  {
    path: 'doctor',
    canActivate: [roleGuard],
    data: {
      roles: [
        UserRoleMap.ANONYMOUS,
        UserRoleMap.PATIENT,
        UserRoleMap.EMPLOYEE,
        UserRoleMap.DOCTOR,
        UserRoleMap.ADMIN,
      ],
    },
    loadChildren: () =>
      import('./modules/doctor/doctor.routes').then((m) => m.DOCTOR_ROUTES),
  },
  {
    path: 'chats',
    canActivate: [roleGuard],
    data: {
      roles: [UserRoleMap.PATIENT, UserRoleMap.DOCTOR],
    },
    loadComponent: () =>
      import('./modules/chat/chat.component').then((c) => c.ChatComponent),
  },
  { path: '**', redirectTo: '' },
];
