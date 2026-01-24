import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenVerifyRequest } from '../../../core/models/auth.model';
import { ResendCooldownService } from '../../../core/services/resend-cooldown.service';

@Component({
  selector: 'app-account-activation',
  standalone: true,
  imports: [],
  templateUrl: './account-activation.component.html',
})
export class AccountActivationComponent implements OnInit {
  private _authService = inject(AuthService);
  private _cooldownService = inject(ResendCooldownService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  ngOnInit(): void {
    const token = this._route.snapshot.paramMap.get('uid');
    const email = this._route.snapshot.queryParamMap.get('email');

    if (!token || !email) {
      this.redirectAndShowMessage(
        'Twój link weryfikacyjny jest nieprawidłowy.',
        'warning',
      );
      return;
    }

    const tokenRequest: TokenVerifyRequest = { token, email };

    this._authService.activateAccount(tokenRequest).subscribe({
      next: () => {
        localStorage.removeItem('verified');
        this._cooldownService.clear('email_verify_resend');
        this.redirectAndShowMessage('Konto aktywowane pomyślnie!', 'success');
      },
      error: () => {
        this.redirectAndShowMessage(
          'Twój link weryfikacyjny jest nieprawidłowy.',
          'warning',
        );
      },
    });
  }

  private redirectAndShowMessage(message: string, variant: string) {
    void this._router.navigate(['/auth/login'], {
      state: {
        message: message,
        variant: variant,
      },
    });
  }
}
