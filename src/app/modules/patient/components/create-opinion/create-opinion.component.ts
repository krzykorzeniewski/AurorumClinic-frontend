import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgForOf, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsService } from '../../../core/services/forms.service';
import { Router, RouterLink } from '@angular/router';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { Appointment } from '../../../core/models/appointment.model';
import { MatIcon } from '@angular/material/icon';
import { OpinionService } from '../../../core/services/opinion.service';
import { CreateOpinionPatient } from '../../../core/models/opinion.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputRefDirective } from '../../../shared/directives/input-ref.directive';

@Component({
  selector: 'app-create-opinion-patient',
  standalone: true,
  imports: [
    CdkTextareaAutosize,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    DoctorCardComponent,
    MatIcon,
    NgForOf,
    AlertComponent,
    InputRefDirective,
  ],
  templateUrl: './create-opinion.component.html',
})
export class CreateOpinionComponent {
  private _opinionService = inject(OpinionService);
  private _destroyRef = inject(DestroyRef);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  opinionForm = this._formService.getOpinionPatientForm();
  appointment = signal<Appointment | null>(null);
  rating = signal(0);
  message = signal('');

  stars = [1, 2, 3, 4, 5];

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { appointment: Appointment };

    if (!state?.appointment) {
      void this._router.navigate(['/profile/appointments']);
    }

    this.appointment.set(state.appointment);

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
    const appointment = this.appointment();
    if (!appointment) return;

    const formValue = this.opinionForm.getRawValue();

    const opinionData: CreateOpinionPatient = {
      rating: this.rating(),
      comment: formValue.comment,
    };

    this._opinionService
      .createDoctorOpinionByPatient(appointment.id, opinionData)
      .subscribe({
        next: () => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: 'Pomyślnie zamieszczono opinię',
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
