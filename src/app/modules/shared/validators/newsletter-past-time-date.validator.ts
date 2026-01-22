import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function newsletterDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateControl = control.get('date');
    const timeControl = control.get('time');

    if (!dateControl || !timeControl) {
      return null;
    }

    const date: Date | null = dateControl.value;
    const time: Date | null = timeControl.value;

    if (!date || !time) {
      return null;
    }

    const planned = new Date(date);
    planned.setHours(time.getHours(), time.getMinutes(), 0, 0);

    const now = new Date();

    if (planned <= now) {
      timeControl.setErrors({ plannedDateInPast: true });
    }

    return null;
  };
}
