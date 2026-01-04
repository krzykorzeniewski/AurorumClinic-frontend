import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormsService } from '../../../../core/services/forms.service';
import { AbsenceService } from '../../../../core/services/absence.service';
import { DoctorCreateAbsenceByEmployee } from '../../../../core/models/absences.model';
import { toLocalISOString } from '../../../../shared/methods/dateTransform';
@Component({
  selector: 'app-create-doctor-absence-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './create-doctor-absence-dialog.component.html',
  styleUrl: './create-doctor-absence-dialog.component.css',
})
export class CreateDoctorAbsenceDialogComponent {
  private _dialogRef = inject(MatDialogRef<CreateDoctorAbsenceDialogComponent>);
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
