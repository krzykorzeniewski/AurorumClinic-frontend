import { Component, inject, signal } from '@angular/core';
import { FormsService } from '../../../../core/services/forms.service';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { CreateSpecialization } from '../../../../core/models/specialization.model';
import { SpecializationService } from '../../../../core/services/specialization.service';
import { InputRefDirective } from '../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-create-specialization-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    AlertComponent,
    NgIf,
    MatButton,
    MatError,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    InputRefDirective,
  ],
  templateUrl: './create-specialization-dialog.component.html',
})
export class CreateSpecializationDialogComponent {
  private _specService = inject(SpecializationService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(
    MatDialogRef<CreateSpecializationDialogComponent>,
  );
  createForm = this._formService.getSpecializationForm();
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');

  onSubmit() {
    if (this.createForm.invalid) return;

    const data: CreateSpecialization = {
      name: this.createForm.value,
    };

    this._specService.createSpecialization(data).subscribe({
      next: () => {
        this._dialogRef.close({
          success: true,
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
