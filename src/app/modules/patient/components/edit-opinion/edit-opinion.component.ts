import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OpinionService } from '../../../core/services/opinion.service';
import { FormsService } from '../../../core/services/forms.service';
import {
  CreateOpinionPatient,
  UpdateOpinionPatient,
} from '../../../core/models/opinion.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-opinion-patient',
  standalone: true,
  imports: [
    AlertComponent,
    CdkTextareaAutosize,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './edit-opinion.component.html',
  styleUrl: './edit-opinion.component.css',
})
export class EditOpinionComponent {
  private _opinionService = inject(OpinionService);
  private _destroyRef = inject(DestroyRef);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  opinionForm = this._formService.getOpinionPatientForm();
  opinionId = signal<number | null>(null);
  rating = signal(0);
  message = signal('');

  stars = [1, 2, 3, 4, 5];

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      opinionId: number;
      opinion: UpdateOpinionPatient;
    };

    if (!state?.opinionId && !state?.opinion) {
      void this._router.navigate(['']);
    }

    this.opinionId.set(state.opinionId);
    this.rating.set(state.opinion.rating);
    this.opinionForm.patchValue({
      rating: state.opinion.rating,
      comment: state.opinion.comment,
    });

    const ratingControl = this.opinionForm.controls.rating;

    this.rating.set(ratingControl.value);

    ratingControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this.rating.set(value);
      });
  }

  onSubmit(): void {
    if (this.opinionForm.invalid) {
      return;
    }
    const opinionId = this.opinionId();
    if (!opinionId) return;

    const formValue = this.opinionForm.getRawValue();

    const opinionData: CreateOpinionPatient = {
      rating: this.rating(),
      comment: formValue.comment,
    };

    this._opinionService
      .patchDoctorOpinionByPatient(opinionId, opinionData)
      .subscribe({
        next: () => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: 'Pomyślnie edytowano opinię',
              status: 'success',
            },
          });
        },
        error: (err) => {
          this.message.set(err.message);
        },
      });
  }

  setRating(value: number) {
    this.opinionForm.controls.rating.setValue(value);
    this.opinionForm.controls.rating.markAsTouched();
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.opinionForm.controls;
  }
}
