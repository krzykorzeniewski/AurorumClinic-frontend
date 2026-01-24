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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { spinnerInterceptor } from './modules/core/interceptors/spinner.interceptor';
import { autologinInterceptor } from './modules/core/interceptors/autologin.interceptor';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { customPaginator } from './modules/shared/methods/customPaginator';
import { MY_DATE_FORMATS } from './modules/shared/config/customDateFormat';
import { CustomDateAdapter } from './modules/shared/config/customDateAdapter';

registerLocaleData(localePl, 'pl');

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([spinnerInterceptor, autologinInterceptor]),
    ),
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: LOCALE_ID, useValue: 'pl' },
    { provide: MatPaginatorIntl, useValue: customPaginator() },
  ],
};
