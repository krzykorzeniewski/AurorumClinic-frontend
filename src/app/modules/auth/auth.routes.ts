import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: 'recover',
    loadChildren: () =>
      import('./components/password-recovery/password-recovery.component').then((c) => c.PasswordRecoveryComponent),
  },
  {
    path: 'recover/:uid',
    loadChildren: () =>
      import('./components/password-recovery-form/password-recovery-form.component').then((c) => c.PasswordRecoveryFormComponent),
  },
  {
    path: 'account-activate/:uid',
    loadComponent: () =>
      import('./components/account-activation/account-activation.component').then((c) => c.AccountActivationComponent),
  }
];
