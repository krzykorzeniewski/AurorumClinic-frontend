import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/auth.model';

export const DOCTOR_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('../doctor/components/profile/profile.component').then(
        (c) => c.ProfileComponent,
      ),
  },
  {
    path: 'profile/edit',
    canActivate: [roleGuard],
    data: { roles: [UserRole.DOCTOR] },
    loadComponent: () =>
      import('../doctor/components/profile/profile-edit/profile-edit.component').then(
        (c) => c.ProfileEditComponent,
      ),
  },
  {
    path: 'profile/opinion/answer',
    canActivate: [roleGuard],
    data: { roles: [UserRole.DOCTOR] },
    loadComponent: () =>
      import('../doctor/components/profile/create-opinion/create-opinion.component').then(
        (c) => c.CreateOpinionComponent,
      ),
  },
  {
    path: 'profile/opinion/answer/edit',
    canActivate: [roleGuard],
    data: { roles: [UserRole.DOCTOR] },
    loadComponent: () =>
      import('../doctor/components/profile/edit-opinion/edit-opinion.component').then(
        (c) => c.EditOpinionComponent,
      ),
  },
];
