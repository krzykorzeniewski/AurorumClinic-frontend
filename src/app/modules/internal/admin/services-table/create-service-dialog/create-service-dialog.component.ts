import { Component, inject, signal } from '@angular/core';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../shared/components/alert/alert.component';
import { MatButton } from '@angular/material/button';
import {
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
import { FormsService } from '../../../../core/services/forms.service';
import { Specialization } from '../../../../core/models/specialization.model';
import { ServicesService } from '../../../../core/services/services.service';
import { CreateService } from '../../../../core/models/service.model';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { EMPTY, expand, map, scan, takeLast } from 'rxjs';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { InputRefDirective } from '../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-create-service-dialog',
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
    MatOption,
    MatSelect,
    CdkTextareaAutosize,
    InputRefDirective,
  ],
  templateUrl: './create-service-dialog.component.html',
})
export class CreateServiceDialogComponent {
  private _doctorService = inject(DoctorService);
  private _servicesService = inject(ServicesService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<CreateServiceDialogComponent>);
  createForm = this._formService.getServiceForm();
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');
  specializations: Specialization[] = [];

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
  }

  onSubmit() {
    if (this.createForm.invalid) return;

    const data: CreateService = {
      name: this.createForm.value.name!,
      price: this.createForm.value.price!,
      duration: this.createForm.value.duration!,
      description: this.createForm.value.description!,
      specializationIds: this.createForm.value.specializationIds!,
    };

    this._servicesService.createService(data).subscribe({
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
    return this.createForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
