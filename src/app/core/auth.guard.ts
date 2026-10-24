import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SalaoEstadoService } from './salao-estado.service';

export const authGuard: CanActivateFn = async (_rota, estado) => {
  const auth = inject(AuthService);
  const salao = inject(SalaoEstadoService);
  const router = inject(Router);
  if (!auth.autenticada()) {
    return router.createUrlTree(['/login'], {
      queryParams: estado.url && estado.url !== '/' ? { voltar: estado.url } : {},
    });
  }
  try {
    await salao.garantirCarregado();
    const sessao = auth.sessao();
    if (sessao) {
      salao.definirUsuario(sessao.usuario, sessao.nome);
    }
    return true;
  } catch {
    auth.sair();
    return router.createUrlTree(['/login']);
  }
};

export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.autenticada()) {
    return router.createUrlTree(['/']);
  }
  return true;
};
