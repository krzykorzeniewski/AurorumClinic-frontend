import { Component, inject, OnInit } from '@angular/core';
import {
  DoctorAppointmentCard,
  SpecializationWithServices,
} from '../../../core/models/doctor.model';
import { GetPatientResponse } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { DatePipe, NgIf } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { Service } from '../../../core/models/service.model';
import { MatButton } from '@angular/material/button';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { PatientService } from '../../../core/services/patient.service';
import { CreateAppointmentPatient } from '../../../core/models/appointment.model';

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
    RouterLink,
    DoctorCardComponent,
  ],
  templateUrl: './appointment-register.component.html',
  styleUrl: './appointment-register.component.css',
})
export class AppointmentRegisterComponent implements OnInit {
  private _doctorService = inject(DoctorService);
  private _patientService = inject(PatientService);
  private _userService = inject(UserService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  doctor!: DoctorAppointmentCard;
  patient!: GetPatientResponse;
  service!: Service;
  date!: string;

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
          const serviceFromStorage = this.returnServiceById(
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
      description: 'wa',
    };
    console.log(appointment);

    this._patientService.registerPatientForAppointment(appointment).subscribe({
      next: () => {
        console.log('sie udalo');
      },
    });
  }

  private returnServiceById(
    servicesArray: SpecializationWithServices[],
    serviceId: string,
  ) {
    for (const spec of servicesArray) {
      const found = spec.services.find(
        (s: Service) => String(s.id) === serviceId,
      );
      if (found) {
        return found;
      }
    }
    return null;
  }
}
