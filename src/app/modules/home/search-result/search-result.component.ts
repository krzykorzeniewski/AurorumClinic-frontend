import { Component, inject, OnInit } from '@angular/core';
import { DoctorService } from '../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { DoctorAppointmentCard } from '../../core/models/doctor.model';
import { AppointmentsSlots } from '../../core/models/appointment.model';
import { DoctorAppointmentCardComponent } from '../../shared/components/doctor-appointment-card/doctor-appointment-card.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [DoctorAppointmentCardComponent, NgForOf],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
})
export class SearchResultComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _doctorService = inject(DoctorService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  startOfTheWeek!: Date;
  endOfTheWeek!: Date;

  doctors: DoctorAppointmentCard[] = [];
  appointments: Record<number, AppointmentsSlots> = {};

  ngOnInit(): void {
    this._route.queryParams.subscribe({
      next: (params) => {
        const searchQuery = params['searchQuery'] || null;
        const serviceIdFromQuery = params['serviceId'] || null;

        if (serviceIdFromQuery) {
          this.setDaysToSearch();

          this._doctorService
            .searchDoctor(searchQuery, serviceIdFromQuery)
            .subscribe({
              next: (doctors) => {
                this.doctors = doctors;
                this.loadAppointmentsForDoctors(doctors);
              },
            });
        } else {
          void this._router.navigate(['']);
        }
      },
    });
  }

  private loadAppointmentsForDoctors(doctors: DoctorAppointmentCard[]): void {
    doctors.forEach((doctor) => {
      this._appointmentService
        .getAppointmentSlots(
          doctor.id,
          this.startOfTheWeek,
          this.endOfTheWeek,
          doctor.serviceId,
        )
        .subscribe({
          next: (slots) => {
            this.appointments[doctor.id] = slots;
          },
        });
    });
  }

  private setDaysToSearch() {
    const now = new Date();
    const day = now.getDay();

    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(8, 0, 0, 0);

    const diffToFriday = day === 0 ? 5 : 5 - day;
    const friday = new Date(now);
    friday.setDate(now.getDate() + diffToFriday);
    friday.setHours(21, 0, 0, 0);

    this.startOfTheWeek = monday;
    this.endOfTheWeek = friday;
  }
}
