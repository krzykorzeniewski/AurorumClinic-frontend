import { Component, inject, input, OnInit, output } from '@angular/core';
import { DoctorAppointmentCard } from '../../../core/models/doctor.model';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { DatePipe, Location, NgIf } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { Service } from '../../../core/models/service.model';
import { MatButton } from '@angular/material/button';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import {
  CreateAppointmentPatient,
  CreateAppointmentPatientByEmployee,
} from '../../../core/models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { FormsService } from '../../../core/services/forms.service';
import { GetPatientResponse } from '../../../core/models/patient.model';
import { forkJoin } from 'rxjs';
import { GetUserProfileResponse } from '../../../core/models/user.model';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-appointment-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    DatePipe,
    NgIf,
    MatButton,
    DoctorCardComponent,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './appointment-register.component.html',
})
export class AppointmentRegisterComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _patientService = inject(PatientService);
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _userService = inject(UserService);
  private _location = inject(Location);
  private _router = inject(Router);
  createAppointment = input.required<
    CreateAppointmentPatient | CreateAppointmentPatientByEmployee
  >();
  doctor = input.required<DoctorAppointmentCard>();
  confirmRegister = output<
    CreateAppointmentPatient | CreateAppointmentPatientByEmployee
  >();
  patient!: GetPatientResponse | GetUserProfileResponse;
  service!: Service;
  date!: string;
  additionalInformation =
    this._formService.getAdditionalInformationAppointmentForm();

  ngOnInit(): void {
    const appointmentData = this.createAppointment();

    this.date = appointmentData.startedAt;

    if ('patientId' in appointmentData) {
      this._patientService.getPatient(appointmentData.patientId).subscribe({
        next: (patient) => {
          this.patient = patient;
        },
      });
    } else {
      this._userService.getUser().subscribe({
        next: (user) => {
          this.patient = user;
        },
      });
    }

    forkJoin({
      services: this._doctorService.getSpecializationsWithServices(),
    }).subscribe({
      next: ({ services }) => {
        const serviceFromStorage = this._appointmentService.returnServiceById(
          services,
          appointmentData.serviceId.toString(),
        );

        if (serviceFromStorage) {
          this.service = serviceFromStorage;
        } else {
          void this._router.navigate(['']);
        }
      },
      error: () => {
        void this._router.navigate(['']);
      },
    });
  }

  onAppointmentRegister() {
    const currentData = this.createAppointment();
    const updatedData:
      | CreateAppointmentPatient
      | CreateAppointmentPatientByEmployee = {
      ...currentData,
      description: this.additionalInformation.value || '',
    };
    this.confirmRegister.emit(updatedData);
  }

  onCancel() {
    this._location.back();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
