import { Component, inject, signal } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { EmployeeGetSchedules } from '../../../../core/models/schedule.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-details',
  standalone: true,
  imports: [
    DatePipe,
    DoctorCardComponent,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    NgForOf,
  ],
  templateUrl: './schedule-details.component.html',
  styleUrl: './schedule-details.component.css',
})
export class ScheduleDetailsComponent {
  private _scheduleService = inject(ScheduleService);
  private _router = inject(Router);
  schedule = signal<EmployeeGetSchedules | null>(null);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      scheduleId: number;
    };

    if (state?.scheduleId) {
      this._scheduleService.getDoctorScheduleById(state.scheduleId).subscribe({
        next: (res) => {
          this.schedule.set(res);
        },
        error: () => {
          void this._router.navigate(['/internal/schedules']);
        },
      });
    } else {
      void this._router.navigate(['/internal/schedules']);
    }
  }

  goBack() {}

  changeSchedule() {}

  removeSchedule() {}
}
