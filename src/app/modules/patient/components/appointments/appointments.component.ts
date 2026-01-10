import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { Location, NgForOf, NgIf } from '@angular/common';
import {
  Appointment,
  AppointmentStatus,
} from '../../../core/models/appointment.model';
import {
  distinctUntilChanged,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    DoctorCardComponent,
    NgForOf,
    NgIf,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatPaginator,
  ],
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent implements AfterViewInit, OnDestroy {
  private _userService = inject(UserService);
  private _location = inject(Location);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  appointments: Appointment[] = [];
  appointmentType = new FormControl<AppointmentStatus>(
    AppointmentStatus.CREATED,
    { nonNullable: true },
  );
  sub = new Subscription();
  totalData = 0;
  appointmentTypes = [
    { key: AppointmentStatus.CREATED, label: 'Nadchodzące' },
    { key: AppointmentStatus.FINISHED, label: 'Poprzednie' },
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  ngAfterViewInit(): void {
    this.sub.add(
      merge(
        this.paginator.page,
        this.appointmentType.valueChanges.pipe(distinctUntilChanged()),
      )
        .pipe(
          startWith({}),
          switchMap(() => {
            return this._userService.getPatientAppointments(
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.appointmentType.value,
            );
          }),
          map((response) => {
            this.totalData = response.page.totalElements;
            return response.appointments;
          }),
        )
        .subscribe((appointments) => {
          this.appointments = appointments;
        }),
    );
    this.appointmentType.valueChanges.subscribe(() => {
      this.paginator.pageIndex = 0;
    });
  }

  goToDetails(appointment: Appointment) {
    void this._router.navigate(['/profile/appointments/details'], {
      state: { appointment },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
