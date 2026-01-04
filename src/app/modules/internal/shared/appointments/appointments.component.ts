import { Component, inject, signal } from '@angular/core';
import { PatientCardComponent } from '../../../shared/components/patient-card/patient-card.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCalendar } from '@angular/material/datepicker';
import { GetDailyAppointmentInfo } from '../../../core/models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { map } from 'rxjs';
import { UserRole } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    PatientCardComponent,
    NgForOf,
    MatPaginator,
    MatCalendar,
    AlertComponent,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent {
  private _authService = inject(AuthService);
  private _appointmentService = inject(AppointmentService);
  selectedDate = signal<Date>(new Date());
  appointments = signal<GetDailyAppointmentInfo[]>([]);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  infoMessage = signal<string>('');
  isEmployee$ = this._authService.user$.pipe(
    map((user) => user?.role === UserRole.EMPLOYEE),
  );

  onDateChange(date: Date): void {
    this.selectedDate.set(date);
    this.currentPage.set(0);
    this.loadAppointments();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadAppointments();
  }

  private loadAppointments() {
    this._appointmentService
      .getAllAppointments(
        this.selectedDate(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.appointments.set(res.doctors);
          this.totalElements.set(res.page.totalElements);
        },
        error: (err) => {
          this.infoMessage.set(err.message);
        },
      });
  }
}
