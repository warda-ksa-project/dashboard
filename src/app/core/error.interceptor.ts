import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

function extractErrorMessage(errBody: any, error: HttpErrorResponse): string {
  if (!errBody) return error?.message || 'shared.errors.general';
  if (typeof errBody === 'string' && errBody.trim()) return errBody;
  return (
    errBody?.error?.message ||
    (typeof errBody?.error === 'string' ? errBody.error : null) ||
    errBody?.message ||
    errBody?.title ||
    errBody?.detail ||
    'shared.errors.general'
  );
}

function isAuthOtpRequest(req: HttpRequest<unknown>): boolean {
  const url = req.url.toLowerCase();
  return url.includes('auth/send-otp') || url.includes('auth/verify-otp');
}

function isLoginPage(router: Router): boolean {
  return router.url.includes('/auth/login');
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const skipToast = isLoginPage(router) && isAuthOtpRequest(req);

      if (!skipToast) {
        const errBody = error?.error;
        const message = extractErrorMessage(errBody, error);

        switch (error.status) {
          case 401:
            if (!isLoginPage(router)) {
              toaster.errorToaster(message || 'Unauthorized');
              router.navigate(['/auth/login']);
            }
            break;

          case 403:
            toaster.errorToaster(message || 'Forbidden');
            break;

          case 400:
            toaster.errorToaster(message || 'Bad request');
            break;

          case 0:
            toaster.errorToaster('shared.errors.network');
            break;

          default:
            toaster.errorToaster(message || 'shared.errors.server');
            break;
        }
      }

      return throwError(() => error);
    })
  );
};
