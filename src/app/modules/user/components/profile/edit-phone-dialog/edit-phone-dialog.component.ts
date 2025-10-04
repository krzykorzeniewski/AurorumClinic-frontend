import { Component, inject, signal } from '@angular/core';
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
  UpdateTokenRequest,
  UpdatePhoneTokenRequest,
} from '../../../../core/models/user.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';

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
    AlertComponent,
    NgIf,
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
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');

  onSubmit() {
    if (this.confirmForm.invalid) return;

    const token: UpdateTokenRequest = {
      token: this.confirmForm.value,
    };

    const useAuthService =
      this.data.oldPhone === this.data.updatedPhone.phoneNumber;

    const updatePhoneFn = useAuthService
      ? this._authService.updateUserPhone.bind(this._authService)
      : this._userService.updateUserPhone.bind(this._userService);

    const successMessage = useAuthService
      ? 'Twój numer został zweryfikowany'
      : 'Twój numer został zmieniony i zweryfikowany';

    updatePhoneFn(token).subscribe({
      next: () => {
        this._dialogRef.close({
          success: true,
          message: successMessage,
        });
      },
      error: (err) => {
        this.infoMessage.set(err.message);
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
