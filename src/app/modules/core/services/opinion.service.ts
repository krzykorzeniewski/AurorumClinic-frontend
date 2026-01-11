import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { catchError, Observable, throwError } from 'rxjs';
import {
  AnswerOpinionDoctor,
  CreateOpinionPatient,
  Opinion,
  UpdateAnswerOpinionDoctor,
  UpdateOpinionPatient,
} from '../models/opinion.model';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getDoctorOpinions(
    doctorId: number,
    page: number,
    size: number,
    sort?: string,
  ): Observable<ApiResponse<PageableResponse<Opinion>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this._http.get<ApiResponse<PageableResponse<Opinion>>>(
      `${this._apiUrl}/doctors/${doctorId}/opinions`,
      {
        params: params,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  createDoctorAnswerToOpinion(opinionId: number, data: AnswerOpinionDoctor) {
    return this._http
      .post<void>(
        `${this._apiUrl}/doctors/me/opinions/${opinionId}/answer`,
        data,
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  createDoctorOpinionByPatient(
    appointmentId: number,
    data: CreateOpinionPatient,
  ) {
    return this._http
      .post<void>(
        `${this._apiUrl}/patients/me/appointments/${appointmentId}/opinion`,
        data,
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  patchDoctorOpinionByPatient(opinionId: number, data: UpdateOpinionPatient) {
    return this._http
      .patch<void>(`${this._apiUrl}/patients/me/opinions/${opinionId}`, data, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  patchDoctorOpinion(opinionId: number, data: UpdateAnswerOpinionDoctor) {
    return this._http
      .patch<void>(
        `${this._apiUrl}/doctors/me/opinions/${opinionId}/answer`,
        data,
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  deleteDoctorAnswer(opinionId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/doctors/me/opinions/${opinionId}/answer`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  deletePatientOpinionByPatient(opinionId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/patients/me/opinions/${opinionId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  deletePatientOpinionByAdmin(opinionId: number): Observable<void> {
    return this._http
      .delete<void>(`${this._apiUrl}/opinions/${opinionId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.mapError(err)));
        }),
      );
  }

  private mapError(err: HttpErrorResponse) {
    let errorMsg: string;

    if (err.status === 0 || (err.status >= 500 && err.status < 600)) {
      errorMsg = 'Wystąpił błąd. Spróbuj ponownie.';
    } else if (err.error?.status === 'fail' && err.error?.data) {
      const errorData = err.error.data;

      if (errorData.opinionContent === 'Content rejected by moderation') {
        errorMsg =
          'Ta wiadomość została odrzucona przez niewłaściwą treść. Spróbuj ponownie.';
      } else {
        errorMsg = 'Wystąpił błąd. Spróbuj ponownie.';
      }
    } else {
      errorMsg = 'Wystąpił błąd. Spróbuj ponownie.';
    }
    return errorMsg;
  }
}
