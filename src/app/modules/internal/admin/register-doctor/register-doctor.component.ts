import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsService } from '../../../core/services/forms.service';
import { Router } from '@angular/router';
import { DoctorRegisterRequest } from '../../../core/models/auth.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
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
import { NgIf } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { DoctorService } from '../../../core/services/doctor.service';
import { Specialization } from '../../../core/models/specialization.model';
import { EMPTY, expand, map, scan, takeLast } from 'rxjs';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [
    AlertComponent,
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
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css',
})
export class RegisterDoctorComponent {
  private _authService = inject(AuthService);
  private _doctorService = inject(DoctorService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  readonly registerForm = this._formService.getDoctorRegisterForm();
  hasPesel: WritableSignal<boolean> = signal(true);
  errorMessage = signal('');
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

  onRegister(): void {
    const formValue = this.registerForm.value;

    const userData: DoctorRegisterRequest = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthDate: formValue.birthdate!.toLocaleDateString('sv-SE'),
      email: formValue.email!,
      phoneNumber: formValue.phone!,
      description: formValue.description!,
      education: formValue.education!,
      experience: formValue.experience!,
      pwzNumber: formValue.pwzNumber!,
      specializationIds: formValue.specializationIds!,
    };

    this._authService.registerDoctor(userData).subscribe({
      next: () => {
        void this._router.navigate(['/internal/users'], {
          state: {
            message: 'Pomyślnie utworzono konto doktora.',
            status: 'success',
          },
        });
      },
      error: (err) => this.errorMessage.set(err.message),
    });
  }

  peselCheckbox(): void {
    this.hasPesel.set(!this.hasPesel());
    const peselControl = this.registerForm.controls['pesel'];

    if (!this.hasPesel()) {
      peselControl.disable();
      peselControl.clearValidators();
    } else {
      peselControl.enable();
      peselControl.setValidators([
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.required,
      ]);
    }

    peselControl.updateValueAndValidity();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.registerForm.controls;
  }
}
