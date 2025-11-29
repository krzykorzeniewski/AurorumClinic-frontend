import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/auth.model';
import { roleMatchGuard } from '../core/guards/role-match.guard';

export const APPOINTMENT_ROUTES: Routes = [
  {
    path: 'register',
    canActivate: [roleGuard],
    data: { roles: [UserRole.PATIENT] },
    loadComponent: () =>
      import(
        '../appointment/components/appointment-register/appointment-register.component'
      ).then((c) => c.AppointmentRegisterComponent),
  },
  {
    path: 'reschedule',
    canMatch: [roleMatchGuard],
    data: { roles: [UserRole.EMPLOYEE] },
    loadComponent: () =>
      import(
        '../appointment/components/appointment-reschedule/appointment-reschedule-employee/appointment-reschedule-employee.component'
      ).then((c) => c.AppointmentRescheduleEmployeeComponent),
  },
  {
    path: 'reschedule',
    canMatch: [roleMatchGuard],
    data: { roles: [UserRole.PATIENT] },
    loadComponent: () =>
      import(
        '../appointment/components/appointment-reschedule/appointment-reschedule-patient/appointment-reschedule-patient.component'
      ).then((c) => c.AppointmentReschedulePatientComponent),
  },
];
