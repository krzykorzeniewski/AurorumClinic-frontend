import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, PageableResponse } from '../models/auth.model';
import { catchError, map, throwError } from 'rxjs';
import {
  DoctorRecommended,
  GetRecommendedDoctorApiResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private _apiUrl = environment.apiUrl + '/doctors';
  private _http = inject(HttpClient);

  getRecommendedDoctors(page = 0, size = 6) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this._http
      .get<ApiResponse<PageableResponse<GetRecommendedDoctorApiResponse>>>(
        `${this._apiUrl}/recommended`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          return res.data.content.map(
            (doctor) =>
              new DoctorRecommended(
                doctor.id,
                doctor.name,
                doctor.surname,
                doctor.specialization,
                doctor.profilePicture,
                doctor.rating,
              ),
          );
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }
}
