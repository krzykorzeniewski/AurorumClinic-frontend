import { Routes } from '@angular/router';
import { authActivateGuard } from './modules/core/guards/auth-activate.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import('./modules/home/search-result/search-result.component').then(
        (c) => c.SearchResultComponent,
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [authActivateGuard],
    loadChildren: () =>
      import('./modules/user/user.routes').then((m) => m.USER_ROUTES),
  },
];
