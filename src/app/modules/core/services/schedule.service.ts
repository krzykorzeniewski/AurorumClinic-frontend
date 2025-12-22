import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { catchError, map, throwError } from 'rxjs';
import { toLocalISOString } from '../../shared/methods/dateTransform';
import {
  EmployeeGetSchedules,
  UpdateDoctorSchedule,
} from '../models/schedule.model';
import { AuthService } from './auth.service';
import { UserRole } from '../models/auth.model';
import { GetScheduleAppointmentInfo } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private _authService = inject(AuthService);
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl + '/schedules';

  getScheduleAppointmentsBasedOnRole(scheduleId: number) {
    const role = this._authService.userRole;

    const url =
      role === UserRole.EMPLOYEE
        ? `/${scheduleId}/appointments`
        : `/me/${scheduleId}/appointments`;

    return this._http
      .get<ApiResponse<GetScheduleAppointmentInfo[]>>(this._apiUrl + url, {
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

  rescheduleDoctorScheduleByEmployee(
    scheduleId: number,
    data: UpdateDoctorSchedule,
  ) {
    return this._http.put<ApiResponse<EmployeeGetSchedules>>(
      `${this._apiUrl}/${scheduleId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
  }

  deleteDoctorScheduleByEmployee(scheduleId: number) {
    return this._http.delete<void>(`${this._apiUrl}/${scheduleId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }
}
