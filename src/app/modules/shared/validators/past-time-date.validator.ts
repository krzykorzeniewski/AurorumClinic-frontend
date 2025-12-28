import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pastTimeDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    if (date > today) {
      return { futureDate: true };
    }

    return null;
  };
}
