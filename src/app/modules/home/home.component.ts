import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { DoctorCardComponent } from '../shared/components/doctor-card/doctor-card.component';
import { DoctorService } from '../core/services/doctor.service';
import { DoctorRecommended } from '../core/models/doctor.model';
import { Router } from '@angular/router';
import { DoctorAppointmentSearchComponent } from '../shared/components/doctor-appointment-search/doctor-appointment-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    DoctorCardComponent,
    NgIf,
    DoctorAppointmentSearchComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private _doctorService = inject(DoctorService);
  private _router = inject(Router);
  private numberOfRecommendedDoctors = 6;
  recommendedDoctors: DoctorRecommended[] = [];

  ngOnInit(): void {
    this._doctorService
      .getRecommendedDoctors(0, this.numberOfRecommendedDoctors)
      .subscribe({
        next: (res) => {
          this.recommendedDoctors = res;
        },
      });
  }

  onSearch(data: { name: string; serviceId: string }) {
    void this._router.navigate(['/search-results'], {
      queryParams: {
        name: data.name || null,
        serviceId: data.serviceId || null,
      },
    });
  }
}
