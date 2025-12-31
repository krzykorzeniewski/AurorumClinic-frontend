import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { Opinion } from '../models/opinion.model';

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
}
