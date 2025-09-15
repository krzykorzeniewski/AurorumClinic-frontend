import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
        if (token) {
          this._authService.activateAccount(token).subscribe({
            next: () => {
              void this._router.navigate(['/auth/login'], {
                state: {
                  message: 'Konto aktywowane pomyślnie!',
                  variant: 'success',
                },
              });
            },
            error: () => {
              void this._router.navigate(['/auth/login'], {
                state: {
                  message: 'Twój link weryfikacyjny jest nieprawidłowy.',
                  variant: 'warning',
                },
              });
            },
          });
        }
      },
    });
  }
}
