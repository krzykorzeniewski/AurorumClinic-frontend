import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatButton, MatDialogTitle],
  templateUrl: './payment-dialog.component.html',
})
export class PaymentDialogComponent implements OnInit, OnDestroy {
  private _dialogRef = inject(MatDialogRef<PaymentDialogComponent>);
  private _router = inject(Router);
  counter = 5;
  private intervalId!: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.counter--;

      if (this.counter === 0) {
        this.redirectNow();
      }
    }, 1000);
  }

  redirectNow() {
    clearInterval(this.intervalId);
    this._dialogRef.close();
    void this._router.navigate(['']);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
