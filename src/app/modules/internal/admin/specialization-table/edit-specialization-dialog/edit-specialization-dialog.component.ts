import { Component, inject, signal } from '@angular/core';
import { FormsService } from '../../../../core/services/forms.service';
import { SpecializationService } from '../../../../core/services/specialization.service';
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
import {
  Specialization,
  UpdateSpecialization,
} from '../../../../core/models/specialization.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { InputRefDirective } from '../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-edit-specialization-dialog',
  standalone: true,
  imports: [
    AlertComponent,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    InputRefDirective,
  ],
  templateUrl: './edit-specialization-dialog.component.html',
})
export class EditSpecializationDialogComponent {
  private _specService = inject(SpecializationService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<EditSpecializationDialogComponent>);
  createForm = this._formService.getSpecializationForm();
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');
  readonly data = inject<{
    specialization: Specialization;
  }>(MAT_DIALOG_DATA);

  constructor() {
    this.createForm.setValue(this.data.specialization.name);
  }

  onSubmit() {
    if (this.createForm.invalid) return;

    const updateData: UpdateSpecialization = {
      name: this.createForm.value,
    };

    this._specService
      .updateSpecialization(this.data.specialization.id, updateData)
      .subscribe({
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
