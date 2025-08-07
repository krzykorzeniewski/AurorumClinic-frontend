import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordRepeatValidator(): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const password = formControl.get('password');
    const repeated = formControl.get('repeatedPassword');

    if (!password || !repeated) return null;

    if (password.value && repeated.value && password.value !== repeated.value) {
      repeated.setErrors({ passwordMismatch: true });
    } else {
      const { passwordMismatch, ...otherErrors } = repeated.errors || {};
      repeated.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return null;
  }
}
