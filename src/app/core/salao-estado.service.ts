import { Injectable, inject } from '@angular/core';
import { anamneseParaApi, mapearAgendamento, mapearBloqueio, mapearCaixa, mapearCategoria, mapearCliente, mapearConta, mapearDadosSalao, mapearFichaAtendimento, mapearFichaVisita, mapearForma, mapearHorario, mapearMovimentacao, mapearNotificacao, mapearProduto, mapearProfissional, mapearSangria, mapearServico, mapearUsuario } from './api/api.mappers';
import { SalaoApiService } from './api/salao-api.service';
import { idNumero, idNumeroObrigatorio, mensagemApi, numeroDe } from './api/api.util';

/**
 * Estado compartilhado da sessão.
 * Não há API no projeto: Estoque e Dashboard leem estes mesmos cadastros.
 * Os dados duram enquanto a aplicação está aberta.
 */
export type StatusAgendamento = 'Confirmado' | 'Em andamento' | 'Aguardando' | 'Concluído' | 'Cancelado' | 'Falta';
export type StatusEstoque = 'critico' | 'baixo' | 'normal';
export type UsoProduto = 'salao' | 'venda';
export type FormaPagamento = 'Dinheiro' | 'Pix' | 'Cartão de débito' | 'Cartão de crédito';
export type TipoMovimento = 'entrada' | 'saida' | 'venda' | 'estorno';
export type StatusCaixa = 'aberto' | 'fechado';

export interface Profissional {
  id: string;
  nome: string;
  telefone: string;
  ativo: boolean;
}

export interface ProfissionalCadastro {
  id?: string;
  nome: string;
  telefone: string;
}

export const TIPOS_CABELO = ['Liso', 'Ondulado', 'Cacheado', 'Crespo'] as const;
export const ESPESSURAS_CABELO = ['Fino', 'Médio', 'Grosso'] as const;
export const POROSIDADES_CABELO = ['Baixa', 'Média', 'Alta'] as const;
export const COUROS_CABELUDOS = ['Normal', 'Oleoso', 'Seco', 'Sensível'] as const;
export const TIPOS_QUIMICA = ['Coloração', 'Descoloração', 'Progressiva', 'Relaxamento'] as const;
export const CONDICOES_CABELO = ['Danificado', 'Ressecado', 'Quebradiço', 'Com queda', 'Elástico', 'Poroso'] as const;

export type TipoCabelo = (typeof TIPOS_CABELO)[number];
export type EspessuraCabelo = (typeof ESPESSURAS_CABELO)[number];
export type PorosidadeCabelo = (typeof POROSIDADES_CABELO)[number];
export type CouroCabeludo = (typeof COUROS_CABELUDOS)[number];
export type TipoQuimica = (typeof TIPOS_QUIMICA)[number];
export type CondicaoCabelo = (typeof CONDICOES_CABELO)[number];

export interface QuimicaAnterior {
  tipo: TipoQuimica;
  dataAproximada: string;
}

export const PROCEDIMENTOS_ATENDIMENTO = ['Coloração', 'Mechas', 'Correção de cor', 'Progressiva', 'Outro'] as const;

export type ProcedimentoAtendimento = (typeof PROCEDIMENTOS_ATENDIMENTO)[number];
export type ProgressivaAtendimento = 'nao' | 'com' | 'sem' | '';
export type StatusFichaAtendimento = 'rascunho' | 'finalizada';

/** Ficha criada no atendimento. Cada visita guarda a sua; uma nova não apaga a anterior. */
export interface FichaAtendimento {
  id: string;
  clienteId: string;
  agendamentoId?: string;
  atendimentoId?: string;
  /** Liga a ficha ao serviço ainda sem agendamento ou venda. */
  vinculo?: string;
  data: string;
  status: StatusFichaAtendimento;
  procedimentos: ProcedimentoAtendimento[];
  cor: string;
  progressiva: ProgressivaAtendimento;
  alergia: string;
  observacoes: string;
}

export interface FichaAtendimentoCadastro {
  id?: string;
  clienteId: string;
  agendamentoId?: string;
  atendimentoId?: string;
  vinculo?: string;
  data: string;
  status: StatusFichaAtendimento;
  procedimentos: ProcedimentoAtendimento[];
  cor: string;
  progressiva: ProgressivaAtendimento;
  alergia: string;
  observacoes?: string;
}

export interface AnamneseCapilar {
  tipoCabelo: TipoCabelo | '';
  comprimento: string;
  espessura: EspessuraCabelo | '';
  porosidade: PorosidadeCabelo | '';
  couroCabeludo: CouroCabeludo | '';
  quimica: QuimicaAnterior[];
  condicoes: CondicaoCabelo[];
  alergias: string;
  testeMecha: boolean | null;
  testeMechaData: string;
  observacoesSaude: string;
  cuidadosCasa: string;
  preferencias: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  nascimento: string;
  email: string;
  instagram: string;
  observacoes: string;
  observacoesSaude: string;
  consentimentoSaude: boolean;
  tags: string[];
  ativo: boolean;
  anamnese: AnamneseCapilar;
}

export interface ClienteCadastro {
  id?: string;
  nome: string;
  telefone: string;
  nascimento?: string;
  email?: string;
  instagram?: string;
  observacoes?: string;
  observacoesSaude?: string;
  consentimentoSaude?: boolean;
  tags?: string[];
  ativo?: boolean;
  senhaAdmin?: string;
}

export interface ProdutoFormula {
  marca: string;
  linha: string;
  cor: string;
  oxidante: string;
  proporcao: string;
  tempoPausa: string;
}

export interface FotoVisita {
  id: string;
  momento: 'antes' | 'depois';
  dados: string;
}

export interface FichaVisita {
  id: string;
  clienteId: string;
  agendamentoId?: string;
  data: string;
  servico: string;
  profissional: string;
  produtos: ProdutoFormula[];
  observacoes: string;
  retorno: string;
  fotos: FotoVisita[];
  valor: number;
  /** Venda que originou esta visita. O valor já entra no total gasto pela venda. */
  vendaId?: string;
}

export interface FichaVisitaCadastro {
  id?: string;
  clienteId: string;
  agendamentoId?: string;
  data: string;
  servico: string;
  profissional: string;
  produtos: ProdutoFormula[];
  observacoes?: string;
  retorno?: string;
  fotos?: FotoVisita[];
  valor?: number;
  vendaId?: string;
}

export interface ResumoCliente {
  totalVisitas: number;
  ultimaVisita: string | null;
  totalGasto: number;
  ticketMedio: number;
  proximo: AgendamentoDia | null;
}

