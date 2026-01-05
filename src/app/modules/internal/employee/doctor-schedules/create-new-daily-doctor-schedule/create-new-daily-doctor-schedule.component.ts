import { Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { NgIf } from '@angular/common';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { FormsService } from '../../../../core/services/forms.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment.development';
import {
  GetFullDoctorApiResponse,
  SpecializationWithServices,
} from '../../../../core/models/doctor.model';
import { combineLatest } from 'rxjs';
import { CreateDailyDoctorScheduleByEmployee } from '../../../../core/models/schedule.model';
import { toLocalISOString } from '../../../../shared/methods/dateTransform';

@Component({
  selector: 'app-create-new-daily-doctor-schedule',
  standalone: true,
  imports: [
    AlertComponent,
    DoctorCardComponent,
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOptgroup,
    MatOption,
    MatSelect,
    MatSuffix,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './create-new-daily-doctor-schedule.component.html',
})
export class CreateNewDailyDoctorScheduleComponent {
  private _scheduleService = inject(ScheduleService);
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  environmentVariables = environment;
  scheduleForm = this._formService.getScheduleDailyForm();
  doctor = signal<GetFullDoctorApiResponse | null>(null);
  specializations: SpecializationWithServices[] = [];

  errorMessage = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      doctorId: number;
    };
    if (!state?.doctorId) {
      void this._router.navigate(['/internal/doctors']);
      return;
    }

    combineLatest([
      this._doctorService.getDoctorById(state.doctorId),
      this._doctorService.getSpecializationsWithServices(),
    ]).subscribe({
      next: ([doctor, specs]) => {
        this.doctor.set(doctor);
        const doctorSpecIds = doctor.specializations.map((s) => s.id);

        this.specializations = specs.filter((spec) =>
          doctorSpecIds.includes(spec.id),
        );
      },
      error: () => void this._router.navigate(['/internal/doctors']),
    });
  }

  goBack() {
    void this._router.navigate(['/internal/doctors']);
  }

  createSchedule() {
    const doctor = this.doctor();
    if (!doctor) return;
    const value = this.scheduleForm.value;
    if (!value) return;
    const data: CreateDailyDoctorScheduleByEmployee = {
      startedAt:
        toLocalISOString(value.date!).split('T')[0] +
        'T' +
        toLocalISOString(value.startedAt!).split('T')[1],
      finishedAt:
        toLocalISOString(value.date!).split('T')[0] +
        'T' +
        toLocalISOString(value.finishedAt!).split('T')[1],
      doctorId: doctor.id,
      serviceIds: value.services!,
    };

    this._scheduleService.createDoctorDailyScheduleByEmployee(data).subscribe({
      next: () => {
        void this._router.navigate(['/internal/doctors'], {
          state: {
            message: 'Pomyślnie utworzono grafik jednodniowy',
            status: 'success',
          },
        });
      },
      error: (err) => {
        this.errorMessage.set(err.message);
      },
    });
  }

  get controls() {
    return this.scheduleForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
