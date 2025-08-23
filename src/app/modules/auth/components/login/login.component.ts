import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { UserLoginDataRequest } from '../../../core/models/user.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsService } from '../../../core/services/forms.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatIcon,
    MatButton,
    RouterLink,
    MatInput,
    MatIconButton,
    MatError,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AlertComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent{
  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.email,
        Validators.maxLength(100),
        Validators.required
      ],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [
        Validators.maxLength(200),
        Validators.required
      ],
      nonNullable: true,
    }),
  });
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formService = inject(FormsService);
  hidePassword = signal(true);
  errorMessage = signal('');

  onLogin(): void{
    const userData: UserLoginDataRequest = this.loginForm.value as UserLoginDataRequest;

    this._authService.login(userData).subscribe({
      next: () => {
        this._router.navigate(["/home"]);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
      },
    });
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  get controls() {
    return this.loginForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
