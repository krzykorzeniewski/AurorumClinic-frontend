import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('../doctor/components/profile/profile.component').then(
        (c) => c.ProfileComponent,
      ),
  },
];
