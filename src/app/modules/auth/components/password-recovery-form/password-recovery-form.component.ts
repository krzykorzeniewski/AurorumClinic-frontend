import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsService } from '../../../core/services/forms.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPasswordResetRequest } from '../../../core/models/auth.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-password-recovery-form',
  standalone: true,
  imports: [
    AlertComponent,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './password-recovery-form.component.html',
  styleUrl: './password-recovery-form.component.css',
})
export class PasswordRecoveryFormComponent implements OnInit {
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  passwordResetForm = this._formService.getPasswordResetForm();
  private _token: string | null = null;
  private _email: string | null = null;
  hidePassword = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this._token = this._route.snapshot.paramMap.get('uid');
    this._email = this._route.snapshot.queryParamMap.get('email');
  }

  onPasswordReset(): void {
    if (this._token && this._email) {
      const userData: UserPasswordResetRequest = {
        password: this.passwordResetForm.value.password!,
        token: this._token,
        email: this._email,
      };

      this._authService.changePassword(userData).subscribe({
        next: () => {
          this.redirectAndShowMessage(
            'Twoje nowe hasło zostało ustawione pomyślnie!',
            'success',
          );
        },
        error: () => {
          this.redirectAndShowMessage(
            'Wystąpił błąd w trakcie ustawiania nowego hasła. Proszę spróbować później.',
            'warning',
          );
        },
      });
    } else {
      this.redirectAndShowMessage(
        'Wystąpił błąd w trakcie ustawiania nowego hasła. Proszę spróbować później.',
        'warning',
      );
    }
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  private redirectAndShowMessage(message: string, variant: string) {
    void this._router.navigate(['/auth/login'], {
      state: {
        message: message,
        variant: variant,
      },
    });
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.passwordResetForm.controls;
  }
}
