import { Component, inject, signal } from '@angular/core';
import { FormsService } from '../../../../core/services/forms.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NewsletterService } from '../../../../core/services/newsletter.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewsletterDialogComponent } from './create-newsletter-dialog/create-newsletter-dialog.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-newsletter-prompt',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    CdkTextareaAutosize,
  ],
  templateUrl: './newsletter-prompt.component.html',
  styleUrl: './newsletter-prompt.component.css',
})
export class NewsletterPromptComponent {
  private _newsletterService = inject(NewsletterService);
  private _formService = inject(FormsService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  promptForm = new FormControl('');
  message = signal('');

  onSubmit() {
    this._newsletterService
      .createNewNewsletterMessagePrompt(this.promptForm.value)
      .subscribe({
        next: (res) => {
          const dialogRef = this._dialog.open(CreateNewsletterDialogComponent, {
            data: {
              newsletter: res.data,
            },
            disableClose: true,
            maxWidth: '800px',
            minWidth: '600px',
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result?.approved) {
              void this._router.navigate(['/internal/newsletter'], {
                state: {
                  message: 'Pomyślnie utworzono wpis i dodano go do wysyłki.',
                  status: 'success',
                },
              });
            } else {
              void this._router.navigate(['/internal/newsletter'], {
                state: {
                  message: 'Odrzucono wpis i został dodany do historii.',
                  status: 'success',
                },
              });
            }
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
}
