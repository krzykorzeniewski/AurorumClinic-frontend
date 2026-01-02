import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function peselValidator(): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const peselCtrl = formControl.get('pesel');
    const birthdateCtrl = formControl.get('birthdate');

    if (!peselCtrl || !birthdateCtrl) return null;
    if (peselCtrl.disabled) {
      clearBirthdateError(birthdateCtrl);
      return null;
    }

    const pesel = peselCtrl.value as string;
    const birthdate = birthdateCtrl.value as Date | null;

    if (!pesel || pesel.length !== 11 || !birthdate) {
      clearBirthdateError(birthdateCtrl);
      return null;
    }

    const year = birthdate.getFullYear();
    const month = birthdate.getMonth() + 1;
    const day = birthdate.getDate();

    let peselMonth = month;
    if (year >= 2000 && year < 2100) peselMonth += 20;

    const expected = `${year.toString().slice(-2)}${peselMonth
      .toString()
      .padStart(2, '0')}${day.toString().padStart(2, '0')}`;

    const actual = pesel.substring(0, 6);

    if (expected !== actual) {
      birthdateCtrl.setErrors({
        ...birthdateCtrl.errors,
        peselBirthdateMismatch: true,
      });
    } else {
      clearBirthdateError(birthdateCtrl);
    }

    return null;
  };
}

function clearBirthdateError(ctrl: AbstractControl) {
  if (!ctrl.errors?.['peselBirthdateMismatch']) return;
  const { peselBirthdateMismatch, ...rest } = ctrl.errors;
  ctrl.setErrors(Object.keys(rest).length ? rest : null);
}
