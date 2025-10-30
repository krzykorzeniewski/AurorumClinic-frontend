import { Routes } from '@angular/router';

export const APPOINTMENT_ROUTES: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import(
        '../appointment/components/appointment-register/appointment-register.component'
      ).then((c) => c.AppointmentRegisterComponent),
  },
  {
    path: 'reschedule',
    loadComponent: () =>
      import(
        '../appointment/components/appointment-reschedule/appointment-reschedule.component'
      ).then((c) => c.AppointmentRescheduleComponent),
  },
];
