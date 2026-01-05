import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeValidator(): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const startedAt = formControl.get('startedAt');
    const finishedAt = formControl.get('finishedAt');

    if (!startedAt || !finishedAt) return null;
    if (!startedAt.value || !finishedAt.value) return null;

    const start = new Date(startedAt.value).getTime();
    const end = new Date(finishedAt.value).getTime();

    if (start >= end) {
      finishedAt.setErrors({ timeRangeInvalid: true });
    } else {
      const { timeRangeInvalid, ...otherErrors } = finishedAt.errors || {};
      finishedAt.setErrors(
        Object.keys(otherErrors).length ? otherErrors : null,
      );
    }

    return null;
  };
}
