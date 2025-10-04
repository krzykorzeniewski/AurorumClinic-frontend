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

  constructor() {
    const nav = this._router.getCurrentNavigation();
    console.log(nav);
    if (nav?.extras.state) {
      if (!nav.extras.state['fromLogin']) {
        void this._router.navigate(['/auth/login']);
      }

      const email: UserLoginDataTwoFactorTokenRequest = {
        email: nav.extras.state['email'],
      };
      this._email = email;

      this._authService.loginTwoFactorToken(email).subscribe({
        next: () => {
          this.isLoginTokenRequestSent = true;
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
    } else {
      void this._router.navigate(['/auth/login']);
    }
  }

  onTwoFactorLogin() {
    if (this.confirmForm.invalid) return;

    const token: UserLoginDataTwoFactorRequest = {
      email: this._email.email,
      token: this.confirmForm.value,
    };

    this._authService.loginTwoFactor(token).subscribe({
      next: () => {
        void this._router.navigate(['/']);
      },
      error: (err) => {
        this.message.set(err.message);
      },
    });
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
