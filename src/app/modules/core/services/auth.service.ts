import { inject, Injectable } from '@angular/core';
import { AccessTokenResponse, User, UserLoginDataRequest } from '../models/user.model';
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
      .post<AccessTokenResponse>(`${this._apiUrl}/login`, userData)
      .pipe(
        map((res) =>
          new User(userData.email, res.accessToken, res.refreshToken)),
        tap((user) => this.handleAuthentication(user)),
        catchError((err: HttpErrorResponse) => {
          let errorMsg = "";

          if(err.status === 0 ||err.status >= 500 && err.status < 600){
            errorMsg = "Wystąpił błąd. Proszę spróbować później"
          } else {
            errorMsg = "Niepoprawny email lub hasło";
          }
          return throwError(() => new Error(errorMsg));
        })
    );
  }

  private handleAuthentication(user: User) {
    localStorage.setItem('user', JSON.stringify({
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken
    }));
    this._user.next(user);
  }

  autoLogin() {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const userJson = JSON.parse(userData);
    const user =
      new User(userJson.email, userJson.accessToken, userJson.refreshToken);

    this._user.next(user);
  }

  isLoggedIn(): boolean {
    return !!this._user.getValue();
  }

  logout() {
    localStorage.removeItem('user');
    this._user.next(null);
    this._router.navigate(['/auth/login']);
  }

  get user(): BehaviorSubject<User | null> {
    return this._user;
  }
}
