import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CreateAppointmentPatient } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  registerPatientForAppointment(
    appointment: CreateAppointmentPatient,
  ): Observable<void> {
    return this._http
      .post<void>(`${this._apiUrl}/appointments/me`, appointment, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie umawiania wizyty. Spróbuj ponownie później.',
              ),
          );
        }),
      );
  }
}
