import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {
  Appointment,
  AppointmentStatus,
  GetAppointmentInfo,
} from '../models/appointment.model';
import {
  ApiResponse,
  PageableResponse,
  Payment,
} from '../models/api-response.model';
import { Doctor } from '../models/doctor.model';
import { Service } from '../models/service.model';
import { GetPatientApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getPatientAppointments(page: number, size: number) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this._http
      .get<ApiResponse<PageableResponse<GetAppointmentInfo>>>(
        `${this._apiUrl}/appointments/me`,
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
            appointments: res.data.content.map(
              (value) =>
                new Appointment(
                  value.id,
                  value.startedAt,
                  value.status as AppointmentStatus,
                  value.description,
                  new Doctor(
                    value.doctor.id,
                    value.doctor.name,
                    value.doctor.surname,
                    value.doctor.specializations,
                    value.doctor.profilePicture,
                  ),
                  new Service(
                    value.service.id,
                    value.service.name,
                    value.service.price,
                  ),
                  new Payment(value.payment.amount, value.payment.status),
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

  getPatients(
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
      .get<ApiResponse<PageableResponse<GetPatientApiResponse>>>(
        `${this._apiUrl}/patients`,
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
            patients: res.data.content,
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd podczas uzyskiwania danych pacjentów. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }
}
