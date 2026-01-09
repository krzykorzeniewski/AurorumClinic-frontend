import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AlertComponent,
  AlertVariant,
} from '../../../shared/components/alert/alert.component';
import { FormsService } from '../../../core/services/forms.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  UserLoginDataTwoFactorRequest,
  UserLoginDataTwoFactorTokenRequest,
} from '../../../core/models/auth.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-two-factor-login',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    RouterLink,
    MatFormField,
    ReactiveFormsModule,
  ],
  templateUrl: './two-factor-login.component.html',
  styleUrl: './two-factor-login.component.css',
})
export class TwoFactorLoginComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formService = inject(FormsService);
  private _email!: UserLoginDataTwoFactorTokenRequest;
  readonly confirmForm = this._formService.getCodeVerificationForm();
  isLoginTokenRequestSent = false;
  message = signal('');
  variant = signal<AlertVariant>('warning');
  resendTimer = signal(0);
  canResend = signal(true);
  private resendIntervalId?: any;

  constructor() {
    const nav = this._router.getCurrentNavigation();
    if (nav?.extras.state) {
      if (!nav.extras.state['fromLogin']) {
        void this._router.navigate(['/auth/login']);
      }

      this._email = {
        email: nav.extras.state['email'],
      };

      this.sendTwoFactorToken();
      this.initResendTimer();
    }
  }

  onResendToken() {
    if (!this.canResend()) return;
    this.sendTwoFactorToken();
  }

  onTwoFactorLogin() {
    if (this.confirmForm.invalid) return;

    const token: UserLoginDataTwoFactorRequest = {
      email: this._email.email,
      token: this.confirmForm.value,
    };

    this._authService.loginTwoFactor(token).subscribe({
      next: () => {
        localStorage.removeItem('emailResendTimestamp');
        localStorage.removeItem('email');
        localStorage.removeItem('twoFactorResendTimestamp');
        this._authService.redirectAfterLogin();
      },
      error: (err) => {
        this.message.set(err.message);
      },
    });
  }

  private sendTwoFactorToken() {
    this._authService.loginTwoFactorToken(this._email).subscribe({
      next: () => {
        this.isLoginTokenRequestSent = true;
        this.startResendTimer(120);
      },
      error: () => {
        void this._router.navigate(['/auth/login'], {
          state: {
            message:
              'Wystąpił błąd z weryfikacją dwuetapową. Spróbuj zalogować się ponownie.',
            variant: 'warning',
          },
        });
      },
    });
  }

  startResendTimer(seconds: number) {
    const expireAt = Date.now() + seconds * 1000;
    localStorage.setItem('twoFactorResendTimestamp', expireAt.toString());

    this.canResend.set(false);
    this.resendTimer.set(seconds);

    if (this.resendIntervalId) clearInterval(this.resendIntervalId);

    this.resendIntervalId = setInterval(() => {
      const current = this.resendTimer();
      if (current > 0) {
        this.resendTimer.set(current - 1);
      } else {
        this.clearResendTimer();
      }
    }, 1000);
  }

  private initResendTimer() {
    const ts = Number(localStorage.getItem('twoFactorResendTimestamp') || '0');
    const remaining = Math.max(0, Math.ceil((ts - Date.now()) / 1000));

    if (remaining > 0) {
      this.canResend.set(false);
      this.resendTimer.set(remaining);
      this.startResendTimer(remaining);
    }
  }

  private clearResendTimer() {
    if (this.resendIntervalId) clearInterval(this.resendIntervalId);
    this.resendIntervalId = undefined;
    this.canResend.set(true);
    this.resendTimer.set(0);
    localStorage.removeItem('twoFactorResendTimestamp');
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
