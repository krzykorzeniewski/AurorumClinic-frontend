import { Component, computed, inject, OnInit, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgForOf, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { startWith } from 'rxjs';
import { DoctorService } from '../../../core/services/doctor.service';
import { FormsService } from '../../../core/services/forms.service';
import { SpecializationWithServices } from '../../../core/models/doctor.model';
import { Service } from '../../../core/models/service.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-doctor-appointment-search',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './doctor-appointment-search.component.html',
  styleUrl: './doctor-appointment-search.component.css',
})
export class DoctorAppointmentSearchComponent implements OnInit {
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  readonly searchForm = this._formService.getSearchFrom();
  private formChanges = toSignal(this.searchForm.valueChanges, {
    initialValue: this.searchForm.value,
  });
  confirmSearch = output<{
    name: string;
    serviceId: string;
  }>();

  specializations: SpecializationWithServices[] = [];
  selectedServices: Service[] = [];
  selectedService = output<Service>();
  canSearch = computed(() => {
    this.formChanges();

    const { specialization, service } = this.controls;

    const selectedSpec = this.specializations.find(
      (spec) => spec.id === Number(specialization.value),
    );

    const hasServices = (selectedSpec?.services?.length ?? 0) > 0;
    if (hasServices) {
      return this.searchForm.valid && !!service.value;
    }

    return false;
  });

  ngOnInit(): void {
    this._doctorService.getSpecializationsWithServices().subscribe({
      next: (res) => {
        this.specializations = res;
      },
    });

    this.controls.specialization.valueChanges
      .pipe(startWith(this.controls.specialization.value))
      .subscribe((specId) => {
        const selectedSpec = this.specializations.find(
          (spec) => spec.id === Number(specId),
        );

        this.selectedServices = selectedSpec?.services || [];

        this.controls.service.setValue('');
        this.controls.service.markAsPristine();
        this.controls.service.markAsUntouched();

        if (this.selectedServices.length > 0) {
          this.controls.service.setValidators([Validators.required]);
          this.controls.service.enable({ emitEvent: false });
        } else {
          this.controls.service.clearValidators();
          this.controls.service.disable({ emitEvent: false });
        }

        this.controls.service.updateValueAndValidity({ emitEvent: false });
        this.searchForm.updateValueAndValidity();
      });
  }

  onSearch() {
    if (!this.searchForm.invalid) {
      const { name, service } = this.searchForm.value;
      this.confirmSearch.emit({
        name: name || '',
        serviceId: service!,
      });
    }
  }

  get controls() {
    return this.searchForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
