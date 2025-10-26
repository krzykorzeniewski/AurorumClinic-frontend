import { Routes } from '@angular/router';
import { patientGuard } from '../core/guards/patient.guard';

export const APPOINTMENT_ROUTES: Routes = [
  {
    path: 'register',
    canActivate: [patientGuard],
    loadComponent: () =>
      import(
        '../appointment/components/appointment-register/appointment-register.component'
      ).then((c) => c.AppointmentRegisterComponent),
  },
  {
    path: 'reschedule',
    canActivate: [patientGuard],
    loadComponent: () =>
      import(
        '../appointment/components/appointment-reschedule/appointment-reschedule.component'
      ).then((c) => c.AppointmentRescheduleComponent),
  },
];
