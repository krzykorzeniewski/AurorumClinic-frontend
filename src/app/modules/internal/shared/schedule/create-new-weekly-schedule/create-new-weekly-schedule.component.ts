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
import { DatePipe, NgForOf, NgIf } from '@angular/common';
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
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelActionRow,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import {
  CreateWeeklyDoctorScheduleByEmployee,
  DayDto,
} from '../../../../core/models/schedule.model';
import { toLocalISOString } from '../../../../shared/methods/dateTransform';

@Component({
  selector: 'app-create-new-weekly-schedule',
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
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    MatExpansionPanel,
    MatExpansionPanelActionRow,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatAccordion,
    MatExpansionPanelHeader,
    NgForOf,
    MatSelect,
    MatOption,
    MatOptgroup,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker,
    DatePipe,
  ],
  templateUrl: './create-new-weekly-schedule.component.html',
  styleUrl: '../schedule-details/schedule-details.component.css',
})
export class CreateNewWeeklyScheduleComponent {
  private _scheduleService = inject(ScheduleService);
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  environmentVariables = environment;
  scheduleForm = this._formService.getScheduleWeeklyForm();
  doctor = signal<GetFullDoctorApiResponse | null>(null);
  specializations: SpecializationWithServices[] = [];
  step = signal(0);
  weekDays = [
    { key: 'mon', label: 'Poniedziałek' },
    { key: 'tue', label: 'Wtorek' },
    { key: 'wed', label: 'Środa' },
    { key: 'thu', label: 'Czwartek' },
    { key: 'fri', label: 'Piątek' },
  ] as const;

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
    void this._router.navigate(['internal/doctors']);
  }

  createSchedule() {
    if (this.scheduleForm.invalid) {
      this.errorMessage.set('Formularz zawiera błędy. Sprawdź wszystkie pola.');
      return;
    }

    const doctorData = this.doctor();
    if (!doctorData) {
      this.errorMessage.set('Nie znaleziono danych lekarza.');
      return;
    }

    const formValue = this.scheduleForm.getRawValue();

    const payload: CreateWeeklyDoctorScheduleByEmployee = {
      mon: {
        hours: this.formatHours(formValue.mon!.hours),
        serviceIds: formValue.mon!.serviceIds,
      },
      tue: {
        hours: this.formatHours(formValue.tue!.hours),
        serviceIds: formValue.tue!.serviceIds,
      },
      wed: {
        hours: this.formatHours(formValue.wed!.hours),
        serviceIds: formValue.wed!.serviceIds,
      },
      thu: {
        hours: this.formatHours(formValue.thu!.hours),
        serviceIds: formValue.thu!.serviceIds,
      },
      fri: {
        hours: this.formatHours(formValue.fri!.hours),
        serviceIds: formValue.fri!.serviceIds,
      },
      startedAt: toLocalISOString(formValue.startedAt!),
      finishedAt: toLocalISOString(formValue.finishedAt!),
      doctorId: doctorData.id,
    };

    this._scheduleService
      .createDoctorWeeklyScheduleByEmployee(payload)
      .subscribe({
        next: () => {
          void this._router.navigate(['internal/doctors'], {
            state: {
              message: 'Pomyślnie utworzono grafik tygodniowy',
              status: 'success',
            },
          });
        },
        error: (err) => {
          this.errorMessage.set(err);
        },
      });
  }

  onTimeFromChange(dayKey: string, time: string) {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    if (control) {
      const currentValue = control.value;
      control.setValue({
        ...currentValue,
        hours: [time, currentValue.hours[1]],
      });
    }
  }

  onTimeToChange(dayKey: string, time: string) {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    if (control) {
      const currentValue = control.value;
      control.setValue({
        ...currentValue,
        hours: [currentValue.hours[0], time],
      });
    }
  }

  onServicesChange(dayKey: string, serviceIds: number[]) {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    if (control) {
      const currentValue = control.value;
      control.setValue({
        ...currentValue,
        serviceIds: serviceIds,
      });
    }
  }

  isDaySelected(dayKey: string): boolean {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    if (!control) return false;

    const value = control.value;
    return !!(value.hours[0] && value.hours[1] && value.serviceIds.length > 0);
  }

  getDayHourFrom(dayKey: string): string {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    return control?.value?.hours[0] || '';
  }

  getDayHourTo(dayKey: string): string {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    return control?.value?.hours[1] || '';
  }

  getDayServices(dayKey: string): number[] {
    const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
    return control?.value?.serviceIds || [];
  }

  hasAtLeastOneDay(): boolean {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri'];

    return days.some((dayKey) => {
      const control = this.scheduleForm.get(dayKey) as FormControl<DayDto>;
      if (!control) return false;

      const value = control.value;
      return !!(
        value?.hours?.[0] &&
        value?.hours?.[1] &&
        value?.serviceIds?.length > 0
      );
    });
  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update((i) => i + 1);
  }

  prevStep() {
    this.step.update((i) => i - 1);
  }

  formatHours = (hours: (string | Date | null)[]): string[] => {
    return hours.map((hour) => {
      if (!hour) return '';
      if (hour instanceof Date) {
        return toLocalISOString(hour);
      }
      return hour.slice(0, hour.length - 2);
    });
  };

  get controls() {
    return this.scheduleForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get isFormValid(): boolean {
    return this.scheduleForm.valid && this.hasAtLeastOneDay();
  }
}
