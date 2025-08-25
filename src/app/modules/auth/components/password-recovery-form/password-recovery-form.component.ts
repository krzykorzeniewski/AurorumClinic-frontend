import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsService } from '../../../core/services/forms.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPasswordResetRequest } from '../../../core/models/user.model';
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
    ReactiveFormsModule
  ],
  templateUrl: './password-recovery-form.component.html',
  styleUrl: './password-recovery-form.component.css'
})
export class PasswordRecoveryFormComponent implements OnInit{
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  passwordResetForm = this._formService.getPasswordResetForm();
  private _token: string | null = null;
  hidePassword = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this._route.paramMap.subscribe({
      next: (param) => {
        this._token = param.get('uid');
      }
    });
  }

  onPasswordReset(): void {
    const userData: UserPasswordResetRequest = {
      password: this.passwordResetForm.value.password!,
      token: this._token
    }

    this._authService.changePassword(userData).subscribe({
      next: () => {
        void this._router.navigate(["/auth/login"]);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
      },
    });
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.passwordResetForm.controls;
  }
}
