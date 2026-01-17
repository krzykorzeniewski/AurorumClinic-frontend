import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { DoctorStatisticsData } from '../models/doctor.model';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getPanelStatistics(startedAt: string, finishedAt: string, fetchAll: boolean) {
    let params = new HttpParams()
      .set('startedAt', startedAt)
      .set('finishedAt', finishedAt);
    if (fetchAll) {
      params.set('fetch', 'all');
    }
    return this._http
      .get<ApiResponse<DoctorStatisticsData>>(
        `${this._apiUrl + '/stats/appointments'}`,
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
          return res.data;
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }
}
