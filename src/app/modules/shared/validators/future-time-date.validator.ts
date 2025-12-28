import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureTimeDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return { pastDate: true };
    }

    return null;
  };
}
