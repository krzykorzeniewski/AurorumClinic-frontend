import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import {
  DoctorAppointmentCard,
  DoctorPanelStats,
  DoctorRecommended,
  GetDoctorApiResponse,
  GetFullDoctorApiResponse,
  GetRecommendedDoctorApiResponse,
} from '../models/doctor.model';
import {
  Specialization,
  SpecializationResponseApi,
} from '../models/specialization.model';
import { Service, ServiceResponseApi } from '../models/service.model';
import { Absence, GetDoctorAbsencesByEmployee } from '../models/absences.model';

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

  getDoctors(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc' | '',
    query?: string,
  ) {
    let params = new HttpParams().set('page', page).set('size', size);

    if (sort) {
      if (direction) {
        params = params.set('sort', `${sort},${direction}`);
      } else {
        params = params.set('sort', sort);
      }
    }

    if (query) {
      params = params.set('query', query);
    }

    return this._http
      .get<ApiResponse<PageableResponse<GetDoctorApiResponse>>>(
        `${this._apiUrl}`,
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
          return {
            doctors: res.data.content,
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd podczas uzyskiwania listy lekarzy. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }

  getDoctorById(doctorId: number) {
    return this._http
      .get<ApiResponse<GetFullDoctorApiResponse>>(
        `${this._apiUrl}/${doctorId}`,
        {
          withCredentials: true,
        },
      )
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd serwera podczas uzyskiwania danych lekarza. Spróbuj ponownie później.',
              ),
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
        `${this._apiUrl}/search`,
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

  getAllAbsences(doctorId: number, page: number, size: number) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'id,desc');
    return this._http
      .get<ApiResponse<PageableResponse<GetDoctorAbsencesByEmployee>>>(
        this._apiUrl + `/${doctorId}/absences`,
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
          return {
            absence: res.data.content.map(
              (absence) =>
                new Absence(
                  absence.id,
                  absence.name,
                  absence.startedAt,
                  absence.finishedAt,
                ),
            ),
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

  getSpecializations() {
    return this._http
      .get<ApiResponse<SpecializationResponseApi[]>>(
        `${environment.apiUrl + '/specializations'}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          return res.data.map(
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

  getPanelStatistics(startedAt: string, finishedAt: string) {
    const params = new HttpParams()
      .set('startedAt', startedAt)
      .set('finishedAt', finishedAt);
    return this._http
      .get<ApiResponse<DoctorPanelStats>>(
        `${environment.apiUrl + '/stats/appointments/me'}`,
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
