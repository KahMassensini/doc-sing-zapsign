import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      const message =
        err?.error?.detail ||
        err?.message ||
        'Erro inesperado ao comunicar com a API.';
      console.error('[API ERROR]', err);
      return throwError(() => new Error(message));
    })
  );
};
