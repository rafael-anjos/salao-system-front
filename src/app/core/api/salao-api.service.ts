import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AgendamentoApi,
  AnamneseApi,
  BackupApi,
  BloqueioApi,
  CaixaApi,
  CategoriaApi,
  ClienteApi,
  ContaVisivelApi,
  DadosSalaoApi,
  FichaAtendimentoApi,
  FichaVisitaApi,
  FormaConfigApi,
  HorarioApi,
  LoginApi,
  MovimentacaoApi,
  NotificacaoApi,
  PainelApi,
  ProdutoApi,
  ProfissionalApi,
  SangriaApi,
  ServicoApi,
  UsuarioApi,
} from './api.models';
import { apiUrl, paramsDe } from './api.util';

@Injectable({ providedIn: 'root' })
export class SalaoApiService {
  private readonly http = inject(HttpClient);
  readonly base = environment.apiUrl.replace(/\/$/, '');

  get disponivel(): boolean {
    return !!this.base;
  }

  private url(caminho: string): string {
    return apiUrl(this.base, caminho);
  }

  private get<T>(caminho: string, params?: Record<string, string | number | boolean | null | undefined>): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(this.url(caminho), {
        params: params ? paramsDe(params) : undefined,
        withCredentials: true,
      }),
    );
  }

  private post<T>(caminho: string, corpo: unknown = {}, params?: Record<string, string | number | boolean | null | undefined>): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(this.url(caminho), corpo, {
        params: params ? paramsDe(params) : undefined,
        withCredentials: true,
      }),
    );
  }

  private put<T>(caminho: string, corpo: unknown = {}): Promise<T> {
    return firstValueFrom(this.http.put<T>(this.url(caminho), corpo, { withCredentials: true }));
  }

  private patch<T>(caminho: string, corpo: unknown = {}, params?: Record<string, string | number | boolean | null | undefined>): Promise<T> {
    return firstValueFrom(
      this.http.patch<T>(this.url(caminho), corpo, {
        params: params ? paramsDe(params) : undefined,
        withCredentials: true,
      }),
    );
  }

  private delete(caminho: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(this.url(caminho), { withCredentials: true }));
  }

  login(usuario: string, senha: string): Promise<LoginApi> {
    return this.post<LoginApi>('/auth/login', { usuario, senha });
  }

  renovar(): Promise<LoginApi> {
    return this.post<LoginApi>('/auth/refresh');
  }

  logout(): Promise<void> {
    return this.post<void>('/auth/logout');
  }

  dadosSalao(): Promise<DadosSalaoApi> {
    return this.get<DadosSalaoApi>('/configuracoes/salao');
  }

  salvarDadosSalao(corpo: { nome: string; telefone: string; endereco: string }): Promise<DadosSalaoApi> {
    return this.put<DadosSalaoApi>('/configuracoes/salao', corpo);
  }

  salvarDesconto(percentual: number): Promise<DadosSalaoApi> {
    return this.put<DadosSalaoApi>('/configuracoes/desconto', { percentual });
  }

  horarios(): Promise<HorarioApi[]> {
    return this.get<HorarioApi[]>('/configuracoes/horarios');
  }

  salvarHorarios(horarios: HorarioApi[]): Promise<HorarioApi[]> {
    return this.put<HorarioApi[]>('/configuracoes/horarios', horarios);
  }

  formas(): Promise<FormaConfigApi[]> {
    return this.get<FormaConfigApi[]>('/configuracoes/formas');
  }

  salvarFormas(formas: FormaConfigApi[]): Promise<FormaConfigApi[]> {
    return this.put<FormaConfigApi[]>('/configuracoes/formas', formas);
  }

  usuarios(): Promise<UsuarioApi[]> {
    return this.get<UsuarioApi[]>('/configuracoes/usuarios');
  }

  cadastrarOperador(corpo: { nome: string; acessos: string[] }): Promise<UsuarioApi> {
    return this.post<UsuarioApi>('/configuracoes/usuarios', corpo);
  }

  definirAcessos(id: number, acessos: string[]): Promise<UsuarioApi> {
    return this.put<UsuarioApi>(`/configuracoes/usuarios/${id}/acessos`, { acessos });
  }

  definirUsuarioAtivo(id: number, ativo: boolean): Promise<UsuarioApi> {
    return this.patch<UsuarioApi>(`/configuracoes/usuarios/${id}/ativo`, { ativo });
  }

  alterarSenha(corpo: { atual: string; nova: string; confirmacao: string }): Promise<{ mensagem?: string }> {
    return this.put<{ mensagem?: string }>('/configuracoes/senha', corpo);
  }

  exportarBackup(): Promise<BackupApi> {
    return this.get<BackupApi>('/configuracoes/backup');
  }

  restaurarBackup(backup: BackupApi): Promise<BackupApi> {
    return this.post<BackupApi>('/configuracoes/backup', backup);
  }

  clientes(): Promise<ClienteApi[]> {
    return this.get<ClienteApi[]>('/clientes');
  }

  salvarCliente(id: number | undefined, corpo: unknown): Promise<ClienteApi> {
    return id == null ? this.post<ClienteApi>('/clientes', corpo) : this.put<ClienteApi>(`/clientes/${id}`, corpo);
  }

  salvarAnamnese(id: number, corpo: AnamneseApi & { consentimento?: boolean }): Promise<ClienteApi> {
    return this.put<ClienteApi>(`/clientes/${id}/anamnese`, corpo);
  }

  salvarResumoCliente(id: number, corpo: { alergia: string; observacoesSaude: string }): Promise<ClienteApi> {
    return this.put<ClienteApi>(`/clientes/${id}/resumo`, corpo);
  }

  profissionais(somenteAtivos = false): Promise<ProfissionalApi[]> {
    return this.get<ProfissionalApi[]>('/profissionais', { somenteAtivos });
  }

  salvarProfissional(id: number | undefined, corpo: { nome: string; telefone: string }): Promise<ProfissionalApi> {
    return id == null
      ? this.post<ProfissionalApi>('/profissionais', corpo)
      : this.put<ProfissionalApi>(`/profissionais/${id}`, corpo);
  }

  definirProfissionalAtivo(id: number, ativo: boolean): Promise<ProfissionalApi> {
    return this.patch<ProfissionalApi>(`/profissionais/${id}/ativo`, { ativo });
  }

  servicos(somenteAtivos = false): Promise<ServicoApi[]> {
    return this.get<ServicoApi[]>('/servicos', { somenteAtivos });
  }

  salvarServico(
    id: number | undefined,
    corpo: { nome: string; descricao: string; preco: number; duracaoMinutos: number },
  ): Promise<ServicoApi> {
    return id == null ? this.post<ServicoApi>('/servicos', corpo) : this.put<ServicoApi>(`/servicos/${id}`, corpo);
  }

  definirServicoAtivo(id: number, ativo: boolean): Promise<ServicoApi> {
    return this.patch<ServicoApi>(`/servicos/${id}/ativo`, { ativo });
  }

  produtos(): Promise<ProdutoApi[]> {
    return this.get<ProdutoApi[]>('/produtos');
  }

  salvarProduto(id: number | undefined, corpo: unknown): Promise<ProdutoApi> {
    return id == null ? this.post<ProdutoApi>('/produtos', corpo) : this.put<ProdutoApi>(`/produtos/${id}`, corpo);
  }

  removerProduto(id: number): Promise<void> {
    return this.delete(`/produtos/${id}`);
  }

  movimentarProduto(corpo: { produtoId: number; tipo: string; quantidade: number }): Promise<unknown> {
    return this.post('/movimentos', corpo);
  }

  categorias(tipo?: string): Promise<CategoriaApi[]> {
    return this.get<CategoriaApi[]>('/categorias', { tipo });
  }

  salvarCategoria(id: number | undefined, corpo: { nome: string; tipo: string }): Promise<CategoriaApi> {
    return id == null
      ? this.post<CategoriaApi>('/categorias', corpo)
      : this.put<CategoriaApi>(`/categorias/${id}`, corpo);
  }

  removerCategoria(id: number): Promise<void> {
    return this.delete(`/categorias/${id}`);
  }

  agendamentos(inicio?: string, fim?: string): Promise<AgendamentoApi[]> {
    return this.get<AgendamentoApi[]>('/agendamentos', { inicio, fim });
  }

  salvarAgendamento(id: number | undefined, corpo: unknown): Promise<AgendamentoApi> {
    return id == null
      ? this.post<AgendamentoApi>('/agendamentos', corpo)
      : this.put<AgendamentoApi>(`/agendamentos/${id}`, corpo);
  }

  moverAgendamento(id: number, data: string, hora: string): Promise<AgendamentoApi> {
    return this.patch<AgendamentoApi>(`/agendamentos/${id}`, { data, hora });
  }

  statusAgendamento(id: number, status: string): Promise<AgendamentoApi> {
    return this.patch<AgendamentoApi>(`/agendamentos/${id}/status`, { status });
  }

  assumirVinculo(id: number, vinculo: string): Promise<AgendamentoApi> {
    return this.patch<AgendamentoApi>(`/agendamentos/${id}/vinculo`, { vinculo });
  }

  excluirAgendamento(id: number): Promise<void> {
    return this.delete(`/agendamentos/${id}`);
  }

  caixas(inicio?: string, fim?: string): Promise<CaixaApi[]> {
    return this.get<CaixaApi[]>('/caixa', { inicio, fim });
  }

  async caixaAberto(): Promise<CaixaApi | null> {
    const resposta = await firstValueFrom(
      this.http.get<CaixaApi>(this.url('/caixa/aberto'), { observe: 'response', withCredentials: true }),
    );
    if (resposta.status === 204 || !resposta.body) {
      return null;
    }
    return resposta.body;
  }

  abrirCaixa(saldoInicial: number, profissionalId?: number): Promise<CaixaApi> {
    return this.post<CaixaApi>('/caixa/abrir', { saldoInicial }, { profissionalId });
  }

  fecharCaixa(id: number, valorContado: number): Promise<CaixaApi> {
    return this.patch<CaixaApi>(`/caixa/${id}/fechar`, { valorContado });
  }

  movimentosDoCaixa(id: number): Promise<MovimentacaoApi[]> {
    return this.get<MovimentacaoApi[]>(`/caixa/${id}/movimentos`);
  }

  registrarMovimento(corpo: { tipo: string; valor: number; descricao: string; forma: string }): Promise<MovimentacaoApi> {
    return this.post<MovimentacaoApi>('/caixa/movimentos', corpo);
  }

  registrarVenda(corpo: unknown): Promise<MovimentacaoApi> {
    return this.post<MovimentacaoApi>('/caixa/vendas', corpo);
  }

  bloqueios(): Promise<BloqueioApi[]> {
    return this.get<BloqueioApi[]>('/disponibilidade/bloqueados');
  }

  bloquear(corpo: unknown): Promise<BloqueioApi> {
    return this.post<BloqueioApi>('/disponibilidade/bloqueio', corpo);
  }

  removerBloqueio(id: number): Promise<void> {
    return this.delete(`/disponibilidade/bloqueio/${id}`);
  }

  notificacoes(lida?: boolean, inicio?: string, fim?: string): Promise<NotificacaoApi[]> {
    return this.get<NotificacaoApi[]>('/notificacoes', { lida, inicio, fim });
  }

  marcarNotificacaoLida(id: number): Promise<NotificacaoApi> {
    return this.patch<NotificacaoApi>(`/notificacoes/${id}/lida`);
  }

  contas(competencia: string): Promise<ContaVisivelApi[]> {
    return this.get<ContaVisivelApi[]>('/financeiro/contas', { competencia });
  }

  criarConta(corpo: unknown): Promise<ContaVisivelApi> {
    return this.post<ContaVisivelApi>('/financeiro/contas', corpo);
  }

  pagarConta(id: number): Promise<ContaVisivelApi> {
    return this.patch<ContaVisivelApi>(`/financeiro/lancamentos/${id}/pagar`);
  }

  encerrarConta(id: number): Promise<void> {
    return this.patch<void>(`/financeiro/contas/${id}/encerrar`);
  }

  registrarSangria(corpo: { descricao: string; valor: number; data: string }): Promise<SangriaApi> {
    return this.post<SangriaApi>('/financeiro/sangrias', corpo);
  }

  sangrias(inicio: string, fim: string): Promise<SangriaApi[]> {
    return this.get<SangriaApi[]>('/financeiro/sangrias', { inicio, fim });
  }

  painel(inicio: string, fim: string): Promise<PainelApi> {
    return this.get<PainelApi>('/financeiro/painel', { inicio, fim });
  }

  fichasVisita(clienteId: number): Promise<FichaVisitaApi[]> {
    return this.get<FichaVisitaApi[]>(`/clientes/${clienteId}/fichas`);
  }

  salvarFichaVisita(clienteId: number, corpo: unknown): Promise<FichaVisitaApi> {
    return this.post<FichaVisitaApi>(`/clientes/${clienteId}/fichas`, corpo);
  }

  fichasAtendimento(clienteId: number): Promise<FichaAtendimentoApi[]> {
    return this.get<FichaAtendimentoApi[]>(`/clientes/${clienteId}/fichas-atendimento`);
  }

  salvarFichaAtendimento(clienteId: number, corpo: unknown): Promise<FichaAtendimentoApi> {
    return this.post<FichaAtendimentoApi>(`/clientes/${clienteId}/fichas-atendimento`, corpo);
  }
}
