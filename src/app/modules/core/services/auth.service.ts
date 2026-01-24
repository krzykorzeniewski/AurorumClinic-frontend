import { inject, Injectable } from '@angular/core';
import {
  DoctorRegisterRequest,
  EmployeeRegisterRequest,
  PatientRegisterRequest,
  TokenVerifyRequest,
  User,
  UserLoginDataRequest,
  UserLoginDataTwoFactorRequest,
  UserLoginDataTwoFactorTokenRequest,
  UserLoginResponse,
  UserPasswordRecoverEmailRequest,
  UserPasswordResetRequest,
  UserRoleMap,
  VerifyEmailTokenRequest,
} from '../models/auth.model';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  UpdatePhoneTokenRequest,
  UpdateTokenRequest,
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #user = new BehaviorSubject<User | null | undefined>(undefined);
  private _apiUrl = environment.apiUrl + '/auth';
  private _router = inject(Router);
  private _http = inject(HttpClient);
  private readonly ROLE_MAP: Record<string, UserRoleMap> = {
    doctor: UserRoleMap.DOCTOR,
    patient: UserRoleMap.PATIENT,
    employee: UserRoleMap.EMPLOYEE,
    admin: UserRoleMap.ADMIN,
  };

  login(userData: UserLoginDataRequest): Observable<User> {
    return this._http
      .post<ApiResponse<UserLoginResponse>>(`${this._apiUrl}/login`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((res) => {
          const data = res.data;
          return new User(
            data.id,
            data.twoFactorAuth,
            this.ROLE_MAP[data.role?.toLowerCase()] ?? UserRoleMap.PATIENT,
          );
        }),
        tap((user) => {
          if (!user.twoFactorAuth) this.#user.next(user);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  loginTwoFactorToken(
    userEmail: UserLoginDataTwoFactorTokenRequest,
  ): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/login-2fa-token`, userEmail, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  loginTwoFactor(userData: UserLoginDataTwoFactorRequest): Observable<User> {
    return this._http
      .post<ApiResponse<UserLoginResponse>>(
        `${this._apiUrl}/login-2fa`,
        userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          const data = res.data;
          return new User(
            data.id,
            data.twoFactorAuth,
            this.ROLE_MAP[data.role?.toLowerCase()] ?? UserRoleMap.PATIENT,
          );
        }),
        tap((user) => {
          this.#user.next(user);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  refreshCookies(): Observable<User | null> {
    return this._http
      .post<ApiResponse<UserLoginResponse>>(
        `${this._apiUrl}/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Auto-Login': 'true',
          },
        },
      )
      .pipe(
        map((res) => {
          const data = res.data;
          return new User(
            data.id,
            data.twoFactorAuth,
            this.ROLE_MAP[data.role?.toLowerCase()] ?? UserRoleMap.PATIENT,
          );
        }),
        tap((user) => this.#user.next(user)),
        catchError(() => {
          this.#user.next(null);
          return of(null);
        }),
      );
  }

  verifyEmail(request: VerifyEmailTokenRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/verify-email-token`, request)
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  verifyUserPhoneToken(userPhone: UpdatePhoneTokenRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/me/verify-phone-number-token`, userPhone, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  updateUserPhone(userToken: UpdateTokenRequest): Observable<void> {
    return this._http
      .put<void>(`${this._apiUrl}/me/verify-phone-number`, userToken, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  activateAccount(tokenRequest: TokenVerifyRequest): Observable<void> {
    return this._http.post<void>(`${this._apiUrl}/verify-email`, tokenRequest);
  }

  registerPatient(patientData: PatientRegisterRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/register-patient`, patientData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  registerDoctor(doctorData: DoctorRegisterRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/register-doctor`, doctorData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  registerEmployee(employeeData: EmployeeRegisterRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/register-employee`, employeeData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  resetPassword(email: UserPasswordRecoverEmailRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/reset-password-token`, email)
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  createNewPasswordStaff(staffId: number): Observable<void> {
    return this._http
      .post<void>(
        `${this._apiUrl}/${staffId}/new-password`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd. Proszę spróbować później'),
          );
        }),
      );
  }

  changePassword(passwordData: UserPasswordResetRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/reset-password`, passwordData)
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.getLoginErrorMessage(err)));
        }),
      );
  }

  logout(): Observable<void> {
    return this._http
      .get<void>(`${this._apiUrl}/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.#user.next(null);
        }),
      );
  }

  get user$(): Observable<User | null | undefined> {
    return this.#user.asObservable();
  }

  get userRole() {
    return this.#user.value?.role ?? UserRoleMap.ANONYMOUS;
  }

  private getLoginErrorMessage(err: HttpErrorResponse) {
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
        errorMsg = 'Ten numer jest już zajęty.';
      } else if (errorData.email === 'already in use') {
        errorMsg = 'Ten email jest już zajęty.';
      } else if (errorData.phoneNumber === 'already in use') {
        errorMsg = 'Ten numer jest już zajęty.';
      } else if (err.error.data.password) {
        errorMsg =
          'Hasło musi zawierać przynajmniej 10 znaków, zawierać 1 wielką literę, 1 małą literę oraz 1 cyfrę';
      } else if (
        ['Token is invalid', 'Invalid token'].includes(errorData.token)
      ) {
        errorMsg = 'Podany kod jest nieprawidłowy. Spróbuj ponownie.';
      } else {
        errorMsg = 'Wystąpił błąd. Spróbuj ponownie później';
      }
    } else {
      errorMsg = 'Wystąpił błąd. Spróbuj ponownie później';
    }
    return errorMsg;
  }

  redirectAfterLogin(): void {
    const role = this.userRole;

    switch (role) {
      case UserRoleMap.DOCTOR:
      case UserRoleMap.EMPLOYEE:
      case UserRoleMap.ADMIN:
        void this._router.navigate(['/internal']);
        break;
      case UserRoleMap.PATIENT:
        void this._router.navigate(['']);
        break;
      default:
        void this._router.navigate(['']);
    }
  }
}
