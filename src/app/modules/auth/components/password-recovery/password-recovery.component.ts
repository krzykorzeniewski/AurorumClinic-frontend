import { Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsService } from '../../../core/services/forms.service';
import { UserPasswordRecoverEmail } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-password-recovery',
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
    FormsModule
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {
  email = new FormControl('', {
    validators: [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ],
    nonNullable: true
  });
  private _formService = inject(FormsService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  message = signal('');

  onRecover() {
    const userData: UserPasswordRecoverEmail = {
      email: this.email.value
    };

    this._authService.recover(userData)
      .subscribe({
      next: () => {
        this._router.navigate(["/home"]);
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
