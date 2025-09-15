import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  GetPatientApiResponse,
  GetPatientResponse,
  UpdatePatientRequest,
} from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getPatient(userId: number): Observable<GetPatientResponse> {
    return this._http
      .get<ApiResponse<GetPatientApiResponse>>(
        `${this._apiUrl}/patients/${userId}`,
        {
          withCredentials: true,
        },
      )
      .pipe(
        map(
          (apiResponse): GetPatientResponse => ({
            ...apiResponse.data,
            birthDate: new Date(
              apiResponse.data.birthDate,
            ).toLocaleDateString(),
          }),
        ),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie uzyskiwania danych. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  updatePatient(
    userId: number,
    userData: UpdatePatientRequest,
  ): Observable<GetPatientResponse> {
    return this._http
      .patch<ApiResponse<GetPatientApiResponse>>(
        `${this._apiUrl}/patients/${userId}`,
        userData,
        {
          withCredentials: true,
        },
      )
      .pipe(
        map(
          (apiResponse): GetPatientResponse => ({
            ...apiResponse.data,
            birthDate: new Date(
              apiResponse.data.birthDate,
            ).toLocaleDateString(),
          }),
        ),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie aktualizowania danych. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  deletePatient(userId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/patients/${userId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie usuwania konta. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }
}
