import type {
  AnamneseCapilar,
  BloqueioAgenda,
  CaixaRegistro,
  Cliente,
  ContaVisivel,
  DadosSalao,
  FichaAtendimento,
  FichaVisita,
  FormaConfigurada,
  FormaPagamento,
  HorarioFuncionamento,
  ItemMovimento,
  LinhaParticipacao,
  Movimentacao,
  Notificacao,
  PagamentoRegistrado,
  ProdutoEstoque,
  Profissional,
  Sangria,
  Servico,
  StatusAgendamento,
  StatusCaixa,
  TipoMovimento,
  TotaisPeriodo,
  UsuarioSalao,
} from '../salao-estado.service';

export interface LoginApi {
  token?: string;
  acessToken?: string;
  usuario?: string;
  nome?: string;
  expiraEm?: number | string;
  tipo?: string;
}

export interface DadosSalaoApi {
  nome?: string;
  telefone?: string;
  endereco?: string;
  descontoMaximoPercentual?: number;
}

export interface HorarioApi {
  dia?: number;
  abertura?: string;
  fechamento?: string;
  ativo?: boolean;
}

export interface FormaConfigApi {
  forma?: FormaPagamento;
  ativa?: boolean;
  taxaPercentual?: number;
  maxParcelas?: number;
}

export interface UsuarioApi {
  id?: number;
  usuario?: string;
  nome?: string;
  perfil?: string;
  ativo?: boolean;
  acessos?: string[];
}

export interface AnamneseApi {
  tipoCabelo?: string;
  comprimento?: string;
  espessura?: string;
  porosidade?: string;
  couroCabeludo?: string;
  quimica?: { tipo?: string; dataAproximada?: string }[];
  condicoes?: string[];
  alergias?: string;
  testeMecha?: boolean | null;
  testeMechaData?: string;
  observacoesSaude?: string;
  cuidadosCasa?: string;
  preferencias?: string;
}

export interface ClienteApi {
  id?: number;
  nome?: string;
  telefone?: string;
  nascimento?: string;
  email?: string;
  instagram?: string;
  observacoes?: string;
  observacoesSaude?: string;
  consentimentoSaude?: boolean;
  tags?: string[];
  ativo?: boolean;
  anamnese?: AnamneseApi;
}

export interface ServicoApi {
  id?: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  duracaoMinutos?: number;
  ativo?: boolean;
  legado?: boolean;
}

export interface ProfissionalApi {
  id?: number;
  nome?: string;
  telefone?: string;
  ativo?: boolean;
}

export interface ProdutoApi {
  id?: number;
  nome?: string;
  descricao?: string;
  categoriaNome?: string;
  categoria?: string;
  precoVenda?: number;
  precoCusto?: number;
  preco?: number;
  unidadeMedida?: string;
  unidade?: string;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  codigoBarras?: string;
  ativo?: boolean;
  estoqueBaixo?: boolean;
  uso?: string;
  status?: string;
}

export interface CategoriaApi {
  id?: number;
  nome?: string;
  descricao?: string;
  ativo?: boolean;
  tipo?: string;
}

export interface AgendamentoApi {
  id?: number;
  data?: string;
  hora?: string;
  cliente?: string;
  clienteId?: number | null;
  servico?: string;
  servicoId?: number;
  profissional?: string;
  profissionalId?: number;
  status?: StatusAgendamento;
  preco?: number;
  observacao?: string;
  vendaId?: number | null;
}

export interface CaixaApi {
  id?: number;
  dataAbertura?: string;
  dataFechamento?: string;
  saldoInicial?: number;
  saldoFinal?: number;
  status?: StatusCaixa;
  nomeProfissional?: string;
  valorContado?: number;
  diferencaDinheiro?: number;
}

export interface ItemMovimentoApi {
  tipo?: string;
  id?: number;
  nome?: string;
  quantidade?: number;
  precoUnitario?: number;
}

export interface PagamentoApi {
  forma?: FormaPagamento;
  valor?: number;
  parcelas?: number;
}

