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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import {
  UpdateTokenRequest,
  UpdateEmailTokenRequest,
} from '../../../../core/models/user.model';
import { MatButton } from '@angular/material/button';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-email-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatError,
    MatDialogContent,
    MatInput,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    AlertComponent,
    NgIf,
  ],
  templateUrl: './edit-email-dialog.component.html',
  styleUrl: './edit-email-dialog.component.css',
})
export class EditEmailDialogComponent {
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<EditEmailDialogComponent>);
  readonly data = inject<{
    oldEmail: string;
    updatedEmail: UpdateEmailTokenRequest;
  }>(MAT_DIALOG_DATA);
  readonly confirmForm = this._formService.getCodeVerificationForm();
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');

  onSubmit() {
    if (this.confirmForm.invalid) return;

    const token: UpdateTokenRequest = {
      token: this.confirmForm.value,
    };

    this._userService.updateUserEmail(token).subscribe({
      next: () => {
        this._dialogRef.close({
          success: true,
          message: 'Twój email został zmieniony',
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
