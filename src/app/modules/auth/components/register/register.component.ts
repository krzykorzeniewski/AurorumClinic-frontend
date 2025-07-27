import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateValidator } from '../../../shared/validators/date.validator';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButton,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly registerForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.maxLength(50),
        Validators.required
      ],
      nonNullable: true
    }),
    surname: new FormControl('', {
      validators: [
        Validators.maxLength(50),
        Validators.required
      ],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [
        Validators.email,
        Validators.maxLength(100),
        Validators.required
      ],
      nonNullable: true
    }),
    pesel: new FormControl('', {
      validators: [
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
      nonNullable: false
    }),
    phone: new FormControl('', {
      validators: [
        Validators.email,
        Validators.maxLength(11),
        Validators.required
      ],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [
        Validators.maxLength(200),
        Validators.required
      ],
      nonNullable: true
    }),
    repeatedPassword: new FormControl('', {
      validators: [
        Validators.maxLength(200),
        Validators.required
      ],
      nonNullable: true
    }),
    birthdate: new FormControl('', {
      validators: [
        dateValidator(),
        Validators.required
      ],
      nonNullable: true
    }),
  });
  hasPesel: WritableSignal<boolean> = signal(true);

  onRegister(): void {
    console.log('onRegister');
  }

  peselCheckbox(): void {
    this.hasPesel.set(!this.hasPesel());
    if (!this.hasPesel()){
      this.registerForm.controls['pesel'].disable();
    } else {
      this.registerForm.controls['pesel'].enable();
    }
  }

  get controls() {
    return this.registerForm.controls;
  }
}
