import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { invalidDate: 'Niepoprawna data' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      return { futureDate: 'Data urodzenia nie może być w przyszłości' };
    }

    return null;
  };
}
