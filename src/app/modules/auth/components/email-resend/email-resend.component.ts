import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Location, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VerifyEmailTokenRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-email-resend',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './email-resend.component.html',
  styleUrl: './email-resend.component.css',
})
export class EmailResendComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthService);
  private _location = inject(Location);
  private _router = inject(Router);
  message = signal('');
  email = signal('');
  canModify = signal(false);
  timer = signal(0);
  canResend = signal(true);
  private intervalId?: any;

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { email: string };

    if (!state?.email) {
      void this._router.navigate(['/auth/login']);
      return;
    }
    this.email.set(state?.email);
    this._location.replaceState('/auth/email-resend');
  }

  ngOnInit() {
    this.initTimerFromStorage();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  onResend() {
    if (!this.canResend()) return;

    const email = this.email();
    if (!email) void this._router.navigate(['/auth/login']);
    this.message.set('');

    const userData: VerifyEmailTokenRequest = { email };

    this._authService.verifyEmail(userData).subscribe({
      next: () => {
        this.message.set('Wysłano ponownie email weryfikacyjny');
        this.startTimer(120);
      },
      error: () => {
        void this._router.navigate(['/auth/login']);
      },
    });
  }

  startTimer(seconds: number) {
    this.clearTimer();

    const expireAt = Date.now() + seconds * 1000;
    localStorage.setItem('emailResendTimestamp', expireAt.toString());

    this.canResend.set(false);
    this.timer.set(seconds);

    this.intervalId = setInterval(() => {
      const current = this.timer();
      if (current > 0) {
        this.timer.set(current - 1);
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  private initTimerFromStorage() {
    const ts = Number(localStorage.getItem('emailResendTimestamp') || '0');
    const remaining = Math.max(0, Math.ceil((ts - Date.now()) / 1000));

    if (remaining > 0) {
      this.canResend.set(false);
      this.timer.set(remaining);
      this.intervalId = setInterval(() => {
        const current = this.timer();
        if (current > 0) {
          this.timer.set(current - 1);
        } else {
          this.clearTimer();
        }
      }, 1000);
    } else {
      this.startTimer(120);
    }
  }

  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.canResend.set(true);
    this.timer.set(0);
    localStorage.removeItem('emailResendTimestamp');
    localStorage.removeItem('email');
  }
}
