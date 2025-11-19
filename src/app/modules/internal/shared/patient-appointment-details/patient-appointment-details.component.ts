import { Component, inject, OnInit, signal } from '@angular/core';
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
export class PatientAppointmentDetailsComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _location = inject(Location);
  private _router = inject(Router);
  protected readonly PaymentStatus = PaymentStatus;
  protected readonly AppointmentStatus = AppointmentStatus;

  appointment = signal<Appointment | null>(null);

  ngOnInit(): void {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { appointment: Appointment };

    if (state?.appointment) {
      this.appointment.set(state.appointment);
    } else {
      const historyState = history.state as { appointment: Appointment };
      if (historyState?.appointment) {
        this.appointment.set(historyState.appointment);
      } else {
        void this._router.navigate(['/internal']);
      }
    }
  }

  onRescheduleAppointment() {}

  onPayment() {}

  onCancelAppointment() {}

  goBack() {
    this._location.back();
  }

  mapPaymentToVisibleStatus(payment: PaymentStatus) {
    return this._appointmentService.mapPaymentToVisibleStatus(payment);
  }
}
