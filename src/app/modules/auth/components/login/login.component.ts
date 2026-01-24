import { Component, inject, signal } from '@angular/core';
import {
  MatError,
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import {
  UserLoginDataRequest,
  UserRoleMap,
} from '../../../core/models/auth.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsService } from '../../../core/services/forms.service';
import {
  AlertComponent,
  AlertVariant,
} from '../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatIcon,
    MatButton,
    RouterLink,
    MatInput,
    MatIconButton,
    MatError,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AlertComponent,
    NgIf,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _chatService = inject(ChatService);
  private _router = inject(Router);
  readonly loginForm = this._formService.getLoginForm();
  hidePassword = signal(true);
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this.variant.set(navigation.extras.state['variant']);
      this.infoMessage.set(navigation.extras.state['message']);
    }
  }

  onLogin(): void {
    const userData: UserLoginDataRequest = this.loginForm
      .value as UserLoginDataRequest;

    this._authService.login(userData).subscribe({
      next: (user) => {
        if (user.twoFactorAuth) {
          void this._router.navigate(['/auth/twoFactorAuthorization'], {
            state: {
              fromLogin: true,
              email: userData.email,
            },
          });
        } else {
          const isDoctorOrPatient =
            user.role === UserRoleMap.DOCTOR ||
            user.role === UserRoleMap.PATIENT;

          if (isDoctorOrPatient) {
            this._chatService.connect();
          }
          this._authService.redirectAfterLogin();
        }
      },
      error: (err) => {
        if (
          err.message ===
          'Twoje konto nie jest jeszcze aktywne. Na twój adres email został wysłany link do weryfikacji konta.'
        ) {
          if (localStorage.getItem('verified') === null) {
            void this._router.navigate(['/auth/email-resend'], {
              state: {
                email: userData.email,
              },
            });
          } else {
            this._authService.verifyEmail({ email: userData.email }).subscribe({
              next: () => {
                void this._router.navigate(['/auth/email-resend'], {
                  state: {
                    email: userData.email,
                  },
                });
              },
              error: (err) => {
                this.variant.set('warning');
                this.infoMessage.set(err.message);
              },
            });
          }
        } else {
          this.variant.set('warning');
          this.infoMessage.set(err.message);
        }
      },
    });
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  get controls() {
    return this.loginForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
