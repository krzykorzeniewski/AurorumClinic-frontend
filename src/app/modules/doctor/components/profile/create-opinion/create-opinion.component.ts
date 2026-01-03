import { Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OpinionService } from '../../../../core/services/opinion.service';
import { FormsService } from '../../../../core/services/forms.service';
import {
  AnswerOpinionDoctor,
  Opinion,
} from '../../../../core/models/opinion.model';
import { OpinionCardComponent } from '../../../shared/opinion-card/opinion-card.component';

@Component({
  selector: 'app-create-opinion-doctor',
  standalone: true,
  imports: [
    AlertComponent,
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
    OpinionCardComponent,
  ],
  templateUrl: './create-opinion.component.html',
  styleUrl: './create-opinion.component.css',
})
export class CreateOpinionComponent {
  private _opinionService = inject(OpinionService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  opinionForm = this._formService.getOpinionDoctorForm();
  opinion = signal<Opinion | null>(null);
  message = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { opinion: Opinion };

    if (!state?.opinion) {
      void this._router.navigate(['/doctor/profile']);
    }
    this.opinion.set(state.opinion);
  }

  onSubmit(): void {
    if (this.opinionForm.invalid) {
      return;
    }
    const opinion = this.opinion();
    if (!opinion) return;

    const formValue = this.opinionForm.getRawValue();

    const opinionData: AnswerOpinionDoctor = {
      answer: formValue.answer,
    };

    this._opinionService
      .createDoctorAnswerToOpinion(opinion.id, opinionData)
      .subscribe({
        next: () => {
          void this._router.navigate(['/doctor/profile'], {
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

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  get controls() {
    return this.opinionForm.controls;
  }
}
