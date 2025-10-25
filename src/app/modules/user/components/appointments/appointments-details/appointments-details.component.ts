import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from '../../../../core/models/appointment.model';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { MatButton } from '@angular/material/button';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-appointments-details',
  standalone: true,
  imports: [
    DoctorCardComponent,
    MatButton,
    NgIf,
    DatePipe,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
  ],
  templateUrl: './appointments-details.component.html',
  styleUrl: './appointments-details.component.css',
})
export class AppointmentsDetailsComponent implements OnInit {
  private _patientService = inject(PatientService);
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
        void this._router.navigate(['/profile/appointments']);
      }
    }
  }

  mapPaymentToVisibleStatus(payment: PaymentStatus) {
    return this._patientService.mapPaymentToVisibleStatus(payment);
  }
}
