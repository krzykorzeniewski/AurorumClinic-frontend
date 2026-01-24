import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { PatientService } from '../../../../core/services/patient.service';
import { FormsService } from '../../../../core/services/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { catchError, of, switchMap, tap } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  GetPatientResponse,
  UpdatePatientEmployeeRequest,
} from '../../../../core/models/patient.model';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { InputRefDirective } from '../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-patient-profile-edit',
  standalone: true,
  imports: [
    MatButton,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgIf,
    AlertComponent,
    InputRefDirective,
  ],
  templateUrl: './patient-profile-edit.component.html',
})
export class PatientProfileEditComponent implements OnInit {
  private _patientService = inject(PatientService);
  private _formService = inject(FormsService);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);
  private _router = inject(Router);
  patient!: GetPatientResponse;
  private initialFormValues: any = null;
  patientForm = this._formService.getFulfilledPatientProfileForm(null);
  hasPesel: WritableSignal<boolean> = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((params) => {
          const token = params.get('id');
          if (!token) {
            this._location.back();
            throw new Error('Brak uid użytkownika');
          }
        }),
        switchMap((params) => {
          const patientId = Number.parseInt(params.get('id') as string);
          return this._patientService.getPatient(patientId).pipe(
            tap((patient) => {
              this.patient = patient;
            }),
            catchError(() => {
              return of(null);
            }),
          );
        }),
      )
      .subscribe({
        next: (userResponse) => {
          if (userResponse) {
            this.patientForm =
              this._formService.getFulfilledPatientProfileForm(userResponse);

            if (!userResponse.pesel) {
              this.peselCheckbox();
            }

            this.initialFormValues = this.patientForm.getRawValue();
          } else {
            throw new Error('Brak użytkownika');
          }
        },
      });
  }

  onPatientUpdate() {
    const formValue = this.patientForm.value;

    const patientData: UpdatePatientEmployeeRequest = {
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
        void this._router.navigate([`/internal/patients/${this.patient.id}`]);
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
