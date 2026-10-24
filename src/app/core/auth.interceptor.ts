import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (pedido, proximo) => {
  const token = inject(AuthService).token();
  if (!token || !environment.apiUrl) {
    return proximo(pedido);
  }
  return proximo(
    pedido.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
