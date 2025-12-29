import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsService } from '../../../../core/services/forms.service';
import { AbsenceService } from '../../../../core/services/absence.service';
import { DoctorCreateAbsenceByEmployee } from '../../../../core/models/absences.model';
import { toLocalISOString } from '../../../../shared/methods/dateTransform';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';

@Component({
  selector: 'app-create-absence-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    NgIf,
    MatDatepicker,
    MatDatepickerToggle,
    MatError,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatDatepickerInput,
    MatInput,
    MatDialogContent,
    MatDialogTitle,
    MatSuffix,
  ],
  templateUrl: './create-absence-dialog.component.html',
  styleUrl: './create-absence-dialog.component.css',
})
export class CreateAbsenceDialogComponent {
  private _dialogRef = inject(MatDialogRef<CreateAbsenceDialogComponent>);
  private _data = inject<{ doctorId: number }>(MAT_DIALOG_DATA);
  private _formService = inject(FormsService);
  private _absenceService = inject(AbsenceService);

  absenceForm = this._formService.getAbsenceCreateForm();
  errorMessage = '';
  isSubmitting = false;

  get controls() {
    return this.absenceForm.controls;
  }

  createAbsence(): void {
    if (this.absenceForm.invalid) {
      this.absenceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.absenceForm.getRawValue();
    const endOfDay = formValue.finishedAt!;
    endOfDay.setHours(23);
    endOfDay.setMinutes(59);
    endOfDay.setSeconds(59);

    const absenceData: DoctorCreateAbsenceByEmployee = {
      name: formValue.name,
      startedAt: toLocalISOString(formValue.startedAt!),
      finishedAt: toLocalISOString(endOfDay),
      doctorId: this._data.doctorId,
    };

    this._absenceService.createAbsenceByEmployee(absenceData).subscribe({
      next: () => {
        this._dialogRef.close({ success: true });
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSubmitting = false;
      },
    });
  }

  cancel(): void {
    this._dialogRef.close();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
