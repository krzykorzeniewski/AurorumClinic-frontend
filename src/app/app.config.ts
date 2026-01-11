import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { APP_ROUTES } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { spinnerInterceptor } from './modules/core/interceptors/spinner.interceptor';
import { autologinInterceptor } from './modules/core/interceptors/autologin.interceptor';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { csrfInterceptor } from './modules/core/interceptors/csrf.interceptor';

registerLocaleData(localePl, 'pl');

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([
        spinnerInterceptor,
        autologinInterceptor,
        csrfInterceptor,
      ]),
      withXsrfConfiguration({
        cookieName: 'X-XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: LOCALE_ID, useValue: 'pl' },
  ],
};
