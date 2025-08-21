import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private _apiUrl = environment.apiUrl + "/";
  private _http = inject(HttpClient);

  signup(email: string): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/subscribe`, { email })
      .pipe(
        catchError(() => {
          return throwError(() =>
            new Error('Wystąpił błąd. Proszę spróbować później'))
        })
      );
  }
}
