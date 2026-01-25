import { Component, inject, signal } from '@angular/core';
import { DatePipe, Location, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { ScheduleService } from '../../../../core/services/schedule.service';
import {
  DoctorGetSchedules,
  UpdateDoctorSchedule,
} from '../../../../core/models/schedule.model';
import { Router } from '@angular/router';
import { FormsService } from '../../../../core/services/forms.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../../../core/services/doctor.service';
import { SpecializationWithServices } from '../../../../core/models/doctor.model';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { environment } from '../../../../../../environments/environment';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { toLocalISOString } from '../../../../shared/methods/dateTransform';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleAppointmentsListComponent } from './schedule-appointments-list/schedule-appointments-list.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { filter, forkJoin, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-schedule-details',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatSelect,
    MatOptgroup,
    MatOption,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker,
    MatError,
    DatePipe,
    NgForOf,
    AlertComponent,
  ],
  templateUrl: './schedule-details.component.html',
})
export class ScheduleDetailsComponent {
  private _scheduleService = inject(ScheduleService);
  private _authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _dialog = inject(MatDialog);
  private _location = inject(Location);
  private _router = inject(Router);
  environmentVariables = environment;
  scheduleForm = this._formService.getScheduleEditForm();
  schedule = signal<DoctorGetSchedules | null>(null);
  editMode = signal(false);
  specializations: SpecializationWithServices[] = [];

  errorMessage = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      scheduleId: number;
    };

    if (!state?.scheduleId) {
      void this._router.navigate(['/internal/schedules']);
      return;
    }

    this._authService.user$
      .pipe(
        take(1),
        filter((user) => !!user),
        switchMap((user) =>
          forkJoin({
            schedule: this._scheduleService.getScheduleById(state.scheduleId),
            doctor: this._doctorService.getDoctorById(user.id),
            specializations:
              this._doctorService.getSpecializationsWithServices(),
          }),
        ),
      )
      .subscribe({
        next: ({ schedule, doctor, specializations }) => {
          this.scheduleForm.patchValue({
            services: schedule.services.map((s) => s.id),
            date: new Date(schedule.startedAt.split('T')[0]),
            startedAt: new Date(schedule.startedAt),
            finishedAt: new Date(schedule.finishedAt),
          });
          this.schedule.set(schedule);
          this.scheduleForm.disable();

          const doctorSpecIds = doctor.specializations.map((s) => s.id);
          this.specializations = specializations.filter((spec) =>
            doctorSpecIds.includes(spec.id),
          );
        },
        error: () => {
          void this._router.navigate(['/internal/my-schedules']);
        },
      });
  }

  goBack() {
    this._location.back();
  }

  cancelEdit() {
    const s = this.schedule();
    if (!s) return;

    this.scheduleForm.patchValue({
      startedAt: new Date(s.startedAt),
      finishedAt: new Date(s.finishedAt),
      services: s.services.map((s) => s.id),
    });

    this.scheduleForm.disable();
    this.editMode.set(false);
  }

  editSchedule() {
    this.editMode.set(true);
    this.scheduleForm.enable();
    this.scheduleForm.controls.date.disable();
  }

  changeSchedule() {
    const schedule = this.schedule();
    if (!schedule) return;
    const value = this.scheduleForm.value;
    if (!value) return;
    const data: UpdateDoctorSchedule = {
      startedAt: toLocalISOString(value.startedAt!),
      finishedAt: toLocalISOString(value.finishedAt!),
      serviceIds: value.services!,
    };

    this._scheduleService.rescheduleSchedule(schedule.id, data).subscribe({
      next: () => {
        this._snackBar.open('Pomyślnie zmieniono grafik', 'Zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-info',
        });
        this.refreshSchedule(schedule.id);
      },
      error: (err) => {
        this.appointmentListOpenDialogBasedOnError(err, false, data);
      },
    });
  }

  removeSchedule() {
    const schedule = this.schedule();
    if (!schedule) return;

    this._scheduleService.deleteSchedule(schedule.id).subscribe({
      next: () => {
        void this._router.navigate(['/internal/my-schedules'], {
          state: {
            message: 'Pomyślnie usunięto grafik',
            status: 'success',
          },
        });
      },
      error: (err) => {
        this.appointmentListOpenDialogBasedOnError(err, true, null);
      },
    });
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.scheduleForm.controls;
  }

  private appointmentListOpenDialogBasedOnError(
    err: HttpErrorResponse,
    isDeleting: boolean,
    data: UpdateDoctorSchedule | null,
  ) {
    const schedule = this.schedule();
    if (!schedule) return;

    let appointmentsIds: number[] = [];

    if (err.error?.status === 'fail' && err.error?.data.appointments) {
      try {
        appointmentsIds = Array.isArray(err.error.data.appointments)
          ? err.error.data.appointments
          : JSON.parse(err.error.data.appointments);

        const dialogRef = this._dialog.open(ScheduleAppointmentsListComponent, {
          data: {
            scheduleId: schedule.id,
            appointmentsIds: appointmentsIds,
            isDeleting: isDeleting,
            data: data,
          },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.success) {
            if (result.isDeleting) {
              void this._router.navigate(['/internal/my-schedules'], {
                state: {
                  message: 'Pomyślnie usunięto grafik',
                  status: 'success',
                },
              });
            } else {
              this._snackBar.open('Pomyślnie zmieniono grafik', 'Zamknij', {
                duration: 5000,
                panelClass: 'xxx-alert-info',
              });
              this.refreshSchedule(schedule.id);
            }
          } else if (!result?.cancel) {
            if (isDeleting) {
              this.errorMessage.set(
                'Wystąpił błąd podczas usuwania grafiku. Spróbuj ponownie później',
              );
            } else {
              this.errorMessage.set(
                'Wystąpił błąd podczas przekładania grafiku. Spróbuj ponownie później',
              );
            }
          }
        });
      } catch {
        this.errorMessage.set(
          'Wystąpił błąd serwera. Spróbuj ponownie później.',
        );
      }
    } else {
      this.errorMessage.set(err.message);
    }
  }

  private refreshSchedule(scheduleId: number) {
    this._scheduleService.getScheduleById(scheduleId).subscribe({
      next: (res) => {
        this.editMode.set(false);
        this.scheduleForm.patchValue({
          services: res.services.map((s) => s.id),
          date: new Date(res.startedAt.split('T')[0]),
          startedAt: new Date(res.startedAt),
          finishedAt: new Date(res.finishedAt),
        });
        this.schedule.set(res);
        this.scheduleForm.disable();
      },
      error: (err) => {
        this.errorMessage.set(err.message);
      },
    });
  }
}
