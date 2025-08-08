import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const isValid = /^\d{9}$/.test(value);

    return isValid ? null : { invalidPhone: true };
  };
}
