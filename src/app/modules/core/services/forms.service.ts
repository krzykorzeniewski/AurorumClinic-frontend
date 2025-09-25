import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordRepeatValidator } from '../../shared/validators/password-repeat.validator';
import { phoneValidator } from '../../shared/validators/phone.validator';
import { dateValidator } from '../../shared/validators/date.validator';
import {
  communicationPreferences,
  GetPatientResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  getLoginForm() {
    return new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.email,
          Validators.maxLength(100),
          Validators.required,
        ],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.maxLength(200), Validators.required],
        nonNullable: true,
      }),
    });
  }

  getEmailForm() {
    return new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ],
      nonNullable: true,
    });
  }

  getPasswordResetForm() {
    return new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.maxLength(200), Validators.required],
          nonNullable: true,
        }),
        repeatedPassword: new FormControl('', {
          validators: [Validators.maxLength(200), Validators.required],
          nonNullable: true,
        }),
      },
      { validators: passwordRepeatValidator() },
    );
  }

  getRegisterForm() {
    return new FormGroup(
      {
        firstName: new FormControl('', {
          validators: [Validators.maxLength(50), Validators.required],
          nonNullable: true,
        }),
        surname: new FormControl('', {
          validators: [Validators.maxLength(50), Validators.required],
          nonNullable: true,
        }),
        email: new FormControl('', {
          validators: [
            Validators.email,
            Validators.maxLength(100),
            Validators.required,
          ],
          nonNullable: true,
        }),
        pesel: new FormControl('', {
          validators: [
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.required,
          ],
          nonNullable: false,
        }),
        phone: new FormControl('', {
          validators: [Validators.required, phoneValidator()],
          nonNullable: true,
        }),
        password: new FormControl('', {
          validators: [Validators.maxLength(200), Validators.required],
          nonNullable: true,
        }),
        repeatedPassword: new FormControl('', {
          validators: [Validators.maxLength(200), Validators.required],
          nonNullable: true,
        }),
        birthdate: new FormControl<Date | null>(null, {
          validators: [dateValidator(), Validators.required],
          nonNullable: true,
        }),
      },
      { validators: passwordRepeatValidator() },
    );
  }

  getFulfilledEmailProfileForm(userData: GetPatientResponse | null) {
    return new FormGroup({
      email: new FormControl<string>(userData ? userData.email : '', {
        validators: [
          Validators.email,
          Validators.maxLength(100),
          Validators.required,
        ],
        nonNullable: true,
      }),
    });
  }

  getFulfilledPhoneProfileForm(userData: GetPatientResponse | null) {
    return new FormGroup({
      phoneNumber: new FormControl<string>(
        userData ? userData.phoneNumber : '',
        {
          validators: [Validators.required, phoneValidator()],
          nonNullable: true,
        },
      ),
    });
  }

  getFulfilledAdditionalInformationProfileForm(
    userData: GetPatientResponse | null,
  ) {
    return new FormGroup({
      communicationPreferences: new FormControl<communicationPreferences>(
        userData
          ? userData.communicationPreferences
          : communicationPreferences.EMAIL,
        {
          validators: [Validators.required],
          nonNullable: true,
        },
      ),
      newsletter: new FormControl<boolean>(
        userData ? userData.newsletter : false,
        {
          validators: [Validators.required],
          nonNullable: true,
        },
      ),
    });
  }

  getCodeVerificationForm() {
    return new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    });
  }

  getErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'To pole jest wymagane.';
    }
    if (control.hasError('email')) {
      return 'Niepoprawny adres email.';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      return `Minimalna długość to ${requiredLength} znaków.`;
    }
    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;
      return `Maksymalna długość to ${requiredLength} znaków.`;
    }
    if (control.hasError('min')) {
      return 'Wartość jest za mała.';
    }
    if (control.hasError('max')) {
      return 'Wartość jest za duża.';
    }
    if (control.hasError('passwordMismatch')) {
      return 'Hasła się nie zgadzają.';
    }
    if (control.hasError('textMismatch')) {
      return 'Tekst się nie zgadza.';
    }
    if (control.hasError('invalidDate')) {
      return 'Niepoprawna data.';
    }
    if (control.hasError('futureDate')) {
      return 'Data urodzenia nie może być w przyszłości.';
    }
    if (control.hasError('invalidPhone')) {
      return 'Numer telefonu musi zawierać dokładnie 9 cyfr.';
    }

    return 'Niepoprawna wartość';
  }
}
