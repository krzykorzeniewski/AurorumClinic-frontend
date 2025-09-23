import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsService } from '../../../core/services/forms.service';
import { MatIcon } from '@angular/material/icon';
import { UserRegisterRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
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
    MatIconButton,
    MatIcon,
    AlertComponent,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  readonly registerForm = this._formService.getRegisterForm();
  hasPesel: WritableSignal<boolean> = signal(true);
  hidePassword = signal(true);
  errorMessage = signal('');

  onRegister(): void {
    const formValue = this.registerForm.value;

    const userData: UserRegisterRequest = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthDate: formValue.birthdate!.toLocaleDateString('sv-SE'),
      email: formValue.email!,
      password: formValue.password!,
      phoneNumber: formValue.phone!,
    };

    this._authService.registerPatient(userData).subscribe({
      next: () => {
        localStorage.setItem('email', userData.email);
        void this._router.navigate(['/auth/login'], {
          state: {
            message:
              'Na adres email wysłano link do aktywacji konta. Kod jest ważny 15 minut.',
            variant: 'info',
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

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.registerForm.controls;
  }
}
