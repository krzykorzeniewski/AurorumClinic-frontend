import {Routes} from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/profile/profile.component').then((c) => c.ProfileComponent),
  }
];
