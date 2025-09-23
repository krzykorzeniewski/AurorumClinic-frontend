import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  TokenVerifyRequest,
  User,
  UserLoginDataRequest,
  UserLoginResponse,
  UserPasswordRecoverEmailRequest,
  UserPasswordResetRequest,
  UserRegisterRequest,
  UserRole,
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  private _apiUrl = environment.apiUrl + '/auth';
  private _http = inject(HttpClient);

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
            data.userId,
            data.email,
            data.twoFactorAuth,
            this.mapRole(data.role),
          );
        }),
        tap((user) => {
          this._user.next(user);
        }),
        catchError((err: HttpErrorResponse) => {
          let errorMsg = '';

          if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
            errorMsg = 'Wystąpił błąd. Proszę spróbować później';
          } else if (err.error?.status === 'fail' && err.error?.data) {
            const errorData = err.error.data;

            if (errorData.email === 'Email is not verified') {
              errorMsg =
                'Twoje konto nie jest jeszcze aktywne. Na twój adres email został wysłany link do weryfikacji konta.';
            } else if (errorData.credentials === 'Invalid credentials') {
              errorMsg = 'Niepoprawny email lub hasło';
            } else {
              errorMsg = 'Wystąpił błąd podczas logowania';
            }
          } else {
            errorMsg = 'Niepoprawny email lub hasło';
          }
          return throwError(() => new Error(errorMsg));
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
            data.userId,
            data.email,
            data.twoFactorAuth,
            this.mapRole(data.role),
          );
        }),
        tap((user) => this._user.next(user)),
        catchError(() => {
          this._user.next(null);
          return of(null);
        }),
      );
  }

  verifyEmail(request: VerifyEmailTokenRequest): Observable<void> {
    return this._http.post<void>(`${this._apiUrl}/verify-email-token`, request);
  }

  activateAccount(tokenRequest: TokenVerifyRequest): Observable<void> {
    return this._http.post<void>(`${this._apiUrl}/verify-email`, tokenRequest);
  }

  registerPatient(patientData: UserRegisterRequest): Observable<void> {
    return this._http
      .post<ApiResponse<Record<string, string>>>(
        `${this._apiUrl}/register-patient`,
        patientData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map(() => {
          return;
        }),
        catchError((err) => {
          let errorMsg = 'Wystąpił błąd. Proszę spróbować później';

          if (err.error?.status === 'fail') {
            const failError = Object.values(err.error.data || {})[0];
            errorMsg = typeof failError === 'string' ? failError : errorMsg;
          } else if (err.error?.status === 'error') {
            errorMsg = err.error.message || errorMsg;
          }

          return throwError(() => new Error(errorMsg));
        }),
      );
  }

  resetPassword(email: UserPasswordRecoverEmailRequest): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/reset-password-token`, email)
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
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd. Proszę spróbować później'),
          );
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
          this._user.next(null);
        }),
      );
  }

  forceLogout() {
    this._user.next(null);
  }

  isLoggedIn(): boolean {
    return !!this._user.getValue();
  }

  get user$(): Observable<User | null> {
    return this._user.asObservable();
  }

  private mapRole(roleFromApi: string): UserRole {
    const roleString = (roleFromApi || '').toString().toLowerCase();
    switch (roleString) {
      case 'patient':
        return UserRole.PATIENT;
      case 'doctor':
        return UserRole.DOCTOR;
      default:
        return UserRole.PATIENT;
    }
  }
}
