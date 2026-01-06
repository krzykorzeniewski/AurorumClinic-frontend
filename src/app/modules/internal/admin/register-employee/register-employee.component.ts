import { Component, inject, signal, WritableSignal } from '@angular/core';
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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormsService } from '../../../core/services/forms.service';
import { Router } from '@angular/router';
import { EmployeeRegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register-employee',
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
  ],
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.css',
})
export class RegisterEmployeeComponent {
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  readonly registerForm = this._formService.getEmployeeRegisterForm();
  hasPesel: WritableSignal<boolean> = signal(true);
  errorMessage = signal('');

  onRegister(): void {
    const formValue = this.registerForm.value;

    const userData: EmployeeRegisterRequest = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthDate: formValue.birthdate!.toLocaleDateString('sv-SE'),
      email: formValue.email!,
      phoneNumber: formValue.phone!,
    };

    this._authService.registerEmployee(userData).subscribe({
      next: () => {
        void this._router.navigate(['/internal/users'], {
          state: {
            message: 'Pomyślnie utworzono konto pracownika.',
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
