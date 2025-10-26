import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import {
  DoctorAppointmentCard,
  DoctorRecommended,
  GetRecommendedDoctorApiResponse,
} from '../models/doctor.model';
import {
  Specialization,
  SpecializationResponseApi,
} from '../models/specialization.model';
import { Service, ServiceResponseApi } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private _apiUrl = environment.apiUrl + '/doctors';
  private _http = inject(HttpClient);

  getRecommendedDoctors(page = 0, size = 6) {
    const params = new HttpParams().set('page', page).set('size', size);

    return this._http
      .get<ApiResponse<GetRecommendedDoctorApiResponse[]>>(
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
          return res.data.map(
            (doctor) =>
              new DoctorRecommended(
                doctor.id,
                doctor.name,
                doctor.surname,
                doctor.specializations,
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

  searchDoctors(query: string, serviceId: number, page = 0, size = 6) {
    let searchParams = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('serviceId', serviceId);

    if (query) {
      searchParams = searchParams.set('query', query);
    }
    return this._http
      .get<ApiResponse<PageableResponse<GetRecommendedDoctorApiResponse>>>(
        `${this._apiUrl}`,
        {
          params: searchParams,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          return res.data.content.map(
            (doctor) =>
              new DoctorAppointmentCard(
                doctor.id,
                doctor.name,
                doctor.surname,
                doctor.specializations,
                doctor.profilePicture,
                doctor.rating,
                serviceId,
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

  getSpecializations() {
    return this._http
      .get<ApiResponse<PageableResponse<SpecializationResponseApi>>>(
        `${environment.apiUrl + '/specializations'}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          return res.data.content.map(
            (doctor) => new Specialization(doctor.id, doctor.name),
          );
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  getSpecializationsWithServices() {
    return this._http
      .get<ApiResponse<PageableResponse<SpecializationResponseApi>>>(
        `${environment.apiUrl + '/specializations'}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) =>
          res.data.content.map(
            (spec) => new Specialization(spec.id, spec.name),
          ),
        ),
        switchMap((specializations) => {
          const requests = specializations.map((spec) =>
            this._http
              .get<
                ApiResponse<PageableResponse<ServiceResponseApi>>
              >(`${environment.apiUrl}/specializations/${spec.id}/services`)
              .pipe(
                map((res) => ({
                  ...spec,
                  services: res.data.content.map(
                    (srv) => new Service(srv.id, srv.name, srv.price ?? 0),
                  ),
                })),
              ),
          );
          return forkJoin(requests);
        }),
        catchError(() =>
          throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          ),
        ),
      );
  }
}
