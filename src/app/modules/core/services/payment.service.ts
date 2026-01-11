import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaymentRequest } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl + '/payments';

  placePayment(paymentId: number, paymentMethod: PaymentRequest) {
    return this._http.put<void>(`${this._apiUrl}/${paymentId}`, paymentMethod, {
      withCredentials: true,
    });
  }
}
