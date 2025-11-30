import { Component, inject } from '@angular/core';
import { DoctorAppointmentSearchComponent } from '../../../shared/components/doctor-appointment-search/doctor-appointment-search.component';
import { DoctorService } from '../../../core/services/doctor.service';
import { Router } from '@angular/router';
import { DoctorAppointmentCard } from '../../../core/models/doctor.model';
import { DoctorAppointmentCardComponent } from '../../../shared/components/doctor-appointment-card/doctor-appointment-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { GetPatientResponse } from '../../../core/models/patient.model';

@Component({
  selector: 'app-appointment-search',
  standalone: true,
  imports: [
    DoctorAppointmentSearchComponent,
    DoctorAppointmentCardComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './appointment-search.component.html',
  styleUrl: './appointment-search.component.css',
})
export class AppointmentSearchComponent {
  private _doctorService = inject(DoctorService);
  private _router = inject(Router);
  patient: GetPatientResponse | null = null;
  doctors: DoctorAppointmentCard[] = [];

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { patient: GetPatientResponse };
    if (state?.patient) {
      this.patient = state.patient;
    } else {
      void this._router.navigate(['/internal/patients']);
    }
  }

  onSearch(data: { name: string; serviceId: string }) {
    this._doctorService
      .searchDoctors(data.name, Number(data.serviceId))
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors;
        },
      });
  }
}
