import { Injectable, computed, inject, signal } from '@angular/core';
import { SalaoApiService } from './api/salao-api.service';
import { mensagemApi } from './api/api.util';
import { SalaoEstadoService, UsuarioSalao } from './salao-estado.service';

export interface SessaoAuth {
  token: string;
  usuario: string;
  nome: string;
  iniciadoEm: number;
  expiraEm: number;
}

export interface ResultadoLogin {
  ok: boolean;
  mensagem: string;
}

const CHAVE_SESSAO = 'salao.sessao.v1';
const DURACAO_SESSAO_MS = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly estado = inject(SalaoEstadoService);
  private readonly api = inject(SalaoApiService);
  private renovando: Promise<boolean> | null = null;
  private readonly sessaoAtual = signal<SessaoAuth | null>(this.lerSessao());

  readonly sessao = this.sessaoAtual.asReadonly();
  readonly autenticada = computed(() => this.sessaoViva() !== null);
  readonly token = computed(() => this.sessaoViva()?.token ?? '');

  async entrar(usuario: string, senha: string): Promise<ResultadoLogin> {
    const login = usuario.trim();
    const senhaInformada = senha.trim();
    if (!login || !senhaInformada) {
      return { ok: false, mensagem: 'Informe o usuário e a senha.' };
    }

    try {
      const sessao = this.api.disponivel
        ? await this.entrarPelaApi(login, senhaInformada)
        : await this.entrarLocal(login, senhaInformada);
      this.gravar(sessao);
      this.estado.definirUsuario(sessao.usuario, sessao.nome);
      if (this.api.disponivel) {
        await this.estado.carregar();
      }
      return { ok: true, mensagem: 'Sessão iniciada.' };
    } catch (erro) {
      return { ok: false, mensagem: mensagemApi(erro, 'Não foi possível entrar. Tente de novo.') };
    }
  }

  async renovar(): Promise<boolean> {
    if (!this.api.disponivel) {
      return false;
    }
    if (this.renovando) {
      return this.renovando;
    }
    this.renovando = this.tentarRenovar().finally(() => {
      this.renovando = null;
    });
    return this.renovando;
  }

  sair(): void {
    if (this.api.disponivel && this.sessaoAtual()) {
      void this.api.logout().catch(() => undefined);
    }
    localStorage.removeItem(CHAVE_SESSAO);
    this.sessaoAtual.set(null);
    this.estado.limparSessao();
  }

  private async tentarRenovar(): Promise<boolean> {
    try {
      const resposta = await this.api.renovar();
      const token = (resposta.token || resposta.acessToken || '').trim();
      if (!token) {
        return false;
      }
      const atual = this.sessaoAtual();
      const sessao = this.montarSessao({
        token,
        usuario: resposta.usuario?.trim() || atual?.usuario || '',
        nome: resposta.nome?.trim() || atual?.nome || resposta.usuario?.trim() || '',
        expiraEm: this.lerExpiracao(resposta.expiraEm),
      });
      this.gravar(sessao);
      return true;
    } catch {
      return false;
    }
  }

  private async entrarLocal(usuario: string, senha: string): Promise<SessaoAuth> {
    await new Promise((resolver) => setTimeout(resolver, 180));
    const conta = this.encontrarAdministradora(usuario);
    if (!conta || !this.estado.senhaConfere(senha)) {
      throw new Error('Usuário ou senha inválidos.');
    }
    return this.montarSessao({
      token: this.novoToken(),
      usuario: conta.usuario ?? conta.nome,
      nome: conta.nome,
    });
  }

  private async entrarPelaApi(usuario: string, senha: string): Promise<SessaoAuth> {
    const resposta = await this.api.login(usuario, senha);
    const login = resposta.usuario?.trim() || usuario;
    const token = (resposta.token || resposta.acessToken || '').trim();
    if (!token) {
      throw new Error('A autenticação não devolveu a sessão.');
    }
    return this.montarSessao({
      token,
      usuario: login,
      nome: resposta.nome?.trim() || login,
      expiraEm: this.lerExpiracao(resposta.expiraEm),
    });
  }

  private encontrarAdministradora(usuario: string): UsuarioSalao | undefined {
    const login = usuario.trim().toLowerCase();
    return this.estado.usuarios.find((conta) => {
      if (!conta.ativo || conta.perfil !== 'ADMIN') {
        return false;
      }
      const identificador = (conta.usuario ?? conta.nome).trim().toLowerCase();
      return identificador === login;
    });
  }

  private montarSessao(dados: { token: string; usuario: string; nome: string; expiraEm?: number }): SessaoAuth {
    const iniciadoEm = Date.now();
    return {
      token: dados.token,
      usuario: dados.usuario,
      nome: dados.nome,
      iniciadoEm,
      expiraEm: dados.expiraEm ?? iniciadoEm + DURACAO_SESSAO_MS,
    };
  }

  private gravar(sessao: SessaoAuth): void {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    this.sessaoAtual.set(sessao);
  }

  private sessaoViva(): SessaoAuth | null {
    const vigente = this.sessaoVigente(this.sessaoAtual());
    if (this.sessaoAtual() && !vigente) {
      queueMicrotask(() => this.sair());
    }
    return vigente;
  }

  private lerSessao(): SessaoAuth | null {
    try {
      const bruto = localStorage.getItem(CHAVE_SESSAO);
      if (!bruto) {
        return null;
      }
      return this.sessaoVigente(JSON.parse(bruto) as SessaoAuth);
    } catch {
      localStorage.removeItem(CHAVE_SESSAO);
      return null;
    }
  }

  private sessaoVigente(sessao: SessaoAuth | null): SessaoAuth | null {
    if (!sessao?.token || !sessao.usuario || !sessao.expiraEm) {
      return null;
    }
    if (sessao.expiraEm <= Date.now()) {
      localStorage.removeItem(CHAVE_SESSAO);
      return null;
    }
    return sessao;
  }

  private lerExpiracao(valor: number | string | undefined): number | undefined {
    if (typeof valor === 'number' && Number.isFinite(valor) && valor > Date.now()) {
      return valor;
    }
    if (typeof valor === 'string') {
      const data = Date.parse(valor);
      if (Number.isFinite(data) && data > Date.now()) {
        return data;
      }
    }
    return undefined;
  }

  private novoToken(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
