import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function peselValidator(): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const peselValidator = formControl.get('pesel');
    if (!peselValidator?.hasValidator(Validators.required)) {
      return null;
    }

    const pesel = formControl.get('pesel')?.value as string;
    const birthdate = formControl.get('birthdate')?.value as Date | null;

    if (!pesel || pesel.length !== 11 || !birthdate) {
      return null;
    }

    const year = birthdate.getFullYear();
    const month = birthdate.getMonth() + 1;
    const day = birthdate.getDate();

    let peselMonth = month;

    if (year >= 2000 && year < 2100) peselMonth += 20;

    const yy = year.toString().slice(-2);
    const mm = peselMonth.toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');

    const expected = `${yy}${mm}${dd}`;
    const actual = pesel.substring(0, 6);

    return expected === actual ? null : { peselBirthdateMismatch: true };
  };
}
