import { Component, inject, signal } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { NewsletterService } from '../../../../core/services/newsletter.service';
import { NewsletterMessageResponse } from '../../../../core/models/newsletter.model';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter-details',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    RouterLink,
    CdkTextareaAutosize,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './newsletter-details.component.html',
})
export class NewsletterDetailsComponent {
  private _newsletterService = inject(NewsletterService);
  private _router = inject(Router);

  newsletter = signal<NewsletterMessageResponse | null>(null);
  canModify = signal(false);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { newsletterId: number };

    if (!state?.newsletterId) {
      void this._router.navigate(['/internal/newsletter']);
      return;
    }

    this._newsletterService.getMessageById(state.newsletterId).subscribe({
      next: (res) => {
        this.newsletter.set(res);
      },
      error: () => {
        void this._router.navigate(['/internal/newsletter']);
      },
    });
  }
}
