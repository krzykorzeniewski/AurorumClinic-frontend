import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('Auto-Login')) {
    return next(req);
  }
  const spinner = inject(SpinnerService);
  queueMicrotask(() => spinner.showSpinner());
  return next(req).pipe(
    finalize(() => queueMicrotask(() => spinner.hideSpinner())),
  );
};
