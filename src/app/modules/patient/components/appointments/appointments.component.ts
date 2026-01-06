import { Component, inject, OnInit } from '@angular/core';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { Location, NgForOf, NgIf } from '@angular/common';
import { Appointment } from '../../../core/models/appointment.model';
import { map } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [DoctorCardComponent, NgForOf, NgIf, MatButton],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  private _userService = inject(UserService);
  private _location = inject(Location);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private _page = 0;
  private _size = 5;
  appointmentsDone: Appointment[] = [];
  appointmentsFuture: Appointment[] = [];
  hasMoreData = true;

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
    this.fetchAppointments();
  }

  fetchMoreData(): void {
    this._page++;
    this.fetchAppointments();
  }

  goToDetails(appointment: Appointment) {
    void this._router.navigate(['/profile/appointments/details'], {
      state: { appointment },
    });
  }

  private fetchAppointments(): void {
    this._userService
      .getPatientAppointments(this._page, this._size)
      .pipe(
        map((res) => ({
          done: res.appointments.filter((app) => app.status === 'FINISHED'),
          future: res.appointments.filter((app) => app.status === 'CREATED'),
          page: res.page,
        })),
      )
      .subscribe({
        next: (res) => {
          this.appointmentsDone = [...this.appointmentsDone, ...res.done];
          this.appointmentsFuture = [...this.appointmentsFuture, ...res.future];
          this.hasMoreData = res.page.number + 1 < res.page.totalPages;
        },
      });
  }
}
