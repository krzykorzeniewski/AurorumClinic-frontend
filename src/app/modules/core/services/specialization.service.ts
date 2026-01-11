import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  CreateSpecialization,
  UpdateSpecialization,
} from '../models/specialization.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl + '/specializations';

  createSpecialization(data: CreateSpecialization) {
    return this._http
      .post<void>(`${this._apiUrl}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  updateSpecialization(specId: number, data: UpdateSpecialization) {
    return this._http
      .put<void>(`${this._apiUrl}/${specId}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }
}
