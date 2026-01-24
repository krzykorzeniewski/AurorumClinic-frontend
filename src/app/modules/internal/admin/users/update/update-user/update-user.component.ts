import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsService } from '../../../../../core/services/forms.service';
import { Location, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import {
  GetUserApiResponse,
  UpdateUser,
} from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';
import { UserRole } from '../../../../../core/models/auth.model';
import { InputRefDirective } from '../../../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    InputRefDirective,
  ],
  templateUrl: './update-user.component.html',
})
export class UpdateUserComponent {
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _location = inject(Location);
  private _router = inject(Router);
  user!: GetUserApiResponse;
  role!: UserRole;
  private initialFormValues: any = null;
  userForm = this._formService.getFulfilledUserProfileForm(null);
  hasPesel: WritableSignal<boolean> = signal(true);
  errorMessage = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      userId: number;
      role: UserRole;
    };
    if (!state?.userId || !state?.role) {
      void this._router.navigate(['/internal/users']);
      return;
    }

    this.role = state.role;

    this._userService.getUserByIdByUser(state?.userId).subscribe({
      next: (res) => {
        this.user = res;
        this.userForm = this._formService.getFulfilledUserProfileForm(res);

        if (!res.pesel) {
          this.peselCheckbox();
        }

        this.initialFormValues = this.userForm.getRawValue();
      },
      error: () => {
        void this._router.navigate(['/internal/users']);
      },
    });
  }

  onUserUpdate() {
    const formValue = this.userForm.value;

    const patientData: UpdateUser = {
      name: formValue.firstName!,
      surname: formValue.surname!,
      pesel: formValue.pesel || null,
      birthdate: formValue.birthdate!.toLocaleDateString('sv-SE'),
      email: formValue.email!,
      phoneNumber: formValue.phoneNumber!,
      twoFactorAuth: formValue.twoFactorAuth!,
    };

    this._userService.updateUser(this.user.id, patientData).subscribe({
      next: () => {
        void this._router.navigate([`/internal/users`], {
          state: {
            message: 'Pomyślnie zmieniono dane',
            status: 'success',
          },
        });
      },
      error: (err) => this.errorMessage.set(err.message),
    });
  }

  peselCheckbox(): void {
    this.hasPesel.set(!this.hasPesel());
    const peselControl = this.userForm.controls['pesel'];

    if (!this.hasPesel()) {
      peselControl.disable();
      peselControl.clearValidators();
      peselControl.setValue(null);
    } else {
      peselControl.enable();
      peselControl.setValue(this.user.pesel);
      peselControl.setValidators([
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.required,
      ]);
    }

    peselControl.updateValueAndValidity();
  }

  goBack() {
    this._location.back();
  }

  get controls() {
    return this.userForm.controls;
  }

  get noChangesDetected(): boolean {
    if (!this.initialFormValues) return true;

    return (
      JSON.stringify(this.userForm.getRawValue()) ===
      JSON.stringify(this.initialFormValues)
    );
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  protected readonly UserRole = UserRole;
}