export function semAcento(valor: string): string {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function servicoPedeFicha(nome: string): boolean {
  const texto = semAcento(nome);
  return (
    texto.includes('coloracao') ||
    texto.includes('mecha') ||
    texto.includes('correcao de cor') ||
    texto.includes('progressiva')
  );
}

export function resumoFichaAtendimento(ficha: Pick<FichaAtendimento, 'procedimentos' | 'cor' | 'progressiva'>): string {
  const progressiva = ficha.progressiva === 'com' ? 'Com formol' : ficha.progressiva === 'sem' ? 'Sem formol' : '';
  return [ficha.procedimentos.join(', '), ficha.cor.trim(), progressiva].filter(Boolean).join(' · ');
}

export function anamneseVazia(): AnamneseCapilar {
  return {
    tipoCabelo: '',
    comprimento: '',
    espessura: '',
    porosidade: '',
    couroCabeludo: '',
    quimica: [],
    condicoes: [],
    alergias: '',
    testeMecha: null,
    testeMechaData: '',
    observacoesSaude: '',
    cuidadosCasa: '',
    preferencias: '',
  };
}

export function montarCliente(dados: Pick<Cliente, 'id' | 'nome'> & Partial<Omit<Cliente, 'id' | 'nome'>>): Cliente {
  const anamnese = dados.anamnese;
  const fichaFixa: AnamneseCapilar = {
    ...anamneseVazia(),
    ...anamnese,
    quimica: anamnese?.quimica ? anamnese.quimica.map((item) => ({ ...item })) : [],
    condicoes: anamnese?.condicoes ? [...anamnese.condicoes] : [],
  };
  const saudeInformada = typeof dados.observacoesSaude === 'string' ? dados.observacoesSaude.trim() : '';
  const saude = saudeInformada || fichaFixa.observacoesSaude.trim();
  fichaFixa.observacoesSaude = saude;
  return {
    telefone: '',
    nascimento: '',
    email: '',
    instagram: '',
    observacoes: '',
    consentimentoSaude: false,
    ativo: true,
    ...dados,
    tags: dados.tags ? [...dados.tags] : [],
    observacoesSaude: saude,
    anamnese: fichaFixa,
  };
}

export function linkWhatsapp(telefone: string, texto = ''): string {
  const digitos = telefone.replace(/\D/g, '');
  const comPais = digitos.startsWith('55') && digitos.length > 11 ? digitos : `55${digitos}`;
  const base = `https://wa.me/${comPais}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
  /** Cadastro anterior da agenda. Fica fora da tela de serviços. */
  legado?: boolean;
}

export interface ServicoCadastro {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
}

export interface HorarioFuncionamento {
  dia: number;
  abertura: string;
  fechamento: string;
  ativo: boolean;
}

export interface BloqueioAgenda {
  id: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  diaInteiro: boolean;
  motivo: string;
}

export interface BloqueioCadastro {
  id?: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  diaInteiro: boolean;
  motivo: string;
}

export interface TrocaSenha {
  atual: string;
  nova: string;
  confirmacao: string;
}

export type PerfilUsuario = 'ADMIN' | 'OPERADOR';
export type ModuloAcesso =
  | 'inicio'
  | 'agenda'
  | 'clientes'
  | 'caixa'
  | 'financeiro'
  | 'estoque'
  | 'relatorios'
  | 'servicos'
  | 'profissionais'
  | 'configuracoes';

export const MODULOS_ACESSO: { id: ModuloAcesso; nome: string }[] = [
  { id: 'inicio', nome: 'Início' },
  { id: 'agenda', nome: 'Agenda' },
  { id: 'clientes', nome: 'Clientes' },
  { id: 'caixa', nome: 'Caixa' },
  { id: 'financeiro', nome: 'Financeiro' },
  { id: 'estoque', nome: 'Estoque' },
  { id: 'relatorios', nome: 'Relatórios' },
  { id: 'servicos', nome: 'Serviços' },
  { id: 'profissionais', nome: 'Profissionais' },
  { id: 'configuracoes', nome: 'Configurações' },
];

export type TipoCategoria = 'estoque' | 'despesa';

export interface UsuarioSalao {
  id: string;
  nome: string;
  /** Identificador de entrada. Só a administração usa para abrir o sistema. */
  usuario?: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  acessos: ModuloAcesso[];
}

export interface UsuarioOperadorCadastro {
  nome: string;
  acessos: ModuloAcesso[];
}

export interface CategoriaSalao {
  id: string;
  nome: string;
  tipo: TipoCategoria;
}

export interface CategoriaCadastro {
  id?: string;
  nome: string;
  tipo: TipoCategoria;
}

export const DIAS_SEMANA: { dia: number; nome: string }[] = [
  { dia: 1, nome: 'Segunda' },
  { dia: 2, nome: 'Terça' },
  { dia: 3, nome: 'Quarta' },
  { dia: 4, nome: 'Quinta' },
  { dia: 5, nome: 'Sexta' },
  { dia: 6, nome: 'Sábado' },
  { dia: 0, nome: 'Domingo' },
];

export function nomeDia(dia: number): string {
  return DIAS_SEMANA.find((item) => item.dia === dia)?.nome ?? 'Dia';
}

export interface ProdutoEstoque {
  id: string;
  nome: string;
  categoria: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  preco: number;
  precoCusto?: number;
  status: StatusEstoque;
  uso: UsoProduto;
  unidade?: string;
  codigoBarras?: string;
}

export interface ProdutoCadastro {
  id?: string;
  nome: string;
  categoria: string;
  uso: UsoProduto;
  unidade: string;
  codigoBarras: string;
  precoCusto: number;
  preco: number;
  estoqueMinimo: number;
  estoqueAtual: number;
}

export interface AgendamentoDia {
  id: string;
  data: string;
  hora: string;
  cliente: string;
  clienteId: string;
  servico: string;
  servicoId: string;
  profissional: string;
  profissionalId: string;
  status: StatusAgendamento;
  preco: number;
  observacao?: string;
  vendaId?: string;
}

export interface AgendamentoCadastro {
  id?: string;
  clienteNome: string;
  clienteId?: string;
  servicoId: string;
  profissionalId: string;
  data: string;
  hora: string;
  observacao?: string;
}

export interface ItemMovimento {
  tipo: 'servico' | 'produto';
  id: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PagamentoRegistrado {
  forma: FormaPagamento;
  valor: number;
  parcelas?: number;
}

export interface FormaConfigurada {
  forma: FormaPagamento;
  ativa: boolean;
  taxaPercentual: number;
  maxParcelas: number;
}

export interface DadosSalao {
  nome: string;
  telefone: string;
  endereco: string;
}

export interface Movimentacao {
  id: string;
  caixaId: string;
  dataHora: string;
  tipo: TipoMovimento;
  descricao: string;
  cliente?: string;
  clienteId?: string;
  profissional?: string;
  profissionalId?: string;
  itens: ItemMovimento[];
  pagamentos: PagamentoRegistrado[];
  valor: number;
  desconto: number;
  responsavel: string;
  agendamentoId?: string;
}

export interface CaixaRegistro {
  id: string;
  abertoEm: string;
  fechadoEm?: string;
  responsavelAbertura: string;
  responsavelFechamento?: string;
  saldoInicial: number;
  status: StatusCaixa;
  valorContado?: number;
  diferencaDinheiro?: number;
}

export interface ItemPedido {
  tipo: 'servico' | 'produto';
  id: string;
  quantidade: number;
}

export interface PedidoVenda {
  profissionalId: string;
  clienteId: string | null;
  /** Nome de quem não está cadastrado. Não cria ficha de cliente. */
  clienteNome?: string;
  itens: ItemPedido[];
  desconto: number;
  pagamentos: PagamentoRegistrado[];
  agendamentoId?: string;
}

export interface TotaisFinanceiros {
  vendas: number;
  servicos: number;
  produtos: number;
  entradas: number;
  saidas: number;
  descontos: number;
  taxas: number;
  liquido: number;
  porForma: { forma: FormaPagamento; total: number }[];
}

export interface ResumoCaixa extends TotaisFinanceiros {
  saldoInicial: number;
  saldoAtual: number;
  esperadoDinheiro: number;
}

export interface ResultadoOperacao {
  ok: boolean;
  mensagem: string;
  id?: string;
}

export type TipoConta = 'fixa' | 'parcelada' | 'avulsa';
export type StatusConta = 'pendente' | 'pago';

export interface ContaContrato {
  id: string;
  nome: string;
  valor: number;
  tipo: TipoConta;
  diaVencimento: number;
  inicioCompetencia: string;
  parcelas?: number;
  canceladaApartir?: string;
}

export interface ContaLancamento {
  id: string;
  contratoId: string;
  competencia: string;
  vencimento: string;
  valor: number;
  status: StatusConta;
  pagoEm?: string;
  numeroParcela?: number;
}

export interface ContaVisivel {
  lancamentoId: string;
  contratoId: string;
  nome: string;
  valor: number;
  vencimento: string;
  tipo: TipoConta;
  status: StatusConta;
  numeroParcela?: number;
  parcelas?: number;
  vencida: boolean;
  podeEncerrar: boolean;
}

export interface Sangria {
  id: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  texto: string;
  data: string;
  lida: boolean;
}

export interface NovaConta {
  nome: string;
  valor: number;
  tipo: TipoConta;
  diaVencimento?: number;
  vencimento?: string;
  parcelas?: number;
  status: StatusConta;
}

export interface LinhaParticipacao {
  nome: string;
  quantidade: number;
  total: number;
  percentual: number;
}

export interface TotaisPeriodo {
  entradas: number;
  saidas: number;
  lucro: number;
  vendas: number;
  quantidadeVendas: number;
  ticket: number;
}

export const FORMAS_PAGAMENTO: FormaPagamento[] = [
  'Dinheiro',
  'Pix',
  'Cartão de débito',
  'Cartão de crédito',
];

export function dataIso(data = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function arredondar(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function competenciaDe(iso: string): string {
  return iso.slice(0, 7);
}

export function deslocarMes(competencia: string, delta: number): string {
  const [ano, mes] = competencia.split('-').map(Number);
  const data = new Date(ano, mes - 1 + delta, 1);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

export function vencimentoNoMes(competencia: string, dia: number): string {
  const [ano, mes] = competencia.split('-').map(Number);
  const ultimo = new Date(ano, mes, 0).getDate();
  const diaReal = Math.min(Math.max(1, dia), ultimo);
  return `${competencia}-${String(diaReal).padStart(2, '0')}`;
}

export function somarDias(iso: string, dias: number): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);
  return dataIso(data);
}

export function inicioDaSemana(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  const semana = data.getDay();
  const delta = semana === 0 ? -6 : 1 - semana;
  return somarDias(iso, delta);
}

export function diferencaDias(inicio: string, fim: string): number {
  const [anoA, mesA, diaA] = inicio.split('-').map(Number);
  const [anoB, mesB, diaB] = fim.split('-').map(Number);
  const a = new Date(anoA, mesA - 1, diaA).getTime();
  const b = new Date(anoB, mesB - 1, diaB).getTime();
  return Math.round((b - a) / 86400000);
}

export type SentidoVariacao = 'subiu' | 'caiu' | 'estavel' | 'sem-base';

export interface VariacaoPeriodo {
  sentido: SentidoVariacao;
  percentual: number | null;
}

export function variacaoPeriodo(atual: number, anterior: number): VariacaoPeriodo {
  const diferenca = arredondar(atual - anterior);
  if (diferenca === 0) {
    return { sentido: 'estavel', percentual: 0 };
  }
  if (anterior === 0) {
    return { sentido: diferenca > 0 ? 'subiu' : 'caiu', percentual: null };
  }
  return {
    sentido: diferenca > 0 ? 'subiu' : 'caiu',
    percentual: Math.round((diferenca / Math.abs(anterior)) * 1000) / 10,
  };
}

export function rotuloStatusAgendamento(status: StatusAgendamento): string {
  if (status === 'Aguardando') {
    return 'Pendente';
  }
  if (status === 'Falta') {
    return 'Não compareceu';
  }
  return status;
}

export function ocupaAgenda(status: StatusAgendamento): boolean {
  return status !== 'Cancelado' && status !== 'Falta';
}

function compararCompetencia(a: string, b: string): number {
  return a.localeCompare(b);
}

function somar(valores: number[]): number {
  return arredondar(valores.reduce((total, valor) => total + valor, 0));
}

function dataIsoValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }
  const [ano, mes, dia] = valor.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

@Injectable({ providedIn: 'root' })
export class SalaoEstadoService {
  private readonly api = inject(SalaoApiService);
  private carga: Promise<void> | null = null;
  private readonly contasMes = new Map<string, ContaVisivel[]>();
  private readonly fichasPorCliente = new Set<string>();
  carregado = false;

  dadosSalao: DadosSalao = {
    nome: 'Eula Moraes Studio',
    telefone: '',
    endereco: '',
  };
  /** Porcentagem máxima do subtotal que o caixa pode descontar. 100 permite até o total. */
  descontoMaximoPercentual = 100;
  usuarioAtualId = '';
  usuarioAtual = '';
  readonly formas: FormaConfigurada[] = [
    { forma: 'Dinheiro', ativa: true, taxaPercentual: 0, maxParcelas: 1 },
    { forma: 'Pix', ativa: true, taxaPercentual: 0, maxParcelas: 1 },
    { forma: 'Cartão de débito', ativa: true, taxaPercentual: 0, maxParcelas: 1 },
    { forma: 'Cartão de crédito', ativa: true, taxaPercentual: 0, maxParcelas: 6 },
  ];

  get salao(): string {
    return this.dadosSalao.nome;
  }

  get formasPagamento(): FormaPagamento[] {
    return this.formas.filter((forma) => forma.ativa).map((forma) => forma.forma);
  }

  get formasConsulta(): FormaPagamento[] {
    return this.formas.map((forma) => forma.forma);
  }

  readonly horarios: HorarioFuncionamento[] = [
    { dia: 1, abertura: '09:00', fechamento: '19:00', ativo: true },
    { dia: 2, abertura: '09:00', fechamento: '19:00', ativo: true },
    { dia: 3, abertura: '09:00', fechamento: '19:00', ativo: true },
    { dia: 4, abertura: '09:00', fechamento: '19:00', ativo: true },
    { dia: 5, abertura: '09:00', fechamento: '19:00', ativo: true },
    { dia: 6, abertura: '09:00', fechamento: '19:00', ativo: true },
    { dia: 0, abertura: '09:00', fechamento: '19:00', ativo: true },
  ];

  /**
   * Bloqueios da sessão.
   * Contrato previsto: GET /api/disponibilidade/bloqueados e POST/DELETE /api/disponibilidade/bloqueio.
   */
  readonly bloqueios: BloqueioAgenda[] = [];

  private senha = '123456';

  readonly usuarios: UsuarioSalao[] = [
    {
      id: 'usr-paula',
      nome: 'Paula',
      usuario: 'paula',
      perfil: 'ADMIN',
      ativo: true,
      acessos: MODULOS_ACESSO.map((modulo) => modulo.id),
    },
  ];

  readonly categorias: CategoriaSalao[] = [];

  readonly profissionais: Profissional[] = [];

  readonly clientes: Cliente[] = [];

  readonly fichas: FichaVisita[] = [];

  readonly fichasAtendimento: FichaAtendimento[] = [];

  readonly servicos: Servico[] = [];

  readonly produtos: ProdutoEstoque[] = [];

  readonly agendamentos: AgendamentoDia[] = [];

  readonly caixas: CaixaRegistro[] = [];
  readonly movimentacoes: Movimentacao[] = [];
  readonly contas: ContaContrato[] = [];
  readonly lancamentosConta: ContaLancamento[] = [];
  readonly sangrias: Sangria[] = [];
  readonly notificacoes: Notificacao[] = [];

  private sequencia = 0;

  definirUsuario(usuario: string, nome: string): void {
    this.usuarioAtual = nome.trim() || usuario.trim();
    const login = usuario.trim().toLowerCase();
    const conta = this.usuarios.find((item) => {
      const identificador = (item.usuario ?? item.nome).trim().toLowerCase();
      return identificador === login || item.nome.trim().toLowerCase() === this.usuarioAtual.toLowerCase();
    });
    this.usuarioAtualId = conta?.id ?? this.usuarioAtualId;
  }

  limparSessao(): void {
    this.carregado = false;
    this.carga = null;
    this.contasMes.clear();
    this.fichasPorCliente.clear();
  }

  async garantirCarregado(): Promise<void> {
    if (this.carregado) {
      return;
    }
    await this.carregar();
  }

  async carregar(): Promise<void> {
    if (!this.api.disponivel) {
      this.carregado = true;
      return;
    }
    if (this.carga) {
      return this.carga;
    }
    this.carga = this.puxarCadastros()
      .then(() => {
        this.carregado = true;
      })
      .finally(() => {
        this.carga = null;
      });
    return this.carga;
  }

  async garantirFichas(clienteId: string): Promise<void> {
    if (!clienteId || this.fichasPorCliente.has(clienteId) || !this.api.disponivel) {
      return;
    }
    const id = idNumero(clienteId);
    if (id == null) {
      return;
    }
    const [visitas, atendimentos] = await Promise.all([
      this.api.fichasVisita(id),
      this.api.fichasAtendimento(id),
    ]);
    this.fichas.push(...visitas.map(mapearFichaVisita).filter((ficha) => !this.fichas.some((atual) => atual.id === ficha.id)));
    this.fichasAtendimento.push(
      ...atendimentos
        .map(mapearFichaAtendimento)
        .filter((ficha) => !this.fichasAtendimento.some((atual) => atual.id === ficha.id)),
    );
    this.fichasPorCliente.add(clienteId);
  }

  async garantirLancamentos(competencia: string): Promise<void> {
    if (!/^\d{4}-\d{2}$/.test(competencia)) {
      return;
    }
    if (!this.api.disponivel) {
      this.gerarLancamentosLocais(competencia);
      return;
    }
    const contas = (await this.api.contas(competencia)).map(mapearConta);
    this.contasMes.set(competencia, contas);
  }

  private async puxarCadastros(): Promise<void> {
    const hoje = dataIso();
    const inicioSangria = somarDias(hoje, -400);
    const [
      salao,
      horarios,
      formas,
      usuarios,
      profissionais,
      servicos,
      clientes,
      produtos,
      categorias,
      agendamentos,
      caixas,
      bloqueios,
      notificacoes,
      sangrias,
    ] = await Promise.all([
      this.api.dadosSalao(),
      this.api.horarios(),
      this.api.formas(),
      this.api.usuarios(),
      this.api.profissionais(false),
      this.api.servicos(false),
      this.api.clientes(),
      this.api.produtos(),
      this.api.categorias(),
      this.api.agendamentos(),
      this.api.caixas(),
      this.api.bloqueios(),
      this.api.notificacoes(),
      this.api.sangrias(inicioSangria, hoje),
    ]);

    this.dadosSalao = mapearDadosSalao(salao);
    this.descontoMaximoPercentual = numeroDe(salao.descontoMaximoPercentual, this.descontoMaximoPercentual);
    this.substituir(this.horarios, horarios.map(mapearHorario));
    const formasMapeadas = formas.map(mapearForma).filter((item): item is FormaConfigurada => !!item);
    if (formasMapeadas.length) {
      this.substituir(this.formas, formasMapeadas);
    }
    this.substituir(this.usuarios, usuarios.map(mapearUsuario));
    this.substituir(this.profissionais, profissionais.map(mapearProfissional));
    this.substituir(this.servicos, servicos.map(mapearServico));
    this.substituir(this.clientes, clientes.map(mapearCliente));
    this.substituir(this.produtos, produtos.map(mapearProduto));
    this.substituir(this.categorias, categorias.map(mapearCategoria));
    this.substituir(this.agendamentos, agendamentos.map(mapearAgendamento));
    this.substituir(this.caixas, caixas.map(mapearCaixa));
    this.substituir(this.bloqueios, bloqueios.map(mapearBloqueio));
    this.substituir(this.notificacoes, notificacoes.map(mapearNotificacao));
    this.substituir(this.sangrias, sangrias.map(mapearSangria));
    this.definirUsuario(
      this.usuarios.find((item) => item.id === this.usuarioAtualId)?.usuario ?? this.usuarioAtual,
      this.usuarioAtual,
    );

    const movimentos = await Promise.all(this.caixas.map((caixa) => this.api.movimentosDoCaixa(idNumeroObrigatorio(caixa.id))));
    this.substituir(
      this.movimentacoes,
      movimentos.flat().map((item) => mapearMovimentacao(item, this.usuarioAtual)),
    );
  }

  private falha(erro: unknown, padrao?: string): ResultadoOperacao {
    return { ok: false, mensagem: mensagemApi(erro, padrao ?? 'Não foi possível concluir.') };
  }

  private upsert<T extends { id: string }>(lista: T[], item: T): void {
    const indice = lista.findIndex((atual) => atual.id === item.id);
    if (indice < 0) {
      lista.push(item);
      return;
    }
    lista[indice] = item;
  }

  private idProfissionalAtual(): number | undefined {
    return idNumero(this.usuarioAtualId) ?? idNumero(this.profissionais.find((item) => item.nome === this.usuarioAtual)?.id);
  }

  get caixaAberto(): boolean {
    return this.caixas.some((caixa) => caixa.status === 'aberto');
  }

  get caixaAbertoAtual(): CaixaRegistro | undefined {
    return this.caixas.find((caixa) => caixa.status === 'aberto');
  }

  async abrirCaixa(saldoInicial: number): Promise<ResultadoOperacao> {
    if (this.caixaAberto) {
      return { ok: false, mensagem: 'Já existe um caixa aberto.' };
    }

    const saldo = arredondar(Number(saldoInicial));
    if (!Number.isFinite(saldo) || saldo < 0) {
      return { ok: false, mensagem: 'Informe um saldo inicial válido.' };
    }

    try {
      const caixa = mapearCaixa(await this.api.abrirCaixa(saldo, this.idProfissionalAtual()));
      this.upsert(this.caixas, caixa);
      return { ok: true, mensagem: 'Caixa aberto.', id: caixa.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async fecharCaixa(valorContado: number): Promise<ResultadoOperacao> {
    const caixa = this.caixaAbertoAtual;
    if (!caixa) {
      return { ok: false, mensagem: 'Não há caixa aberto para fechar.' };
    }

    const contado = arredondar(Number(valorContado));
    if (!Number.isFinite(contado) || contado < 0) {
      return { ok: false, mensagem: 'Informe o valor contado em dinheiro.' };
    }

    try {
      const fechado = mapearCaixa(await this.api.fecharCaixa(idNumeroObrigatorio(caixa.id), contado));
      this.upsert(this.caixas, fechado);
      return { ok: true, mensagem: 'Caixa fechado.', id: fechado.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async registrarMovimento(dados: {
    tipo: 'entrada' | 'saida';
    valor: number;
    descricao: string;
    forma: FormaPagamento;
  }): Promise<ResultadoOperacao> {
    const caixa = this.caixaAbertoAtual;
    if (!caixa) {
      return { ok: false, mensagem: 'Abra o caixa para registrar a movimentação.' };
    }

    const valor = arredondar(Number(dados.valor));
    const descricao = dados.descricao.trim();
    if (!Number.isFinite(valor) || valor <= 0) {
      return { ok: false, mensagem: 'Informe um valor maior que zero.' };
    }
    if (descricao.length < 2) {
      return { ok: false, mensagem: 'Descreva a movimentação.' };
    }
    if (!this.formasPagamento.includes(dados.forma)) {
      return { ok: false, mensagem: 'Selecione a forma de pagamento.' };
    }

    if (dados.tipo === 'saida') {
      const disponivel = this.disponivel(caixa.id, dados.forma);
      if (valor > disponivel) {
        return {
          ok: false,
          mensagem: `Saldo insuficiente em ${dados.forma} para esta saída.`,
        };
      }
    }

    try {
      const movimento = mapearMovimentacao(
        await this.api.registrarMovimento({
          tipo: dados.tipo,
          valor,
          descricao,
          forma: dados.forma,
        }),
        this.usuarioAtual,
      );
      this.upsert(this.movimentacoes, movimento);
      return { ok: true, mensagem: 'Movimentação registrada.', id: movimento.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async registrarVenda(pedido: PedidoVenda): Promise<ResultadoOperacao> {
    const caixa = this.caixaAbertoAtual;
    if (!caixa) {
      return { ok: false, mensagem: 'Abra o caixa para registrar a venda.' };
    }

    const profissional = this.profissionais.find((item) => item.id === pedido.profissionalId);
    if (!profissional) {
      return { ok: false, mensagem: 'Selecione o profissional responsável.' };
    }
    if (!profissional.ativo && !pedido.agendamentoId) {
      return { ok: false, mensagem: 'Esta profissional está inativa.' };
    }

    let cliente: Cliente | undefined;
    if (pedido.clienteId) {
      cliente = this.clientes.find((item) => item.id === pedido.clienteId);
      if (!cliente) {
        return { ok: false, mensagem: 'Cliente não encontrado.' };
      }
    }
    const nomeAvulso = cliente ? '' : (pedido.clienteNome?.trim() ?? '');

    let agendamento: AgendamentoDia | undefined;
    if (pedido.agendamentoId) {
      agendamento = this.agendamentos.find((item) => item.id === pedido.agendamentoId);
      if (!agendamento) {
        return { ok: false, mensagem: 'Atendimento não encontrado.' };
      }
      if (agendamento.vendaId || agendamento.status === 'Concluído') {
        return { ok: false, mensagem: 'Este atendimento já foi finalizado.' };
      }
    }

    if (!pedido.itens.length) {
      return { ok: false, mensagem: 'Adicione ao menos um serviço ou produto.' };
    }

    const itens: ItemMovimento[] = [];
    for (const item of pedido.itens) {
      const quantidade = Math.floor(Number(item.quantidade));
      if (!Number.isFinite(quantidade) || quantidade < 1) {
        return { ok: false, mensagem: 'Informe quantidades válidas.' };
      }

      if (item.tipo === 'servico') {
        const servico = this.servicos.find((cadastro) => cadastro.id === item.id);
        if (!servico) {
          return { ok: false, mensagem: 'Serviço não encontrado.' };
        }
        itens.push({
          tipo: 'servico',
          id: servico.id,
          nome: servico.nome,
          quantidade,
          precoUnitario: servico.preco,
        });
        continue;
      }

      const produto = this.produtos.find((cadastro) => cadastro.id === item.id);
      if (!produto || produto.uso !== 'venda') {
        return { ok: false, mensagem: 'Produto não disponível para venda.' };
      }
      if (quantidade > produto.estoqueAtual) {
        return {
          ok: false,
          mensagem: `Estoque insuficiente de ${produto.nome}.`,
        };
      }
      itens.push({
        tipo: 'produto',
        id: produto.id,
        nome: produto.nome,
        quantidade,
        precoUnitario: produto.preco,
      });
    }

    const subtotal = somar(itens.map((item) => item.quantidade * item.precoUnitario));
    const desconto = arredondar(Number(pedido.desconto));
    if (!Number.isFinite(desconto) || desconto < 0) {
      return { ok: false, mensagem: 'Informe um desconto válido.' };
    }
    if (desconto > subtotal) {
      return { ok: false, mensagem: 'O desconto não pode ultrapassar o subtotal.' };
    }
    const teto = this.tetoDesconto(subtotal);
    if (desconto > teto) {
      return { ok: false, mensagem: 'O desconto passa do máximo configurado para esta venda.' };
    }

    const total = arredondar(subtotal - desconto);
    const pagamentos: PagamentoRegistrado[] = (pedido.pagamentos ?? []).map((pagamento) => ({
      forma: pagamento.forma,
      valor: arredondar(Number(pagamento.valor)),
      parcelas: pagamento.parcelas,
    }));

    if (!pagamentos.length || pagamentos.some((pagamento) => !this.formasPagamento.includes(pagamento.forma))) {
      return { ok: false, mensagem: 'Selecione uma forma de pagamento ativa.' };
    }
    for (const pagamento of pagamentos) {
      if (pagamento.forma !== 'Cartão de crédito') {
        pagamento.parcelas = undefined;
        continue;
      }
      const parcelas = pagamento.parcelas ?? 1;
      const maximo = this.maxParcelasCredito();
      if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > maximo) {
        return { ok: false, mensagem: `O crédito aceita de 1 a ${maximo} parcelas.` };
      }
      pagamento.parcelas = parcelas;
    }
    if (pagamentos.some((pagamento) => !Number.isFinite(pagamento.valor) || pagamento.valor < 0)) {
      return { ok: false, mensagem: 'Informe valores válidos para o pagamento.' };
    }
    if (total > 0 && pagamentos.some((pagamento) => pagamento.valor <= 0)) {
      return { ok: false, mensagem: 'Informe valores válidos para o pagamento.' };
    }
    if (new Set(pagamentos.map((pagamento) => pagamento.forma)).size !== pagamentos.length) {
      return { ok: false, mensagem: 'Use formas de pagamento diferentes na divisão.' };
    }
    if (somar(pagamentos.map((pagamento) => pagamento.valor)) !== total) {
      return { ok: false, mensagem: 'A soma dos pagamentos deve ser igual ao total.' };
    }

    try {
      const venda = mapearMovimentacao(
        await this.api.registrarVenda({
          profissionalId: idNumeroObrigatorio(profissional.id),
          clienteId: idNumero(cliente?.id) ?? null,
          clienteNome: nomeAvulso || undefined,
          itens: itens.map((item) => ({
            tipo: item.tipo,
            id: idNumeroObrigatorio(item.id),
            quantidade: item.quantidade,
          })),
          desconto,
          pagamentos: pagamentos.map((pagamento) => ({
            forma: pagamento.forma,
            valor: pagamento.valor,
            parcelas: pagamento.parcelas,
          })),
          agendamentoId: idNumero(agendamento?.id) ?? null,
        }),
        this.usuarioAtual,
      );
      this.upsert(this.movimentacoes, venda);
      if (agendamento) {
        agendamento.status = 'Concluído';
        agendamento.vendaId = venda.id;
      }
      this.produtos
        .filter((produto) => itens.some((item) => item.tipo === 'produto' && item.id === produto.id))
        .forEach((produto) => {
          const item = itens.find((linha) => linha.tipo === 'produto' && linha.id === produto.id);
          if (item) {
            produto.estoqueAtual -= item.quantidade;
            this.atualizarStatus(produto);
          }
        });
      return { ok: true, mensagem: 'Venda registrada.', id: venda.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  resumoCaixa(caixaId: string): ResumoCaixa {
    const caixa = this.caixas.find((item) => item.id === caixaId);
    const movimentos = this.movimentacoes.filter((item) => item.caixaId === caixaId);
    const totais = this.agregar(movimentos);
    const saldoInicial = caixa?.saldoInicial ?? 0;
    const saldoAtual = arredondar(saldoInicial + totais.entradas - totais.saidas);
    return {
      ...totais,
      saldoInicial,
      saldoAtual,
      esperadoDinheiro: this.esperadoDinheiro(caixaId),
    };
  }

  agregar(movimentos: Movimentacao[]): TotaisFinanceiros {
    const vendas = movimentos.filter((item) => item.tipo === 'venda');
    const totalVendas = somar(vendas.map((item) => item.valor));
    const taxas = somar(
      movimentos.flatMap((movimento) => {
        if (movimento.tipo !== 'venda' && movimento.tipo !== 'estorno') {
          return [];
        }
        const sinal = movimento.tipo === 'estorno' ? -1 : 1;
        return movimento.pagamentos.map(
          (pagamento) => (sinal * pagamento.valor * this.taxaDe(pagamento.forma)) / 100,
        );
      }),
    );
    const porForma = new Map<FormaPagamento, number>();

    for (const movimento of movimentos) {
      const sinal = movimento.tipo === 'saida' || movimento.tipo === 'estorno' ? -1 : 1;
      for (const pagamento of movimento.pagamentos) {
        porForma.set(pagamento.forma, arredondar((porForma.get(pagamento.forma) ?? 0) + sinal * pagamento.valor));
      }
    }

    return {
      vendas: totalVendas,
      servicos: somar(
        vendas.flatMap((venda) =>
          venda.itens
            .filter((item) => item.tipo === 'servico')
            .map((item) => item.quantidade * item.precoUnitario),
        ),
      ),
      produtos: somar(
        vendas.flatMap((venda) =>
          venda.itens
            .filter((item) => item.tipo === 'produto')
            .map((item) => item.quantidade * item.precoUnitario),
        ),
      ),
      entradas: somar(
        movimentos
          .filter((item) => item.tipo === 'entrada' || item.tipo === 'venda')
          .map((item) => item.valor),
      ),
      saidas: somar(
        movimentos
          .filter((item) => item.tipo === 'saida' || item.tipo === 'estorno')
          .map((item) => item.valor),
      ),
      descontos: somar(vendas.map((item) => item.desconto)),
      taxas,
      liquido: arredondar(totalVendas - taxas),
      porForma: this.formasConsulta
        .map((forma) => ({ forma, total: arredondar(porForma.get(forma) ?? 0) }))
        .filter((item) => item.total !== 0),
    };
  }

  private esperadoDinheiro(caixaId: string): number {
    const caixa = this.caixas.find((item) => item.id === caixaId);
    const movimentos = this.movimentacoes.filter((item) => item.caixaId === caixaId);
    const liquido = somar(
      movimentos.flatMap((movimento) => {
        const sinal = movimento.tipo === 'saida' || movimento.tipo === 'estorno' ? -1 : 1;
        return movimento.pagamentos
          .filter((pagamento) => pagamento.forma === 'Dinheiro')
          .map((pagamento) => sinal * pagamento.valor);
      }),
    );
    return arredondar((caixa?.saldoInicial ?? 0) + liquido);
  }

  private disponivel(caixaId: string, forma: FormaPagamento): number {
    if (forma === 'Dinheiro') {
      return this.esperadoDinheiro(caixaId);
    }
    const movimentos = this.movimentacoes.filter((item) => item.caixaId === caixaId);
    return somar(
      movimentos.flatMap((movimento) => {
        const sinal = movimento.tipo === 'saida' || movimento.tipo === 'estorno' ? -1 : 1;
        return movimento.pagamentos
          .filter((pagamento) => pagamento.forma === forma)
          .map((pagamento) => sinal * pagamento.valor);
      }),
    );
  }

  async salvarAgendamento(dados: AgendamentoCadastro): Promise<ResultadoOperacao> {
    const clienteNome = dados.clienteNome.trim();
    const hora = this.normalizarHora(dados.hora);
    const observacao = dados.observacao?.trim() ?? '';

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data) || Number.isNaN(new Date(`${dados.data}T00:00:00`).getTime())) {
      return { ok: false, mensagem: 'Informe a data do agendamento.' };
    }
    if (!hora) {
      return { ok: false, mensagem: 'Informe o horário de início.' };
    }

    const atual = dados.id ? this.agendamentos.find((item) => item.id === dados.id) : undefined;
    if (dados.id && !atual) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    if (atual && (atual.status === 'Concluído' || atual.vendaId)) {
      return { ok: false, mensagem: 'Este atendimento já foi finalizado.' };
    }

    const servico = this.servicos.find((item) => item.id === dados.servicoId);
    if (!servico || (servico.id !== atual?.servicoId && (servico.legado || !servico.ativo))) {
      return { ok: false, mensagem: 'Selecione um serviço ativo.' };
    }

    const profissional = this.profissionais.find((item) => item.id === dados.profissionalId);
    if (!profissional || (!profissional.ativo && profissional.id !== atual?.profissionalId)) {
      return { ok: false, mensagem: 'Selecione uma profissional ativa.' };
    }

    const fechado = this.motivoFechado(dados.data, hora, servico.duracaoMinutos);
    if (fechado) {
      return { ok: false, mensagem: fechado };
    }

    const inicio = this.minutos(hora);
    const duracao = servico.duracaoMinutos;
    const conflito = this.agendamentos.some((item) => {
      if (item.id === atual?.id || item.data !== dados.data || !ocupaAgenda(item.status)) {
        return false;
      }
      const outroServico = this.servicos.find((cadastro) => cadastro.id === item.servicoId);
      const outraDuracao = outroServico?.duracaoMinutos ?? 60;
      const outroInicio = this.minutos(item.hora);
      const mesmoHorario = inicio < outroInicio + outraDuracao && outroInicio < inicio + duracao;
      if (!mesmoHorario) {
        return false;
      }
      const mesmoCliente = !!clienteNome && item.cliente.trim().toLowerCase() === clienteNome.toLowerCase();
      return item.profissionalId === profissional.id || mesmoCliente;
    });
    if (conflito) {
      return { ok: false, mensagem: 'Esse horário já está ocupado para a profissional ou para o cliente.' };
    }

    const vinculado = dados.clienteId ? this.clientes.find((item) => item.id === dados.clienteId) : undefined;
    if (dados.clienteId && !vinculado) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    const nomeAgenda = vinculado?.nome ?? (clienteNome || 'Serviço avulso');
    const clienteId = vinculado?.id ?? '';
    try {
      const salvo = mapearAgendamento(
        await this.api.salvarAgendamento(idNumero(dados.id), {
          id: idNumero(dados.id) ?? null,
          servicoId: idNumeroObrigatorio(servico.id),
          data: dados.data,
          hora,
          horaInicio: hora,
          clienteNome: nomeAgenda,
          nome: nomeAgenda,
          clienteId: idNumero(clienteId) ?? null,
          profissionalId: idNumeroObrigatorio(profissional.id),
          observacao,
        }),
      );
      this.upsert(this.agendamentos, salvo);
      await this.acompanharFicha([salvo.id], clienteId, dados.data);
      return { ok: true, mensagem: dados.id ? 'Agendamento atualizado.' : 'Agendamento salvo.', id: salvo.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async moverAgendamento(id: string, data: string, hora: string): Promise<ResultadoOperacao> {
    const atual = this.agendamentos.find((item) => item.id === id);
    if (!atual) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    const normalizada = this.normalizarHora(hora);
    if (!normalizada) {
      return { ok: false, mensagem: 'Informe o horário de início.' };
    }
    try {
      const movido = mapearAgendamento(await this.api.moverAgendamento(idNumeroObrigatorio(id), data, normalizada));
      this.upsert(this.agendamentos, movido);
      return { ok: true, mensagem: 'Agendamento atualizado.', id: movido.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async alterarStatusAgendamento(id: string, status: 'Aguardando' | 'Confirmado'): Promise<ResultadoOperacao> {
    const atual = this.agendamentos.find((item) => item.id === id);
    if (!atual) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    if (atual.status === 'Concluído' || atual.vendaId) {
      return { ok: false, mensagem: 'Este atendimento já foi finalizado.' };
    }
    try {
      const salvo = mapearAgendamento(await this.api.statusAgendamento(idNumeroObrigatorio(id), status));
      this.upsert(this.agendamentos, salvo);
      return {
        ok: true,
        mensagem: status === 'Confirmado' ? 'Agendamento confirmado.' : 'Agendamento marcado como pendente.',
        id: salvo.id,
      };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async excluirAgendamento(id: string): Promise<ResultadoOperacao> {
    const index = this.agendamentos.findIndex((item) => item.id === id);
    if (index < 0) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    const atual = this.agendamentos[index];
    if (atual.status === 'Concluído' || atual.vendaId) {
      return { ok: false, mensagem: 'Este atendimento já foi finalizado.' };
    }
    try {
      await this.api.excluirAgendamento(idNumeroObrigatorio(id));
      this.agendamentos.splice(index, 1);
      await this.acompanharFicha([atual.id], '');
      return { ok: true, mensagem: 'Agendamento excluído.', id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  listarProfissionais(somenteAtivos = true): Profissional[] {
    return this.profissionais.filter((profissional) => !somenteAtivos || profissional.ativo);
  }

  atendimentosDoProfissional(id: string): number {
    return this.agendamentos.filter((agendamento) => agendamento.profissionalId === id).length;
  }

  async salvarProfissional(dados: ProfissionalCadastro): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    const telefone = this.formatarTelefone(dados.telefone);
    const digitos = telefone.replace(/\D/g, '');

    if (!nome) {
      return { ok: false, mensagem: 'Informe o nome da profissional.' };
    }
    if (digitos.length < 10 || digitos.length > 11) {
      return { ok: false, mensagem: 'Informe um telefone válido.' };
    }

    const nomeIgual = nome.toLowerCase();
    const duplicado = this.profissionais.some(
      (profissional) => profissional.id !== dados.id && profissional.nome.trim().toLowerCase() === nomeIgual,
    );
    if (duplicado) {
      return { ok: false, mensagem: 'Já existe uma profissional com esse nome.' };
    }

    try {
      const salva = mapearProfissional(
        await this.api.salvarProfissional(idNumero(dados.id), { nome, telefone }),
      );
      this.upsert(this.profissionais, salva);
      this.atualizarNomeNoHistorico(salva.id, salva.nome);
      return { ok: true, mensagem: dados.id ? 'Profissional atualizada.' : 'Profissional cadastrada.', id: salva.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async definirProfissionalAtivo(id: string, ativo: boolean): Promise<ResultadoOperacao> {
    const profissional = this.profissionais.find((item) => item.id === id);
    if (!profissional) {
      return { ok: false, mensagem: 'Profissional não encontrada.' };
    }
    if (profissional.ativo === ativo) {
      return {
        ok: false,
        mensagem: ativo ? 'Esta profissional já está ativa.' : 'Esta profissional já está inativa.',
      };
    }
    try {
      const salva = mapearProfissional(await this.api.definirProfissionalAtivo(idNumeroObrigatorio(id), ativo));
      this.upsert(this.profissionais, salva);
      return {
        ok: true,
        mensagem: ativo ? 'Profissional reativada.' : 'Profissional desativada.',
        id: salva.id,
      };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  listarServicos(somenteAtivos = true): Servico[] {
    return this.servicos.filter((servico) => !servico.legado && (!somenteAtivos || servico.ativo));
  }

  async salvarServico(dados: ServicoCadastro): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    const descricao = dados.descricao.trim();
    const preco = arredondar(Number(dados.preco));
    const duracao = Math.floor(Number(dados.duracaoMinutos));

    if (!nome) {
      return { ok: false, mensagem: 'Informe o nome do serviço.' };
    }
    if (!descricao) {
      return { ok: false, mensagem: 'Informe a descrição do serviço.' };
    }
    if (!Number.isFinite(preco) || preco <= 0) {
      return { ok: false, mensagem: 'Informe um preço de venda válido.' };
    }
    if (!Number.isFinite(duracao) || duracao < 1) {
      return { ok: false, mensagem: 'Informe a duração em minutos.' };
    }

    const nomeIgual = nome.toLowerCase();
    const duplicado = this.servicos.some(
      (servico) => !servico.legado && servico.id !== dados.id && servico.nome.trim().toLowerCase() === nomeIgual,
    );
    if (duplicado) {
      return { ok: false, mensagem: 'Já existe um serviço com esse nome.' };
    }

    try {
      const salvo = mapearServico(
        await this.api.salvarServico(idNumero(dados.id), { nome, descricao, preco, duracaoMinutos: duracao }),
      );
      this.upsert(this.servicos, salvo);
      return { ok: true, mensagem: dados.id ? 'Serviço atualizado.' : 'Serviço cadastrado.', id: salvo.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async definirServicoAtivo(id: string, ativo: boolean): Promise<ResultadoOperacao> {
    const servico = this.servicos.find((item) => item.id === id && !item.legado);
    if (!servico) {
      return { ok: false, mensagem: 'Serviço não encontrado.' };
    }
    if (servico.ativo === ativo) {
      return { ok: false, mensagem: ativo ? 'Este serviço já está ativo.' : 'Este serviço já está desativado.' };
    }
    try {
      const salvo = mapearServico(await this.api.definirServicoAtivo(idNumeroObrigatorio(id), ativo));
      this.upsert(this.servicos, salvo);
      return {
        ok: true,
        mensagem: ativo ? 'Serviço reativado.' : 'Serviço desativado.',
        id: salvo.id,
      };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  private gerarLancamentosLocais(competencia: string): void {
    if (!/^\d{4}-\d{2}$/.test(competencia)) {
      return;
    }
    for (const contrato of this.contas) {
      for (const mes of this.mesesDevidos(contrato, competencia)) {
        const existe = this.lancamentosConta.some(
          (item) => item.contratoId === contrato.id && item.competencia === mes,
        );
        if (existe) {
          continue;
        }
        const indice = this.indiceParcela(contrato, mes);
        this.lancamentosConta.push({
          id: this.novoId('cta'),
          contratoId: contrato.id,
          competencia: mes,
          vencimento: vencimentoNoMes(mes, contrato.diaVencimento),
          valor: contrato.valor,
          status: 'pendente',
          numeroParcela: contrato.tipo === 'parcelada' ? indice + 1 : undefined,
        });
      }
    }
  }

  contasDoMes(competencia: string): ContaVisivel[] {
    const cache = this.contasMes.get(competencia);
    if (cache) {
      return cache;
    }
    this.gerarLancamentosLocais(competencia);
    const hoje = dataIso();
    return this.lancamentosConta
      .filter((item) => item.competencia === competencia)
      .map((item) => {
        const contrato = this.contas.find((conta) => conta.id === item.contratoId);
        return { item, contrato };
      })
      .filter((linha): linha is { item: ContaLancamento; contrato: ContaContrato } => {
        if (!linha.contrato) {
          return false;
        }
        if (linha.contrato.tipo === 'avulsa' && linha.item.status === 'pago') {
          return false;
        }
        return true;
      })
      .map(({ item, contrato }) => ({
        lancamentoId: item.id,
        contratoId: contrato.id,
        nome: contrato.nome,
        valor: item.valor,
        vencimento: item.vencimento,
        tipo: contrato.tipo,
        status: item.status,
        numeroParcela: item.numeroParcela,
        parcelas: contrato.parcelas,
        vencida: item.status === 'pendente' && item.vencimento < hoje,
        podeEncerrar: contrato.tipo === 'fixa' && !contrato.canceladaApartir,
      }))
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento) || a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  contasAPagar(competencia: string): number {
    return somar(
      this.contasDoMes(competencia)
        .filter((conta) => conta.status === 'pendente')
        .map((conta) => conta.valor),
    );
  }

  listarNotificacoes(lida: boolean, inicio = '', fim = ''): Notificacao[] {
    return this.notificacoes
      .filter((item) => item.lida === lida)
      .filter((item) => !inicio || item.data >= inicio)
      .filter((item) => !fim || item.data <= fim)
      .map((item) => ({ ...item }))
      .sort((a, b) => b.data.localeCompare(a.data) || a.titulo.localeCompare(b.titulo, 'pt-BR'));
  }

  quantidadeNaoLidas(): number {
    return this.notificacoes.filter((item) => !item.lida).length;
  }

  async marcarComoLida(id: string): Promise<ResultadoOperacao> {
    const notificacao = this.notificacoes.find((item) => item.id === id);
    if (!notificacao) {
      return { ok: false, mensagem: 'Notificação não encontrada.' };
    }
    try {
      const lida = mapearNotificacao(await this.api.marcarNotificacaoLida(idNumeroObrigatorio(id)));
      this.upsert(this.notificacoes, lida);
      return { ok: true, mensagem: 'Notificação marcada como lida.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async criarConta(dados: NovaConta): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    const valor = arredondar(Number(dados.valor));
    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome da conta.' };
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      return { ok: false, mensagem: 'Informe um valor maior que zero.' };
    }
    if (dados.tipo !== 'fixa' && dados.tipo !== 'parcelada' && dados.tipo !== 'avulsa') {
      return { ok: false, mensagem: 'Selecione o tipo da conta.' };
    }
    if (dados.status !== 'pendente' && dados.status !== 'pago') {
      return { ok: false, mensagem: 'Selecione se a conta está pendente ou paga.' };
    }

    let dia = Number(dados.diaVencimento);
    let inicio = competenciaDe(dataIso());
    if (dados.tipo === 'fixa') {
      if (!Number.isInteger(dia) || dia < 1 || dia > 31) {
        return { ok: false, mensagem: 'Informe o dia de vencimento, de 1 a 31.' };
      }
    } else {
      if (!dados.vencimento || !/^\d{4}-\d{2}-\d{2}$/.test(dados.vencimento)) {
        return { ok: false, mensagem: 'Informe a data de vencimento.' };
      }
      dia = Number(dados.vencimento.slice(8, 10));
      inicio = competenciaDe(dados.vencimento);
    }

    let parcelas: number | undefined;
    if (dados.tipo === 'parcelada') {
      parcelas = Math.floor(Number(dados.parcelas));
      if (!Number.isFinite(parcelas) || parcelas < 2 || parcelas > 48) {
        return { ok: false, mensagem: 'Informe de 2 a 48 parcelas.' };
      }
    }

    try {
      const criada = mapearConta(
        await this.api.criarConta({
          nome,
          valor,
          tipo: dados.tipo,
          diaVencimento: dia,
          vencimento: dados.tipo === 'fixa' ? null : dados.vencimento,
          parcelas,
          status: dados.status,
        }),
      );
      await this.garantirLancamentos(inicio);
      const mensagem =
        dados.tipo === 'avulsa' && dados.status === 'pago'
          ? 'Conta avulsa paga. Ela sai da lista e entra nas saídas de hoje.'
          : 'Conta registrada.';
      return { ok: true, mensagem, id: criada.contratoId };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async marcarContaPaga(lancamentoId: string): Promise<ResultadoOperacao> {
    const visivel = [...this.contasMes.values()].flat().find((item) => item.lancamentoId === lancamentoId);
    if (visivel?.status === 'pago') {
      return { ok: false, mensagem: 'Esta conta já está paga.' };
    }
    try {
      const paga = mapearConta(await this.api.pagarConta(idNumeroObrigatorio(lancamentoId)));
      await this.garantirLancamentos(competenciaDe(paga.vencimento));
      const avulsa = paga.tipo === 'avulsa';
      return {
        ok: true,
        mensagem: avulsa ? 'Conta avulsa paga. Ela sai da lista e entra nas saídas.' : 'Conta marcada como paga.',
        id: paga.lancamentoId,
      };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async encerrarContaFixa(contratoId: string): Promise<ResultadoOperacao> {
    try {
      await this.api.encerrarConta(idNumeroObrigatorio(contratoId));
      for (const [competencia, contas] of this.contasMes) {
        this.contasMes.set(
          competencia,
          contas.map((conta) =>
            conta.contratoId === contratoId ? { ...conta, podeEncerrar: false } : conta,
          ),
        );
      }
      return { ok: true, mensagem: 'A conta deixa de se repetir a partir do próximo mês.', id: contratoId };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async registrarSangria(dados: { descricao: string; valor: number; data: string }): Promise<ResultadoOperacao> {
    const descricao = dados.descricao.trim();
    const valor = arredondar(Number(dados.valor));
    if (descricao.length < 2) {
      return { ok: false, mensagem: 'Descreva a sangria.' };
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      return { ok: false, mensagem: 'Informe um valor maior que zero.' };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data) || dados.data > dataIso()) {
      return { ok: false, mensagem: 'Informe uma data até hoje.' };
    }
    try {
      const sangria = mapearSangria(await this.api.registrarSangria({ descricao, valor, data: dados.data }));
      this.upsert(this.sangrias, sangria);
      return { ok: true, mensagem: 'Sangria registrada.', id: sangria.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  sangriasDoPeriodo(inicio: string, fim: string): Sangria[] {
    return this.sangrias
      .filter((item) => item.data >= inicio && item.data <= fim)
      .sort((a, b) => b.data.localeCompare(a.data) || b.id.localeCompare(a.id));
  }

  totaisPeriodo(inicio: string, fim: string): TotaisPeriodo {
    const movimentos = this.movimentosNoPeriodo(inicio, fim);
    const entradas = somar(
      movimentos.filter((item) => item.tipo === 'entrada' || item.tipo === 'venda').map((item) => item.valor),
    );
    const saidasCaixa = somar(
      movimentos.filter((item) => item.tipo === 'saida' || item.tipo === 'estorno').map((item) => item.valor),
    );
    const sangrias = somar(this.sangriasDoPeriodo(inicio, fim).map((item) => item.valor));
    const contasPagas = somar(
      this.lancamentosConta
        .filter((item) => item.status === 'pago' && item.pagoEm)
        .filter((item) => {
          const dia = dataIso(new Date(item.pagoEm as string));
          return dia >= inicio && dia <= fim;
        })
        .map((item) => item.valor),
    );
    const vendas = movimentos.filter((item) => item.tipo === 'venda');
    const totalVendas = somar(vendas.map((item) => item.valor));
    return {
      entradas,
      saidas: arredondar(saidasCaixa + sangrias + contasPagas),
      lucro: arredondar(entradas - (saidasCaixa + sangrias + contasPagas)),
      vendas: totalVendas,
      quantidadeVendas: vendas.length,
      ticket: vendas.length ? arredondar(totalVendas / vendas.length) : 0,
    };
  }

  receitaPorServico(inicio: string, fim: string): LinhaParticipacao[] {
    return this.participacao(
      this.movimentosNoPeriodo(inicio, fim).filter((item) => item.tipo === 'venda'),
      (item) => item.tipo === 'servico',
    );
  }

  receitaPorForma(inicio: string, fim: string): LinhaParticipacao[] {
    const totais = new Map<FormaPagamento, number>();
    for (const forma of this.formasPagamento) {
      totais.set(forma, 0);
    }
    for (const movimento of this.movimentosNoPeriodo(inicio, fim)) {
      if (movimento.tipo !== 'venda' && movimento.tipo !== 'entrada') {
        continue;
      }
      for (const pagamento of movimento.pagamentos) {
        totais.set(pagamento.forma, arredondar((totais.get(pagamento.forma) ?? 0) + pagamento.valor));
      }
    }
    const ordem: FormaPagamento[] = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito'];
    const linhas = ordem.map((forma) => ({
      nome: forma,
      quantidade: 0,
      total: arredondar(totais.get(forma) ?? 0),
      percentual: 0,
    }));
    return this.comPercentual(linhas);
  }

  receitaServicoProduto(inicio: string, fim: string): { servicos: LinhaParticipacao; revenda: LinhaParticipacao } {
    const vendas = this.movimentosNoPeriodo(inicio, fim).filter((item) => item.tipo === 'venda');
    const servicos = this.somarItens(vendas, 'servico');
    const revenda = this.somarItens(vendas, 'produto');
    const total = arredondar(servicos.total + revenda.total);
    servicos.percentual = total ? arredondar((servicos.total / total) * 100) : 0;
    revenda.percentual = total ? arredondar(100 - servicos.percentual) : 0;
    if (!total) {
      revenda.percentual = 0;
    }
    return { servicos, revenda };
  }

  private mesesDevidos(contrato: ContaContrato, ate: string): string[] {
    const meses: string[] = [];
    if (contrato.tipo === 'avulsa') {
      if (compararCompetencia(contrato.inicioCompetencia, ate) <= 0) {
        meses.push(contrato.inicioCompetencia);
      }
      return meses;
    }
    if (contrato.tipo === 'parcelada') {
      const total = contrato.parcelas ?? 0;
      for (let indice = 0; indice < total; indice += 1) {
        const mes = deslocarMes(contrato.inicioCompetencia, indice);
        if (compararCompetencia(mes, ate) <= 0) {
          meses.push(mes);
        }
      }
      return meses;
    }
    let mes = contrato.inicioCompetencia;
    while (compararCompetencia(mes, ate) <= 0 && meses.length < 36) {
      if (!contrato.canceladaApartir || compararCompetencia(mes, contrato.canceladaApartir) < 0) {
        meses.push(mes);
      }
      mes = deslocarMes(mes, 1);
    }
    return meses;
  }

  private indiceParcela(contrato: ContaContrato, competencia: string): number {
    let indice = 0;
    let mes = contrato.inicioCompetencia;
    while (mes !== competencia && indice < 60) {
      mes = deslocarMes(mes, 1);
      indice += 1;
    }
    return indice;
  }

  private movimentosNoPeriodo(inicio: string, fim: string): Movimentacao[] {
    return this.movimentacoes.filter((item) => {
      const dia = dataIso(new Date(item.dataHora));
      return dia >= inicio && dia <= fim;
    });
  }

  private participacao(vendas: Movimentacao[], aceita: (item: ItemMovimento) => boolean): LinhaParticipacao[] {
    const mapa = new Map<string, LinhaParticipacao>();
    for (const venda of vendas) {
      const bruto = somar(venda.itens.map((item) => item.quantidade * item.precoUnitario));
      const fator = bruto > 0 ? venda.valor / bruto : 0;
      for (const item of venda.itens.filter(aceita)) {
        const atual = mapa.get(item.nome) ?? { nome: item.nome, quantidade: 0, total: 0, percentual: 0 };
        atual.quantidade += item.quantidade;
        atual.total = arredondar(atual.total + item.quantidade * item.precoUnitario * fator);
        mapa.set(item.nome, atual);
      }
    }
    return this.comPercentual([...mapa.values()].sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, 'pt-BR')));
  }

  private somarItens(vendas: Movimentacao[], tipo: 'servico' | 'produto'): LinhaParticipacao {
    let quantidade = 0;
    let total = 0;
    for (const venda of vendas) {
      const bruto = somar(venda.itens.map((item) => item.quantidade * item.precoUnitario));
      const fator = bruto > 0 ? venda.valor / bruto : 0;
      for (const item of venda.itens.filter((linha) => linha.tipo === tipo)) {
        quantidade += item.quantidade;
        total = arredondar(total + item.quantidade * item.precoUnitario * fator);
      }
    }
    return { nome: tipo === 'servico' ? 'Serviços' : 'Revenda', quantidade, total, percentual: 0 };
  }

  private comPercentual(linhas: LinhaParticipacao[]): LinhaParticipacao[] {
    const total = somar(linhas.map((linha) => linha.total));
    if (!total) {
      return linhas.map((linha) => ({ ...linha, percentual: 0 }));
    }
    const ultimoComValor = linhas.reduce((indice, linha, posicao) => (linha.total ? posicao : indice), -1);
    let acumulado = 0;
    return linhas.map((linha, indice) => {
      if (!linha.total) {
        return { ...linha, percentual: 0 };
      }
      const percentual =
        indice === ultimoComValor ? arredondar(100 - acumulado) : arredondar((linha.total / total) * 100);
      acumulado = arredondar(acumulado + percentual);
      return { ...linha, percentual };
    });
  }

  async salvarCliente(dados: ClienteCadastro): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    const telefone = this.formatarTelefone(dados.telefone);
    const digitos = telefone.replace(/\D/g, '');
    if (!nome) {
      return { ok: false, mensagem: 'Informe o nome da cliente.' };
    }
    if (digitos.length < 10 || digitos.length > 11) {
      return { ok: false, mensagem: 'Informe um telefone com DDD.' };
    }

    const duplicado = this.clientes.some(
      (cliente) => cliente.id !== dados.id && cliente.telefone.replace(/\D/g, '') === digitos,
    );
    if (duplicado) {
      return { ok: false, mensagem: 'Já existe uma cliente com esse telefone.' };
    }

    const email = dados.email?.trim() ?? '';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, mensagem: 'Informe um e-mail válido ou deixe o campo vazio.' };
    }
    const nascimento = dados.nascimento?.trim() ?? '';
    if (nascimento && !/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
      return { ok: false, mensagem: 'Informe a data de nascimento.' };
    }
    if (nascimento && nascimento > dataIso()) {
      return { ok: false, mensagem: 'A data de nascimento não pode ser futura.' };
    }

    const instagram = (dados.instagram ?? '').trim().replace(/^@+/, '');
    const tags = [...new Set((dados.tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
    const desejaAtivo = dados.ativo !== false;
    const registro = {
      nome,
      telefone,
      nascimento,
      email,
      instagram,
      observacoes: dados.observacoes?.trim() ?? '',
      consentimentoSaude: !!dados.consentimentoSaude,
      tags,
      ativo: desejaAtivo,
    };

    if (dados.id) {
      const atual = this.clientes.find((cliente) => cliente.id === dados.id);
      if (!atual) {
        return { ok: false, mensagem: 'Cliente não encontrada.' };
      }
      const alergia = atual.anamnese.alergias.trim();
      const semAlergia = registro.tags.filter((tag) => tag.toLowerCase() !== 'alergia');
      registro.tags = alergia ? [...semAlergia, 'Alergia'] : semAlergia;
    }

    try {
      const salva = mapearCliente(
        await this.api.salvarCliente(idNumero(dados.id), {
          ...registro,
          contato: telefone,
          senhaAdmin: dados.senhaAdmin,
        }),
      );
      this.upsert(this.clientes, salva);
      this.atualizarNomeCliente(salva.id, salva.nome);
      return { ok: true, mensagem: dados.id ? 'Cliente atualizada.' : 'Cliente cadastrada.', id: salva.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async definirClienteAtivo(id: string, ativo: boolean, senhaAdmin: string): Promise<ResultadoOperacao> {
    const cliente = this.clientes.find((item) => item.id === id);
    if (!cliente) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    if (cliente.ativo === ativo) {
      return { ok: false, mensagem: ativo ? 'Essa cliente já está ativa.' : 'Essa cliente já está inativa.' };
    }
    if (!senhaAdmin.trim()) {
      return { ok: false, mensagem: 'Informe a senha de administradora para alterar o cadastro.' };
    }
    return this.salvarCliente({
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      nascimento: cliente.nascimento,
      email: cliente.email,
      instagram: cliente.instagram,
      observacoes: cliente.observacoes,
      tags: cliente.tags,
      consentimentoSaude: cliente.consentimentoSaude,
      ativo,
      senhaAdmin,
    });
  }

  async salvarAnamnese(clienteId: string, anamnese: AnamneseCapilar, consentimento: boolean): Promise<ResultadoOperacao> {
    const cliente = this.clientes.find((item) => item.id === clienteId);
    if (!cliente) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    const alergias = anamnese.alergias.trim();
    const saude = anamnese.observacoesSaude.trim();
    const pedeSaude = !!alergias || !!saude || anamnese.condicoes.length > 0 || anamnese.testeMecha !== null;
    if (pedeSaude && !consentimento) {
      return { ok: false, mensagem: 'Marque o consentimento para guardar dados de saúde.' };
    }
    try {
      const salva = mapearCliente(
        await this.api.salvarAnamnese(idNumeroObrigatorio(clienteId), anamneseParaApi(anamnese, consentimento)),
      );
      this.upsert(this.clientes, salva);
      return { ok: true, mensagem: 'Ficha de anamnese salva.', id: salva.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  fichasDaCliente(clienteId: string): FichaVisita[] {
    return this.fichas
      .filter((ficha) => ficha.clienteId === clienteId)
      .sort((a, b) => b.data.localeCompare(a.data) || b.id.localeCompare(a.id));
  }

  ultimaFormula(clienteId: string): FichaVisita | null {
    return this.fichasDaCliente(clienteId)[0] ?? null;
  }

  resumoCliente(clienteId: string): ResumoCliente {
    const concluidos = this.agendamentos.filter((item) => item.clienteId === clienteId && item.status === 'Concluído');
    const manuais = this.fichas.filter((ficha) => ficha.clienteId === clienteId && !ficha.agendamentoId);
    const manuaisSemVenda = manuais.filter((ficha) => !ficha.vendaId);
    const vendas = this.movimentacoes.filter((item) => item.tipo === 'venda' && item.clienteId === clienteId);
    const comVenda = new Set(vendas.map((item) => item.agendamentoId).filter((id): id is string => !!id));
    const semVenda = concluidos.filter((item) => !item.vendaId && !comVenda.has(item.id));
    const totalGasto = arredondar(
      somar(vendas.map((item) => item.valor)) +
        somar(semVenda.map((item) => item.preco)) +
        somar(manuaisSemVenda.map((item) => item.valor)),
    );
    const datas = [...concluidos.map((item) => item.data), ...manuais.map((item) => item.data)].sort();
    const totalVisitas = concluidos.length + manuais.length;
    const agora = new Date();
    const hoje = dataIso(agora);
    const hora = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    const proximo =
      this.agendamentos
        .filter((item) => {
          if (item.clienteId !== clienteId || item.status === 'Cancelado' || item.status === 'Falta' || item.status === 'Concluído') {
            return false;
          }
          return item.data > hoje || (item.data === hoje && item.hora >= hora);
        })
        .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))[0] ?? null;

    return {
      totalVisitas,
      ultimaVisita: datas.at(-1) ?? null,
      totalGasto,
      ticketMedio: totalVisitas ? arredondar(totalGasto / totalVisitas) : 0,
      proximo,
    };
  }

  async salvarFicha(dados: FichaVisitaCadastro): Promise<ResultadoOperacao> {
    const cliente = this.clientes.find((item) => item.id === dados.clienteId);
    if (!cliente) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    const servico = dados.servico.trim();
    const profissional = dados.profissional.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) {
      return { ok: false, mensagem: 'Informe a data do atendimento.' };
    }
    if (!servico) {
      return { ok: false, mensagem: 'Informe o serviço.' };
    }
    if (!profissional) {
      return { ok: false, mensagem: 'Informe a profissional.' };
    }
    const produtos = dados.produtos
      .map((produto) => ({
        marca: produto.marca.trim(),
        linha: produto.linha.trim(),
        cor: produto.cor.trim(),
        oxidante: produto.oxidante.trim(),
        proporcao: produto.proporcao.trim(),
        tempoPausa: produto.tempoPausa.trim(),
      }))
      .filter((produto) => Object.values(produto).some(Boolean));
    const valor = arredondar(Number(dados.valor ?? 0));
    if (!Number.isFinite(valor) || valor < 0) {
      return { ok: false, mensagem: 'Informe o valor cobrado.' };
    }

    try {
      const ficha = mapearFichaVisita(
        await this.api.salvarFichaVisita(idNumeroObrigatorio(cliente.id), {
          id: idNumero(dados.id) ?? null,
          clienteId: idNumeroObrigatorio(cliente.id),
          agendamentoId: idNumero(dados.agendamentoId) ?? null,
          data: dados.data,
          servico,
          profissional,
          produtos,
          observacoes: dados.observacoes?.trim() ?? '',
          retorno: dados.retorno?.trim() ?? '',
          fotos: (dados.fotos ?? []).map((foto) => ({ momento: foto.momento, dados: foto.dados })),
          valor,
          vendaId: idNumero(dados.vendaId) ?? null,
        }),
      );
      this.upsert(this.fichas, ficha);
      return {
        ok: true,
        mensagem: dados.id ? 'Ficha do atendimento atualizada.' : 'Ficha do atendimento registrada.',
        id: ficha.id,
      };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  senhaConfere(senha: string | undefined | null): boolean {
    return typeof senha === 'string' && senha.length > 0 && senha === this.senha;
  }

  async salvarResumoCliente(clienteId: string, dados: { alergia: string; observacoesSaude: string }): Promise<ResultadoOperacao> {
    const cliente = this.clientes.find((item) => item.id === clienteId);
    if (!cliente) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    try {
      const salva = mapearCliente(
        await this.api.salvarResumoCliente(idNumeroObrigatorio(clienteId), {
          alergia: dados.alergia,
          observacoesSaude: dados.observacoesSaude,
        }),
      );
      this.upsert(this.clientes, salva);
      return { ok: true, mensagem: 'Resumo atualizado.', id: salva.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  fichaDoAtendimento(visita: FichaVisita): FichaAtendimento | null {
    return (
      this.fichasAtendimento.find(
        (ficha) =>
          ficha.atendimentoId === visita.id || (!!visita.agendamentoId && ficha.agendamentoId === visita.agendamentoId),
      ) ?? null
    );
  }

  fichaDoContexto(clienteId: string, agendamentoId?: string, vinculo?: string): FichaAtendimento | null {
    if (!agendamentoId && !vinculo) {
      return null;
    }
    return (
      this.fichasAtendimento.find((ficha) => {
        if (ficha.clienteId !== clienteId) {
          return false;
        }
        if (agendamentoId && (ficha.agendamentoId === agendamentoId || ficha.vinculo === agendamentoId)) {
          return true;
        }
        return !!vinculo && (ficha.vinculo === vinculo || ficha.agendamentoId === vinculo);
      }) ?? null
    );
  }

  fichasAnteriores(clienteId: string, agendamentoId?: string, vinculo?: string): FichaAtendimento[] {
    const atual = this.fichaDoContexto(clienteId, agendamentoId, vinculo);
    return this.fichasAtendimento
      .filter((ficha) => ficha.clienteId === clienteId && ficha.id !== atual?.id)
      .sort((a, b) => b.data.localeCompare(a.data) || b.id.localeCompare(a.id));
  }

  ultimaFichaAtendimento(clienteId: string, ignorarId?: string): FichaAtendimento | null {
    return this.fichasAnteriores(clienteId).find((ficha) => ficha.id !== ignorarId) ?? null;
  }

  async salvarFichaAtendimento(dados: FichaAtendimentoCadastro, senhaAdmin?: string): Promise<ResultadoOperacao> {
    const cliente = this.clientes.find((item) => item.id === dados.clienteId);
    if (!cliente) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    if (!dataIsoValida(dados.data)) {
      return { ok: false, mensagem: 'Informe a data do atendimento.' };
    }
    const procedimentos = dados.procedimentos.filter((item) =>
      (PROCEDIMENTOS_ATENDIMENTO as readonly string[]).includes(item),
    );
    const progressiva: ProgressivaAtendimento =
      dados.progressiva === 'com' || dados.progressiva === 'sem' || dados.progressiva === 'nao' ? dados.progressiva : '';
    const registro: FichaAtendimento = {
      id: dados.id ?? this.novoId('fa'),
      clienteId: cliente.id,
      agendamentoId: dados.agendamentoId || undefined,
      atendimentoId: dados.atendimentoId || undefined,
      vinculo: dados.vinculo || undefined,
      data: dados.data,
      status: dados.status === 'finalizada' ? 'finalizada' : 'rascunho',
      procedimentos,
      cor: dados.cor.trim(),
      progressiva,
      alergia: dados.alergia.trim(),
      observacoes: dados.observacoes?.trim() ?? '',
    };

    if (dados.id) {
      const index = this.fichasAtendimento.findIndex((item) => item.id === dados.id);
      if (index < 0) {
        return { ok: false, mensagem: 'Ficha não encontrada.' };
      }
      const atual = this.fichasAtendimento[index];
      if (atual.clienteId !== cliente.id) {
        return { ok: false, mensagem: 'Esta ficha é de outra cliente.' };
      }
      if (atual.status === 'finalizada' && atual.data !== dataIso() && !this.senhaConfere(senhaAdmin)) {
        return { ok: false, mensagem: 'Ficha de outro dia só a administração reabre.' };
      }
      registro.id = atual.id;
      registro.atendimentoId = dados.atendimentoId || atual.atendimentoId;
      registro.agendamentoId = dados.agendamentoId || atual.agendamentoId;
      registro.vinculo = dados.vinculo || atual.vinculo;
    }

    try {
      const salva = mapearFichaAtendimento(
        await this.api.salvarFichaAtendimento(idNumeroObrigatorio(cliente.id), {
          id: idNumero(registro.id) ?? null,
          clienteId: idNumeroObrigatorio(cliente.id),
          agendamentoId: idNumero(registro.agendamentoId) ?? null,
          atendimentoId: idNumero(registro.atendimentoId) ?? null,
          vinculo: registro.vinculo,
          data: registro.data,
          status: registro.status,
          procedimentos: registro.procedimentos,
          cor: registro.cor,
          progressiva: registro.progressiva,
          alergia: registro.alergia,
          observacoes: registro.observacoes,
          senhaAdmin,
        }),
      );
      this.upsert(this.fichasAtendimento, salva);
      const temFichaMaisNova = this.fichasAtendimento.some(
        (outra) => outra.clienteId === cliente.id && outra.id !== salva.id && outra.data > salva.data,
      );
      if (!temFichaMaisNova) {
        this.definirAlergia(cliente, salva.alergia);
      }
      const verbo = salva.status === 'finalizada' ? 'Ficha finalizada.' : 'Rascunho da ficha salvo.';
      return { ok: true, mensagem: verbo, id: salva.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async assumirVinculo(vinculo: string, agendamentoId: string): Promise<void> {
    if (!vinculo || vinculo === agendamentoId) {
      return;
    }
    const agendamento = this.agendamentos.find((item) => item.id === agendamentoId);
    try {
      await this.api.assumirVinculo(idNumeroObrigatorio(agendamentoId), vinculo);
    } catch {
      // o cache local ainda acompanha a ficha
    }
    for (const ficha of this.fichasAtendimento) {
      if (ficha.vinculo !== vinculo) {
        continue;
      }
      ficha.agendamentoId = agendamentoId;
      ficha.vinculo = undefined;
      if (!agendamento?.clienteId || ficha.atendimentoId) {
        continue;
      }
      ficha.clienteId = agendamento.clienteId;
      ficha.data = agendamento.data;
    }
  }

  /**
   * A ficha do serviço acompanha a cliente e a data do agendamento enquanto ainda não entrou no histórico.
   * Sem cliente, o rascunho é descartado.
   */
  async acompanharFicha(chaves: string[], clienteId: string, data?: string): Promise<void> {
    const refs = chaves.filter(Boolean);
    if (!refs.length) {
      return;
    }
    for (let indice = this.fichasAtendimento.length - 1; indice >= 0; indice -= 1) {
      const ficha = this.fichasAtendimento[indice];
      const ligada = refs.some((chave) => ficha.agendamentoId === chave || ficha.vinculo === chave);
      if (!ligada || ficha.atendimentoId) {
        continue;
      }
      if (!clienteId) {
        this.fichasAtendimento.splice(indice, 1);
        continue;
      }
      ficha.clienteId = clienteId;
      if (data) {
        ficha.data = data;
      }
    }
  }

  /**
   * Fecha o atendimento: a ficha do serviço vira uma visita no histórico.
   * Sem ficha de serviço, só grava visita quando o caixa pede o retorno.
   */
  async publicarFichaDoAgendamento(
    agendamentoId: string,
    extra?: {
      servico?: string;
      profissional?: string;
      valor?: number;
      observacoes?: string;
      retorno?: string;
      registrarVisita?: boolean;
    },
  ): Promise<ResultadoOperacao | null> {
    const fichaServico = this.fichasAtendimento.find(
      (ficha) => ficha.agendamentoId === agendamentoId || ficha.vinculo === agendamentoId,
    );
    const agendamento = this.agendamentos.find((item) => item.id === agendamentoId);
    if (!agendamento?.clienteId || (!fichaServico && !extra?.registrarVisita)) {
      return null;
    }
    if (fichaServico) {
      fichaServico.agendamentoId = agendamentoId;
      fichaServico.vinculo = undefined;
      fichaServico.clienteId = agendamento.clienteId;
    }

    const servico = extra?.servico?.trim() || agendamento.servico;
    const profissional = extra?.profissional?.trim() || agendamento.profissional;
    const valor = extra?.valor ?? agendamento.preco;
    const existente = this.fichas.find((ficha) => ficha.agendamentoId === agendamentoId);
    if (existente) {
      existente.servico = servico;
      existente.profissional = profissional;
      existente.valor = arredondar(Number(valor) || 0);
      existente.data = agendamento.data;
      if (extra?.observacoes !== undefined) {
        existente.observacoes = extra.observacoes.trim();
      }
      if (extra?.retorno !== undefined) {
        existente.retorno = extra.retorno.trim();
      }
      if (fichaServico) {
        fichaServico.atendimentoId = existente.id;
      }
      return { ok: true, mensagem: 'Ficha do atendimento atualizada.', id: existente.id };
    }

    const criada = await this.salvarFicha({
      clienteId: agendamento.clienteId,
      agendamentoId,
      data: agendamento.data,
      servico,
      profissional,
      produtos: [],
      observacoes: extra?.observacoes,
      retorno: extra?.retorno,
      valor,
    });
    if (criada.id && fichaServico) {
      fichaServico.atendimentoId = criada.id;
    }
    return criada;
  }

  async publicarFichaAvulsa(
    vinculo: string,
    dados: { clienteId: string; servico: string; profissional: string; valor: number; data: string; vendaId?: string },
  ): Promise<void> {
    const anamnese = this.fichasAtendimento.find((ficha) => ficha.vinculo === vinculo && ficha.clienteId === dados.clienteId);
    if (!anamnese) {
      return;
    }
    const criada = await this.salvarFicha({
      clienteId: dados.clienteId,
      data: dados.data,
      servico: dados.servico,
      profissional: dados.profissional,
      produtos: [],
      valor: dados.valor,
      vendaId: dados.vendaId,
    });
    if (!criada.id) {
      return;
    }
    anamnese.atendimentoId = criada.id;
    anamnese.vinculo = undefined;
    anamnese.data = dados.data;
  }

  private definirAlergia(cliente: Cliente, alergia: string): void {
    const texto = alergia.trim();
    cliente.anamnese = { ...cliente.anamnese, alergias: texto };
    const semAlergia = cliente.tags.filter((tag) => tag.toLowerCase() !== 'alergia');
    cliente.tags = texto ? [...semAlergia, 'Alergia'] : semAlergia;
  }

  private normalizarHora(valor: string): string {
    const match = valor.trim().match(/^(\d{2}):(\d{2})/);
    if (!match) {
      return '';
    }
    const hora = Number(match[1]);
    const minuto = Number(match[2]);
    if (hora > 23 || minuto > 59) {
      return '';
    }
    return `${match[1]}:${match[2]}`;
  }

  private minutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  private atualizarNomeCliente(clienteId: string, nome: string): void {
    for (const agendamento of this.agendamentos) {
      if (agendamento.clienteId === clienteId) {
        agendamento.cliente = nome;
      }
    }
    for (const movimento of this.movimentacoes) {
      if (movimento.clienteId === clienteId) {
        movimento.cliente = nome;
      }
    }
  }

  private atualizarNomeNoHistorico(profissionalId: string, nome: string): void {
    for (const agendamento of this.agendamentos) {
      if (agendamento.profissionalId === profissionalId) {
        agendamento.profissional = nome;
      }
    }
    for (const movimento of this.movimentacoes) {
      if (movimento.profissionalId === profissionalId) {
        movimento.profissional = nome;
      }
    }
  }

  private formatarTelefone(valor: string): string {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length < 10) {
      return valor.trim();
    }
    const ddd = digitos.slice(0, 2);
    const numero = digitos.slice(2);
    if (numero.length === 9) {
      return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
    }
    return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
  }

  private inteiroNaoNegativo(valor: number): number | null {
    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero < 0 || !Number.isInteger(numero)) {
      return null;
    }
    return numero;
  }

  private atualizarStatus(produto: ProdutoEstoque): void {
    if (produto.estoqueAtual <= produto.estoqueMinimo / 4) {
      produto.status = 'critico';
      return;
    }
    if (produto.estoqueAtual < produto.estoqueMinimo) {
      produto.status = 'baixo';
      return;
    }
    produto.status = 'normal';
  }

  listarHorarios(): HorarioFuncionamento[] {
    return this.horarios.map((horario) => ({ ...horario }));
  }

  listarDadosSalao(): DadosSalao {
    return { ...this.dadosSalao };
  }

  async salvarDadosSalao(dados: DadosSalao): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    const endereco = dados.endereco.trim();
    const digitos = dados.telefone.replace(/\D/g, '');
    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome do salão.' };
    }
    if (digitos.length < 10 || digitos.length > 11) {
      return { ok: false, mensagem: 'Informe um telefone válido.' };
    }
    if (endereco.length < 5) {
      return { ok: false, mensagem: 'Informe o endereço do salão.' };
    }
    try {
      const salvo = mapearDadosSalao(
        await this.api.salvarDadosSalao({
          nome,
          telefone: this.formatarTelefone(dados.telefone),
          endereco,
        }),
      );
      this.dadosSalao = salvo;
      return { ok: true, mensagem: 'Dados do salão salvos.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async salvarDescontoMaximo(percentual: number): Promise<ResultadoOperacao> {
    const valor = Number(percentual);
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
      return { ok: false, mensagem: 'Informe um desconto máximo entre 0 e 100%.' };
    }
    try {
      const salvo = await this.api.salvarDesconto(arredondar(valor));
      this.descontoMaximoPercentual = numeroDe(salvo.descontoMaximoPercentual, arredondar(valor));
      return { ok: true, mensagem: 'Desconto máximo salvo.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  tetoDesconto(subtotal: number): number {
    const base = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;
    const percentual = Number(this.descontoMaximoPercentual);
    const limitado = Number.isFinite(percentual) ? Math.min(100, Math.max(0, percentual)) : 100;
    return arredondar((base * limitado) / 100);
  }

  minutoFechado(iso: string, hora: string): boolean {
    return this.motivoFechado(iso, hora, 1) !== null;
  }

  /**
   * O intervalo [hora, hora + duração) precisa caber no expediente e fora dos bloqueios.
   * Retorna a frase para a tela, ou null quando o horário está aberto.
   */
  motivoFechado(iso: string, hora: string, duracaoMinutos: number): string | null {
    const inicio = this.normalizarHora(hora);
    if (!inicio || !dataIsoValida(iso)) {
      return 'Informe um horário válido.';
    }
    const horario = this.horarioNaData(iso);
    if (!horario?.ativo) {
      return 'O salão está fechado nesse dia.';
    }
    const de = this.minutos(inicio);
    const ate = de + Math.max(1, duracaoMinutos);
    if (de < this.minutos(horario.abertura) || ate > this.minutos(horario.fechamento)) {
      return 'O salão está fechado nesse horário.';
    }
    for (const bloqueio of this.bloqueios) {
      if (iso < bloqueio.dataInicio || iso > bloqueio.dataFim) {
        continue;
      }
      if (bloqueio.diaInteiro) {
        return `Horário bloqueado: ${bloqueio.motivo}.`;
      }
      const blocoDe = this.minutos(bloqueio.horaInicio);
      const blocoAte = this.minutos(bloqueio.horaFim);
      if (de < blocoAte && blocoDe < ate) {
        return `Horário bloqueado: ${bloqueio.motivo}.`;
      }
    }
    return null;
  }

  private horarioNaData(iso: string): HorarioFuncionamento | undefined {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return this.horarios.find((item) => item.dia === new Date(ano, mes - 1, dia).getDay());
  }

  async salvarHorarios(horarios: HorarioFuncionamento[]): Promise<ResultadoOperacao> {
    const dias = new Set(horarios.map((horario) => horario.dia));
    if (dias.size !== DIAS_SEMANA.length || DIAS_SEMANA.some((dia) => !dias.has(dia.dia))) {
      return { ok: false, mensagem: 'Informe o horário de todos os dias da semana.' };
    }

    const normalizados: HorarioFuncionamento[] = [];
    for (const horario of horarios) {
      const abertura = this.normalizarHora(horario.abertura);
      const fechamento = this.normalizarHora(horario.fechamento);
      if (horario.ativo && (!abertura || !fechamento || this.minutos(abertura) >= this.minutos(fechamento))) {
        return { ok: false, mensagem: `${nomeDia(horario.dia)}: o fechamento precisa ser depois da abertura.` };
      }
      normalizados.push({
        dia: horario.dia,
        abertura: abertura || horario.abertura,
        fechamento: fechamento || horario.fechamento,
        ativo: Boolean(horario.ativo),
      });
    }

    try {
      this.substituir(this.horarios, (await this.api.salvarHorarios(normalizados)).map(mapearHorario));
      return { ok: true, mensagem: 'Horários salvos.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  listarBloqueios(): BloqueioAgenda[] {
    return [...this.bloqueios].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio) || a.id.localeCompare(b.id));
  }

  async salvarBloqueio(dados: BloqueioCadastro): Promise<ResultadoOperacao> {
    const motivo = dados.motivo.trim();
    if (!motivo) {
      return { ok: false, mensagem: 'Informe o motivo do bloqueio.' };
    }
    if (!dataIsoValida(dados.dataInicio) || !dataIsoValida(dados.dataFim)) {
      return { ok: false, mensagem: 'Informe um período válido.' };
    }
    if (dados.dataFim < dados.dataInicio) {
      return { ok: false, mensagem: 'A data final não pode ser anterior à inicial.' };
    }

    let horaInicio = '';
    let horaFim = '';
    if (!dados.diaInteiro) {
      horaInicio = this.normalizarHora(dados.horaInicio);
      horaFim = this.normalizarHora(dados.horaFim);
      if (!horaInicio || !horaFim || this.minutos(horaInicio) >= this.minutos(horaFim)) {
        return { ok: false, mensagem: 'Informe um intervalo de horas válido.' };
      }
    }

    try {
      const registro = mapearBloqueio(
        await this.api.bloquear({
          id: idNumero(dados.id) ?? null,
          data: dados.dataInicio,
          dataInicio: dados.dataInicio,
          dataFim: dados.dataFim,
          horaInicio: horaInicio || null,
          horaFim: horaFim || null,
          diaInteiro: dados.diaInteiro,
          motivo,
        }),
      );
      this.upsert(this.bloqueios, registro);
      return { ok: true, mensagem: dados.id ? 'Bloqueio atualizado.' : 'Bloqueio salvo.', id: registro.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async removerBloqueio(id: string): Promise<ResultadoOperacao> {
    const indice = this.bloqueios.findIndex((item) => item.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Bloqueio não encontrado.' };
    }
    try {
      await this.api.removerBloqueio(idNumeroObrigatorio(id));
      this.bloqueios.splice(indice, 1);
      return { ok: true, mensagem: 'Bloqueio removido.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  listarUsuarios(): UsuarioSalao[] {
    return this.usuarios.map((usuario) => ({ ...usuario, acessos: [...usuario.acessos] }));
  }

  async cadastrarOperador(dados: UsuarioOperadorCadastro): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome da funcionária.' };
    }
    if (this.usuarios.some((usuario) => usuario.nome.trim().toLowerCase() === nome.toLowerCase())) {
      return { ok: false, mensagem: 'Já existe uma conta com esse nome.' };
    }
    const acessos = this.normalizarAcessos(dados.acessos);
    if (!acessos?.length) {
      return { ok: false, mensagem: 'Escolha ao menos uma tela.' };
    }
    try {
      const usuario = mapearUsuario(await this.api.cadastrarOperador({ nome, acessos }));
      this.upsert(this.usuarios, usuario);
      return { ok: true, mensagem: 'Funcionária cadastrada.', id: usuario.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async definirAcessos(id: string, acessosInformados: ModuloAcesso[]): Promise<ResultadoOperacao> {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      return { ok: false, mensagem: 'Usuário não encontrado.' };
    }
    if (usuario.perfil === 'ADMIN') {
      return { ok: false, mensagem: 'A administradora já tem acesso a todas as telas.' };
    }
    const acessos = this.normalizarAcessos(acessosInformados);
    if (!acessos?.length) {
      return { ok: false, mensagem: 'Escolha ao menos uma tela.' };
    }
    try {
      const salvo = mapearUsuario(await this.api.definirAcessos(idNumeroObrigatorio(id), acessos));
      this.upsert(this.usuarios, salvo);
      return { ok: true, mensagem: 'Acessos atualizados.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async definirUsuarioAtivo(id: string, ativo: boolean): Promise<ResultadoOperacao> {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      return { ok: false, mensagem: 'Usuário não encontrado.' };
    }
    if (usuario.perfil === 'ADMIN') {
      return { ok: false, mensagem: 'A conta da administradora não pode ser desativada.' };
    }
    try {
      const salvo = mapearUsuario(await this.api.definirUsuarioAtivo(idNumeroObrigatorio(id), ativo));
      this.upsert(this.usuarios, salvo);
      return { ok: true, mensagem: ativo ? 'Funcionária reativada.' : 'Funcionária desativada.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async salvarProduto(dados: ProdutoCadastro): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    const codigoBarras = dados.codigoBarras.trim();
    const unidade = dados.unidade.trim();
    const preco = arredondar(Number(dados.preco));
    const precoCusto = arredondar(Number(dados.precoCusto));
    const estoqueAtual = this.inteiroNaoNegativo(dados.estoqueAtual);
    const estoqueMinimo = this.inteiroNaoNegativo(dados.estoqueMinimo);

    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome do produto.' };
    }
    if (dados.uso !== 'salao' && dados.uso !== 'venda') {
      return { ok: false, mensagem: 'Selecione o tipo de uso.' };
    }

    const categoria = this.categorias.find(
      (item) => item.tipo === 'estoque' && item.nome.trim().toLowerCase() === dados.categoria.trim().toLowerCase(),
    );
    if (!categoria) {
      return { ok: false, mensagem: 'Selecione uma categoria de estoque.' };
    }
    if (unidade && unidade !== 'ml' && unidade !== 'g') {
      return { ok: false, mensagem: 'A unidade precisa ser ml ou g.' };
    }
    if (!Number.isFinite(precoCusto) || precoCusto < 0) {
      return { ok: false, mensagem: 'Informe um preço de custo válido.' };
    }
    if (!Number.isFinite(preco) || preco < 0) {
      return { ok: false, mensagem: 'Informe um preço de venda válido.' };
    }
    if (estoqueMinimo === null) {
      return { ok: false, mensagem: 'Informe um estoque mínimo inteiro.' };
    }
    if (estoqueAtual === null) {
      return { ok: false, mensagem: 'Informe um estoque atual inteiro.' };
    }

    const nomeIgual = nome.toLowerCase();
    const duplicado = this.produtos.some(
      (produto) => produto.id !== dados.id && produto.nome.trim().toLowerCase() === nomeIgual,
    );
    if (duplicado) {
      return { ok: false, mensagem: 'Já existe um produto com esse nome.' };
    }
    if (codigoBarras) {
      const codigoDuplicado = this.produtos.some(
        (produto) => produto.id !== dados.id && produto.codigoBarras?.trim() === codigoBarras,
      );
      if (codigoDuplicado) {
        return { ok: false, mensagem: 'Já existe um produto com esse código de barras.' };
      }
    }

    try {
      const salvo = mapearProduto(
        await this.api.salvarProduto(idNumero(dados.id), {
          nome,
          descricao: nome,
          categoriaId: idNumero(categoria.id),
          categoria: categoria.nome,
          precoVenda: preco,
          preco,
          precoCusto,
          unidade,
          estoqueMinimo,
          estoqueAtual,
          codigoBarras,
          uso: dados.uso,
        }),
      );
      this.upsert(this.produtos, salvo);
      return { ok: true, mensagem: dados.id ? 'Produto atualizado.' : 'Produto cadastrado.', id: salvo.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async movimentarProduto(id: string, tipo: 'entrada' | 'saida', quantidadeInformada: number): Promise<ResultadoOperacao> {
    const produto = this.produtos.find((item) => item.id === id);
    if (!produto) {
      return { ok: false, mensagem: 'Produto não encontrado.' };
    }

    const quantidade = this.inteiroNaoNegativo(quantidadeInformada);
    if (quantidade === null || quantidade < 1) {
      return { ok: false, mensagem: 'Informe uma quantidade inteira maior que zero.' };
    }
    if (tipo === 'saida' && quantidade > produto.estoqueAtual) {
      return {
        ok: false,
        mensagem: `Só há ${produto.estoqueAtual} un. de ${produto.nome} em estoque.`,
      };
    }

    try {
      await this.api.movimentarProduto({
        produtoId: idNumeroObrigatorio(id),
        tipo,
        quantidade,
      });
      produto.estoqueAtual += tipo === 'entrada' ? quantidade : -quantidade;
      this.atualizarStatus(produto);
      return {
        ok: true,
        mensagem: tipo === 'entrada' ? 'Entrada registrada.' : 'Saída registrada.',
        id: produto.id,
      };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async removerProduto(id: string): Promise<ResultadoOperacao> {
    const indice = this.produtos.findIndex((produto) => produto.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Produto não encontrado.' };
    }
    try {
      await this.api.removerProduto(idNumeroObrigatorio(id));
      this.produtos.splice(indice, 1);
      return { ok: true, mensagem: 'Produto excluído.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  listarCategorias(tipo: TipoCategoria): CategoriaSalao[] {
    return this.categorias.filter((categoria) => categoria.tipo === tipo).map((categoria) => ({ ...categoria }));
  }

  produtosNaCategoria(nome: string): number {
    const alvo = nome.trim().toLowerCase();
    return this.produtos.filter((produto) => produto.categoria.trim().toLowerCase() === alvo).length;
  }

  async salvarCategoria(dados: CategoriaCadastro): Promise<ResultadoOperacao> {
    const nome = dados.nome.trim();
    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome da categoria.' };
    }
    const duplicada = this.categorias.some(
      (categoria) =>
        categoria.tipo === dados.tipo &&
        categoria.nome.trim().toLowerCase() === nome.toLowerCase() &&
        categoria.id !== dados.id,
    );
    if (duplicada) {
      return { ok: false, mensagem: 'Já existe uma categoria com esse nome.' };
    }

    try {
      const salva = mapearCategoria(await this.api.salvarCategoria(idNumero(dados.id), { nome, tipo: dados.tipo }));
      if (dados.id) {
        const atual = this.categorias.find((categoria) => categoria.id === dados.id);
        if (atual?.tipo === 'estoque') {
          for (const produto of this.produtos) {
            if (produto.categoria.trim().toLowerCase() === atual.nome.trim().toLowerCase()) {
              produto.categoria = nome;
            }
          }
        }
      }
      this.upsert(this.categorias, salva);
      return { ok: true, mensagem: dados.id ? 'Categoria atualizada.' : 'Categoria salva.', id: salva.id };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async removerCategoria(id: string): Promise<ResultadoOperacao> {
    const indice = this.categorias.findIndex((categoria) => categoria.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Categoria não encontrada.' };
    }
    const categoria = this.categorias[indice];
    if (categoria.tipo === 'estoque' && this.produtosNaCategoria(categoria.nome) > 0) {
      return { ok: false, mensagem: 'Esta categoria ainda tem produtos no estoque.' };
    }
    try {
      await this.api.removerCategoria(idNumeroObrigatorio(id));
      this.categorias.splice(indice, 1);
      return { ok: true, mensagem: 'Categoria removida.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  listarFormas(): FormaConfigurada[] {
    return this.formas.map((forma) => ({ ...forma }));
  }

  async salvarFormas(formas: FormaConfigurada[]): Promise<ResultadoOperacao> {
    const validacao = this.validarFormas(formas, 'formas');
    if (!validacao.ok) {
      return validacao;
    }
    this.aplicarFormas(validacao.formas, 'formas');
    try {
      this.substituir(
        this.formas,
        (await this.api.salvarFormas(this.formas)).map(mapearForma).filter((item): item is FormaConfigurada => !!item),
      );
      return { ok: true, mensagem: 'Formas de pagamento salvas.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async salvarTaxas(formas: FormaConfigurada[]): Promise<ResultadoOperacao> {
    const validacao = this.validarFormas(formas, 'taxas');
    if (!validacao.ok) {
      return validacao;
    }
    this.aplicarFormas(validacao.formas, 'taxas');
    try {
      this.substituir(
        this.formas,
        (await this.api.salvarFormas(this.formas)).map(mapearForma).filter((item): item is FormaConfigurada => !!item),
      );
      return { ok: true, mensagem: 'Taxas salvas.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  maxParcelasCredito(): number {
    const credito = this.formas.find((forma) => forma.forma === 'Cartão de crédito');
    const maximo = Math.floor(Number(credito?.maxParcelas ?? 1));
    if (!Number.isFinite(maximo) || maximo < 1) {
      return 1;
    }
    return Math.min(24, maximo);
  }

  taxaDe(forma: FormaPagamento): number {
    const configurada = this.formas.find((item) => item.forma === forma);
    const taxa = Number(configurada?.taxaPercentual ?? 0);
    if (!Number.isFinite(taxa) || taxa < 0) {
      return 0;
    }
    return taxa;
  }

  async alterarSenha(dados: TrocaSenha): Promise<ResultadoOperacao> {
    const nova = dados.nova.trim();
    if (nova.length < 6) {
      return { ok: false, mensagem: 'A nova senha precisa ter ao menos 6 caracteres.' };
    }
    if (nova !== dados.confirmacao.trim()) {
      return { ok: false, mensagem: 'A confirmação não confere com a nova senha.' };
    }
    try {
      await this.api.alterarSenha({ atual: dados.atual, nova, confirmacao: dados.confirmacao.trim() });
      this.senha = nova;
      return { ok: true, mensagem: 'Senha alterada.' };
    } catch (erro) {
      return this.falha(erro);
    }
  }

  async exportarDados(): Promise<string> {
    try {
      return JSON.stringify(await this.api.exportarBackup(), null, 2);
    } catch {
      return JSON.stringify(
        {
          versao: 1,
          dadosSalao: this.dadosSalao,
          descontoMaximoPercentual: this.descontoMaximoPercentual,
          horarios: this.horarios,
          bloqueios: this.bloqueios,
          usuarios: this.usuarios,
          categorias: this.categorias,
          formas: this.formas,
          profissionais: this.profissionais,
          clientes: this.clientes,
          fichas: this.fichas,
          fichasAtendimento: this.fichasAtendimento,
          servicos: this.servicos,
          produtos: this.produtos,
          agendamentos: this.agendamentos,
          caixas: this.caixas,
          movimentacoes: this.movimentacoes,
          contas: this.contas,
          lancamentosConta: this.lancamentosConta,
          sangrias: this.sangrias,
          sequencia: this.sequencia,
        },
        null,
        2,
      );
    }
  }

  async restaurarDados(texto: string): Promise<ResultadoOperacao> {
    let bruto: unknown;
    try {
      bruto = JSON.parse(texto);
    } catch {
      return { ok: false, mensagem: 'O arquivo não é um backup válido.' };
    }
    try {
      await this.api.restaurarBackup(bruto as never);
      await this.carregar();
      return { ok: true, mensagem: 'Backup restaurado.' };
    } catch {
      // cai no restore local abaixo
    }
    if (!bruto || typeof bruto !== 'object') {
      return { ok: false, mensagem: 'O arquivo não é um backup válido.' };
    }

    const dados = bruto as Record<string, unknown>;
    const horarios = this.comoLista<HorarioFuncionamento>(dados['horarios']);
    const bloqueios = this.comoLista<BloqueioAgenda>(dados['bloqueios']);
    const usuarios = this.comoLista<UsuarioSalao>(dados['usuarios']);
    const categorias = this.comoLista<CategoriaSalao>(dados['categorias']);
    const formas = this.comoLista<FormaConfigurada>(dados['formas']);
    const profissionais = this.comoLista<Profissional>(dados['profissionais']);
    const clientes = this.comoLista<Cliente>(dados['clientes']);
    const servicos = this.comoLista<Servico>(dados['servicos']);
    const produtos = this.comoLista<ProdutoEstoque>(dados['produtos']);
    const agendamentos = this.comoLista<AgendamentoDia>(dados['agendamentos']);
    const caixas = this.comoLista<CaixaRegistro>(dados['caixas']);
    const movimentacoes = this.comoLista<Movimentacao>(dados['movimentacoes']);
    const contas = this.comoLista<ContaContrato>(dados['contas']);
    const lancamentos = this.comoLista<ContaLancamento>(dados['lancamentosConta']);
    const sangrias = this.comoLista<Sangria>(dados['sangrias']);

    if (
      !horarios ||
      !bloqueios ||
      !usuarios ||
      !categorias ||
      !formas ||
      !profissionais ||
      !clientes ||
      !servicos ||
      !produtos ||
      !agendamentos ||
      !caixas ||
      !movimentacoes ||
      !contas ||
      !lancamentos ||
      !sangrias ||
      !this.formasCompletas(formas)
    ) {
      return { ok: false, mensagem: 'O backup está incompleto.' };
    }

    this.substituir(
      this.horarios,
      horarios.map((horario) => ({ ...horario })),
    );
    this.substituir(
      this.bloqueios,
      bloqueios.map((bloqueio) => ({ ...bloqueio })),
    );
    this.substituir(
      this.usuarios,
      usuarios.map((usuario) => ({ ...usuario, acessos: [...usuario.acessos] })),
    );
    this.substituir(
      this.categorias,
      categorias.map((categoria) => ({ ...categoria })),
    );
    this.substituir(
      this.formas,
      formas.map((forma) => ({ ...forma })),
    );
    this.substituir(
      this.profissionais,
      profissionais.map((profissional) => ({ ...profissional })),
    );
    this.substituir(
      this.clientes,
      clientes.map((cliente) => this.normalizarCliente(cliente)),
    );
    const fichas = this.comoLista<FichaVisita>(dados['fichas']) ?? [];
    this.substituir(
      this.fichas,
      fichas.map((ficha) => ({
        ...ficha,
        produtos: (ficha.produtos ?? []).map((produto) => ({ ...produto })),
        fotos: [],
      })),
    );
    const fichasAtendimento = this.comoLista<FichaAtendimento>(dados['fichasAtendimento']) ?? [];
    this.substituir(
      this.fichasAtendimento,
      fichasAtendimento.map((ficha) => this.normalizarFichaAtendimento(ficha)),
    );
    this.substituir(
      this.servicos,
      servicos.map((servico) => ({ ...servico })),
    );
    this.substituir(
      this.produtos,
      produtos.map((produto) => ({ ...produto })),
    );
    this.substituir(
      this.agendamentos,
      agendamentos.map((agendamento) => ({ ...agendamento })),
    );
    this.substituir(
      this.caixas,
      caixas.map((caixa) => ({ ...caixa })),
    );
    this.substituir(
      this.movimentacoes,
      movimentacoes.map((movimento) => ({
        ...movimento,
        itens: movimento.itens.map((item) => ({ ...item })),
        pagamentos: movimento.pagamentos.map((pagamento) => ({ ...pagamento })),
      })),
    );
    this.substituir(
      this.contas,
      contas.map((conta) => ({ ...conta })),
    );
    this.substituir(
      this.lancamentosConta,
      lancamentos.map((lancamento) => ({ ...lancamento })),
    );
    this.substituir(
      this.sangrias,
      sangrias.map((sangria) => ({ ...sangria })),
    );
    if (typeof dados['sequencia'] === 'number' && Number.isFinite(dados['sequencia'])) {
      this.sequencia = dados['sequencia'];
    }
    const salao = dados['dadosSalao'];
    if (salao && typeof salao === 'object') {
      const registro = salao as DadosSalao;
      if (typeof registro.nome === 'string' && registro.nome.trim()) {
        this.dadosSalao = {
          nome: registro.nome.trim(),
          telefone: typeof registro.telefone === 'string' ? registro.telefone : '',
          endereco: typeof registro.endereco === 'string' ? registro.endereco : '',
        };
      }
    }
    if (typeof dados['descontoMaximoPercentual'] === 'number' && Number.isFinite(dados['descontoMaximoPercentual'])) {
      const percentual = dados['descontoMaximoPercentual'];
      this.descontoMaximoPercentual = Math.min(100, Math.max(0, arredondar(percentual)));
    }
    return { ok: true, mensagem: 'Backup restaurado.' };
  }

  private validarFormas(
    formas: FormaConfigurada[],
    foco: 'formas' | 'taxas',
  ): { ok: true; formas: FormaConfigurada[] } | { ok: false; mensagem: string } {
    if (!this.formasCompletas(formas)) {
      return { ok: false, mensagem: 'Informe todas as formas de pagamento.' };
    }

    const normalizadas = formas.map((forma) => ({ ...forma }));
    if (foco === 'formas') {
      if (!normalizadas.some((forma) => forma.ativa)) {
        return { ok: false, mensagem: 'Deixe ao menos uma forma ativa.' };
      }
      for (const forma of normalizadas) {
        if (forma.forma !== 'Cartão de crédito') {
          forma.maxParcelas = 1;
          continue;
        }
        const maximo = Math.floor(Number(forma.maxParcelas));
        if (!Number.isInteger(maximo) || maximo < 1 || maximo > 24) {
          return { ok: false, mensagem: 'O crédito aceita de 1 a 24 parcelas.' };
        }
        forma.maxParcelas = maximo;
      }
      return { ok: true, formas: normalizadas };
    }

    for (const forma of normalizadas) {
      const taxa = Number(forma.taxaPercentual);
      if (!Number.isFinite(taxa) || taxa < 0 || taxa > 100) {
        return { ok: false, mensagem: `Informe uma taxa entre 0 e 100 para ${forma.forma}.` };
      }
      forma.taxaPercentual = arredondar(taxa);
    }
    return { ok: true, formas: normalizadas };
  }

  private aplicarFormas(formas: FormaConfigurada[], foco: 'formas' | 'taxas'): void {
    for (const atual of this.formas) {
      const nova = formas.find((forma) => forma.forma === atual.forma);
      if (!nova) {
        continue;
      }
      if (foco === 'formas') {
        atual.ativa = nova.ativa;
        atual.maxParcelas = nova.maxParcelas;
        continue;
      }
      atual.taxaPercentual = nova.taxaPercentual;
    }
  }

  private formasCompletas(formas: FormaConfigurada[]): boolean {
    if (formas.length !== FORMAS_PAGAMENTO.length) {
      return false;
    }
    return FORMAS_PAGAMENTO.every((nome) => formas.some((forma) => forma.forma === nome));
  }

  private normalizarFichaAtendimento(bruto: FichaAtendimento): FichaAtendimento {
    const procedimentos = Array.isArray(bruto.procedimentos)
      ? bruto.procedimentos.filter((item): item is ProcedimentoAtendimento =>
          (PROCEDIMENTOS_ATENDIMENTO as readonly string[]).includes(item),
        )
      : [];
    const progressiva: ProgressivaAtendimento =
      bruto.progressiva === 'com' || bruto.progressiva === 'sem' || bruto.progressiva === 'nao' ? bruto.progressiva : '';
    return {
      id: typeof bruto.id === 'string' ? bruto.id : this.novoId('fa'),
      clienteId: typeof bruto.clienteId === 'string' ? bruto.clienteId : '',
      agendamentoId: typeof bruto.agendamentoId === 'string' ? bruto.agendamentoId : undefined,
      atendimentoId: typeof bruto.atendimentoId === 'string' ? bruto.atendimentoId : undefined,
      vinculo: typeof bruto.vinculo === 'string' ? bruto.vinculo : undefined,
      data: typeof bruto.data === 'string' ? bruto.data : dataIso(),
      status: bruto.status === 'finalizada' ? 'finalizada' : 'rascunho',
      procedimentos,
      cor: typeof bruto.cor === 'string' ? bruto.cor : '',
      progressiva,
      alergia: typeof bruto.alergia === 'string' ? bruto.alergia : '',
      observacoes: typeof bruto.observacoes === 'string' ? bruto.observacoes : '',
    };
  }

  private comoLista<T>(valor: unknown): T[] | null {
    return Array.isArray(valor) ? (valor as T[]) : null;
  }

  private normalizarCliente(bruto: Cliente): Cliente {
    const anamnese = bruto.anamnese;
    return montarCliente({
      id: bruto.id,
      nome: typeof bruto.nome === 'string' ? bruto.nome : '',
      telefone: typeof bruto.telefone === 'string' ? bruto.telefone : '',
      nascimento: typeof bruto.nascimento === 'string' ? bruto.nascimento : '',
      email: typeof bruto.email === 'string' ? bruto.email : '',
      instagram: typeof bruto.instagram === 'string' ? bruto.instagram : '',
      observacoes: typeof bruto.observacoes === 'string' ? bruto.observacoes : '',
      observacoesSaude: typeof bruto.observacoesSaude === 'string' ? bruto.observacoesSaude : '',
      consentimentoSaude: !!bruto.consentimentoSaude,
      tags: Array.isArray(bruto.tags) ? bruto.tags.filter((tag) => typeof tag === 'string') : [],
      ativo: bruto.ativo !== false,
      anamnese: anamnese
        ? {
            ...anamneseVazia(),
            ...anamnese,
            quimica: Array.isArray(anamnese.quimica) ? anamnese.quimica : [],
            condicoes: Array.isArray(anamnese.condicoes) ? anamnese.condicoes : [],
          }
        : anamneseVazia(),
    });
  }

  private substituir<T>(destino: T[], origem: T[]): void {
    destino.splice(0, destino.length, ...origem);
  }

  private normalizarAcessos(acessos: ModuloAcesso[]): ModuloAcesso[] | null {
    const validos = new Set(MODULOS_ACESSO.map((modulo) => modulo.id));
    const unicos: ModuloAcesso[] = [];
    for (const acesso of acessos) {
      if (!validos.has(acesso)) {
        return null;
      }
      if (!unicos.includes(acesso)) {
        unicos.push(acesso);
      }
    }
    return unicos;
  }

  private novoId(prefixo: string): string {
    this.sequencia += 1;
    return `${prefixo}-${String(this.sequencia).padStart(3, '0')}`;
  }
}
