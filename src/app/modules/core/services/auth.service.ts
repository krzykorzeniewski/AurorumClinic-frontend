import { inject, Injectable } from '@angular/core';
import { User, UserLoginDataRequest, UserLoginResponse, UserRegisterRequest } from '../models/user.model';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  private _apiUrl = environment.apiUrl + "/users";
  private _http = inject(HttpClient);
  private _router = inject(Router);


  login(userData: UserLoginDataRequest): Observable<User>{
    return this._http
      .post<UserLoginResponse>(
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
        map(res => new User(Number.parseInt(res.userId))),
        tap((user) => this._user.next(user)),
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
      .post<UserLoginResponse>(`${this._apiUrl}/refresh`, {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
        )
      .pipe(
        map(res => new User(Number.parseInt(res.userId))),
        tap(user => this._user.next(user)),
        catchError(() => {
          this._user.next(null);
          return throwError(() => new Error("Wystąpił błąd. Proszę spróbować później"));
        })
      );
  }

  logout() {
    this._user.next(null);
    this._router.navigate(['/auth/login']);
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

  isLoggedIn(): boolean {
    return !!this._user.getValue();
  }

  get user(): BehaviorSubject<User | null> {
    return this._user;
  }
}
