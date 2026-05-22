import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const WardaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf2f5',
      100: '#fce7ec',
      200: '#f9d0db',
      300: '#f4a8bc',
      400: '#ec7496',
      500: '#7a1e3b',
      600: '#6d1a34',
      700: '#5c1530',
      800: '#4a1120',
      900: '#3d0e1a',
      950: '#2a0c12',
    },
  },
});
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/basic-auth.interceptor';
import { errorInterceptor } from './core/error.interceptor';
import { spinnerInterceptor } from './core/spinner.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

// Initialize translations before app starts
const initializeTranslations = (translate: TranslateService) => {
  return () => {
    const defaultLang = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang(defaultLang);
    return firstValueFrom(translate.use(defaultLang));
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        spinnerInterceptor,
        authInterceptor,
        errorInterceptor
      ])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: WardaPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.never-dark', // لا يُفعّل الدارك أبداً — الثيم أبيض فقط
          cssLayer: false
        },
      }
    }),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService,
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslateService],
      multi: true
    }
  ]
};
