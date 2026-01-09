import { Component, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Router } from '@angular/router';
import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from '../../../core/models/appointment.model';
import { DatePipe, Location, NgIf } from '@angular/common';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { GetPatientResponse } from '../../../core/models/patient.model';
import { catchError, of, tap } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-appointment-details',
  standalone: true,
  imports: [
    DatePipe,
    DoctorCardComponent,
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
  ],
  templateUrl: './patient-appointment-details.component.html',
  styleUrl: './patient-appointment-details.component.css',
})
export class PatientAppointmentDetailsComponent {
  private _appointmentService = inject(AppointmentService);
  private _patientService = inject(PatientService);
  private _location = inject(Location);
  private _router = inject(Router);
  protected readonly PaymentStatus = PaymentStatus;
  protected readonly AppointmentStatus = AppointmentStatus;

  patient = signal<GetPatientResponse | null>(null);
  appointment = signal<Appointment | null>(null);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      appointment: Appointment;
      patientId: number;
    };

    if (state?.appointment && state?.patientId) {
      this.appointment.set(state.appointment);
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
      void this._router.navigate(['/internal/patients']);
    }
  }

  onRescheduleAppointment() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    const currentPatient = this.patient();
    if (!currentPatient) return;

    void this._router.navigate(['/appointment/reschedule'], {
      state: { appointment: currentAppointment, patientId: currentPatient.id },
    });
  }

  onPayment() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    void this._router.navigate(['/appointment/payment'], {
      state: {
        paymentId: currentAppointment.payment.id,
      },
    });
  }

  onCancelAppointment() {
    const currentAppointment = this.appointment();
    const patient = this.patient();
    if (!currentAppointment || !patient) return;

    this._appointmentService
      .deletePatientAppointmentByEmployee(currentAppointment.id)
      .subscribe({
        next: () => {
          void this._router.navigate(['/internal/patients/' + patient.id], {
            state: {
              message: 'Pomyślnie odwołano wizytę pacjenta',
              status: 'success',
            },
          });
        },
        error: (err) => {
          void this._router.navigate(['internal/patients/' + patient.id], {
            state: {
              message: err.message,
              status: 'error',
            },
          });
        },
      });
  }

  goBack() {
    const patient = this.patient();
    if (!patient) return;
    void this._router.navigate(['internal/patients/' + patient.id]);
  }

  mapPaymentToVisibleStatus(payment: PaymentStatus) {
    return this._appointmentService.mapPaymentToVisibleStatus(payment);
  }
}
