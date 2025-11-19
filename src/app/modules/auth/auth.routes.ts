import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register-patient/register-patient.component').then(
        (c) => c.RegisterPatientComponent,
      ),
  },
  {
    path: 'recover',
    loadComponent: () =>
      import('./components/password-recovery/password-recovery.component').then(
        (c) => c.PasswordRecoveryComponent,
      ),
  },
  {
    path: 'recover/:uid',
    loadComponent: () =>
      import(
        './components/password-recovery-form/password-recovery-form.component'
      ).then((c) => c.PasswordRecoveryFormComponent),
  },
  {
    path: 'account-activate/:uid',
    loadComponent: () =>
      import(
        './components/account-activation/account-activation.component'
      ).then((c) => c.AccountActivationComponent),
  },
  {
    path: 'twoFactorAuthorization',
    loadComponent: () =>
      import('./components/two-factor-login/two-factor-login.component').then(
        (c) => c.TwoFactorLoginComponent,
      ),
  },
];
