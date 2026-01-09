import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordRepeatValidator } from '../../shared/validators/password-repeat.validator';
import { phoneValidator } from '../../shared/validators/phone.validator';
import { pastTimeDateValidator } from '../../shared/validators/past-time-date.validator';
import { communicationPreferences } from '../models/user.model';
import { GetPatientResponse } from '../models/patient.model';
import { timeValidator } from '../../shared/validators/time.validator';
import { peselValidator } from '../../shared/validators/pesel.validator';
import { futureTimeDateValidator } from '../../shared/validators/future-time-date.validator';
import { DayDto } from '../models/schedule.model';
import { UpdateDoctorProfileData } from '../models/doctor.model';
import BigNumber from 'bignumber.js';

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

  getPatientRegisterForm() {
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
          validators: [pastTimeDateValidator(), Validators.required],
          nonNullable: true,
        }),
      },
      { validators: [passwordRepeatValidator(), peselValidator()] },
    );
  }

  getDoctorRegisterForm() {
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
        description: new FormControl('', {
          validators: [Validators.maxLength(100), Validators.required],
          nonNullable: true,
        }),
        education: new FormControl('', {
          validators: [Validators.maxLength(100), Validators.required],
          nonNullable: true,
        }),
        experience: new FormControl('', {
          validators: [Validators.maxLength(100), Validators.required],
          nonNullable: true,
        }),
        pwzNumber: new FormControl('', {
          validators: [Validators.maxLength(50), Validators.required],
          nonNullable: true,
        }),
        birthdate: new FormControl<Date | null>(null, {
          validators: [pastTimeDateValidator(), Validators.required],
          nonNullable: true,
        }),
        specializationIds: new FormControl<number[]>([], {
          validators: [Validators.min(1), Validators.required],
        }),
      },
      { validators: [peselValidator()] },
    );
  }

  getEmployeeRegisterForm() {
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
        birthdate: new FormControl<Date | null>(null, {
          validators: [pastTimeDateValidator(), Validators.required],
          nonNullable: true,
        }),
      },
      { validators: [peselValidator()] },
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

  getFulfilledPatientProfileForm(userData: GetPatientResponse | null) {
    return new FormGroup({
      firstName: new FormControl<string>(userData ? userData.name : '', {
        validators: [Validators.maxLength(50), Validators.required],
        nonNullable: true,
      }),
      surname: new FormControl<string>(userData ? userData.surname : '', {
        validators: [Validators.maxLength(50), Validators.required],
        nonNullable: true,
      }),
      pesel: new FormControl<string>(userData ? userData.pesel : '', {
        validators: [
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.required,
        ],
        nonNullable: false,
      }),
      birthdate: new FormControl<Date>(
        userData ? new Date(userData.birthDate) : new Date(),
        {
          validators: [pastTimeDateValidator(), Validators.required],
          nonNullable: true,
        },
      ),
      email: new FormControl<string>(userData ? userData.email : '', {
        validators: [
          Validators.email,
          Validators.maxLength(100),
          Validators.required,
        ],
        nonNullable: true,
      }),
      phoneNumber: new FormControl<string>(
        userData ? userData.phoneNumber : '',
        {
          validators: [Validators.required, phoneValidator()],
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
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ],
      nonNullable: true,
    });
  }

  getSearchFrom() {
    return new FormGroup({
      name: new FormControl('', {
        validators: [],
        nonNullable: true,
      }),
      specialization: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      service: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  getAdditionalInformationAppointmentForm() {
    return new FormControl<string>('', {
      validators: [Validators.maxLength(500)],
    });
  }

  getScheduleDailyForm() {
    return new FormGroup(
      {
        services: new FormControl<number[]>([], {
          validators: [Validators.minLength(1), Validators.required],
          nonNullable: true,
        }),
        date: new FormControl<Date | null>(null, {
          validators: [futureTimeDateValidator(), Validators.required],
          nonNullable: true,
        }),
        startedAt: new FormControl<Date | null>(null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        finishedAt: new FormControl<Date | null>(null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      { validators: timeValidator() },
    );
  }

  getScheduleWeeklyForm() {
    return new FormGroup(
      {
        mon: new FormControl<DayDto | null>(
          { hours: ['', ''], serviceIds: [] },
          {
            nonNullable: true,
          },
        ),
        tue: new FormControl<DayDto | null>(
          { hours: ['', ''], serviceIds: [] },
          {
            nonNullable: true,
          },
        ),
        wed: new FormControl<DayDto | null>(
          { hours: ['', ''], serviceIds: [] },
          {
            nonNullable: true,
          },
        ),
        thu: new FormControl<DayDto | null>(
          { hours: ['', ''], serviceIds: [] },
          {
            nonNullable: true,
          },
        ),
        fri: new FormControl<DayDto | null>(
          { hours: ['', ''], serviceIds: [] },
          {
            nonNullable: true,
          },
        ),
        startedAt: new FormControl<Date | null>(null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        finishedAt: new FormControl<Date | null>(null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      { validators: timeValidator() },
    );
  }

  getScheduleEditForm() {
    return new FormGroup(
      {
        services: new FormControl<number[]>({ value: [], disabled: true }),
        date: new FormControl<Date>({ value: new Date(), disabled: true }),
        startedAt: new FormControl<Date>({ value: new Date(), disabled: true }),
        finishedAt: new FormControl<Date>({
          value: new Date(),
          disabled: true,
        }),
      },
      { validators: timeValidator() },
    );
  }

  getAbsenceCreateForm() {
    return new FormGroup(
      {
        name: new FormControl<string>('', {
          validators: [Validators.required, Validators.maxLength(100)],
          nonNullable: true,
        }),
        startedAt: new FormControl<Date | null>(null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        finishedAt: new FormControl<Date | null>(null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      { validators: timeValidator() },
    );
  }

  getFulfilledUpdateDoctorProfileForm(
    image: string | null,
    doctorData: UpdateDoctorProfileData | null,
  ) {
    return new FormGroup({
      doctorImage: new FormControl<string | null>(image ?? null),
      experience: new FormControl<string>(
        doctorData ? doctorData.experience : '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          nonNullable: true,
        },
      ),
      education: new FormControl<string>(
        doctorData ? doctorData.education : '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          nonNullable: true,
        },
      ),
      description: new FormControl<string>(
        doctorData ? doctorData.description : '',
        {
          validators: [Validators.required, Validators.maxLength(500)],
          nonNullable: true,
        },
      ),
    });
  }

  getOpinionPatientForm() {
    return new FormGroup({
      rating: new FormControl<number>(5, {
        validators: [Validators.required, Validators.min(1), Validators.max(5)],
        nonNullable: true,
      }),
      comment: new FormControl<string>('', {
        validators: [Validators.required, Validators.maxLength(2000)],
        nonNullable: true,
      }),
    });
  }

  getOpinionDoctorForm() {
    return new FormGroup({
      answer: new FormControl<string>('', {
        validators: [Validators.required, Validators.maxLength(2000)],
        nonNullable: true,
      }),
    });
  }

  getSpecializationForm() {
    return new FormControl<string>('', {
      validators: [Validators.maxLength(150), Validators.required],
      nonNullable: true,
    });
  }

  getServiceForm() {
    return new FormGroup({
      name: new FormControl<string>('', {
        validators: [Validators.maxLength(150), Validators.required],
        nonNullable: true,
      }),
      duration: new FormControl<number>(0, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      price: new FormControl<BigNumber>(BigNumber(0), {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      description: new FormControl<string>('', {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
        ],
        nonNullable: true,
      }),
      specializationIds: new FormControl<number[]>([], {
        validators: [Validators.min(1), Validators.required],
      }),
    });
  }

  getUpdateServiceForm() {
    return new FormGroup({
      name: new FormControl<string>('', {
        validators: [Validators.maxLength(150), Validators.required],
        nonNullable: true,
      }),
      description: new FormControl<string>('', {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
        ],
        nonNullable: true,
      }),
    });
  }

  getReviewPromptForm() {
    return new FormGroup({
      subject: new FormControl<string>('', {
        validators: [Validators.minLength(1), Validators.required],
        nonNullable: true,
      }),
      text: new FormControl<string>('', {
        validators: [Validators.minLength(1), Validators.required],
        nonNullable: true,
      }),
      date: new FormControl<Date | null>(null, {
        validators: [futureTimeDateValidator(), Validators.required],
        nonNullable: true,
      }),
      time: new FormControl<Date | null>(null, {
        validators: [Validators.required],
        nonNullable: true,
      }),
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
      return `Minimalna długość to ${requiredLength}.`;
    }
    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;
      return `Maksymalna długość to ${requiredLength}.`;
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
    if (control.hasError('passwordMismatch')) {
      return 'Hasła się nie zgadzają.';
    }
    if (control.hasError('peselBirthdateMismatch')) {
      return 'Data urodzenia nie zgadza się z numerem PESEL.';
    }
    if (control.hasError('textMismatch')) {
      return 'Tekst się nie zgadza.';
    }
    if (control.hasError('invalidDate')) {
      return 'Niepoprawna data.';
    }
    if (control.hasError('futureDate')) {
      return 'Data nie może być w przyszłości.';
    }
    if (control.hasError('pastDate')) {
      return 'Data nie może być w przeszłości.';
    }
    if (control.hasError('invalidPhone')) {
      return 'Numer telefonu musi zawierać dokładnie 9 cyfr.';
    }
    if (control.hasError('matTimepickerParse')) {
      return 'Godzina nie jest poprawna.';
    }
    if (control.hasError('matTimepickerMin')) {
      return 'Wybrana godzina jest za wczesna.';
    }
    if (control.hasError('matTimepickerMax')) {
      return 'Wybrana godzina jest za późna.';
    }
    if (control.hasError('timeRangeInvalid')) {
      return 'Godzina zakończenia musi być później niż rozpoczęcia';
    }

    return 'Niepoprawna wartość';
  }
}
