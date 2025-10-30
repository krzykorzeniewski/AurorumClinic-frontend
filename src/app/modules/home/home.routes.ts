import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import('./search-result/search-result.component').then(
        (c) => c.SearchResultComponent,
      ),
  },
];
