import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();
  let status = 'failed';
  const tagged = req.clone({ setHeaders: { 'X-Client': 'task-manager' } });

  return next(tagged).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        status = String(event.status);
      }
    }),
    finalize(() => {
      const ms = Math.round(performance.now() - started);
      console.log(`${req.method} ${req.urlWithParams} -> ${status} in ${ms} ms`);
    })
  );
};