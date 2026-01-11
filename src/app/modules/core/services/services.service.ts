import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { catchError, map, throwError } from 'rxjs';
import {
  CreateService,
  FullService,
  UpdateService,
} from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl + '/services';

  getServices(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc' | '',
  ) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      if (direction) {
        params = params.set('sort', `${sort},${direction}`);
      } else {
        params = params.set('sort', sort);
      }
    }
    return this._http
      .get<ApiResponse<PageableResponse<FullService>>>(`${this._apiUrl}`, {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((res) => {
          return {
            services: res.data.content,
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  createService(data: CreateService) {
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

  updateService(serviceId: number, data: UpdateService) {
    return this._http
      .put<void>(`${this._apiUrl}/${serviceId}`, data, {
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
