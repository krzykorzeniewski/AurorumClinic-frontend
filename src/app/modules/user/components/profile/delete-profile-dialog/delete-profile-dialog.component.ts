import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../../../core/services/forms.service';
import { switchMap } from 'rxjs';
import { GetPatientResponse } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-delete-profile-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatError,
    MatInput,
  ],
  templateUrl: './delete-profile-dialog.component.html',
})
export class DeleteProfileDialogComponent {
  readonly DELETE_ACCOUNT_CONFIRM_MESSAGE = 'USUWAM KONTO AURORUM';
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<DeleteProfileDialogComponent>);
  readonly data = inject<{ userData: GetPatientResponse }>(MAT_DIALOG_DATA);
  readonly confirmForm = new FormControl('', {
    validators: [
      Validators.required,
      (control) =>
        control.value === this.DELETE_ACCOUNT_CONFIRM_MESSAGE
          ? null
          : { messageMismatch: true },
    ],
    nonNullable: true,
  });

  onDelete() {
    if (this.confirmForm.invalid) return;
    this._userService
      .deleteUser()
      .pipe(switchMap(() => this._authService.refreshCookies()))
      .subscribe({
        next: () => {
          void this._router.navigate(['/auth/login'], {
            state: {
              message: 'Twoje konto zostało usunięte',
              variant: 'success',
            },
          });
          this._dialogRef.close();
        },
      });
  }
  onNoClick() {
    this._dialogRef.close();
  }
  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
