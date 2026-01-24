import { Component, inject, signal } from '@angular/core';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
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
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../../../core/services/doctor.service';
import { ServicesService } from '../../../../core/services/services.service';
import { FormsService } from '../../../../core/services/forms.service';
import { Specialization } from '../../../../core/models/specialization.model';
import { EMPTY, expand, map, scan, takeLast } from 'rxjs';
import {
  FullService,
  UpdateService,
} from '../../../../core/models/service.model';
import { InputRefDirective } from '../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-edit-service-dialog',
  standalone: true,
  imports: [
    AlertComponent,
    CdkTextareaAutosize,
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
  templateUrl: './edit-service-dialog.component.html',
})
export class EditServiceDialogComponent {
  private _doctorService = inject(DoctorService);
  private _servicesService = inject(ServicesService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<EditServiceDialogComponent>);
  updateForm = this._formService.getUpdateServiceForm();
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');
  specializations: Specialization[] = [];
  readonly data = inject<{
    service: FullService;
  }>(MAT_DIALOG_DATA);

  constructor() {
    const pageSize = 15;
    this._doctorService
      .getSpecializations(0, pageSize)
      .pipe(
        expand((res) => {
          const hasMorePages = res.page.number < res.page.totalPages - 1;

          if (hasMorePages) {
            return this._doctorService.getSpecializations(
              res.page.number + 1,
              pageSize,
            );
          } else {
            return EMPTY;
          }
        }),
        map((res) => res.specializations),
        scan((acc, curr) => [...acc, ...curr], [] as Specialization[]),
        takeLast(1),
      )
      .subscribe({
        next: (res) => {
          this.specializations = res;
        },
      });

    this.updateForm.patchValue({
      name: this.data.service.name,
      description: this.data.service.description,
    });
  }

  onSubmit() {
    if (this.updateForm.invalid) return;

    const data: UpdateService = {
      name: this.updateForm.value.name!,
      description: this.updateForm.value.description!,
    };

    this._servicesService.updateService(this.data.service.id, data).subscribe({
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

  get controls() {
    return this.updateForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
