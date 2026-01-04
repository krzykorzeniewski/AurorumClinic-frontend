import { Component, inject, OnInit, signal } from '@angular/core';
import { ScheduleService } from '../../../core/services/schedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  DoctorsScheduleByDay,
  EmployeeGetSchedules,
} from '../../../core/models/schedule.model';
import { expand, map, of, reduce, takeWhile } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-doctor-schedules',
  standalone: true,
  imports: [MatIcon, MatIconButton, NgForOf, NgIf],
  templateUrl: './doctor-schedules.component.html',
})
export class DoctorSchedulesComponent implements OnInit {
  private _scheduleService = inject(ScheduleService);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  schedules = signal<DoctorsScheduleByDay | null>(null);
  currentWeekStart!: Date;
  currentWeekEnd!: Date;
  weekDays: { full: string; short: string; day: string; date: Date }[] = [];
  isLoading = signal<boolean>(false);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this._snackBar.open(navigation.extras.state['message'], 'zamknij', {
        duration: 5000,
        panelClass:
          navigation.extras.state['status'] === 'success'
            ? 'xxx-alert-info'
            : 'xxx-alert-error',
      });
    }
  }

  ngOnInit(): void {
    const startDate = this.getInitialDate();
    this.currentWeekStart = this.getMonday(startDate);
    this.currentWeekEnd = this.getFriday(startDate);
    this.weekDays = this.fillWithWeekDays();
    this.loadSlots();
  }

  goToDetails(scheduleId: number) {
    void this._router.navigate([`/internal/schedules/details`], {
      state: { scheduleId: scheduleId },
    });
  }

  fillWithWeekDays() {
    const days: { full: string; short: string; day: string; date: Date }[] = [];
    const start = this.currentWeekStart;
    const end = this.currentWeekEnd;

    if (!start || !end) return days;

    const current = new Date(start);

    while (current <= end) {
      days.push({
        full: current.toISOString().split('T')[0],
        short: current
          .toLocaleDateString('pl-PL', { weekday: 'short' })
          .toUpperCase(),
        day:
          current.getDate() +
          '.' +
          (current.getMonth() + 1 < 10
            ? '0' + (current.getMonth() + 1)
            : current.getMonth() + 1),
        date: new Date(current),
      });
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  goToNextWeek(): void {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    newStart.setHours(8, 0, 0, 0);

    const newEnd = new Date(this.currentWeekEnd);
    newEnd.setDate(newEnd.getDate() + 7);
    newEnd.setHours(21, 0, 0, 0);

    this.currentWeekStart = newStart;
    this.currentWeekEnd = newEnd;

    this.weekDays = this.fillWithWeekDays();
    this.loadSlots();
  }

  goToPreviousWeek(): void {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    newStart.setHours(8, 0, 0, 0);

    const newEnd = new Date(this.currentWeekEnd);
    newEnd.setDate(newEnd.getDate() - 7);
    newEnd.setHours(21, 0, 0, 0);

    this.currentWeekStart = newStart;
    this.currentWeekEnd = newEnd;

    this.weekDays = this.fillWithWeekDays();
    this.loadSlots();
  }

  canGoToPreviousWeek(): boolean {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    let earliestAllowedWeekStart: Date;

    if ((day === 5 && hour >= 21) || day === 6 || day === 0) {
      earliestAllowedWeekStart = new Date(now);
      const daysToAdd = day === 5 ? 3 : day === 6 ? 2 : 1;
      earliestAllowedWeekStart.setDate(now.getDate() + daysToAdd);
      earliestAllowedWeekStart.setHours(0, 0, 0, 0);
    } else {
      earliestAllowedWeekStart = new Date(now);
      const currentDay = now.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      earliestAllowedWeekStart.setDate(now.getDate() - daysFromMonday);
      earliestAllowedWeekStart.setHours(0, 0, 0, 0);
    }

    const previousWeekStart = new Date(this.currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    previousWeekStart.setHours(0, 0, 0, 0);

    return previousWeekStart >= earliestAllowedWeekStart;
  }

  getTimeFromDay(date: string) {
    return this.schedules()?.[date];
  }

  isPastDay(dateFromAppointment: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateFromAppointment);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  private getInitialDate(): Date {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    if ((day === 5 && hour >= 21) || day === 6 || day === 0) {
      const nextWeek = new Date(now);
      const daysToAdd = day === 5 ? 3 : day === 6 ? 2 : 1;
      nextWeek.setDate(now.getDate() + daysToAdd);
      return nextWeek;
    }

    return now;
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(8, 0, 0, 0);
    return monday;
  }

  private getFriday(date: Date): Date {
    const monday = this.getMonday(date);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(21, 0, 0, 0);
    return friday;
  }

  private loadSlots(): void {
    this.isLoading.set(true);

    this._scheduleService
      .getDoctorsSchedules(this.currentWeekStart, this.currentWeekEnd, 0, 50)
      .pipe(
        expand((res) =>
          res.page.number + 1 < res.page.totalPages
            ? this._scheduleService.getDoctorsSchedules(
                this.currentWeekStart,
                this.currentWeekEnd,
                res.page.number + 1,
                50,
              )
            : of(null),
        ),
        takeWhile((res) => res != null),
        map((res) => res!.content),
        reduce((all, page) => all.concat(page), [] as EmployeeGetSchedules[]),
      )
      .subscribe({
        next: (allSchedules) => {
          const mapped: DoctorsScheduleByDay = {};

          for (const sch of allSchedules) {
            const [date, timeRaw] = sch.startedAt.split('T');
            const startedAt = timeRaw.slice(0, 5);
            const finishedAt = sch.finishedAt.split('T')[1].slice(0, 5);

            if (!mapped[date]) mapped[date] = [];

            mapped[date].push({
              id: sch.id,
              startedAt,
              finishedAt,
              doctor: sch.doctor,
              services: sch.services ?? [sch.services],
            });
          }

          this.schedules.set(mapped);
          this.isLoading.set(false);
        },
        error: () => {
          this.schedules.set(null);
          this.isLoading.set(false);
        },
      });
  }
}
