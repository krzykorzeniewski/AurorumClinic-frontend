import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Appointment,
  RescheduleAppointmentPatient,
} from '../../../../core/models/appointment.model';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { NgIf } from '@angular/common';
import { AppointmentRescheduleComponent } from '../appointment-reschedule.component';

@Component({
  selector: 'app-appointment-reschedule-patient',
  standalone: true,
  imports: [AppointmentRescheduleComponent, NgIf],
  templateUrl: './appointment-reschedule-patient.component.html',
})
export class AppointmentReschedulePatientComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _router = inject(Router);

  appointment = signal<Appointment | null>(null);

  ngOnInit() {
    const navigation = this._router.getCurrentNavigation();
    const state =
      (navigation?.extras.state as { appointment: Appointment }) ||
      (history.state as { appointment: Appointment });

    if (state?.appointment) {
      this.appointment.set(state.appointment);
    } else {
      void this._router.navigate(['/profile/appointments']);
    }
  }

  onConfirmReschedule(data: { date: string; description: string }) {
    const appointment = this.appointment();
    if (!appointment) return;

    const rescheduleAppointment: RescheduleAppointmentPatient = {
      description: data.description,
      startedAt: data.date,
    };

    this._appointmentService
      .rescheduleAppointment(appointment.id, rescheduleAppointment)
      .subscribe({
        next: () => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: 'Pomyślnie przełożono wizytę',
              status: 'success',
            },
          });
        },
        error: (err) => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: err.message,
              status: 'error',
            },
          });
        },
      });
  }
}
