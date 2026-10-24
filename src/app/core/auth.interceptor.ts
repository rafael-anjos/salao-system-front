import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (pedido, proximo) => {
  const auth = inject(AuthService);
  const base = environment.apiUrl.replace(/\/$/, '');
  const paraApi = !!base && pedido.url.startsWith(base);
  const rotaPublica = /\/auth\/(login|refresh)$/.test(pedido.url);
  const token = auth.token();
  const autorizado = pedido.clone({
    withCredentials: paraApi,
    setHeaders: paraApi && token && !rotaPublica ? { Authorization: `Bearer ${token}` } : {},
  });

  return proximo(autorizado).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (!paraApi || erro.status !== 401 || rotaPublica || pedido.url.includes('/auth/logout')) {
        return throwError(() => erro);
      }
      return from(auth.renovar()).pipe(
        switchMap((ok) => {
          if (!ok) {
            auth.sair();
            return throwError(() => erro);
          }
          return proximo(
            pedido.clone({
              withCredentials: true,
              setHeaders: { Authorization: `Bearer ${auth.token()}` },
            }),
          );
        }),
      );
    }),
  );
};
