import { Component, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Router } from '@angular/router';
import {
  GetDailyAppointmentInfo,
  PaymentStatus,
} from '../../../core/models/appointment.model';
import { DatePipe, Location, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-patient-appointment-doctor-details',
  standalone: true,
  imports: [DatePipe, MatButton, MatFormField, MatInput, MatLabel, NgIf],
  templateUrl: './patient-appointment-details.component.html',
})
export class PatientAppointmentDetailsComponent {
  private _appointmentService = inject(AppointmentService);
  private _location = inject(Location);
  private _router = inject(Router);
  protected readonly PaymentStatus = PaymentStatus;

  appointment = signal<GetDailyAppointmentInfo | null>(null);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      appointmentId: number;
    };

    if (state?.appointmentId) {
      this._appointmentService
        .getAppointmentById(state.appointmentId)
        .subscribe({
          next: (res) => {
            this.appointment.set(res);
          },
          error: () => {
            void this._router.navigate(['/internal/appointments']);
          },
        });
    } else {
      void this._router.navigate(['/internal/appointments']);
    }
  }

  goBack() {
    this._location.back();
  }

  mapPaymentToVisibleStatus(payment: PaymentStatus) {
    return this._appointmentService.mapPaymentToVisibleStatus(payment);
  }
}
