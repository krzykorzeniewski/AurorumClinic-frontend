import { Component, inject, OnInit } from '@angular/core';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { Appointment } from '../../../core/models/appointment.model';
import { map } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [DoctorCardComponent, NgForOf, NgIf, MatButton],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  private _userService = inject(UserService);
  private _page = 0;
  private _size = 5;
  appointmentsDone: Appointment[] = [];
  appointmentsFuture: Appointment[] = [];
  hasMoreData = true;

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchMoreData(): void {
    this._page++;
    this.fetchAppointments();
  }

  private fetchAppointments(): void {
    this._userService
      .getUserAppointments(this._page, this._size)
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
