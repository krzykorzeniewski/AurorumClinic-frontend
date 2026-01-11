import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { FormsService } from '../../../../core/services/forms.service';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserPasswordChangeRequest } from '../../../../core/models/auth.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-edit-password-dialog',
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
    MatIcon,
    MatIconButton,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-password-dialog.component.html',
})
export class EditPasswordDialogComponent {
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<EditPasswordDialogComponent>);
  readonly passwordResetForm = this._formService.getPasswordResetForm();
  variant = signal<AlertVariant>('warning');
  infoMessage = signal('');
  hidePassword = signal(true);

  onSubmit() {
    if (this.passwordResetForm.invalid) return;

    const token: UserPasswordChangeRequest = {
      password: this.passwordResetForm.controls.password.value!,
    };

    this._userService.changePassword(token).subscribe({
      next: () => {
        this._dialogRef.close({
          success: true,
          message: 'Pomyślne zmieniono hasło',
        });
      },
      error: (err) => {
        this.infoMessage.set(err.message);
      },
    });
  }
  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }
  onNoClick() {
    this._dialogRef.close({ success: false });
  }
  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
  get controls() {
    return this.passwordResetForm.controls;
  }
}
