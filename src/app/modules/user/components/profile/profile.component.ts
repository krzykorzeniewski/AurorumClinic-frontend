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
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import {
  communicationPreferences,
  GetPatientResponse,
  PatchUserRequest,
  UpdateEmailTokenRequest,
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
import { EditEmailDialogComponent } from './edit-email-dialog/edit-email-dialog.component';
import { Router } from '@angular/router';

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
  userResponse!: GetPatientResponse | null;
  protected readonly communicationPreferences = communicationPreferences;
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');
  @ViewChild(MatAccordion) accordion!: MatAccordion;

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
    const updatedEmail = this.emailProfileForm.value as UpdateEmailTokenRequest;

    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.updateUserEmailToken(
              user.userId,
              updatedEmail,
            );
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

  onUpdateAdditional() {
    const updatedData = this.additionalInformationProfileForm
      .value as PatchUserRequest;

    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.patchUser(user.userId, updatedData);
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
          this.completeAllForm(userResponse);
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
    this._authService.user$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.userId === curr?.userId),
        switchMap((user) => {
          if (user?.userId) {
            return this._userService.getUser(user.userId);
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

  private completeAllForm(userResponse: GetPatientResponse) {
    this.emailProfileForm =
      this._formService.getFulfilledEmailProfileForm(userResponse);
    this.phoneProfileForm =
      this._formService.getFulfilledPhoneProfileForm(userResponse);
    this.additionalInformationProfileForm =
      this._formService.getFulfilledAdditionalInformationProfileForm(
        userResponse,
      );
    this.userResponse = userResponse;
  }
}
