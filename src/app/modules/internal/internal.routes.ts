import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/auth.model';

export const INTERNAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../internal/shared/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent,
      ),
  },
  {
    path: 'patients',
    canActivate: [roleGuard],
    data: { roles: [UserRole.EMPLOYEE] },
    loadComponent: () =>
      import('./shared/patient-table/patient-table.component').then(
        (c) => c.PatientTableComponent,
      ),
  },
  {
    path: 'patients/:id',
    canActivate: [roleGuard],
    data: { roles: [UserRole.EMPLOYEE] },
    loadComponent: () =>
      import('./shared/patient-profile/patient-profile.component').then(
        (c) => c.PatientProfileComponent,
      ),
  },
  {
    path: 'patients/:id/edit',
    canActivate: [roleGuard],
    data: { roles: [UserRole.EMPLOYEE] },
    loadComponent: () =>
      import(
        './shared/patient-profile/patient-profile-edit/patient-profile-edit.component'
      ).then((c) => c.PatientProfileEditComponent),
  },
];
