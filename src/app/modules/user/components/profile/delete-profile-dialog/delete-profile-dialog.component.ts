import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { distinctUntilChanged, of, switchMap } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { GetPatientResponse } from '../../../../core/models/user.model';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../../../core/services/forms.service';

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
  styleUrl: './delete-profile-dialog.component.css',
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
    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.deleteUser(user.userId);
          } else {
            return of(null);
          }
        }),
      )
      .subscribe({
        next: () => {
          this._authService.forceLogout();
          void this._router.navigate(['auth/login'], {
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
