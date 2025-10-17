import { Component, inject, OnInit } from '@angular/core';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { DoctorCardComponent } from '../shared/components/doctor-card/doctor-card.component';
import { DoctorService } from '../core/services/doctor.service';
import { DoctorRecommended } from '../core/models/doctor.model';
import { Specialization } from '../core/models/specialization.model';
import { FormsService } from '../core/services/forms.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Service } from '../core/models/service.model';
import { MatIcon } from '@angular/material/icon';
import { startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    NgForOf,
    DoctorCardComponent,
    MatOption,
    MatSelect,
    MatIcon,
    MatError,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  readonly searchForm = this._formService.getSearchFrom();
  recommendedDoctors: DoctorRecommended[] = [];
  specializations: (Specialization & { services: Service[] })[] = [];
  selectedServices: Service[] = [];

  ngOnInit(): void {
    this._doctorService.getRecommendedDoctors(0, 6).subscribe({
      next: (res) => {
        this.recommendedDoctors = res;
      },
    });
    this._doctorService.getSpecializationsWithServices().subscribe({
      next: (res) => {
        this.specializations = res;
      },
    });

    this.controls.specialization.valueChanges
      .pipe(startWith(this.controls.specialization.value))
      .subscribe((specId) => {
        if (!specId) {
          this.selectedServices = [];
          this.controls.service.reset();
          this.controls.service.disable();
          return;
        }

        const selectedSpec = this.specializations.find(
          (spec) => spec.id === Number(specId),
        );
        this.selectedServices = selectedSpec?.services || [];

        if (this.selectedServices.length) {
          this.controls.service.enable();
        } else {
          this.controls.service.disable();
        }
      });
  }

  onSearch() {
    if (this.searchForm.invalid) return;

    const { name, service } = this.searchForm.value;

    void this._router.navigate(['search-results'], {
      relativeTo: this._route,
      queryParams: {
        name: name || '',
        serviceId: service || null,
      },
    });
  }

  get controls() {
    return this.searchForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
