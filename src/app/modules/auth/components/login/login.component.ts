import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { UserLoginDataRequest } from '../../../core/models/user.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsService } from '../../../core/services/forms.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent{
  private _authService = inject(AuthService);
  private _formService = inject(FormsService);
  private _router = inject(Router);
  readonly loginForm = this._formService.getLoginForm();
  hidePassword = signal(true);
  errorMessage = signal('');

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this.errorMessage.set(navigation.extras.state['message']);
    }
  }

  onLogin(): void{
    const userData: UserLoginDataRequest = this.loginForm.value as UserLoginDataRequest;

    this._authService.login(userData).subscribe({
      next: () => {
        void this._router.navigate(["/home"]);
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
