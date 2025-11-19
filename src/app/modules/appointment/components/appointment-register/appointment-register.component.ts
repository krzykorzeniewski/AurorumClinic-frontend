import { Component, inject, OnInit } from '@angular/core';
import { DoctorAppointmentCard } from '../../../core/models/doctor.model';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CreateAppointmentPatient } from '../../../core/models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { FormsService } from '../../../core/services/forms.service';
import { GetPatientResponse } from '../../../core/models/patient.model';

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
  styleUrl: './appointment-register.component.css',
})
export class AppointmentRegisterComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _userService = inject(UserService);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);
  private _router = inject(Router);
  doctor!: DoctorAppointmentCard;
  patient!: GetPatientResponse;
  service!: Service;
  date!: string;
  additionalInformation =
    this._formService.getAdditionalInformationAppointmentForm();

  ngOnInit(): void {
    this._route.queryParams.subscribe({
      next: (params) => {
        const doctorIdFromQuery = params['doctorId'] || null;
        const serviceIdFromQuery = params['serviceId'] || null;
        const dateFromQuery = params['date'] || null;
        const doctorFromState = history.state?.doctorAppointmentRegister;

        if (
          serviceIdFromQuery &&
          doctorIdFromQuery === String(doctorFromState.id) &&
          dateFromQuery
        ) {
          this.doctor = doctorFromState;
          this.date = dateFromQuery;
          let services;
          const storedServices = localStorage.getItem('services');
          if (storedServices) {
            services = JSON.parse(storedServices);
          } else {
            this._doctorService.getSpecializationsWithServices().subscribe({
              next: (res) => {
                services = res;
                localStorage.setItem('services', JSON.stringify(res));
              },
            });
          }
          const serviceFromStorage = this._appointmentService.returnServiceById(
            services,
            serviceIdFromQuery,
          );
          if (serviceFromStorage) {
            this.service = serviceFromStorage;
          } else {
            void this._router.navigate(['']);
          }
          this._userService.getUser().subscribe({
            next: (user) => {
              this.patient = user;
            },
          });
        } else {
          void this._router.navigate(['']);
        }
      },
    });
  }

  onAppointmentRegister() {
    const appointment: CreateAppointmentPatient = {
      startedAt: this.date + ':00',
      serviceId: this.service.id,
      doctorId: this.doctor.id,
      description: this.additionalInformation.value || '',
    };

    this._appointmentService
      .registerPatientForAppointment(appointment)
      .subscribe({
        next: () => {
          void this._router.navigate(['']);
        },
      });
  }

  goBack() {
    this._location.back();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
