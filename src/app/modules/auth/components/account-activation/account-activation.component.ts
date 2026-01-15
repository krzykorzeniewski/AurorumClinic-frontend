import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenVerifyRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-account-activation',
  standalone: true,
  imports: [],
  templateUrl: './account-activation.component.html',
  styleUrl: './account-activation.component.css',
})
export class AccountActivationComponent implements OnInit {
  private _authService = inject(AuthService);
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
