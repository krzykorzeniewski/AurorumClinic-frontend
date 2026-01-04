import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import {
  Absence,
  DoctorCreateAbsence,
  DoctorCreateAbsenceByEmployee,
  GetDoctorAbsences,
} from '../models/absences.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private _apiUrl = environment.apiUrl + '/absences';
  private _http = inject(HttpClient);

  getAllAbsences(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'id,desc');
    return this._http
      .get<ApiResponse<PageableResponse<GetDoctorAbsences>>>(
        this._apiUrl + '/me',
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
            absence: res.data.content.map(
              (absence) =>
                new Absence(
                  absence.id,
                  absence.name,
                  absence.startedAt,
                  absence.finishedAt,
                ),
            ),
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  createAbsenceByEmployee(
    absence: DoctorCreateAbsenceByEmployee,
  ): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}`, absence, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie tworzenia nieobecności. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  createAbsence(absence: DoctorCreateAbsence): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/me`, absence, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie tworzenia nieobecności. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  deleteAbsenceByEmployee(absenceId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/${absenceId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie usuwania nieobecności. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  deleteAbsence(absenceId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/me/${absenceId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie usuwania nieobecności. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }
}
