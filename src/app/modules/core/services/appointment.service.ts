import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import {
  AppointmentsSlots,
  CreateAppointmentPatient,
  PaymentStatus,
  RescheduleAppointmentPatient,
} from '../models/appointment.model';
import { toLocalISOString } from '../../shared/methods/dateTransform';
import { SpecializationWithServices } from '../models/doctor.model';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getAppointmentSlots(
    doctorId: number,
    startedAt: Date,
    finishedAt: Date,
    serviceId: number,
  ) {
    const params = new HttpParams()
      .set('startedAt', toLocalISOString(startedAt))
      .set('finishedAt', toLocalISOString(finishedAt))
      .set('serviceId', serviceId);

    return this._http
      .get<ApiResponse<string[]>>(
        `${this._apiUrl}/doctors/${doctorId}/appointment-slots`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          const data = res.data ?? [];

          const grouped: AppointmentsSlots = {};

          data.forEach((slot) => {
            const date = slot.split('T')[0];
            const time = slot.split('T')[1].substring(0, 5);

            if (!grouped[date]) {
              grouped[date] = [];
            }
            grouped[date].push(time);
          });

          return grouped;
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  registerPatientForAppointment(
    appointment: CreateAppointmentPatient,
  ): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/appointments/me`, appointment, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie umawiania wizyty. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  rescheduleAppointment(id: number, data: RescheduleAppointmentPatient) {
    return this._http
      .put<void>(`${this._apiUrl}/appointments/me/${id}`, data, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie przekładania wizyty. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  deletePatientAppointment(appointmentId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/appointments/me/${appointmentId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie odwoływania wizyty. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  returnServiceById(
    servicesArray: SpecializationWithServices[],
    serviceId: string,
  ) {
    for (const spec of servicesArray) {
      const found = spec.services.find(
        (s: Service) => String(s.id) === serviceId,
      );
      if (found) {
        return found;
      }
    }
    return null;
  }

  public mapPaymentToVisibleStatus(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.DELETED:
        return 'Anulowano';
      case PaymentStatus.COMPLETED:
        return 'Zapłacono';
      default:
        return 'Nie zapłacono';
    }
  }
}
