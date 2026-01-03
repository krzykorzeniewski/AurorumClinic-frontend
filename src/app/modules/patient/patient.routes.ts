import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/appointments/appointments.component').then(
        (c) => c.AppointmentsComponent,
      ),
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./components/appointments/appointments-details/appointments-details.component').then(
        (c) => c.AppointmentsDetailsComponent,
      ),
  },
  {
    path: 'opinion',
    loadComponent: () =>
      import('./components/create-opinion/create-opinion.component').then(
        (c) => c.CreateOpinionComponent,
      ),
  },
  {
    path: 'opinion/edit',
    loadComponent: () =>
      import('./components/edit-opinion/edit-opinion.component').then(
        (c) => c.EditOpinionComponent,
      ),
  },
];
