import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/auth.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { toLocalISOString } from '../../../shared/methods/dateTransform';

@Component({
  selector: 'app-employee-panel',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './employee-panel.component.html',
  styleUrl: './employee-panel.component.css',
})
export class EmployeePanelComponent implements OnInit {
  private _authService = inject(AuthService);
  private _doctorService = inject(DoctorService);
  private _employeeService = inject(EmployeeService);
  finishedAppointments!: number;
  futureAppointments!: number;
  todayDate!: Date;
  role!: UserRole | undefined;

  ngOnInit(): void {
    this._authService.user$.subscribe((user) => (this.role = user?.role));
    const startDate = new Date();
    startDate.setHours(8, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(21, 0, 0, 0);

    if (this.role === UserRole.DOCTOR) {
      this._doctorService
        .getPanelStatistics(
          toLocalISOString(startDate),
          toLocalISOString(endDate),
        )
        .subscribe({
          next: (values) => {
            this.finishedAppointments = values.totalFinished;
            this.futureAppointments = values.totalScheduled;
          },
        });
    } else {
      this._employeeService
        .getPanelStatistics(
          toLocalISOString(startDate),
          toLocalISOString(endDate),
          this.role === UserRole.ADMIN,
        )
        .subscribe({
          next: (values) => {
            this.finishedAppointments = values.totalFinished;
            this.futureAppointments = values.totalScheduled;
          },
        });
    }

    setInterval(() => {
      this.todayDate = new Date();
    }, 1000);
  }

  mapRoleToPolish(userRole: UserRole | undefined) {
    switch (userRole) {
      case UserRole.DOCTOR:
        return 'DOKTOR';
      case UserRole.ADMIN:
        return 'ADMIN';
      default:
        return 'PRACOWNIK';
    }
  }
}
