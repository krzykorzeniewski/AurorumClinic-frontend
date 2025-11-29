import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  model,
} from '@angular/core';
import { DoctorAppointmentCard } from '../../../core/models/doctor.model';
import { AppointmentsSlots } from '../../../core/models/appointment.model';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-appointment-card',
  standalone: true,
  imports: [NgIf, NgForOf, MatIconButton, MatIcon],
  templateUrl: './doctor-appointment-card.component.html',
  styleUrl: './doctor-appointment-card.component.css',
})
export class DoctorAppointmentCardComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _router = inject(Router);
  doctor = input.required<DoctorAppointmentCard>();
  slots = signal<AppointmentsSlots>({});
  currentWeekStart!: Date;
  currentWeekEnd!: Date;
  weekDays: { full: string; short: string; day: string; date: Date }[] = [];
  isLoading = signal<boolean>(false);
  @Output() timeSelectedReschedule = new EventEmitter<string>();
  selectedDateTime = model<string | null>(null);
  mode = input<'register' | 'reschedule'>('register');

  ngOnInit(): void {
    const startDate = this.getInitialDate();
    this.currentWeekStart = this.getMonday(startDate);
    this.currentWeekEnd = this.getFriday(startDate);
    this.weekDays = this.fillWithWeekDays();
    this.loadSlots();
  }

  patientAppointmentRegisterOrReschedule(date: string, time: string) {
    const doctorAppointmentRegister = this.doctor();

    const dateTime = date + 'T' + time;

    if (this.mode() === 'register') {
      void this._router.navigate(['/appointment/register'], {
        queryParams: {
          doctorId: doctorAppointmentRegister.id,
          serviceId: doctorAppointmentRegister.serviceId,
          date: dateTime,
        },
        state: { doctorAppointmentRegister },
      });
    } else {
      this.selectedDateTime.set(dateTime);
    }
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
        day: current.getDate() + '.' + (current.getMonth() + 1),
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

  getTimeFromDay(date: string): string[] | undefined {
    return this.slots()?.[date];
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

    this._appointmentService
      .getAppointmentSlots(
        this.doctor().id,
        this.currentWeekStart,
        this.currentWeekEnd,
        this.doctor().serviceId,
      )
      .subscribe({
        next: (slotsData) => {
          const now = new Date();
          const filteredData: AppointmentsSlots = {};

          Object.keys(slotsData).forEach((dateKey) => {
            const times = slotsData[dateKey];

            const validTimes = times.filter((time) => {
              const [h, m] = time.split(':').map(Number);

              const slotDate = new Date(dateKey);
              slotDate.setHours(h, m, 0, 0);

              return slotDate > now;
            });

            if (validTimes.length > 0) {
              filteredData[dateKey] = validTimes;
            }
          });

          this.slots.set(filteredData);
          this.isLoading.set(false);
        },
        error: () => {
          this.slots.set({});
          this.isLoading.set(false);
        },
      });
  }
}
