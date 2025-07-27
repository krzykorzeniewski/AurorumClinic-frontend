import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { UserLoginDataRequest } from '../../../core/models/user.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatIconModule
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
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  private _authService = inject(AuthService);
  private _router = inject(Router);
  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  hidePassword = signal(true);

  constructor() {
    merge(this.controls.email.statusChanges, this.controls.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessageEmail());
    merge(this.controls.password.statusChanges, this.controls.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessagePassword());
  }

  updateErrorMessageEmail() {
    if (this.controls.email.hasError('required')) {
      this.errorMessageEmail.set('Adres email jest wymagany');
    } else if (this.controls.email.hasError('email')) {
      this.errorMessageEmail.set('Niepoprawny email');
    } else {
      this.errorMessageEmail.set('');
    }
  }

  updateErrorMessagePassword() {
    if (this.controls.password.hasError('required')) {
      this.errorMessagePassword.set('Hasło jest wymagane');
    } else {
      this.errorMessagePassword.set('');
    }
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  get controls() {
    return this.loginForm.controls;
  }

  onLogin(): void{
    const userData: UserLoginDataRequest = this.loginForm.value as UserLoginDataRequest;

    this._authService.login(userData).subscribe({
      next: (user) => {
        console.log(user);
        this._router.navigate(["/home"]);
      },
      error: (err) => console.log(err),
    });
  }
}