export interface MovimentacaoApi {
  id?: number;
  caixaId?: number;
  dataHora?: string;
  tipo?: TipoMovimento;
  descricao?: string;
  cliente?: string;
  clienteId?: number | null;
  profissional?: string;
  profissionalId?: number | null;
  itens?: ItemMovimentoApi[];
  pagamentos?: PagamentoApi[];
  valor?: number;
  desconto?: number;
  agendamentoId?: number | null;
}

export interface BloqueioApi {
  id?: number;
  data?: string;
  dataInicio?: string;
  dataFim?: string;
  horaInicio?: string;
  horaFim?: string;
  diaInteiro?: boolean;
  motivo?: string;
}

export interface NotificacaoApi {
  id?: number;
  titulo?: string;
  texto?: string;
  data?: string;
  lida?: boolean;
}

export interface ContaVisivelApi {
  lancamentoId?: number;
  contratoId?: number;
  nome?: string;
  valor?: number;
  vencimento?: string;
  tipo?: string;
  status?: string;
  numeroParcela?: number;
  parcelas?: number;
  vencida?: boolean;
  podeEncerrar?: boolean;
}

export interface SangriaApi {
  id?: number;
  descricao?: string;
  valor?: number;
  data?: string;
}

export interface FichaVisitaApi {
  id?: number;
  clienteId?: number;
  agendamentoId?: number | null;
  data?: string;
  servico?: string;
  profissional?: string;
  produtos?: {
    marca?: string;
    linha?: string;
    cor?: string;
    oxidante?: string;
    proporcao?: string;
    tempoPausa?: string;
  }[];
  observacoes?: string;
  retorno?: string;
  fotos?: { id?: number; momento?: string; dados?: string }[];
  valor?: number;
  vendaId?: number | null;
}

export interface FichaAtendimentoApi {
  id?: number;
  clienteId?: number;
  agendamentoId?: number | null;
  atendimentoId?: number | null;
  vinculo?: string;
  data?: string;
  status?: string;
  procedimentos?: string[];
  cor?: string;
  progressiva?: string;
  alergia?: string;
  observacoes?: string;
}

export interface LinhaParticipacaoApi {
  nome?: string;
  quantidade?: number;
  total?: number;
  percentual?: number;
}

export interface TotaisPeriodoApi {
  entradas?: number;
  saidas?: number;
  lucro?: number;
  vendas?: number;
  quantidadeVendas?: number;
  ticket?: number;
}

export interface PainelApi {
  totais?: TotaisPeriodoApi;
  porServico?: LinhaParticipacaoApi[];
  porForma?: LinhaParticipacaoApi[];
  origemReceita?: {
    servicos?: LinhaParticipacaoApi;
    revenda?: LinhaParticipacaoApi;
  };
}

export interface BackupApi {
  versao?: string;
  geradoEm?: string;
  salao?: DadosSalaoApi;
  horarios?: HorarioApi[];
  formas?: FormaConfigApi[];
  usuarios?: UsuarioApi[];
  clientes?: ClienteApi[];
  servicos?: ServicoApi[];
  profissionais?: ProfissionalApi[];
  produtos?: ProdutoApi[];
  categorias?: CategoriaApi[];
  agendamentos?: AgendamentoApi[];
  caixas?: CaixaApi[];
  movimentacoes?: MovimentacaoApi[];
  bloqueios?: BloqueioApi[];
  notificacoes?: NotificacaoApi[];
  extra?: Record<string, unknown>;
}

export type {
  AnamneseCapilar,
  BloqueioAgenda,
  CaixaRegistro,
  Cliente,
  ContaVisivel,
  DadosSalao,
  FichaAtendimento,
  FichaVisita,
  FormaConfigurada,
  HorarioFuncionamento,
  ItemMovimento,
  LinhaParticipacao,
  Movimentacao,
  Notificacao,
  PagamentoRegistrado,
  ProdutoEstoque,
  Profissional,
  Sangria,
  Servico,
  TotaisPeriodo,
  UsuarioSalao,
};
