import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateValidator } from '../../../shared/validators/date.validator';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsService } from '../../../core/services/forms.service';
import { passwordRepeatValidator } from '../../../shared/validators/password-repeat.validator';
import { phoneValidator } from '../../../shared/validators/phone.validator';
import { MatIcon } from '@angular/material/icon';
import { UserRegisterRequest, VerifyEmailTokenRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';
import { finalize, switchMap } from 'rxjs';

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
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly registerForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.maxLength(50),
        Validators.required
      ],
      nonNullable: true
    }),
    surname: new FormControl('', {
      validators: [
        Validators.maxLength(50),
        Validators.required
      ],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [
        Validators.email,
        Validators.maxLength(100),
        Validators.required
      ],
      nonNullable: true
    }),
    pesel: new FormControl('', {
      validators: [
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.required
      ],
      nonNullable: false
    }),
    phone: new FormControl('', {
      validators: [
        Validators.required,
        phoneValidator()
      ],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [
        Validators.maxLength(200),
        Validators.required
      ],
      nonNullable: true
    }),
    repeatedPassword: new FormControl('', {
      validators: [
        Validators.maxLength(200),
        Validators.required
      ],
      nonNullable: true
    }),
    birthdate: new FormControl<Date | null>(null, {
      validators: [
        dateValidator(),
        Validators.required
      ],
      nonNullable: true
    }),
  },
    { validators: passwordRepeatValidator() }
  );
  protected hasPesel: WritableSignal<boolean> = signal(true);
  private _formService = inject(FormsService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  hidePassword = signal(true);
  errorMessage = signal('');


  onRegister(): void {
    const formValue = this.registerForm.value;

    const userData: UserRegisterRequest = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthDate: formValue.birthdate!.toISOString().split('T')[0],
      email: formValue.email!,
      password: formValue.password!,
      phoneNumber: formValue.phone!
    };

    this._authService.registerPatient(userData).pipe(
      switchMap(() => {
        const emailToVerify: VerifyEmailTokenRequest = { email: userData.email };
        return this._authService.verifyEmail(emailToVerify).pipe(
          finalize(() => {
            void this._router.navigate(['/auth/login'], {
              state: { message: 'Na adres email wysłano link do aktywacji konta. Kod jest ważny 15 minut.' }
            });
          })
        );
      })
    ).subscribe({
      error: (err) => this.errorMessage.set(err.message)
    });

  }

  peselCheckbox(): void {
    this.hasPesel.set(!this.hasPesel());
    const peselControl = this.registerForm.controls['pesel'];

    if (!this.hasPesel()){
      peselControl.disable();
      peselControl.clearValidators();
    } else {
      peselControl.enable();
      peselControl.setValidators([
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.required
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
