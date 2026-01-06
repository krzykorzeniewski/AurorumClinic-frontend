import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { UserRoleMap } from '../core/models/auth.model';

export const INTERNAL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: {
      roles: [UserRoleMap.EMPLOYEE, UserRoleMap.DOCTOR, UserRoleMap.ADMIN],
    },
    loadComponent: () =>
      import('../internal/shared/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent,
      ),
  },
  {
    path: 'patients',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./shared/patient-table/patient-table.component').then(
        (c) => c.PatientTableComponent,
      ),
  },
  {
    path: 'patients/:id',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./shared/patient-profile/patient-profile.component').then(
        (c) => c.PatientProfileComponent,
      ),
  },
  {
    path: 'patients/:id/edit',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./shared/patient-profile/patient-profile-edit/patient-profile-edit.component').then(
        (c) => c.PatientProfileEditComponent,
      ),
  },
  {
    path: 'patients/:id/appointments/details',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./shared/patient-appointment-details/patient-appointment-details.component').then(
        (c) => c.PatientAppointmentDetailsComponent,
      ),
  },
  {
    path: 'doctors',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./employee/doctor-table/doctor-table.component').then(
        (c) => c.DoctorTableComponent,
      ),
  },
  {
    path: 'my-schedules',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./doctor/schedule/schedule.component').then(
        (c) => c.ScheduleComponent,
      ),
  },
  {
    path: 'my-schedules/daily',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./doctor/schedule/create-new-daily-schedule/create-new-daily-schedule.component').then(
        (c) => c.CreateNewDailyScheduleComponent,
      ),
  },
  {
    path: 'my-schedules/weekly',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./doctor/schedule/create-new-weekly-schedule/create-new-weekly-schedule.component').then(
        (c) => c.CreateNewWeeklyScheduleComponent,
      ),
  },
  {
    path: 'my-schedules/details',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./doctor/schedule/schedule-details/schedule-details.component').then(
        (c) => c.ScheduleDetailsComponent,
      ),
  },
  {
    path: 'schedules',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./employee/doctor-schedules/doctor-schedules.component').then(
        (c) => c.DoctorSchedulesComponent,
      ),
  },
  {
    path: 'schedules/daily',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./employee/doctor-schedules/create-new-daily-doctor-schedule/create-new-daily-doctor-schedule.component').then(
        (c) => c.CreateNewDailyDoctorScheduleComponent,
      ),
  },
  {
    path: 'schedules/weekly',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./employee/doctor-schedules/create-new-weekly-doctor-schedule/create-new-weekly-doctor-schedule.component').then(
        (c) => c.CreateNewWeeklyDoctorScheduleComponent,
      ),
  },
  {
    path: 'schedules/details',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./employee/doctor-schedules/doctor-schedule-details/doctor-schedule-details.component').then(
        (c) => c.DoctorScheduleDetailsComponent,
      ),
  },
  {
    path: 'my-absences',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./doctor/absences/absences.component').then(
        (c) => c.AbsencesComponent,
      ),
  },
  {
    path: 'absences',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE] },
    loadComponent: () =>
      import('./employee/doctor-absences/doctor-absences.component').then(
        (c) => c.DoctorAbsencesComponent,
      ),
  },
  {
    path: 'appointments',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.EMPLOYEE, UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./shared/appointments/appointments.component').then(
        (c) => c.AppointmentsComponent,
      ),
  },
  {
    path: 'appointments/details',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.DOCTOR] },
    loadComponent: () =>
      import('./doctor/patient-appointment-details/patient-appointment-details.component').then(
        (c) => c.PatientAppointmentDetailsComponent,
      ),
  },
  {
    path: 'users',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.ADMIN] },
    loadComponent: () =>
      import('../internal/admin/user-table/user-table.component').then(
        (c) => c.UserTableComponent,
      ),
  },
  {
    path: 'users/register-doctor',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.ADMIN] },
    loadComponent: () =>
      import('../internal/admin/register-doctor/register-doctor.component').then(
        (c) => c.RegisterDoctorComponent,
      ),
  },
  {
    path: 'users/register-employee',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.ADMIN] },
    loadComponent: () =>
      import('../internal/admin/register-employee/register-employee.component').then(
        (c) => c.RegisterEmployeeComponent,
      ),
  },
  {
    path: 'specializations',
    canActivate: [roleGuard],
    data: { roles: [UserRoleMap.ADMIN] },
    loadComponent: () =>
      import('../internal/admin/specialization-table/specialization-table.component').then(
        (c) => c.SpecializationTableComponent,
      ),
  },
];
