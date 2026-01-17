import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { UserRoleMap } from '../../../core/models/auth.model';
import { toLocalISOString } from '../../../shared/methods/dateTransform';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private _location = inject(Location);
  private _doctorService = inject(DoctorService);
  private _employeeService = inject(EmployeeService);
  private destroy$ = new Subject<void>();
  private interval = setInterval(() => {
    this.todayDate = new Date();
  }, 1000);

  finishedAppointments!: number;
  futureAppointments!: number;
  todayDate!: Date;
  role!: UserRoleMap | undefined;

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this._snackBar.open(navigation.extras.state['message'], 'zamknij', {
        duration: 5000,
        panelClass:
          navigation.extras.state['status'] === 'success'
            ? 'xxx-alert-info'
            : 'xxx-alert-error',
      });
    }
    this._location.replaceState(this._router.url);
  }

  ngOnInit(): void {
    this._authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.role = user?.role));
    const startDate = new Date();
    startDate.setHours(8, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(21, 0, 0, 0);

    if (this.role === UserRoleMap.DOCTOR) {
      this._doctorService
        .getPanelStatistics(
          toLocalISOString(startDate),
          toLocalISOString(endDate),
        )
        .subscribe({
          next: (values) => {
            this.finishedAppointments = values.totalFinished ?? 0;
            this.futureAppointments = values.totalScheduled ?? 0;
          },
        });
    } else {
      this._employeeService
        .getPanelStatistics(
          toLocalISOString(startDate),
          toLocalISOString(endDate),
          this.role === UserRoleMap.ADMIN,
        )
        .subscribe({
          next: (values) => {
            this.finishedAppointments = values.totalFinished ?? 0;
            this.futureAppointments = values.totalScheduled ?? 0;
          },
        });
    }
  }

  mapRoleToPolish(userRole: UserRoleMap | undefined) {
    switch (userRole) {
      case UserRoleMap.DOCTOR:
        return 'DOKTOR';
      case UserRoleMap.ADMIN:
        return 'ADMIN';
      default:
        return 'PRACOWNIK';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
