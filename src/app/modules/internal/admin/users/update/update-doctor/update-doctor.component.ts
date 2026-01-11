import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
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
import { Location, NgIf } from '@angular/common';
import { FormsService } from '../../../../../core/services/forms.service';
import { Router } from '@angular/router';
import { DoctorService } from '../../../../../core/services/doctor.service';
import {
  GetDoctorToUpdate,
  UpdateDoctor,
} from '../../../../../core/models/doctor.model';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { EMPTY, expand, map, scan, takeLast } from 'rxjs';
import { Specialization } from '../../../../../core/models/specialization.model';

@Component({
  selector: 'app-update-doctor',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
  ],
  templateUrl: './update-doctor.component.html',
})
export class UpdateDoctorComponent {
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _location = inject(Location);
  private _router = inject(Router);
  doctor!: GetDoctorToUpdate;
  private initialFormValues: any = null;
  doctorForm = this._formService.getFulfilledDoctorProfileForm(null);
  hasPesel: WritableSignal<boolean> = signal(true);
  errorMessage = signal('');
  specializations: Specialization[] = [];

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      userId: number;
    };
    if (!state?.userId) {
      void this._router.navigate(['/internal/users']);
      return;
    }

    this._doctorService.getDoctorByIdByAdmin(state?.userId).subscribe({
      next: (res) => {
        this.doctor = res;
        this.doctorForm = this._formService.getFulfilledDoctorProfileForm(res);

        if (!res.pesel) {
          this.peselCheckbox();
        }

        this.initialFormValues = this.doctorForm.getRawValue();
      },
      error: () => {
        void this._router.navigate(['/internal/users']);
      },
    });

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

  onDoctorUpdate() {
    const formValue = this.doctorForm.value;

    const patientData: UpdateDoctor = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthdate: formValue.birthdate!.toLocaleDateString('sv-SE'),
      email: formValue.email!,
      phoneNumber: formValue.phoneNumber!,
      pwzNumber: formValue.pwzNumber!,
      specializationIds: formValue.specializationIds!,
      twoFactorAuth: formValue.twoFactorAuth!,
    };

    this._doctorService
      .updateDoctorByAdmin(this.doctor.id, patientData)
      .subscribe({
        next: () => {
          void this._router.navigate([`/internal/users`], {
            state: {
              message: 'Pomyślnie zmieniono dane doktora',
              status: 'success',
            },
          });
        },
        error: (err) => this.errorMessage.set(err.message),
      });
  }

  peselCheckbox(): void {
    this.hasPesel.set(!this.hasPesel());
    const peselControl = this.doctorForm.controls['pesel'];

    if (!this.hasPesel()) {
      peselControl.disable();
      peselControl.clearValidators();
      peselControl.setValue(null);
    } else {
      peselControl.enable();
      peselControl.setValue(this.doctor.pesel);
      peselControl.setValidators([
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.required,
      ]);
    }

    peselControl.updateValueAndValidity();
  }

  goBack() {
    this._location.back();
  }

  get controls() {
    return this.doctorForm.controls;
  }

  get noChangesDetected(): boolean {
    if (!this.initialFormValues) return true;

    return (
      JSON.stringify(this.doctorForm.getRawValue()) ===
      JSON.stringify(this.initialFormValues)
    );
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
