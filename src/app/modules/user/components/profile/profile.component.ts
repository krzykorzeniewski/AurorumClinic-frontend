import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsService } from '../../../core/services/forms.service';
import { UserService } from '../../../core/services/user.service';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import {
  communicationPreferences,
  GetPatientResponse,
  UpdatePatientRequest,
} from '../../../core/models/user.model';
import { DatePipe, NgIf } from '@angular/common';
import { distinctUntilChanged, switchMap, throwError } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import {
  AlertComponent,
  AlertVariant,
} from '../../../shared/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProfileDialogComponent } from './delete-profile-dialog/delete-profile-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatCardContent,
    MatCardTitle,
    MatCard,
    NgIf,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatButton,
    MatCardActions,
    AlertComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _dialog = inject(MatDialog);
  profileForm = this._formService.getFulfilledProfileForm(null);
  userResponse!: GetPatientResponse | null;
  protected readonly communicationPreferences = communicationPreferences;
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  ngOnInit(): void {
    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.getPatient(user.userId);
          } else {
            return throwError(
              () =>
                new Error(
                  'Wystąpił błąd autoryzacji. Spróbuj ponownie później.',
                ),
            );
          }
        }),
      )
      .subscribe({
        next: (userResponse) => {
          this.profileForm =
            this._formService.getFulfilledProfileForm(userResponse);
          this.userResponse = userResponse;
        },
        error: (err) => {
          this.userResponse = null;
          this.infoMessage.set(err.message);
        },
      });
  }

  onClear() {
    if (!this.userResponse) return;
    this.profileForm.reset({
      email: this.userResponse.email,
      phoneNumber: this.userResponse.phoneNumber,
      newsletter: this.userResponse.newsletter,
      communicationPreferences: this.userResponse.communicationPreferences,
    });
  }

  onUpdate() {
    if (!this.isFormChanged) return;

    const updatedData = this.profileForm.value as UpdatePatientRequest;

    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.updatePatient(user.userId, updatedData);
          } else {
            return throwError(
              () =>
                new Error(
                  'Wystąpił błąd autoryzacji. Spróbuj ponownie później.',
                ),
            );
          }
        }),
      )
      .subscribe({
        next: (userResponse) => {
          this.profileForm =
            this._formService.getFulfilledProfileForm(userResponse);
          this.userResponse = userResponse;
        },
        error: (err) => {
          this.accordion.closeAll();
          this.infoMessage.set(err.message);
        },
      });
  }

  openDeleteDialog() {
    this._dialog.open(DeleteProfileDialogComponent, {
      data: { userData: this.userResponse },
    });
  }

  get isFormChanged(): boolean {
    if (!this.userResponse || !this.profileForm) return false;

    const formValues = this.profileForm.value;
    return (
      formValues.email !== this.userResponse.email ||
      formValues.phoneNumber !== this.userResponse.phoneNumber ||
      formValues.newsletter !== this.userResponse.newsletter ||
      formValues.communicationPreferences !==
        this.userResponse.communicationPreferences
    );
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.profileForm.controls;
  }

  getCommunicationPreferenceLabel(
    pref: communicationPreferences | null,
  ): string {
    switch (pref) {
      case communicationPreferences.EMAIL:
        return 'Email';
      case communicationPreferences.PHONE_NUMBER:
        return 'Telefon';
      default:
        return '';
    }
  }
}
