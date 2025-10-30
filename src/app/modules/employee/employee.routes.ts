import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/auth.model';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../employee/components/employee-panel/employee-panel.component'
      ).then((c) => c.EmployeePanelComponent),
  },
  {
    path: 'patients',
    canActivate: [roleGuard],
    data: { roles: [UserRole.EMPLOYEE] },
    loadComponent: () =>
      import(
        '../employee/components/patient-table/patient-table.component'
      ).then((c) => c.PatientTableComponent),
  },
];
