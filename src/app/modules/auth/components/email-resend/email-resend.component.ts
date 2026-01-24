import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { VerifyEmailTokenRequest } from '../../../core/models/auth.model';
import { Location, NgIf } from '@angular/common';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatButton } from '@angular/material/button';
import { ResendCooldownService } from '../../../core/services/resend-cooldown.service';

@Component({
  selector: 'app-email-resend',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    AlertComponent,
    MatButton,
    RouterLink,
    NgIf,
  ],
  templateUrl: './email-resend.component.html',
})
export class EmailResendComponent {
  private _cooldownService = inject(ResendCooldownService);
  private _authService = inject(AuthService);
  private _location = inject(Location);
  private _router = inject(Router);
  message = signal('');
  email = signal('');
  canModify = signal(false);
  timer = signal(0);
  canResend = computed(() => this.timer() === 0);

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { email: string };

    if (!state?.email) {
      void this._router.navigate(['/auth/login']);
      return;
    }
    this.email.set(state?.email);
    this._location.replaceState('/auth/email-resend');

    this.timer = this._cooldownService.init('email_verify_resend');
    if (this.timer() === 0) {
      this._cooldownService.start('email_verify_resend', 5);
    }
  }

  onResend() {
    if (!this.canResend) return;

    if (localStorage.getItem('verified') === null) {
      void this._router.navigate(['/auth/login']);
      return;
    }

    const email = this.email();
    if (!email) void this._router.navigate(['/auth/login']);
    this.message.set('');

    const userData: VerifyEmailTokenRequest = { email };

    this._authService.verifyEmail(userData).subscribe({
      next: () => {
        this.message.set('Wysłano ponownie email weryfikacyjny');
        this._cooldownService.start('email_verify_resend', 5);
      },
      error: () => {
        void this._router.navigate(['/auth/login']);
      },
    });
  }
}
