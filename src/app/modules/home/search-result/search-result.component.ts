import { Component, inject, OnInit } from '@angular/core';
import { DoctorService } from '../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { DoctorAppointmentCard } from '../../core/models/doctor.model';
import { DoctorAppointmentCardComponent } from '../../shared/components/doctor-appointment-card/doctor-appointment-card.component';
import { NgForOf } from '@angular/common';
import { forkJoin } from 'rxjs';

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
  nameOfTheService!: string;
  doctors: DoctorAppointmentCard[] = [];

  ngOnInit(): void {
    this._route.queryParams.subscribe({
      next: (params) => {
        const searchQuery = params['searchQuery'] || null;
        const serviceIdFromQuery = params['serviceId'] || null;

        if (serviceIdFromQuery) {
          this._doctorService
            .searchDoctors(searchQuery, serviceIdFromQuery)
            .subscribe({
              next: (doctors) => {
                this.doctors = doctors;
              },
            });

          forkJoin({
            services: this._doctorService.getSpecializationsWithServices(),
          }).subscribe({
            next: ({ services }) => {
              const serviceFromStorage =
                this._appointmentService.returnServiceById(
                  services,
                  serviceIdFromQuery,
                );

              if (serviceFromStorage) {
                this.nameOfTheService = serviceFromStorage.name;
              } else {
                void this._router.navigate(['']);
              }
            },
            error: () => {
              void this._router.navigate(['']);
            },
          });
        } else {
          void this._router.navigate(['']);
        }
      },
    });
  }
}
