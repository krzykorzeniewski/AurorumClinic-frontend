import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  User,
  UserLoginDataRequest,
  UserLoginResponse,
  UserPasswordRecoverEmailRequest,
  UserPasswordResetRequest,
  UserRegisterRequest
} from '../models/user.model';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  private _apiUrl = environment.apiUrl + "/auth";
  private _http = inject(HttpClient);

  login(userData: UserLoginDataRequest): Observable<User>{
    return this._http
      .post<ApiResponse<UserLoginResponse>>(
        `${this._apiUrl}/login`,
        userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .pipe(
        map(res => {
          const data = res.data;
          return new User(data.userId, data.twoFactorAuth)}
        ),
        tap((user) => {
          this._user.next(user);
          localStorage.setItem('userId', user.userId.toString());
        }),
        catchError((err: HttpErrorResponse) => {
          let errorMsg = '';
          if(err.status === 0 || err.status >= 500 && err.status < 600){
            errorMsg = 'Wystąpił błąd. Proszę spróbować później';
          } else {
            errorMsg = 'Niepoprawny email lub hasło';
          }
          return throwError(() => new Error(errorMsg));
        })
    );
  }

  autoLogin(): Observable<User | null> {
    return this._http
      .post<ApiResponse<UserLoginResponse>>(`${this._apiUrl}/refresh`, {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
        )
      .pipe(
        map(res => {
           const data = res.data;
          return new User(data.userId, data.twoFactorAuth)
        }),
        tap(user => this._user.next(user)),
        catchError(() => {
          this._user.next(null);
          localStorage.removeItem('userId');
          return of(null);
        })
      );
  }

  registerPatient(patientData: UserRegisterRequest): Observable<void>{
    return this._http
      .post<void>(
        `${this._apiUrl}/register-patient`,
        patientData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Wystąpił błąd. Proszę spróbować później'))
        })
      );
  }

  resetPassword(email: UserPasswordRecoverEmailRequest): Observable<void> {
    return this._http
      .post<void>(
        `${this._apiUrl}/reset-password-token`,
        email
      )
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Wystąpił błąd. Proszę spróbować później'))
        })
      );
  }

  changePassword(passwordData: UserPasswordResetRequest): Observable<void>{
    return this._http
      .post<void>(
        `${this._apiUrl}/reset-password`,
        passwordData
      )
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Wystąpił błąd. Proszę spróbować później'))
        })
      );
  }

  logout(): Observable<void> {
    return this._http
      .get<void>(
        `${this._apiUrl}/logout`,
        {
          withCredentials: true,
        })
      .pipe(
        tap(() => {
          localStorage.removeItem('userId');
          this._user.next(null);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this._user.getValue();
  }

  get user$(): Observable<User | null> {
    return this._user.asObservable();
  }
}
