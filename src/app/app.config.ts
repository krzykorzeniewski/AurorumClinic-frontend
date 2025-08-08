import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { spinnerInterceptor } from './modules/core/interceptors/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
    ),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([spinnerInterceptor])),
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
  ]
};
