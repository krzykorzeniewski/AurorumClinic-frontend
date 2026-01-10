import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  GetUserApiResponse,
  PatchUserRequest,
  UpdateEmailTokenRequest,
  UpdatePhoneTokenRequest,
  UpdateTokenRequest,
} from '../models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ApiResponse,
  PageableResponse,
  Payment,
} from '../models/api-response.model';
import { AuthService } from './auth.service';
import {
  Appointment,
  AppointmentStatus,
  GetAppointmentInfo,
} from '../models/appointment.model';
import {
  Doctor,
  UpdateDoctorProfileData,
  UpdateDoctorProfileDataResponse,
} from '../models/doctor.model';
import { Service } from '../models/service.model';
import {
  GetPatientApiResponse,
  GetPatientResponse,
} from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _apiUrl = environment.apiUrl;

  getAllUsers(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc' | '',
    role: string | null,
    query?: string,
  ) {
    let params = new HttpParams().set('page', page).set('size', size);

    if (sort) {
      if (direction) {
        params = params.set('sort', `${sort},${direction}`);
      } else {
        params = params.set('sort', sort);
      }
    }

    if (query) {
      params = params.set('query', query);
    }
    if (role) {
      params = params.set('role', role);
    }

    return this._http
      .get<ApiResponse<PageableResponse<GetUserApiResponse>>>(
        `${this._apiUrl}/users`,
        {
          params: params,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          return {
            users: res.data.content,
            page: res.data.page,
          };
        }),
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

  getUser(): Observable<GetPatientResponse> {
    return this._http
      .get<ApiResponse<GetPatientApiResponse>>(
        `${this._apiUrl}/${this._authService.userRole}/me`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
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

  getPatientAppointments(page: number, size: number) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this._http
      .get<ApiResponse<PageableResponse<GetAppointmentInfo>>>(
        `${this._apiUrl}/appointments/me`,
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
            appointments: res.data.content.map(
              (value) =>
                new Appointment(
                  value.id,
                  value.startedAt,
                  value.status as AppointmentStatus,
                  value.description,
                  new Doctor(
                    value.doctor.id,
                    value.doctor.name,
                    value.doctor.surname,
                    value.doctor.specializations,
                    value.doctor.profilePicture,
                  ),
                  new Service(
                    value.service.id,
                    value.service.name,
                    value.service.price,
                  ),
                  new Payment(
                    value.payment.id,
                    value.payment.amount,
                    value.payment.status,
                  ),
                  value.hasOpinion,
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

  updateDoctorProfile(image: File | null, doctorData: UpdateDoctorProfileData) {
    const formData = new FormData();

    if (image) {
      formData.append('doctorImage', image);
    }

    formData.append(
      'command',
      new Blob([JSON.stringify(doctorData)], { type: 'application/json' }),
    );

    return this._http
      .put<ApiResponse<UpdateDoctorProfileDataResponse>>(
        `${this._apiUrl}/users/doctors/me/profile`,
        formData,
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie aktualizowania profilu. Spróbuj ponownie później.',
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

  updateUserEmail(userToken: UpdateTokenRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/email`, userToken, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          let errorMsg = '';

          if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
            errorMsg =
              'Wystąpił błąd w trakcie aktualizowania adresu email. Spróbuj ponownie później.';
          } else if (err.error?.status === 'fail' && err.error?.data) {
            const errorData = err.error.data;

            if (errorData.token === 'Invalid token') {
              errorMsg = 'Podano błędny kod. Proszę spróbować ponownie.';
            } else if (errorData.token === 'Token is expired') {
              errorMsg = 'Podany kod wygasł. Spróbuj ponownie.';
            } else {
              errorMsg =
                'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
            }
          } else {
            errorMsg =
              'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
          }
          return throwError(() => new Error(errorMsg));
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

  updateUserPhone(userToken: UpdateTokenRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/phone-number`, userToken, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          let errorMsg = '';

          if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
            errorMsg =
              'Wystąpił błąd w trakcie aktualizowania numeru telefonu. Spróbuj ponownie później.';
          } else if (err.error?.status === 'fail' && err.error?.data) {
            const errorData = err.error.data;

            if (errorData.token === 'Invalid token') {
              errorMsg = 'Podano błędny kod. Proszę spróbować ponownie.';
            } else if (errorData.token === 'Token is expired') {
              errorMsg = 'Podany kod wygasł. Spróbuj ponownie.';
            } else {
              errorMsg =
                'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
            }
          } else {
            errorMsg =
              'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
          }
          return throwError(() => new Error(errorMsg));
        }),
      );
  }

  setupTwoFactorAuthorizationToken(): Observable<void> {
    return this._http
      .post<void>(
        `${this._apiUrl}/users/me/2fa-token`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((err) => {
          let errorMsg = '';

          if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
            errorMsg =
              'Wystąpił błąd w trakcie aktualizowania numeru telefonu. Spróbuj ponownie później.';
          } else if (err.error?.status === 'fail' && err.error?.data) {
            const errorData = err.error.data;

            if (errorData.token === 'Invalid token') {
              errorMsg = 'Podano błędny kod. Proszę spróbować ponownie.';
            } else if (errorData.phoneNumber === 'Invalid credentials') {
              errorMsg = 'Niepoprawny email lub hasło';
            } else if (
              errorData.phoneNumber === 'Phone number is not verified'
            ) {
              errorMsg =
                'Proszę zweryfikować telefon przed założeniem weryfikacji dwuetapowej';
            } else {
              errorMsg =
                'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
            }
          } else {
            errorMsg =
              'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
          }
          return throwError(() => new Error(errorMsg));
        }),
      );
  }

  setupTwoFactorAuthorization(userToken: UpdateTokenRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/2fa`, userToken, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie zakładania weryfikacji dwuetapowej. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  disableTwoFactorAuthorizationToken(): Observable<void> {
    return this._http
      .post<void>(
        `${this._apiUrl}/users/me/2fa/disable`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((err) => {
          let errorMsg = '';

          if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
            errorMsg =
              'Wystąpił błąd w trakcie aktualizowania numeru telefonu. Spróbuj ponownie później.';
          } else if (err.error?.status === 'fail' && err.error?.data) {
            const errorData = err.error.data;

            if (errorData.token === 'Invalid token') {
              errorMsg = 'Podano błędny kod. Proszę spróbować ponownie.';
            } else if (errorData.phoneNumber === 'Invalid credentials') {
              errorMsg = 'Niepoprawny email lub hasło';
            } else if (
              errorData.phoneNumber === 'Phone number is not verified'
            ) {
              errorMsg =
                'Proszę zweryfikować telefon przed założeniem weryfikacji dwuetapowej';
            } else if (errorData.userId === 'User has mfa disabled') {
              errorMsg =
                'Ten numer telefonu ma już wyłączoną weryfikację dwuetapową.';
            } else {
              errorMsg =
                'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
            }
          } else {
            errorMsg =
              'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
          }
          return throwError(() => new Error(errorMsg));
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
