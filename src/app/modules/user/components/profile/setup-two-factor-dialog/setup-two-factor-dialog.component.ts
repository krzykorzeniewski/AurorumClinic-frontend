import { Component, inject, signal } from '@angular/core';
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
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { UpdateTokenRequest } from '../../../../core/models/user.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-setup-two-factor-dialog',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    NgIf,
    MatFormField,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './setup-two-factor-dialog.component.html',
})
export class SetupTwoFactorDialogComponent {
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<SetupTwoFactorDialogComponent>);
  readonly data = inject<{ phoneNumber: string }>(MAT_DIALOG_DATA);
  readonly confirmForm = this._formService.getCodeVerificationForm();
  variant = signal<AlertVariant>('warning');
  infoMessage = signal('');

  onSubmit() {
    if (this.confirmForm.invalid) return;

    const token: UpdateTokenRequest = {
      token: this.confirmForm.value,
    };

    this._userService.setupTwoFactorAuthorization(token).subscribe({
      next: () => {
        this._dialogRef.close({
          success: true,
          message: 'Pomyślne założenie weryfikacji dwuetapowej',
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
