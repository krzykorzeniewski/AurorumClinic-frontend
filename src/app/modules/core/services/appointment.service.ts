import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import {
  AppointmentsSlots,
  CreateAppointmentPatient,
  CreateAppointmentPatientByEmployee,
  GetDailyAppointmentInfo,
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

  getAppointmentById(appointmentId: number) {
    return this._http
      .get<ApiResponse<GetDailyAppointmentInfo>>(
        `${this._apiUrl}/appointments/${appointmentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd serwera w trakcie ładowania wizyty. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  getAllAppointments(date: Date, page: number, size: number) {
    const params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('date', toLocalISOString(date).split('T')[0])
      .set('sort', 'started_at');

    return this._http
      .get<ApiResponse<PageableResponse<GetDailyAppointmentInfo>>>(
        `${this._apiUrl}/appointments`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
      .pipe(
        map((res) => {
          return {
            doctors: res.data.content,
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd serwera w trakcie ładowania wizyt. Spróbuj ponownie później.',
              ),
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

  registerPatientForAppointmentByEmployee(
    appointment: CreateAppointmentPatientByEmployee,
  ): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/appointments`, appointment, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie umawiania wizyty pacjenta. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  reschedulePatientAppointmentByEmployee(
    id: number,
    data: RescheduleAppointmentPatient,
  ) {
    return this._http
      .put<void>(`${this._apiUrl}/appointments/${id}`, data, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie przekładania wizyty pacjentowi. Spróbuj ponownie później.',
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

  exportAppointmentPatient() {
    return this._http
      .get<Blob>(`${this._apiUrl}/appointments/me/export`, {
        withCredentials: true,
        responseType: 'blob' as 'json',
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie exportowania wizyt. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  deletePatientAppointmentByEmployee(appointmentId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/appointments/${appointmentId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie odwoływania wizyty pacjenta. Spróbuj ponownie później.',
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

  deleteAppointmentsBulk(appointmentIds: number[]) {
    return this._http.delete<void>(`${this._apiUrl}/appointments/bulk`, {
      body: { appointmentIds },
      withCredentials: true,
    });
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
