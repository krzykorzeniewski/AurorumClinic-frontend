import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function whitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return (control.value || '').trim().length ? null : { whitespace: true };
  };
}
