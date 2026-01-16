import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { catchError, map, throwError } from 'rxjs';
import { toLocalISOString } from '../../shared/methods/dateTransform';
import {
  CreateDailyDoctorScheduleByDoctor,
  CreateDailyDoctorScheduleByEmployee,
  CreateWeeklyDoctorScheduleByDoctor,
  CreateWeeklyDoctorScheduleByEmployee,
  DoctorGetSchedules,
  EmployeeGetSchedules,
  UpdateDoctorSchedule,
} from '../models/schedule.model';
import { AuthService } from './auth.service';
import { UserRoleMap } from '../models/auth.model';
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
      role === UserRoleMap.EMPLOYEE || role === UserRoleMap.ADMIN
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
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
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
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  createDoctorDailyScheduleByEmployee(
    data: CreateDailyDoctorScheduleByEmployee,
  ) {
    return this._http
      .post<ApiResponse<void>>(`${this._apiUrl}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  createDoctorWeeklyScheduleByEmployee(
    data: CreateWeeklyDoctorScheduleByEmployee,
  ) {
    return this._http
      .post<ApiResponse<void>>(`${this._apiUrl}/weekly`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  rescheduleDoctorScheduleByEmployee(
    scheduleId: number,
    data: UpdateDoctorSchedule,
  ) {
    return this._http.put<ApiResponse<void>>(
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

  getSchedules(startedAt: Date, finishedAt: Date, page: number, size: number) {
    const params = new HttpParams()
      .set('startedAt', toLocalISOString(startedAt))
      .set('finishedAt', toLocalISOString(finishedAt))
      .set('page', page)
      .set('size', size)
      .set('sort', 'startedAt');

    return this._http
      .get<ApiResponse<DoctorGetSchedules[]>>(`${this._apiUrl}/me`, {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  getScheduleById(scheduleId: number) {
    return this._http
      .get<ApiResponse<DoctorGetSchedules>>(
        `${this._apiUrl}/me/${scheduleId}`,
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
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  createDailySchedule(data: CreateDailyDoctorScheduleByDoctor) {
    return this._http
      .post<ApiResponse<void>>(`${this._apiUrl}/me`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  createWeeklySchedule(data: CreateWeeklyDoctorScheduleByDoctor) {
    return this._http
      .post<ApiResponse<void>>(`${this._apiUrl}/weekly/me`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  rescheduleSchedule(scheduleId: number, data: UpdateDoctorSchedule) {
    return this._http.put<ApiResponse<void>>(
      `${this._apiUrl}/me/${scheduleId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
  }

  deleteSchedule(scheduleId: number) {
    return this._http.delete<void>(`${this._apiUrl}/me/${scheduleId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }

  private mapError(err: HttpErrorResponse) {
    let errorMsg: string;

    if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
      errorMsg = 'Wystąpił błąd. Proszę spróbować później';
    } else if (err.error?.status === 'fail' && err.error?.data) {
      const errorData = err.error.data;

      if (
        errorData.schedule === 'Schedule overlaps with already existing one'
      ) {
        errorMsg = 'Ten grafik koliduje w planie z innym grafikiem.';
      } else {
        errorMsg = 'Wystąpił błąd serwera. Spróbuj ponownie później.';
      }
    } else {
      errorMsg = 'Wystąpił błąd serwera. Spróbuj ponownie później.';
    }
    return errorMsg;
  }
}
