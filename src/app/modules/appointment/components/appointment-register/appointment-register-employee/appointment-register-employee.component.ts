import { Component, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Router } from '@angular/router';
import {
  CreateAppointmentPatient,
  CreateAppointmentPatientByEmployee,
} from '../../../../core/models/appointment.model';
import { DoctorAppointmentCard } from '../../../../core/models/doctor.model';
import { AppointmentRegisterComponent } from '../appointment-register.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-appointment-register-employee',
  standalone: true,
  imports: [AppointmentRegisterComponent, NgIf],
  templateUrl: './appointment-register-employee.component.html',
  styleUrl: '../appointment-register.component.css',
})
export class AppointmentRegisterEmployeeComponent {
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
      void this._router.navigate(['/internal/patients']);
    }
  }

  onAppointmentRegister(
    data: CreateAppointmentPatient | CreateAppointmentPatientByEmployee,
  ) {
    if ('patientId' in data) {
      const patientAppointment: CreateAppointmentPatientByEmployee = {
        startedAt: data.startedAt + ':00',
        serviceId: data.serviceId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        description: data.description || '',
      };

      this._appointmentService
        .registerPatientForAppointmentByEmployee(patientAppointment)
        .subscribe({
          next: () => {
            void this._router.navigate(['/internal/patients']);
          },
        });
    }
  }
}
