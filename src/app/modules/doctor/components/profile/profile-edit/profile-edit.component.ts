import { Component, inject } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsService } from '../../../../core/services/forms.service';
import { UpdateDoctorProfileData } from '../../../../core/models/doctor.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { UserService } from '../../../../core/services/user.service';
import { environment } from '../../../../../../environments/environment';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatCard,
    MatCardTitle,
    MatCardContent,
    CdkTextareaAutosize,
    MatError,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
})
export class ProfileEditComponent {
  private _userService = inject(UserService);
  private _formService = inject(FormsService);
  private _location = inject(Location);
  private _router = inject(Router);
  profileForm = this._formService.getFulfilledUpdateDoctorProfileForm(
    null,
    null,
  );
  imagePreview: string | null = null;
  selectedImage: File | null = null;

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      doctorImage: string;
      experience: string;
      education: string;
      description: string;
    };

    if (
      !state?.doctorImage &&
      !state?.experience &&
      !state?.education &&
      !state?.description
    ) {
      void this._router.navigate(['']);
      return;
    }

    const doctorData: UpdateDoctorProfileData = {
      experience: state.experience,
      education: state.education,
      description: state.description,
    };

    this.profileForm = this._formService.getFulfilledUpdateDoctorProfileForm(
      state.doctorImage,
      doctorData,
    );
    this.imagePreview = state.doctorImage;
  }

  defaultImage() {
    this.selectedImage = null;

    this.imagePreview = environment.defaultDoctorProfilePicture;

    this.profileForm.patchValue({
      doctorImage: null,
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.profileForm.patchValue({
        doctorImage: this.imagePreview,
      });
    };
    reader.readAsDataURL(file);
  }

  goBack(): void {
    this._location.back();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const formValue = this.profileForm.getRawValue();

    const doctorData: UpdateDoctorProfileData = {
      experience: formValue.experience || '',
      education: formValue.education || '',
      description: formValue.description || '',
    };

    this._userService
      .updateDoctorProfile(this.selectedImage, doctorData)
      .subscribe({
        next: (response) => {
          void this._router.navigate(['/doctor/profile'], {
            state: { doctorId: response.data.doctorId },
          });
        },
      });
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.profileForm.controls;
  }
}
