import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  GetPatientApiResponse,
  GetPatientResponse,
  PatchUserRequest,
  UpdateContactRequest,
  UpdateEmailTokenRequest,
  UpdatePhoneTokenRequest,
} from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getUser(): Observable<GetPatientResponse> {
    return this._http
      .get<ApiResponse<GetPatientApiResponse>>(`${this._apiUrl}/patients/me`, {
        withCredentials: true,
      })
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

  patchUser(userData: PatchUserRequest): Observable<GetPatientResponse> {
    return this._http
      .patch<ApiResponse<GetPatientApiResponse>>(
        `${this._apiUrl}/patients/me`,
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

  updateUserEmailToken(userEmail: UpdateEmailTokenRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/users/me/email-update-token`, userEmail, {
        withCredentials: true,
      })
      .pipe(
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

  updateUserEmail(userToken: UpdateContactRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/email`, userToken, {
        withCredentials: true,
      })
      .pipe(
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

  updateUserPhoneToken(userPhone: UpdatePhoneTokenRequest): Observable<void> {
    return this._http
      .post<void>(
        `${this._apiUrl}/users/me/phone-number-update-token`,
        userPhone,
        {
          withCredentials: true,
        },
      )
      .pipe(
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

  updateUserPhone(userToken: UpdateContactRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/phone-number`, userToken, {
        withCredentials: true,
      })
      .pipe(
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

  deleteUser(): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/patients/me`, {
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
