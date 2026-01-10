import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsService } from '../../../core/services/forms.service';
import { UserService } from '../../../core/services/user.service';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import {
  communicationPreferences,
  GetUserProfileResponse,
  PatchUserRequest,
  UpdateEmailTokenRequest,
  UpdatePhoneTokenRequest,
} from '../../../core/models/user.model';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
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
import { EditEmailDialogComponent } from './edit-email-dialog/edit-email-dialog.component';
import { Router } from '@angular/router';
import { EditPhoneDialogComponent } from './edit-phone-dialog/edit-phone-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { SetupTwoFactorDialogComponent } from './setup-two-factor-dialog/setup-two-factor-dialog.component';
import { GetPatientResponse } from '../../../core/models/patient.model';
import { DeleteTwoFactorDialogComponent } from './delete-two-factor-dialog/delete-two-factor-dialog.component';
import { EditPasswordDialogComponent } from './edit-password-dialog/edit-password-dialog.component';
import { map } from 'rxjs';
import { UserRoleMap } from '../../../core/models/auth.model';

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
    AlertComponent,
    MatIcon,
    AsyncPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  emailProfileForm = this._formService.getFulfilledEmailProfileForm(null);
  phoneProfileForm = this._formService.getFulfilledPhoneProfileForm(null);
  additionalInformationProfileForm =
    this._formService.getFulfilledAdditionalInformationProfileForm(null);
  userResponse!: GetPatientResponse | GetUserProfileResponse | null;
  protected readonly communicationPreferences = communicationPreferences;
  variant = signal<AlertVariant>('warning');
  infoMessage = signal('');
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  isPatient$ = this._authService.user$.pipe(
    map((user) => user?.role === UserRoleMap.PATIENT),
  );

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this.variant.set(navigation.extras.state['variant']);
      this.infoMessage.set(navigation.extras.state['message']);
    }
  }

  ngOnInit() {
    this.getUserProfileInformation();
  }

  onUpdateEmail() {
    const updatedEmail: UpdateEmailTokenRequest = {
      email: this.emailProfileForm.value.email,
    };

    this._userService.updateUserEmailToken(updatedEmail).subscribe({
      next: () => {
        const dialogRef = this._dialog.open(EditEmailDialogComponent, {
          data: {
            oldEmail: this.userResponse?.email,
            updatedEmail: updatedEmail,
          },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.success) {
            this.getUserProfileInformation();
            this.variant.set('success');
            this.infoMessage.set(result.message);
          }
        });
      },
      error: (err) => {
        this.accordion.closeAll();
        this.infoMessage.set(err.message);
      },
    });
  }

  onUpdatePhone() {
    const updatedPhone: UpdatePhoneTokenRequest = {
      phoneNumber: this.phoneProfileForm.value.phoneNumber,
    };

    this._userService.updateUserPhoneToken(updatedPhone).subscribe({
      next: () => {
        const dialogRef = this._dialog.open(EditPhoneDialogComponent, {
          data: {
            oldPhone: this.userResponse?.phoneNumber,
            updatedPhone: updatedPhone,
          },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.success) {
            this.getUserProfileInformation();
            this.variant.set('success');
            this.infoMessage.set(result.message);
          }
        });
      },
      error: (err) => {
        this.accordion.closeAll();
        this.infoMessage.set(err.message);
      },
    });
  }

  onVerifyPhone() {
    const currentPhone: UpdatePhoneTokenRequest = {
      phoneNumber: this.userResponse?.phoneNumber,
    };

    this._authService.verifyUserPhoneToken(currentPhone).subscribe({
      next: () => {
        const dialogRef = this._dialog.open(EditPhoneDialogComponent, {
          data: {
            oldPhone: this.userResponse?.phoneNumber,
            updatedPhone: currentPhone,
          },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.success) {
            this.getUserProfileInformation();
            this.variant.set('success');
            this.infoMessage.set(result.message);
          }
        });
      },
      error: (err) => {
        this.accordion.closeAll();
        this.infoMessage.set(err.message);
      },
    });
  }

  onTwoFactorSetup() {
    this._userService.setupTwoFactorAuthorizationToken().subscribe({
      next: () => {
        const dialogRef = this._dialog.open(SetupTwoFactorDialogComponent, {
          data: {
            phoneNumber: this.userResponse?.phoneNumber,
          },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.success) {
            this.getUserProfileInformation();
            this.variant.set('success');
            this.infoMessage.set(result.message);
          }
        });
      },
      error: (err) => {
        this.accordion.closeAll();
        this.infoMessage.set(err.message);
      },
    });
  }

  onTwoFactorDelete() {
    const dialogRef = this._dialog.open(DeleteTwoFactorDialogComponent, {
      disableClose: true,
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.getUserProfileInformation();
        this.variant.set('success');
        this.infoMessage.set(result.message);
        this.accordion.closeAll();
      }
    });
  }

  onPasswordChange() {
    const dialogRef = this._dialog.open(EditPasswordDialogComponent, {
      disableClose: true,
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.getUserProfileInformation();
        this.variant.set('success');
        this.infoMessage.set(result.message);
        this.accordion.closeAll();
      }
    });
  }

  onUpdateAdditional() {
    const updatedData = this.additionalInformationProfileForm
      .value as PatchUserRequest;

    this._userService.patchUser(updatedData).subscribe({
      next: (userResponse) => {
        this.completeAllForm(userResponse);
        this.variant.set('success');
        this.infoMessage.set('Twoje preferencje zostały zmienione');
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

  private getUserProfileInformation() {
    this._userService.getUser().subscribe({
      next: (userResponse) => {
        this.completeAllForm(userResponse);
      },
      error: (err) => {
        this.userResponse = null;
        this.infoMessage.set(err.message);
      },
    });
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get emailControl() {
    return this.emailProfileForm.controls;
  }

  get phoneControl() {
    return this.phoneProfileForm.controls;
  }

  get additionalInfoControls() {
    return this.additionalInformationProfileForm.controls;
  }

  get isAdditionalInfoDisabled(): boolean {
    if (
      !this.userResponse ||
      !this.isPatient(this.userResponse) ||
      !this.additionalInformationProfileForm
    ) {
      return true;
    }

    const patient = this.userResponse;
    const controls = this.additionalInfoControls;

    return (
      (patient.communicationPreferences ===
        controls.communicationPreferences.value &&
        patient.newsletter === controls.newsletter.value) ||
      this.additionalInformationProfileForm.invalid
    );
  }

  private completeAllForm(
    userResponse: GetPatientResponse | GetUserProfileResponse,
  ) {
    this.emailProfileForm =
      this._formService.getFulfilledEmailProfileForm(userResponse);
    this.phoneProfileForm =
      this._formService.getFulfilledPhoneProfileForm(userResponse);
    if (this.isPatient(userResponse)) {
      this.additionalInformationProfileForm =
        this._formService.getFulfilledAdditionalInformationProfileForm(
          userResponse,
        );
    }
    this.userResponse = userResponse;
  }

  private isPatient(
    user: GetPatientResponse | GetUserProfileResponse,
  ): user is GetPatientResponse {
    return 'communicationPreferences' in user;
  }
}
