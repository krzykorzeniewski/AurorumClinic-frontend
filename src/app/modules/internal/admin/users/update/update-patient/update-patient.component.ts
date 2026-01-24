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
import {
  GetPatientResponse,
  UpdatePatient,
} from '../../../../../core/models/patient.model';
import { PatientService } from '../../../../../core/services/patient.service';
import { InputRefDirective } from '../../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-update-patient',
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
    InputRefDirective,
  ],
  templateUrl: './update-patient.component.html',
})
export class UpdatePatientComponent {
  private _patientService = inject(PatientService);
  private _formService = inject(FormsService);
  private _location = inject(Location);
  private _router = inject(Router);
  patient!: GetPatientResponse;
  private initialFormValues: any = null;
  patientForm = this._formService.getFulfilledPatientProfileForm(null);
  hasPesel: WritableSignal<boolean> = signal(true);
  errorMessage = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      userId: number;
    };
    if (!state?.userId) {
      void this._router.navigate(['/internal/users']);
      return;
    }

    this._patientService.getPatient(state?.userId).subscribe({
      next: (res) => {
        this.patient = res;
        this.patientForm =
          this._formService.getFulfilledPatientProfileForm(res);

        if (!res.pesel) {
          this.peselCheckbox();
        }

        this.initialFormValues = this.patientForm.getRawValue();
      },
      error: () => {
        void this._router.navigate(['/internal/users']);
      },
    });
  }

  onPatientUpdate() {
    const formValue = this.patientForm.value;

    const patientData: UpdatePatient = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthdate: formValue.birthdate!.toLocaleDateString('sv-SE'),
      email: formValue.email!,
      phoneNumber: formValue.phoneNumber!,
      newsletter: formValue.newsletter!,
    };

    this._patientService.updatePatient(this.patient.id, patientData).subscribe({
      next: () => {
        void this._router.navigate([`/internal/users`], {
          state: {
            message: 'Pomyślnie zmieniono dane pacjenta',
            status: 'success',
          },
        });
      },
      error: (err) => this.errorMessage.set(err.message),
    });
  }

  peselCheckbox(): void {
    this.hasPesel.set(!this.hasPesel());
    const peselControl = this.patientForm.controls['pesel'];

    if (!this.hasPesel()) {
      peselControl.disable();
      peselControl.clearValidators();
      peselControl.setValue(null);
    } else {
      peselControl.enable();
      peselControl.setValue(this.patient.pesel);
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
    return this.patientForm.controls;
  }

  get noChangesDetected(): boolean {
    if (!this.initialFormValues) return true;

    return (
      JSON.stringify(this.patientForm.getRawValue()) ===
      JSON.stringify(this.initialFormValues)
    );
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
