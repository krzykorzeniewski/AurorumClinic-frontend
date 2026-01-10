import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { UserRoleMap } from '../core/models/auth.model';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (c) => c.ProfileComponent,
      ),
  },
  {
    path: 'appointments',
    canActivate: [roleGuard],
    data: {
      roles: [UserRoleMap.PATIENT],
    },
    loadChildren: () =>
      import('../patient/patient.routes').then((m) => m.PATIENT_ROUTES),
  },
];
