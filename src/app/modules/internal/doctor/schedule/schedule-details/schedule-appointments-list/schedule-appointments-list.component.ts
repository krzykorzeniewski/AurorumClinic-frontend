import { Component, inject, OnInit } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import {
  GetDailyAppointmentInfo,
  GetScheduleAppointmentInfo,
} from '../../../../../core/models/appointment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from '../../../../../core/services/schedule.service';
import { PatientCardComponent } from '../../../../../shared/components/patient-card/patient-card.component';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { UpdateDoctorSchedule } from '../../../../../core/models/schedule.model';
import { concatMap, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-schedule-appointments-list',
  standalone: true,
  imports: [
    MatSelectionList,
    MatListOption,
    PatientCardComponent,
    MatButton,
    NgIf,
  ],
  templateUrl: './schedule-appointments-list.component.html',
  styleUrl: './schedule-appointments-list.component.css',
})
export class ScheduleAppointmentsListComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _scheduleService = inject(ScheduleService);
  private _dialogRef = inject(MatDialogRef<ScheduleAppointmentsListComponent>);
  readonly data = inject<{
    scheduleId: number;
    appointmentsIds: number[];
    isDeleting: boolean;
    data: UpdateDoctorSchedule | null;
  }>(MAT_DIALOG_DATA);
  appointmentsList: (GetScheduleAppointmentInfo | GetDailyAppointmentInfo)[] =
    [];

  ngOnInit(): void {
    if (this.data.isDeleting) {
      this._scheduleService
        .getScheduleAppointmentsBasedOnRole(this.data.scheduleId)
        .subscribe({
          next: (appointments) => {
            this.appointmentsList = appointments;
          },
          error: () => {
            this._dialogRef.close({ success: false });
          },
        });
    } else {
      if (
        !this.data.appointmentsIds ||
        this.data.appointmentsIds.length === 0
      ) {
        this._dialogRef.close({ success: false });
      }

      const requests = this.data.appointmentsIds.map((id) =>
        this._appointmentService.getAppointmentById(id),
      );

      forkJoin(requests).subscribe({
        next: (appointments) => {
          this.appointmentsList = appointments;
        },
        error: () => {
          this._dialogRef.close({ success: false });
        },
      });
    }
  }

  changeSchedule() {
    this._appointmentService
      .deleteAppointmentsBulk(this.data.appointmentsIds)
      .pipe(
        concatMap(() => {
          if (this.data.data) {
            return this._scheduleService.rescheduleSchedule(
              this.data.scheduleId,
              this.data.data,
            );
          }
          return of(null);
        }),
      )
      .subscribe({
        next: () => this._dialogRef.close({ success: true, isDeleting: false }),
        error: () => this._dialogRef.close({ success: false }),
      });
  }

  removeSchedule() {
    this._appointmentService
      .deleteAppointmentsBulk(this.data.appointmentsIds)
      .pipe(
        concatMap(() =>
          this._scheduleService.deleteSchedule(this.data.scheduleId),
        ),
      )
      .subscribe({
        next: () => this._dialogRef.close({ success: true, isDeleting: true }),
        error: () => this._dialogRef.close({ success: false }),
      });
  }

  onCancel() {
    this._dialogRef.close({ success: false, cancel: true });
  }
}
