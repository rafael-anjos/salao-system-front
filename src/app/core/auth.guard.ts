import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.autenticada()) {
    return true;
  }
  return router.createUrlTree(['/login'], {
    queryParams: estado.url && estado.url !== '/' ? { voltar: estado.url } : {},
  });
};

export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.autenticada()) {
    return router.createUrlTree(['/']);
  }
  return true;
};
