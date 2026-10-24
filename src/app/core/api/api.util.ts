import { HttpErrorResponse, HttpParams } from '@angular/common/http';

export function apiUrl(base: string, caminho: string): string {
  const raiz = base.replace(/\/$/, '');
  const resto = caminho.startsWith('/') ? caminho : `/${caminho}`;
  return `${raiz}${resto}`;
}

export function paramsDe(valores: Record<string, string | number | boolean | null | undefined>): HttpParams {
  let params = new HttpParams();
  for (const [chave, valor] of Object.entries(valores)) {
    if (valor === undefined || valor === null || valor === '') {
      continue;
    }
    params = params.set(chave, String(valor));
  }
  return params;
}

export function mensagemApi(erro: unknown, padrao = 'Não foi possível concluir.'): string {
  if (erro instanceof HttpErrorResponse) {
    const corpo = erro.error as { mensagem?: string } | string | null;
    if (corpo && typeof corpo === 'object' && typeof corpo.mensagem === 'string' && corpo.mensagem.trim()) {
      return corpo.mensagem;
    }
    if (typeof corpo === 'string' && corpo.trim()) {
      return corpo;
    }
    if (erro.status === 0) {
      return 'Sem conexão com o servidor. Confira se o backend está no ar.';
    }
    if (erro.status === 401) {
      return 'Usuário ou senha inválidos.';
    }
  }
  if (erro instanceof Error && erro.message) {
    return erro.message;
  }
  return padrao;
}

export function idTexto(valor: number | string | null | undefined): string {
  return valor == null ? '' : String(valor);
}

export function idNumero(valor: string | number | null | undefined): number | undefined {
  if (valor == null || valor === '') {
    return undefined;
  }
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : undefined;
}

export function idNumeroObrigatorio(valor: string | number | null | undefined): number {
  const numero = idNumero(valor);
  if (numero == null) {
    throw new Error('Identificador inválido.');
  }
  return numero;
}

export function numeroDe(valor: number | string | null | undefined, padrao = 0): number {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : padrao;
}

export function textoDe(valor: string | null | undefined): string {
  return valor?.toString() ?? '';
}

export function dataDe(valor: string | null | undefined): string {
  if (!valor) {
    return '';
  }
  return valor.length >= 10 ? valor.slice(0, 10) : valor;
}

export function horaDe(valor: string | null | undefined): string {
  if (!valor) {
    return '';
  }
  return valor.length >= 5 ? valor.slice(0, 5) : valor;
}
