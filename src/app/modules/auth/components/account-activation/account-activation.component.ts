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
    this._route.paramMap.subscribe({
      next: (param) => {
        const token = param.get('uid');
        const email = localStorage.getItem('email');

        if (token && email) {
          const tokenRequest: TokenVerifyRequest = { token, email };
          this._authService.activateAccount(tokenRequest).subscribe({
            next: () => {
              this.redirectAndShowMessage(
                'Konto aktywowane pomyślnie!',
                'success',
              );
            },
            error: () => {
              this.redirectAndShowMessage(
                'Twój link weryfikacyjny jest nieprawidłowy.',
                'warning',
              );
            },
          });
        } else {
          this.redirectAndShowMessage(
            'Twój link weryfikacyjny jest nieprawidłowy.',
            'warning',
          );
        }
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
