import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorAppointmentCardComponent } from '../../../shared/components/doctor-appointment-card/doctor-appointment-card.component';
import {
  Appointment,
  RescheduleAppointmentPatient,
} from '../../../core/models/appointment.model';
import { Location, NgIf } from '@angular/common';
import { DoctorAppointmentCard } from '../../../core/models/doctor.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { MatButton } from '@angular/material/button';
import { FormsService } from '../../../core/services/forms.service';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-reschedule',
  standalone: true,
  imports: [
    DoctorAppointmentCardComponent,
    NgIf,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatError,
  ],
  templateUrl: './appointment-reschedule.component.html',
  styleUrl: './appointment-reschedule.component.css',
})
export class AppointmentRescheduleComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _formService = inject(FormsService);
  private _location = inject(Location);
  private _router = inject(Router);
  additionalInformation =
    this._formService.getAdditionalInformationAppointmentForm();

  appointment = signal<Appointment | null>(null);
  doctorAppointmentCard!: DoctorAppointmentCard;
  selectedDateTime = signal<string | null>(null);

  ngOnInit(): void {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { appointment: Appointment };

    if (state?.appointment) {
      this.appointment.set(state.appointment);
    } else {
      const historyState = history.state as { appointment: Appointment };
      if (historyState?.appointment) {
        this.appointment.set(historyState.appointment);
        this.doctorAppointmentCard = new DoctorAppointmentCard(
          this.appointment()?.doctor.id,
          this.appointment()?.doctor.name,
          this.appointment()?.doctor.surname,
          this.appointment()?.doctor.specializations,
          this.appointment()?.doctor.profilePicture,
          null,
          this.appointment()?.service.id,
        );
        this.additionalInformation.setValue(
          this.appointment()?.description || '',
        );
      } else {
        void this._router.navigate(['']);
      }
    }
  }

  goBack() {
    this._location.back();
  }

  onConfirmReschedule() {
    const dateTime = this.selectedDateTime();
    if (!dateTime) return;

    const appointment = this.appointment();
    if (!appointment) return;

    const description = this.additionalInformation.value || '';

    const rescheduleAppointment: RescheduleAppointmentPatient = {
      description: description,
      startedAt: dateTime,
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

  onTimeSelected(dateTime: string) {
    this.selectedDateTime.set(dateTime);
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
