import { Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
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
import { ScheduleService } from '../../../../core/services/schedule.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { FormsService } from '../../../../core/services/forms.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import {
  GetFullDoctorApiResponse,
  SpecializationWithServices,
} from '../../../../core/models/doctor.model';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { combineLatest, EMPTY, filter, switchMap, take } from 'rxjs';
import { CreateDailyDoctorScheduleByDoctor } from '../../../../core/models/schedule.model';
import { toLocalISOString } from '../../../../shared/methods/dateTransform';
import { AuthService } from '../../../../core/services/auth.service';
import { User, UserRoleMap } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-create-new-daily-schedule',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOptgroup,
    MatOption,
    MatSelect,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    NgIf,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
  ],
  templateUrl: './create-new-daily-schedule.component.html',
})
export class CreateNewDailyScheduleComponent {
  private _authService = inject(AuthService);
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
    this._authService.user$
      .pipe(
        filter((user): user is User => !!user),
        take(1),
        switchMap((user) => {
          if (user.role !== UserRoleMap.DOCTOR) {
            this._router.navigate(['/internal/my-schedules']);
            return EMPTY;
          }

          return combineLatest([
            this._doctorService.getDoctorById(user.id),
            this._doctorService.getSpecializationsWithServices(),
          ]);
        }),
      )
      .subscribe({
        next: ([doctor, specs]) => {
          this.doctor.set(doctor);

          const doctorSpecIds = doctor.specializations.map((s) => s.id);
          this.specializations = specs.filter((spec) =>
            doctorSpecIds.includes(spec.id),
          );
        },
        error: () => this._router.navigate(['/internal/my-schedules']),
      });
  }

  goBack() {
    void this._router.navigate(['/internal/my-schedules']);
  }

  createSchedule() {
    const doctor = this.doctor();
    if (!doctor) return;
    const value = this.scheduleForm.value;
    if (!value) return;
    const data: CreateDailyDoctorScheduleByDoctor = {
      startedAt:
        toLocalISOString(value.date!).split('T')[0] +
        'T' +
        toLocalISOString(value.startedAt!).split('T')[1],
      finishedAt:
        toLocalISOString(value.date!).split('T')[0] +
        'T' +
        toLocalISOString(value.finishedAt!).split('T')[1],
      serviceIds: value.services!,
    };

    this._scheduleService.createDailySchedule(data).subscribe({
      next: () => {
        void this._router.navigate(['/internal/my-schedules'], {
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
