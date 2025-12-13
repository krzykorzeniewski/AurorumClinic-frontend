import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { catchError, map, throwError } from 'rxjs';
import { toLocalISOString } from '../../shared/methods/dateTransform';
import { EmployeeGetSchedules } from '../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl + '/schedules';

  getDoctorsSchedules(
    startedAt: Date,
    finishedAt: Date,
    page: number,
    size: number,
  ) {
    const params = new HttpParams()
      .set('startedAt', toLocalISOString(startedAt))
      .set('finishedAt', toLocalISOString(finishedAt))
      .set('page', page)
      .set('size', size)
      .set('sort', 'startedAt');

    return this._http
      .get<ApiResponse<PageableResponse<EmployeeGetSchedules>>>(
        `${this._apiUrl}`,
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
          return res.data;
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  getDoctorScheduleById(scheduleId: number) {
    return this._http
      .get<ApiResponse<EmployeeGetSchedules>>(`${this._apiUrl}/${scheduleId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }
}
