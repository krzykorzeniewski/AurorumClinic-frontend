import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    if (!value) return null;

    if (!/[A-Z]/.test(value)) {
      return { missingUpperCase: true };
    }

    if (!/[a-z]/.test(value)) {
      return { missingLowerCase: true };
    }

    if (!/[0-9]/.test(value)) {
      return { missingNumber: true };
    }

    if (value.length < 10) {
      return { minLength: { requiredLength: 10, actualLength: value.length } };
    }

    return null;
  };
}
