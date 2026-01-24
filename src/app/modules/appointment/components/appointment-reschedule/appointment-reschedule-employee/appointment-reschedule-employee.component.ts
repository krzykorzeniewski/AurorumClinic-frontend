import { Component, inject, OnInit, signal } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { AppointmentRescheduleComponent } from '../appointment-reschedule.component';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../core/services/appointment.service';
import {
  Appointment,
  RescheduleAppointmentPatient,
} from '../../../../core/models/appointment.model';
import { PatientService } from '../../../../core/services/patient.service';
import { catchError, of, tap } from 'rxjs';
import { GetPatientResponse } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-appointment-reschedule-employee',
  standalone: true,
  imports: [NgIf, AppointmentRescheduleComponent],
  templateUrl: './appointment-reschedule-employee.component.html',
})
export class AppointmentRescheduleEmployeeComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _patientService = inject(PatientService);
  private _router = inject(Router);
  private _location = inject(Location);

  appointment = signal<Appointment | null>(null);
  patient = signal<GetPatientResponse | null>(null);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { patientId: number };

    if (state?.patientId) {
      this._patientService
        .getPatient(state.patientId)
        .pipe(
          tap((patient) => this.patient.set(patient)),
          catchError(() => of(null)),
        )
        .subscribe((patient) => {
          if (!patient) {
            this._location.back();
          }
        });
    } else {
      this._location.back();
    }
  }

  ngOnInit() {
    const navigation = this._router.getCurrentNavigation();
    const state =
      (navigation?.extras.state as { appointment: Appointment }) ||
      (history.state as { appointment: Appointment });

    if (state?.appointment) {
      this.appointment.set(state.appointment);
    } else {
      const patientResponse = this.patient();
      if (!patientResponse) {
        void this._router.navigate(['/internal/patients']);
        return;
      }
      void this._router.navigate([`/internal/patients/${patientResponse.id}`]);
    }
  }

  onConfirmReschedule(data: { date: string; description: string }) {
    const appointment = this.appointment();
    if (!appointment) return;

    const patient = this.patient();
    if (!patient) return;

    const rescheduleAppointment: RescheduleAppointmentPatient = {
      description: data.description,
      startedAt: data.date,
    };

    this._appointmentService
      .reschedulePatientAppointmentByEmployee(
        appointment.id,
        rescheduleAppointment,
      )
      .subscribe({
        next: () => {
          void this._router.navigate([`/internal/patients/${patient.id}`], {
            state: {
              message: 'Pomyślnie przełożono wizytę pacjenta',
              status: 'success',
            },
          });
        },
        error: (err) => {
          void this._router.navigate([`/internal/patients/${patient.id}`], {
            state: {
              message: err.message,
              status: 'error',
            },
          });
        },
      });
  }
}
