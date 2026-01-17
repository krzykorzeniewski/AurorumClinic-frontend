import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  GetUserApiResponse,
  GetUserProfileResponse,
  PatchUserRequest,
  UpdateEmailTokenRequest,
  UpdatePhoneTokenRequest,
  UpdateTokenRequest,
  UpdateUser,
} from '../models/user.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
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
import { UserPasswordChangeRequest, UserRoleMap } from '../models/auth.model';

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
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  getUser(): Observable<GetPatientResponse | GetUserProfileResponse> {
    const role = this._authService.userRole;

    if (role === UserRoleMap.PATIENT) {
      return this._http
        .get<ApiResponse<GetPatientApiResponse>>(`${this._apiUrl}/${role}/me`, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        })
        .pipe(
          map(
            (apiResponse): GetPatientResponse => ({
              ...apiResponse.data,
              birthDate: new Date(apiResponse.data.birthDate),
            }),
          ),
          catchError(() =>
            throwError(
              () =>
                new Error(
                  'Wystąpił błąd w trakcie uzyskiwania danych pacjenta.',
                ),
            ),
          ),
        );
    }

    return this._http
      .get<ApiResponse<GetUserProfileResponse>>(`${this._apiUrl}/users/me`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map(
          (apiResponse): GetUserProfileResponse => ({
            ...apiResponse.data,
            birthDate: new Date(apiResponse.data.birthDate),
          }),
        ),
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  getUserByIdByUser(userId: number) {
    return this._http
      .get<ApiResponse<GetUserApiResponse>>(`${this._apiUrl}/users/${userId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  getPatientAppointments(
    page: number,
    size: number,
    status: AppointmentStatus,
  ) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'startedAt,asc')
      .set('status', status);
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
                  value.hasChat,
                ),
            ),
            page: res.data.page,
          };
        }),
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
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
            birthDate: new Date(apiResponse.data.birthDate),
          }),
        ),
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  updateUser(userId: number, userData: UpdateUser) {
    return this._http
      .put<ApiResponse<void>>(`${this._apiUrl}/users/${userId}`, userData, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
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
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  updateUserEmailToken(userEmail: UpdateEmailTokenRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/users/me/email-update-token`, userEmail, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
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
          return throwError(() => new Error(this.getErrorMessage(err)));
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
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
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
          return throwError(() => new Error(this.getErrorMessage(err)));
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
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  setupTwoFactorAuthorization(userToken: UpdateTokenRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/2fa`, userToken, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
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
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  changePassword(password: UserPasswordChangeRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/users/me/password`, password, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  deleteUser(): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/patients/me`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getErrorMessage(err)));
        }),
      );
  }

  private getErrorMessage(err: HttpErrorResponse) {
    let errorMsg: string;

    if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
      errorMsg = 'Wystąpił błąd. Proszę spróbować później';
    } else if (err.error?.status === 'fail' && err.status === 429) {
      errorMsg =
        'Hola hola, zwolnij trochę z wysyłaniem danych. Odsapnij i spróbuj ponownie za chwilę.';
    } else if (err.error?.status === 'fail' && err.error?.data) {
      const errorData = err.error.data;

      if (errorData.email === 'Email is not verified') {
        errorMsg =
          'Twoje konto nie jest jeszcze aktywne. Na twój adres email został wysłany link do weryfikacji konta.';
      } else if (errorData.credentials === 'Invalid credentials') {
        errorMsg = 'Niepoprawny email lub hasło';
      } else if (errorData.token === 'Invalid token') {
        errorMsg = 'Podano błędny kod. Proszę spróbować ponownie.';
      } else if (errorData.token === 'Token is expired') {
        errorMsg = 'Podany kod wygasł. Spróbuj ponownie.';
      } else if (errorData.phoneNumber === 'Phone number is already taken') {
        errorMsg = 'Ten numer jest juz zajęty.';
      } else if (errorData.phoneNumber === 'Phone number is not verified') {
        errorMsg =
          'Proszę zweryfikować telefon przed założeniem weryfikacji dwuetapowej';
      } else if (err.error.data.password) {
        errorMsg =
          'Hasło musi zawierać przynajmniej 10 znaków, zawierać 1 wielką literę, 1 małą literę oraz 1 cyfrę';
      } else if (
        ['Token is invalid', 'Invalid token'].includes(errorData.token)
      ) {
        errorMsg = 'Podany kod jest nieprawidłowy. Spróbuj ponownie.';
      } else {
        errorMsg = 'Wystąpił błąd podczas logowania';
      }
    } else {
      errorMsg = 'Niepoprawny email lub hasło';
    }
    return errorMsg;
  }
}
