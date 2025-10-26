import { Routes } from '@angular/router';
import { isLoggedInGuard } from './modules/core/guards/is-logged-in.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
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
    canActivate: [isLoggedInGuard],
    loadChildren: () =>
      import('./modules/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'appointment',
    canActivate: [isLoggedInGuard],
    loadChildren: () =>
      import('./modules/appointment/appointment.routes').then(
        (m) => m.APPOINTMENT_ROUTES,
      ),
  },
];
