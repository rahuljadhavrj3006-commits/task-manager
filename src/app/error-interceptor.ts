import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError, timer } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    retry({
      count: req.method === 'GET' ? 2 : 0,
      delay: (error: HttpErrorResponse, attempt) => {
        const serverOrNetwork = error.status === 0 || error.status >= 500;
        if (!serverOrNetwork) {
          return throwError(() => error);
        }
        console.warn(`retry ${attempt} for ${req.method} ${req.urlWithParams}`);
        return timer(attempt * 500);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const message =
        error.status === 0 || error.status >= 500
          ? 'Cannot reach the task server. Is json-server running?'
          : error.status === 404
            ? 'That task no longer exists.'
            : `Request failed (${error.status}).`;
      return throwError(() => new Error(message));
    })
  );