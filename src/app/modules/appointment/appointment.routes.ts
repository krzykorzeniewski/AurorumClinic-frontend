import { Routes } from '@angular/router';
import { UserRoleMap } from '../core/models/auth.model';
import { roleMatchGuard } from '../core/guards/role-match.guard';
import { roleGuard } from '../core/guards/role.guard';

export const APPOINTMENT_ROUTES: Routes = [
  {
    path: 'search',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('../appointment/components/appointment-search/appointment-search.component').then(
        (c) => c.AppointmentSearchComponent,
      ),
  },
  {
    path: 'register',
    canMatch: [roleMatchGuard],
    data: { roles: [UserRoleMap.PATIENT] },
    loadComponent: () =>
      import('../appointment/components/appointment-register/appointment-register-patient/appointment-register-patient.component').then(
        (c) => c.AppointmentRegisterPatientComponent,
      ),
  },
  {
    path: 'register',
    canMatch: [roleMatchGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('../appointment/components/appointment-register/appointment-register-employee/appointment-register-employee.component').then(
        (c) => c.AppointmentRegisterEmployeeComponent,
      ),
  },
  {
    path: 'reschedule',
    canMatch: [roleMatchGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('../appointment/components/appointment-reschedule/appointment-reschedule-employee/appointment-reschedule-employee.component').then(
        (c) => c.AppointmentRescheduleEmployeeComponent,
      ),
  },
  {
    path: 'reschedule',
    canMatch: [roleMatchGuard],
    data: { roles: [UserRoleMap.PATIENT] },
    loadComponent: () =>
      import('../appointment/components/appointment-reschedule/appointment-reschedule-patient/appointment-reschedule-patient.component').then(
        (c) => c.AppointmentReschedulePatientComponent,
      ),
  },
];
