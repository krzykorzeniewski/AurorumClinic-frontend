import { Component, inject, signal } from '@angular/core';
import {
  AlertComponent,
  AlertVariant,
} from '../../../../../shared/components/alert/alert.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormsService } from '../../../../../core/services/forms.service';
import {
  CreateNewsletter,
  UpdateNewsletterMessagePrompt,
} from '../../../../../core/models/newsletter.model';
import { toLocalISOString } from '../../../../../shared/methods/dateTransform';
import { NewsletterService } from '../../../../../core/services/newsletter.service';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { environment } from '../../../../../../../environments/environment.development';

@Component({
  selector: 'app-create-newsletter-dialog',
  standalone: true,
  imports: [
    AlertComponent,
    CdkTextareaAutosize,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    ReactiveFormsModule,
  ],
  templateUrl: './create-newsletter-dialog.component.html',
  styleUrl: './create-newsletter-dialog.component.css',
})
export class CreateNewsletterDialogComponent {
  private _newsletterService = inject(NewsletterService);
  private _formService = inject(FormsService);
  private _dialogRef = inject(MatDialogRef<CreateNewsletterDialogComponent>);
  createForm = this._formService.getReviewPromptForm();
  infoMessage = signal('');
  variant = signal<AlertVariant>('warning');
  readonly data = inject<{
    newsletter: CreateNewsletter;
  }>(MAT_DIALOG_DATA);

  constructor() {
    this.createForm.patchValue({
      subject: this.data.newsletter.subject,
      text: this.data.newsletter.text,
    });
  }

  onSubmit(approved: boolean) {
    let data: UpdateNewsletterMessagePrompt;

    if (approved) {
      if (this.createForm.invalid) return;
      const fullDate = new Date(this.createForm.value.date!);
      const time = this.createForm.value.time!;

      fullDate.setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds(),
      );

      data = {
        subject: this.createForm.value.subject!,
        text: this.createForm.value.text!,
        approved: approved,
        scheduledAt: toLocalISOString(fullDate),
      };
    } else {
      data = {
        subject: this.createForm.value.subject!,
        text: this.createForm.value.text!,
        approved: approved,
      };
    }

    this._newsletterService
      .reviewMessagePrompt(this.data.newsletter.id, data)
      .subscribe({
        next: () => {
          this._dialogRef.close({
            approved: approved,
          });
        },
        error: (err) => {
          this.infoMessage.set(err.message);
        },
      });
  }

  get controls() {
    return this.createForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  protected readonly environmentVariables = environment;
}
