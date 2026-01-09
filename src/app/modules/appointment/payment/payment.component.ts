import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import {
  PaymentMethod,
  PaymentRequest,
} from '../../core/models/appointment.model';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [AlertComponent, NgSwitch, NgSwitchCase, NgIf],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  private _paymentService = inject(PaymentService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  private paymentId!: number;
  selectedMethod?: PaymentMethod;
  errorMessage = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { paymentId: number };

    if (!state?.paymentId) {
      void this._router.navigate(['']);
      return;
    }
    this.paymentId = state.paymentId;
  }

  onPlacePayment(paymentMethod: PaymentMethod) {
    const payment: PaymentRequest = {
      paymentMethod: paymentMethod,
    };
    this._paymentService.placePayment(this.paymentId, payment).subscribe({
      next: () => {
        this._dialog.open(PaymentDialogComponent, {
          disableClose: true,
        });
      },
      error: (err) => {
        if (err.error?.status === 'fail' && err.error?.data) {
          const errorData = err.error.data;

          if (errorData.status === 'Payment is already settled') {
            void this._router.navigate(['']);
          }
        }
        this.errorMessage.set(
          'Wystąpił błąd w trakcie zapłaty. Spróbuj ponownie później.',
        );
      },
    });
  }

  protected readonly PaymentMethod = PaymentMethod;
}
