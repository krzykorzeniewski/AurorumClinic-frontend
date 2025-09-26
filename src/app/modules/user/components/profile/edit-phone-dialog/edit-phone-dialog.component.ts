import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { FormsService } from '../../../../core/services/forms.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  UpdateContactRequest,
  UpdatePhoneTokenRequest,
} from '../../../../core/models/user.model';
import { distinctUntilChanged, of, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput } from '@angular/material/input';

@Component({
  selector: 'app-edit-phone-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatError,
  ],
  templateUrl: './edit-phone-dialog.component.html',
  styleUrl: './edit-phone-dialog.component.css',
})
export class EditPhoneDialogComponent {
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<EditPhoneDialogComponent>);
  readonly data = inject<{
    oldPhone: string;
    updatedPhone: UpdatePhoneTokenRequest;
  }>(MAT_DIALOG_DATA);
  readonly confirmForm = this._formService.getCodeVerificationForm();

  onSubmit() {
    if (this.confirmForm.invalid) return;

    const token: UpdateContactRequest = {
      token: this.confirmForm.value,
    };

    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.updateUserPhone(user.userId, token);
          } else {
            return of(null);
          }
        }),
      )
      .subscribe({
        next: () => {
          this._dialogRef.close({
            success: true,
            message: 'Twój numer telefonu został zmieniony',
          });
        },
        error: (err) => {
          this._dialogRef.close({ success: false, error: err.message });
        },
      });
  }
  onNoClick() {
    this._dialogRef.close({ success: false });
  }
  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
