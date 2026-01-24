import { Component, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { DoctorAppointmentCard } from '../../../../core/models/doctor.model';
import { CreateAppointmentPatient } from '../../../../core/models/appointment.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentRegisterComponent } from '../appointment-register.component';

@Component({
  selector: 'app-appointment-register-patient',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    AppointmentRegisterComponent,
  ],
  templateUrl: './appointment-register-patient.component.html',
})
export class AppointmentRegisterPatientComponent {
  private _appointmentService = inject(AppointmentService);
  private _router = inject(Router);
  appointment = signal<CreateAppointmentPatient | null>(null);
  doctorAppointmentCard = signal<DoctorAppointmentCard | null>(null);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      appointment: CreateAppointmentPatient;
      doctorAppointmentCard: DoctorAppointmentCard;
    };

    if (
      state?.appointment &&
      state?.doctorAppointmentCard &&
      Number(state?.appointment.doctorId) ===
        Number(state?.doctorAppointmentCard.id)
    ) {
      this.appointment.set(state.appointment);
      this.doctorAppointmentCard.set(state.doctorAppointmentCard);
    } else {
      void this._router.navigate(['']);
    }
  }

  onAppointmentRegister(data: CreateAppointmentPatient) {
    const appointment: CreateAppointmentPatient = {
      startedAt: data.startedAt + ':00',
      serviceId: data.serviceId,
      doctorId: data.doctorId,
      description: data.description || '',
    };

    this._appointmentService
      .registerPatientForAppointment(appointment)
      .subscribe({
        next: () => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: 'Pomyślnie umówiono wizytę',
              status: 'success',
            },
          });
        },
      });
  }
}
