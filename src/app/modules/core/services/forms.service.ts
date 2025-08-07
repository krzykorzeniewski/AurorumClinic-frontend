import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  getErrorMessage(control: FormControl): string {
    if(control.hasError('required')){
      return 'To pole jest wymagane.';
    }
    if (control.hasError('email')) {
      return 'Niepoprawny adres email.';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      return `Minimalna długość to ${requiredLength} znaków.`;
    }
    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;
      return `Maksymalna długość to ${requiredLength} znaków.`;
    }
    if (control.hasError('min')) {
      return 'Wartość jest za mała.';
    }
    if (control.hasError('max')) {
      return 'Wartość jest za duża.';
    }
    if (control.hasError('passwordMismatch')) {
      return 'Hasła się nie zgadzają.';
    }
    if (control.hasError('invalidDate')) {
      return 'Niepoprawna data.';
    }
    if (control.hasError('futureDate')) {
      return 'Data urodzenia nie może być w przyszłości.';
    }
    if (control.hasError('invalidPhone')) {
      return 'Numer telefonu musi zawierać dokładnie 9 cyfr.';
    }

    return 'Niepoprawna wartość';
  }
}
