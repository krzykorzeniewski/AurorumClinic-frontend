import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AlertComponent,
  AlertVariant,
} from '../../../shared/components/alert/alert.component';
import { FormsService } from '../../../core/services/forms.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  UserLoginDataTwoFactorRequest,
  UserLoginDataTwoFactorTokenRequest,
  UserRoleMap,
} from '../../../core/models/auth.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ChatService } from '../../../core/services/chat.service';
import { ResendCooldownService } from '../../../core/services/resend-cooldown.service';

@Component({
  selector: 'app-two-factor-login',
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
    MatFormField,
    ReactiveFormsModule,
  ],
  templateUrl: './two-factor-login.component.html',
})
export class TwoFactorLoginComponent implements OnInit {
  private _authService = inject(AuthService);
  private _cooldownService = inject(ResendCooldownService);
  private _router = inject(Router);
  private _formService = inject(FormsService);
  private _chatService = inject(ChatService);
  private _email!: UserLoginDataTwoFactorTokenRequest;
  readonly confirmForm = this._formService.getCodeVerificationForm();
  message = signal('');
  variant = signal<AlertVariant>('warning');
  timer = signal<number>(0);
  canResend = computed(() => this.timer() === 0);

  constructor() {
    const nav = this._router.getCurrentNavigation();
    const state = nav?.extras.state;

    if (!state?.['fromLogin'] || !state?.['email']) {
      void this._router.navigate(['/auth/login']);
      return;
    }

    this._email = { email: state['email'] };
  }

  ngOnInit(): void {
    this.timer = this._cooldownService.init('two_factor_resend');

    if (this.timer() === 0) {
      this.sendTwoFactorToken();
    }
  }

  onResend() {
    if (!this.canResend()) return;
    this.sendTwoFactorToken();
  }

  onTwoFactorLogin() {
    if (this.confirmForm.invalid) return;

    const token: UserLoginDataTwoFactorRequest = {
      email: this._email.email,
      token: this.confirmForm.value,
    };

    this._authService.loginTwoFactor(token).subscribe({
      next: (user) => {
        const isDoctorOrPatient =
          user.role === UserRoleMap.DOCTOR || user.role === UserRoleMap.PATIENT;

        if (isDoctorOrPatient) {
          this._chatService.connect();
        }

        this._cooldownService.clear('two_factor_resend');
        this._authService.redirectAfterLogin();
      },
      error: (err) => {
        this.message.set(err.message);
      },
    });
  }

  private sendTwoFactorToken() {
    this._authService.loginTwoFactorToken(this._email).subscribe({
      next: () => {
        this._cooldownService.start('two_factor_resend', 120);
        this.timer = this._cooldownService.getTimer('two_factor_resend')!;
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
