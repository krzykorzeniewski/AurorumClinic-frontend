import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AppointmentsSlots } from '../models/appointment.model';
import { toLocalISOString } from '../../shared/methods/dateTransform';

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
}
