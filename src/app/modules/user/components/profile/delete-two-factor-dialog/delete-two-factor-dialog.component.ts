import { Component, inject, signal } from '@angular/core';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { FormsService } from '../../../../core/services/forms.service';

@Component({
  selector: 'app-delete-two-factor-dialog',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    NgIf,
  ],
  templateUrl: './delete-two-factor-dialog.component.html',
})
export class DeleteTwoFactorDialogComponent {
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<DeleteTwoFactorDialogComponent>);
  variant = signal<AlertVariant>('warning');
  infoMessage = signal('');

  onSubmit() {
    this._userService.disableTwoFactorAuthorizationToken().subscribe({
      next: () => {
        this._dialogRef.close({
          success: true,
          message: 'Pomyślne usunięto weryfikację dwuetapową',
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
