import { Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsService } from '../../../core/services/forms.service';
import { UserPasswordRecoverEmailRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    AlertComponent,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatError,
    FormsModule,
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css',
})
export class PasswordRecoveryComponent {
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  readonly emailForm = this._formService.getEmailForm();
  message = signal('');

  onRecover() {
    const userData: UserPasswordRecoverEmailRequest = {
      email: this.emailForm.value,
    };

    this._authService.resetPassword(userData).subscribe({
      next: () => {
        localStorage.setItem('email', userData.email);
        void this._router.navigate(['/auth/login'], {
          state: {
            message:
              'Na podany adres e-mail został wysłany link do resetu hasła',
            variant: 'info',
          },
        });
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
