import { Injectable } from '@angular/core';

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

export const PROCEDIMENTOS_FICHA = ['Coloração', 'Mechas', 'Correção de cor'] as const;

export type ProcedimentoFicha = (typeof PROCEDIMENTOS_FICHA)[number];
export type FormolProgressiva = 'com' | 'sem' | '';

export interface AnamneseCapilar {
  procedimentos: ProcedimentoFicha[];
  cor: string;
  temProgressiva: boolean | null;
  formol: FormolProgressiva;
  alergias: string;
  observacoes: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  nascimento: string;
  email: string;
  observacoes: string;
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
  observacoes?: string;
  consentimentoSaude?: boolean;
  tags?: string[];
  ativo?: boolean;
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
}

export interface ResumoCliente {
  totalVisitas: number;
  ultimaVisita: string | null;
  totalGasto: number;
  proximo: AgendamentoDia | null;
}

export function anamneseVazia(): AnamneseCapilar {
  return {
    procedimentos: [],
    cor: '',
    temProgressiva: null,
    formol: '',
    alergias: '',
    observacoes: '',
  };
}

export function normalizarAnamnese(bruto: unknown): AnamneseCapilar {
  if (!bruto || typeof bruto !== 'object') {
    return anamneseVazia();
  }
  const dados = bruto as Record<string, unknown>;
  const procedimentos = Array.isArray(dados['procedimentos'])
    ? dados['procedimentos'].filter(
        (item): item is ProcedimentoFicha =>
          typeof item === 'string' && (PROCEDIMENTOS_FICHA as readonly string[]).includes(item),
      )
    : [];
  const quimica = Array.isArray(dados['quimica']) ? dados['quimica'] : [];
  const teveProgressiva = quimica.some(
    (item) => !!item && typeof item === 'object' && (item as { tipo?: string }).tipo === 'Progressiva',
  );
  let temProgressiva: boolean | null = null;
  if (dados['temProgressiva'] === true || dados['temProgressiva'] === false) {
    temProgressiva = dados['temProgressiva'];
  } else if (teveProgressiva) {
    temProgressiva = true;
  }
  const observacoesPropria = typeof dados['observacoes'] === 'string' ? dados['observacoes'].trim() : '';
  const extras = ['observacoesSaude', 'cuidadosCasa', 'preferencias']
    .map((chave) => dados[chave])
    .filter((item): item is string => typeof item === 'string' && !!item.trim());
  const formol = dados['formol'] === 'com' || dados['formol'] === 'sem' ? dados['formol'] : '';
  return {
    procedimentos,
    cor: typeof dados['cor'] === 'string' ? dados['cor'] : '',
    temProgressiva,
    formol: temProgressiva ? formol : '',
    alergias: typeof dados['alergias'] === 'string' ? dados['alergias'] : '',
    observacoes: [observacoesPropria, ...extras].filter(Boolean).join('\n'),
  };
}

export function montarCliente(dados: Pick<Cliente, 'id' | 'nome'> & Partial<Omit<Cliente, 'id' | 'nome'>>): Cliente {
  const anamnese = dados.anamnese;
  return {
    telefone: '',
    nascimento: '',
    email: '',
    observacoes: '',
    consentimentoSaude: false,
    ativo: true,
    ...dados,
    tags: dados.tags ? [...dados.tags] : [],
    anamnese: normalizarAnamnese(anamnese),
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

const HOJE = dataIso();

function isoDiasAtras(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return dataIso(data);
}

function nascimentoNesteMes(idade: number, dia: number): string {
  const hoje = new Date();
  return `${hoje.getFullYear() - idade}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
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
  dadosSalao: DadosSalao = {
    nome: 'Eula Moraes Studio',
    telefone: '',
    endereco: '',
  };
  /** Porcentagem máxima do subtotal que o caixa pode descontar. 100 permite até o total. */
  descontoMaximoPercentual = 100;
  readonly usuarioAtualId = 'usr-paula';
  readonly usuarioAtual = 'Paula';
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
      perfil: 'ADMIN',
      ativo: true,
      acessos: MODULOS_ACESSO.map((modulo) => modulo.id),
    },
  ];

  readonly categorias: CategoriaSalao[] = [
    { id: 'cat-coloracao', nome: 'Coloração', tipo: 'estoque' },
    { id: 'cat-tratamento', nome: 'Tratamento', tipo: 'estoque' },
    { id: 'cat-finalizacao', nome: 'Finalização', tipo: 'estoque' },
    { id: 'cat-aluguel', nome: 'Aluguel', tipo: 'despesa' },
    { id: 'cat-energia', nome: 'Energia', tipo: 'despesa' },
    { id: 'cat-imposto', nome: 'Imposto', tipo: 'despesa' },
  ];

  readonly profissionais: Profissional[] = [
    { id: 'pro-paula', nome: 'Paula', telefone: '(11) 98811-2040', ativo: true },
    { id: 'pro-valentina', nome: 'Valentina', telefone: '(11) 99720-4418', ativo: true },
    { id: 'pro-ana', nome: 'Ana', telefone: '(11) 98155-7732', ativo: true },
    { id: 'pro-eula', nome: 'Eula Moraes', telefone: '(11) 99900-1100', ativo: false },
  ];

  readonly clientes: Cliente[] = [
    montarCliente({
      id: 'cli-maria',
      nome: 'Maria Silva',
      telefone: '(11) 98801-2210',
      nascimento: nascimentoNesteMes(34, 9),
      email: 'maria.silva@email.com',
      observacoes: 'Prefere horário de manhã.',
      consentimentoSaude: true,
      tags: ['VIP', 'Alergia'],
      anamnese: {
        ...anamneseVazia(),
        procedimentos: ['Coloração'],
        cor: '7.1',
        temProgressiva: false,
        alergias: 'Amônia. Arde o couro se a tinta tiver cheiro forte.',
        observacoes: 'Sem clarear além do que já está.',
      },
    }),
    montarCliente({
      id: 'cli-ana',
      nome: 'Ana Costa',
      telefone: '(11) 99720-1184',
      nascimento: '1992-03-14',
      consentimentoSaude: true,
      tags: ['VIP'],
      anamnese: {
        ...anamneseVazia(),
        procedimentos: ['Mechas'],
        cor: 'Loiro',
        temProgressiva: true,
        formol: 'sem',
        observacoes: 'Corte em camadas, sem tirar muito comprimento.',
      },
    }),
    montarCliente({
      id: 'cli-juliana',
      nome: 'Juliana Alves',
      telefone: '(11) 98110-4402',
      nascimento: '1988-07-02',
      anamnese: { ...anamneseVazia(), procedimentos: ['Coloração'], cor: 'Castanho', temProgressiva: false },
    }),
    montarCliente({
      id: 'cli-carla',
      nome: 'Carla Mendes',
      telefone: '(11) 99654-3301',
      nascimento: '1995-11-21',
      anamnese: { ...anamneseVazia(), temProgressiva: false, observacoes: 'Cabelo ressecado. Hidratação antes de química.' },
    }),
    montarCliente({
      id: 'cli-beatriz',
      nome: 'Beatriz Nunes',
      telefone: '(11) 98765-2219',
      nascimento: '1990-01-30',
    }),
    montarCliente({
      id: 'cli-fernanda',
      nome: 'Fernanda Rocha',
      telefone: '(11) 99102-7788',
      nascimento: '1986-05-18',
      anamnese: {
        ...anamneseVazia(),
        procedimentos: ['Correção de cor'],
        cor: '6.0',
        temProgressiva: true,
        formol: 'com',
      },
    }),
  ];

  readonly fichas: FichaVisita[] = [
    {
      id: 'fv-maria-hoje',
      clienteId: 'cli-maria',
      agendamentoId: 'ag-maria',
      data: HOJE,
      servico: 'Coloração',
      profissional: 'Eula Moraes',
      produtos: [
        {
          marca: 'Wella',
          linha: 'Koleston Perfect',
          cor: '7.1',
          oxidante: '20 volumes',
          proporcao: '1:1',
          tempoPausa: '35 min',
        },
      ],
      observacoes: 'Tom fechou no comprimento. Raiz um tom mais fechada que o restante.',
      retorno: 'Retoque de raiz em 30 dias',
      fotos: [],
      valor: 280,
    },
    {
      id: 'fv-maria-anterior',
      clienteId: 'cli-maria',
      data: isoDiasAtras(170),
      servico: 'Coloração',
      profissional: 'Paula',
      produtos: [
        {
          marca: 'Wella',
          linha: 'Koleston Perfect',
          cor: '7.0',
          oxidante: '20 volumes',
          proporcao: '1:1',
          tempoPausa: '40 min',
        },
      ],
      observacoes: 'Ficou quente demais. Na próxima, puxar o 7.1.',
      retorno: 'Retoque em 45 dias',
      fotos: [],
      valor: 260,
    },
  ];

  readonly servicos: Servico[] = [
    {
      id: 'srv-escova',
      nome: 'Escova',
      descricao: 'Escova modeladora com finalização.',
      preco: 60,
      duracaoMinutos: 60,
      ativo: true,
    },
    {
      id: 'srv-corte-lista',
      nome: 'Corte',
      descricao: 'Corte feminino ou masculino.',
      preco: 50,
      duracaoMinutos: 45,
      ativo: true,
    },
    {
      id: 'srv-coloracao-lista',
      nome: 'Coloração',
      descricao: 'Coloração completa dos fios.',
      preco: 150,
      duracaoMinutos: 120,
      ativo: true,
    },
    {
      id: 'srv-progressiva-lista',
      nome: 'Progressiva',
      descricao: 'Alisamento progressivo.',
      preco: 200,
      duracaoMinutos: 180,
      ativo: true,
    },
    {
      id: 'srv-hidratacao',
      nome: 'Hidratação',
      descricao: 'Tratamento de hidratação capilar.',
      preco: 80,
      duracaoMinutos: 90,
      ativo: true,
    },
    {
      id: 'srv-mechas',
      nome: 'Mechas',
      descricao: 'Mechas com técnica de luzes.',
      preco: 180,
      duracaoMinutos: 150,
      ativo: true,
    },
    { id: 'srv-coloracao', nome: 'Coloração', descricao: '', preco: 280, duracaoMinutos: 120, ativo: false, legado: true },
    { id: 'srv-corte', nome: 'Corte e escova', descricao: '', preco: 150, duracaoMinutos: 75, ativo: false, legado: true },
    { id: 'srv-mani', nome: 'Manicure e pedicure', descricao: '', preco: 90, duracaoMinutos: 60, ativo: false, legado: true },
    { id: 'srv-hidra', nome: 'Hidratação', descricao: '', preco: 180, duracaoMinutos: 90, ativo: false, legado: true },
    { id: 'srv-sobran', nome: 'Design de sobrancelha', descricao: '', preco: 70, duracaoMinutos: 30, ativo: false, legado: true },
    { id: 'srv-progressiva', nome: 'Escova progressiva', descricao: '', preco: 320, duracaoMinutos: 180, ativo: false, legado: true },
  ];

  readonly produtos: ProdutoEstoque[] = [
    {
      id: 'prd-ox',
      nome: 'Ox 20 Volumes',
      categoria: 'Coloração',
      estoqueAtual: 2,
      estoqueMinimo: 10,
      preco: 18.9,
      status: 'critico',
      uso: 'salao',
    },
    {
      id: 'prd-mascara',
      nome: 'Máscara Hidratante',
      categoria: 'Tratamento',
      estoqueAtual: 3,
      estoqueMinimo: 8,
      preco: 62,
      status: 'baixo',
      uso: 'venda',
    },
    {
      id: 'prd-fluido',
      nome: 'Fluido Finalizador',
      categoria: 'Finalização',
      estoqueAtual: 12,
      estoqueMinimo: 5,
      preco: 52,
      status: 'normal',
      uso: 'salao',
    },
  ];

  readonly agendamentos: AgendamentoDia[] = [
    {
      id: 'ag-maria',
      data: HOJE,
      hora: '09:00',
      cliente: 'Maria Silva',
      clienteId: 'cli-maria',
      servico: 'Coloração',
      servicoId: 'srv-coloracao',
      profissional: 'Eula Moraes',
      profissionalId: 'pro-eula',
      status: 'Concluído',
      preco: 280,
    },
    {
      id: 'ag-ana',
      data: HOJE,
      hora: '10:30',
      cliente: 'Ana Costa',
      clienteId: 'cli-ana',
      servico: 'Corte e escova',
      servicoId: 'srv-corte',
      profissional: 'Paula',
      profissionalId: 'pro-paula',
      status: 'Em andamento',
      preco: 150,
    },
    {
      id: 'ag-juliana',
      data: HOJE,
      hora: '13:00',
      cliente: 'Juliana Alves',
      clienteId: 'cli-juliana',
      servico: 'Manicure e pedicure',
      servicoId: 'srv-mani',
      profissional: 'Paula',
      profissionalId: 'pro-paula',
      status: 'Confirmado',
      preco: 90,
    },
    {
      id: 'ag-carla',
      data: HOJE,
      hora: '15:00',
      cliente: 'Carla Mendes',
      clienteId: 'cli-carla',
      servico: 'Hidratação',
      servicoId: 'srv-hidra',
      profissional: 'Eula Moraes',
      profissionalId: 'pro-eula',
      status: 'Confirmado',
      preco: 180,
    },
    {
      id: 'ag-beatriz',
      data: HOJE,
      hora: '16:30',
      cliente: 'Beatriz Nunes',
      clienteId: 'cli-beatriz',
      servico: 'Design de sobrancelha',
      servicoId: 'srv-sobran',
      profissional: 'Paula',
      profissionalId: 'pro-paula',
      status: 'Aguardando',
      preco: 70,
    },
    {
      id: 'ag-fernanda',
      data: HOJE,
      hora: '18:00',
      cliente: 'Fernanda Rocha',
      clienteId: 'cli-fernanda',
      servico: 'Escova progressiva',
      servicoId: 'srv-progressiva',
      profissional: 'Eula Moraes',
      profissionalId: 'pro-eula',
      status: 'Confirmado',
      preco: 320,
    },
  ];

  readonly caixas: CaixaRegistro[] = [];
  readonly movimentacoes: Movimentacao[] = [];
  readonly contas: ContaContrato[] = [];
  readonly lancamentosConta: ContaLancamento[] = [];
  readonly sangrias: Sangria[] = [];

  private sequencia = 0;

  constructor() {
    this.semearDemonstracao();
  }

  get caixaAberto(): boolean {
    return this.caixas.some((caixa) => caixa.status === 'aberto');
  }

  get caixaAbertoAtual(): CaixaRegistro | undefined {
    return this.caixas.find((caixa) => caixa.status === 'aberto');
  }

  abrirCaixa(saldoInicial: number): ResultadoOperacao {
    if (this.caixaAberto) {
      return { ok: false, mensagem: 'Já existe um caixa aberto.' };
    }

    const saldo = arredondar(Number(saldoInicial));
    if (!Number.isFinite(saldo) || saldo < 0) {
      return { ok: false, mensagem: 'Informe um saldo inicial válido.' };
    }

    const caixa: CaixaRegistro = {
      id: this.novoId('C'),
      abertoEm: new Date().toISOString(),
      responsavelAbertura: this.usuarioAtual,
      saldoInicial: saldo,
      status: 'aberto',
    };
    this.caixas.push(caixa);
    return { ok: true, mensagem: 'Caixa aberto.', id: caixa.id };
  }

  fecharCaixa(valorContado: number): ResultadoOperacao {
    const caixa = this.caixaAbertoAtual;
    if (!caixa) {
      return { ok: false, mensagem: 'Não há caixa aberto para fechar.' };
    }

    const contado = arredondar(Number(valorContado));
    if (!Number.isFinite(contado) || contado < 0) {
      return { ok: false, mensagem: 'Informe o valor contado em dinheiro.' };
    }

    const resumo = this.resumoCaixa(caixa.id);
    caixa.status = 'fechado';
    caixa.fechadoEm = new Date().toISOString();
    caixa.responsavelFechamento = this.usuarioAtual;
    caixa.valorContado = contado;
    caixa.diferencaDinheiro = arredondar(contado - resumo.esperadoDinheiro);
    return { ok: true, mensagem: 'Caixa fechado.', id: caixa.id };
  }

  registrarMovimento(dados: {
    tipo: 'entrada' | 'saida';
    valor: number;
    descricao: string;
    forma: FormaPagamento;
  }): ResultadoOperacao {
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

    const movimento: Movimentacao = {
      id: this.novoId('M'),
      caixaId: caixa.id,
      dataHora: new Date().toISOString(),
      tipo: dados.tipo,
      descricao,
      itens: [],
      pagamentos: [{ forma: dados.forma, valor }],
      valor,
      desconto: 0,
      responsavel: this.usuarioAtual,
    };
    this.movimentacoes.push(movimento);
    return { ok: true, mensagem: 'Movimentação registrada.', id: movimento.id };
  }

  registrarVenda(pedido: PedidoVenda): ResultadoOperacao {
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

    for (const item of itens) {
      if (item.tipo !== 'produto') {
        continue;
      }
      const produto = this.produtos.find((cadastro) => cadastro.id === item.id);
      if (!produto) {
        continue;
      }
      produto.estoqueAtual -= item.quantidade;
      this.atualizarStatus(produto);
    }

    const venda: Movimentacao = {
      id: this.novoId('V'),
      caixaId: caixa.id,
      dataHora: new Date().toISOString(),
      tipo: 'venda',
      descricao: itens.map((item) => item.nome).join(', '),
      cliente: cliente?.nome ?? (nomeAvulso || undefined),
      clienteId: cliente?.id,
      profissional: profissional.nome,
      profissionalId: profissional.id,
      itens,
      pagamentos,
      valor: total,
      desconto,
      responsavel: this.usuarioAtual,
      agendamentoId: agendamento?.id,
    };
    this.movimentacoes.push(venda);

    if (agendamento) {
      agendamento.status = 'Concluído';
      agendamento.vendaId = venda.id;
    }

    return { ok: true, mensagem: 'Venda registrada.', id: venda.id };
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

  salvarAgendamento(dados: AgendamentoCadastro): ResultadoOperacao {
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
    if (atual) {
      atual.data = dados.data;
      atual.hora = hora;
      atual.cliente = nomeAgenda;
      atual.clienteId = clienteId;
      atual.servico = servico.nome;
      atual.servicoId = servico.id;
      atual.profissional = profissional.nome;
      atual.profissionalId = profissional.id;
      atual.preco = servico.preco;
      atual.observacao = observacao || undefined;
      return { ok: true, mensagem: 'Agendamento atualizado.', id: atual.id };
    }

    const criado: AgendamentoDia = {
      id: this.novoId('ag'),
      data: dados.data,
      hora,
      cliente: nomeAgenda,
      clienteId,
      servico: servico.nome,
      servicoId: servico.id,
      profissional: profissional.nome,
      profissionalId: profissional.id,
      status: 'Confirmado',
      preco: servico.preco,
      observacao: observacao || undefined,
    };
    this.agendamentos.push(criado);
    return { ok: true, mensagem: 'Agendamento salvo.', id: criado.id };
  }

  moverAgendamento(id: string, data: string, hora: string): ResultadoOperacao {
    const atual = this.agendamentos.find((item) => item.id === id);
    if (!atual) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    return this.salvarAgendamento({
      id: atual.id,
      clienteNome: atual.cliente,
      clienteId: atual.clienteId || undefined,
      servicoId: atual.servicoId,
      profissionalId: atual.profissionalId,
      data,
      hora,
      observacao: atual.observacao,
    });
  }

  alterarStatusAgendamento(id: string, status: 'Aguardando' | 'Confirmado'): ResultadoOperacao {
    const atual = this.agendamentos.find((item) => item.id === id);
    if (!atual) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    if (atual.status === 'Concluído' || atual.vendaId) {
      return { ok: false, mensagem: 'Este atendimento já foi finalizado.' };
    }
    atual.status = status;
    return {
      ok: true,
      mensagem: status === 'Confirmado' ? 'Agendamento confirmado.' : 'Agendamento marcado como pendente.',
      id: atual.id,
    };
  }

  excluirAgendamento(id: string): ResultadoOperacao {
    const index = this.agendamentos.findIndex((item) => item.id === id);
    if (index < 0) {
      return { ok: false, mensagem: 'Agendamento não encontrado.' };
    }
    const atual = this.agendamentos[index];
    if (atual.status === 'Concluído' || atual.vendaId) {
      return { ok: false, mensagem: 'Este atendimento já foi finalizado.' };
    }
    this.agendamentos.splice(index, 1);
    return { ok: true, mensagem: 'Agendamento excluído.', id };
  }

  listarProfissionais(somenteAtivos = true): Profissional[] {
    return this.profissionais.filter((profissional) => !somenteAtivos || profissional.ativo);
  }

  atendimentosDoProfissional(id: string): number {
    return this.agendamentos.filter((agendamento) => agendamento.profissionalId === id).length;
  }

  salvarProfissional(dados: ProfissionalCadastro): ResultadoOperacao {
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

    if (dados.id) {
      const atual = this.profissionais.find((profissional) => profissional.id === dados.id);
      if (!atual) {
        return { ok: false, mensagem: 'Profissional não encontrada.' };
      }
      atual.nome = nome;
      atual.telefone = telefone;
      this.atualizarNomeNoHistorico(atual.id, nome);
      return { ok: true, mensagem: 'Profissional atualizada.', id: atual.id };
    }

    const criada: Profissional = {
      id: this.novoId('pro'),
      nome,
      telefone,
      ativo: true,
    };
    this.profissionais.push(criada);
    return { ok: true, mensagem: 'Profissional cadastrada.', id: criada.id };
  }

  definirProfissionalAtivo(id: string, ativo: boolean): ResultadoOperacao {
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
    profissional.ativo = ativo;
    return {
      ok: true,
      mensagem: ativo ? 'Profissional reativada.' : 'Profissional desativada.',
      id: profissional.id,
    };
  }

  listarServicos(somenteAtivos = true): Servico[] {
    return this.servicos.filter((servico) => !servico.legado && (!somenteAtivos || servico.ativo));
  }

  salvarServico(dados: ServicoCadastro): ResultadoOperacao {
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

    if (dados.id) {
      const atual = this.servicos.find((servico) => servico.id === dados.id && !servico.legado);
      if (!atual) {
        return { ok: false, mensagem: 'Serviço não encontrado.' };
      }
      atual.nome = nome;
      atual.descricao = descricao;
      atual.preco = preco;
      atual.duracaoMinutos = duracao;
      return { ok: true, mensagem: 'Serviço atualizado.', id: atual.id };
    }

    const criado: Servico = {
      id: this.novoId('srv'),
      nome,
      descricao,
      preco,
      duracaoMinutos: duracao,
      ativo: true,
    };
    this.servicos.push(criado);
    return { ok: true, mensagem: 'Serviço cadastrado.', id: criado.id };
  }

  definirServicoAtivo(id: string, ativo: boolean): ResultadoOperacao {
    const servico = this.servicos.find((item) => item.id === id && !item.legado);
    if (!servico) {
      return { ok: false, mensagem: 'Serviço não encontrado.' };
    }
    if (servico.ativo === ativo) {
      return { ok: false, mensagem: ativo ? 'Este serviço já está ativo.' : 'Este serviço já está desativado.' };
    }
    servico.ativo = ativo;
    return {
      ok: true,
      mensagem: ativo ? 'Serviço reativado.' : 'Serviço desativado.',
      id: servico.id,
    };
  }

  garantirLancamentos(competencia: string): void {
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
    this.garantirLancamentos(competencia);
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

  criarConta(dados: NovaConta): ResultadoOperacao {
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

    const contrato: ContaContrato = {
      id: this.novoId('ctt'),
      nome,
      valor,
      tipo: dados.tipo,
      diaVencimento: dia,
      inicioCompetencia: inicio,
      parcelas,
    };
    this.contas.push(contrato);
    this.garantirLancamentos(inicio);

    if (dados.status === 'pago') {
      const primeiro = this.lancamentosConta.find(
        (item) => item.contratoId === contrato.id && item.competencia === inicio,
      );
      if (primeiro) {
        primeiro.status = 'pago';
        primeiro.pagoEm = new Date().toISOString();
      }
    }

    const mensagem =
      dados.tipo === 'avulsa' && dados.status === 'pago'
        ? 'Conta avulsa paga. Ela sai da lista e entra nas saídas de hoje.'
        : 'Conta registrada.';
    return { ok: true, mensagem, id: contrato.id };
  }

  marcarContaPaga(lancamentoId: string): ResultadoOperacao {
    const lancamento = this.lancamentosConta.find((item) => item.id === lancamentoId);
    if (!lancamento) {
      return { ok: false, mensagem: 'Conta não encontrada.' };
    }
    if (lancamento.status === 'pago') {
      return { ok: false, mensagem: 'Esta conta já está paga.' };
    }
    const contrato = this.contas.find((item) => item.id === lancamento.contratoId);
    lancamento.status = 'pago';
    lancamento.pagoEm = new Date().toISOString();
    if (contrato?.tipo === 'avulsa') {
      return { ok: true, mensagem: 'Conta avulsa paga. Ela sai da lista e entra nas saídas.', id: lancamento.id };
    }
    return { ok: true, mensagem: 'Conta marcada como paga.', id: lancamento.id };
  }

  encerrarContaFixa(contratoId: string): ResultadoOperacao {
    const contrato = this.contas.find((item) => item.id === contratoId);
    if (!contrato || contrato.tipo !== 'fixa') {
      return { ok: false, mensagem: 'Só uma conta fixa pode ser encerrada.' };
    }
    if (contrato.canceladaApartir) {
      return { ok: false, mensagem: 'Esta conta fixa já foi encerrada.' };
    }
    contrato.canceladaApartir = deslocarMes(competenciaDe(dataIso()), 1);
    return { ok: true, mensagem: 'A conta deixa de se repetir a partir do próximo mês.', id: contrato.id };
  }

  registrarSangria(dados: { descricao: string; valor: number; data: string }): ResultadoOperacao {
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
    const sangria: Sangria = {
      id: this.novoId('san'),
      descricao,
      valor,
      data: dados.data,
    };
    this.sangrias.push(sangria);
    return { ok: true, mensagem: 'Sangria registrada.', id: sangria.id };
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

  private semearDemonstracao(): void {
    const hoje = dataIso();
    const diaHoje = Number(hoje.slice(8, 10));
    const mesAtual = competenciaDe(hoje);
    const mesAnterior = deslocarMes(mesAtual, -1);
    const [anoAtual, numeroMes] = mesAtual.split('-').map(Number);
    const [anoAnterior, numeroAnterior] = mesAnterior.split('-').map(Number);

    const caixaAnterior: CaixaRegistro = {
      id: 'cx-demo-anterior',
      abertoEm: new Date(anoAnterior, numeroAnterior - 1, 1, 8).toISOString(),
      fechadoEm: new Date(anoAnterior, numeroAnterior - 1, 28, 20).toISOString(),
      responsavelAbertura: this.usuarioAtual,
      responsavelFechamento: this.usuarioAtual,
      saldoInicial: 200,
      status: 'fechado',
      valorContado: 200,
      diferencaDinheiro: 0,
    };
    const caixaAtual: CaixaRegistro = {
      id: 'cx-demo-atual',
      abertoEm: new Date(anoAtual, numeroMes - 1, 1, 8).toISOString(),
      fechadoEm: new Date(anoAtual, numeroMes - 1, Math.min(diaHoje, 28), 20).toISOString(),
      responsavelAbertura: this.usuarioAtual,
      responsavelFechamento: this.usuarioAtual,
      saldoInicial: 180,
      status: 'fechado',
      valorContado: 180,
      diferencaDinheiro: 0,
    };
    this.caixas.push(caixaAnterior, caixaAtual);

    const vendas: { dia: number; caixaId: string; ano: number; mes: number; servicoId: string; forma: FormaPagamento; profissionalId: string }[] = [
      { dia: 1, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-coloracao-lista', forma: 'Pix', profissionalId: 'pro-valentina' },
      { dia: 3, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-mechas', forma: 'Cartão de crédito', profissionalId: 'pro-valentina' },
      { dia: 4, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-corte-lista', forma: 'Dinheiro', profissionalId: 'pro-paula' },
      { dia: 6, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-hidratacao', forma: 'Pix', profissionalId: 'pro-ana' },
      { dia: 8, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-escova', forma: 'Cartão de débito', profissionalId: 'pro-paula' },
      { dia: 10, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-progressiva-lista', forma: 'Pix', profissionalId: 'pro-ana' },
      { dia: 13, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-coloracao-lista', forma: 'Cartão de crédito', profissionalId: 'pro-valentina' },
      { dia: 15, caixaId: caixaAtual.id, ano: anoAtual, mes: numeroMes, servicoId: 'srv-corte-lista', forma: 'Pix', profissionalId: 'pro-paula' },
      { dia: 2, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-coloracao-lista', forma: 'Pix', profissionalId: 'pro-valentina' },
      { dia: 3, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-corte-lista', forma: 'Dinheiro', profissionalId: 'pro-paula' },
      { dia: 4, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-mechas', forma: 'Cartão de crédito', profissionalId: 'pro-ana' },
      { dia: 6, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-hidratacao', forma: 'Pix', profissionalId: 'pro-paula' },
      { dia: 8, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-escova', forma: 'Dinheiro', profissionalId: 'pro-ana' },
      { dia: 10, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-progressiva-lista', forma: 'Cartão de débito', profissionalId: 'pro-valentina' },
      { dia: 12, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-coloracao-lista', forma: 'Pix', profissionalId: 'pro-ana' },
      { dia: 14, caixaId: caixaAnterior.id, ano: anoAnterior, mes: numeroAnterior, servicoId: 'srv-corte-lista', forma: 'Dinheiro', profissionalId: 'pro-paula' },
    ];

    let clienteCurso = 0;
    for (const plano of vendas) {
      if (plano.dia > diaHoje) {
        continue;
      }
      const servico = this.servicos.find((item) => item.id === plano.servicoId);
      const profissional = this.profissionais.find((item) => item.id === plano.profissionalId);
      if (!servico || !profissional) {
        continue;
      }
      const desconto =
        plano.ano === anoAtual && plano.mes === numeroMes && plano.servicoId === 'srv-coloracao-lista' && plano.dia === 1
          ? 20
          : 0;
      const valor = arredondar(servico.preco - desconto);
      const vendaId = this.novoId('V');
      const venda: Movimentacao = {
        id: vendaId,
        caixaId: plano.caixaId,
        dataHora: new Date(plano.ano, plano.mes - 1, plano.dia, 12).toISOString(),
        tipo: 'venda',
        descricao: servico.nome,
        profissional: profissional.nome,
        profissionalId: profissional.id,
        itens: [{ tipo: 'servico', id: servico.id, nome: servico.nome, quantidade: 1, precoUnitario: servico.preco }],
        pagamentos: [{ forma: plano.forma, valor }],
        valor,
        desconto,
        responsavel: this.usuarioAtual,
      };
      if (plano.dia < diaHoje) {
        const cliente = this.clientes[clienteCurso % this.clientes.length];
        clienteCurso += 1;
        const agendamentoId = this.novoId('ag');
        const competencia = `${plano.ano}-${String(plano.mes).padStart(2, '0')}`;
        this.agendamentos.push({
          id: agendamentoId,
          data: vencimentoNoMes(competencia, plano.dia),
          hora: '10:00',
          cliente: cliente.nome,
          clienteId: cliente.id,
          servico: servico.nome,
          servicoId: servico.id,
          profissional: profissional.nome,
          profissionalId: profissional.id,
          status: 'Concluído',
          preco: servico.preco,
          vendaId,
        });
        venda.agendamentoId = agendamentoId;
      }
      this.movimentacoes.push(venda);
    }

    const ocorrencias: {
      dia: number;
      status: 'Cancelado' | 'Falta';
      clienteId: string;
      servicoId: string;
      profissionalId: string;
      hora: string;
    }[] = [
      { dia: 5, status: 'Cancelado', clienteId: 'cli-juliana', servicoId: 'srv-corte-lista', profissionalId: 'pro-paula', hora: '11:00' },
      { dia: 7, status: 'Falta', clienteId: 'cli-carla', servicoId: 'srv-hidratacao', profissionalId: 'pro-ana', hora: '14:00' },
      { dia: 12, status: 'Cancelado', clienteId: 'cli-beatriz', servicoId: 'srv-mechas', profissionalId: 'pro-valentina', hora: '11:00' },
    ];
    for (const ocorrencia of ocorrencias) {
      if (ocorrencia.dia >= diaHoje) {
        continue;
      }
      const servico = this.servicos.find((item) => item.id === ocorrencia.servicoId);
      const profissional = this.profissionais.find((item) => item.id === ocorrencia.profissionalId);
      const cliente = this.clientes.find((item) => item.id === ocorrencia.clienteId);
      if (!servico || !profissional || !cliente) {
        continue;
      }
      this.agendamentos.push({
        id: this.novoId('ag'),
        data: vencimentoNoMes(mesAtual, ocorrencia.dia),
        hora: ocorrencia.hora,
        cliente: cliente.nome,
        clienteId: cliente.id,
        servico: servico.nome,
        servicoId: servico.id,
        profissional: profissional.nome,
        profissionalId: profissional.id,
        status: ocorrencia.status,
        preco: servico.preco,
      });
    }

    if (diaHoje >= 15) {
      const mascara = this.produtos.find((item) => item.id === 'prd-mascara');
      if (mascara) {
        this.movimentacoes.push({
          id: this.novoId('V'),
          caixaId: caixaAtual.id,
          dataHora: new Date(anoAtual, numeroMes - 1, 15, 15).toISOString(),
          tipo: 'venda',
          descricao: mascara.nome,
          profissional: 'Paula',
          profissionalId: 'pro-paula',
          itens: [{ tipo: 'produto', id: mascara.id, nome: mascara.nome, quantidade: 1, precoUnitario: mascara.preco }],
          pagamentos: [{ forma: 'Dinheiro', valor: mascara.preco }],
          valor: mascara.preco,
          desconto: 0,
          responsavel: this.usuarioAtual,
        });
      }
    }
    if (diaHoje >= 9) {
      const mascara = this.produtos.find((item) => item.id === 'prd-mascara');
      if (mascara) {
        this.movimentacoes.push({
          id: this.novoId('V'),
          caixaId: caixaAnterior.id,
          dataHora: new Date(anoAnterior, numeroAnterior - 1, 9, 15).toISOString(),
          tipo: 'venda',
          descricao: mascara.nome,
          profissional: 'Ana',
          profissionalId: 'pro-ana',
          itens: [{ tipo: 'produto', id: mascara.id, nome: mascara.nome, quantidade: 1, precoUnitario: mascara.preco }],
          pagamentos: [{ forma: 'Pix', valor: mascara.preco }],
          valor: mascara.preco,
          desconto: 0,
          responsavel: this.usuarioAtual,
        });
      }
    }

    const aluguel: ContaContrato = {
      id: 'ctt-aluguel',
      nome: 'Aluguel',
      valor: 1500,
      tipo: 'fixa',
      diaVencimento: 5,
      inicioCompetencia: deslocarMes(mesAtual, -2),
    };
    const energia: ContaContrato = {
      id: 'ctt-energia',
      nome: 'Energia',
      valor: 280,
      tipo: 'fixa',
      diaVencimento: 20,
      inicioCompetencia: deslocarMes(mesAtual, -2),
    };
    const internet: ContaContrato = {
      id: 'ctt-internet',
      nome: 'Internet',
      valor: 129.9,
      tipo: 'fixa',
      diaVencimento: 10,
      inicioCompetencia: deslocarMes(mesAtual, -2),
    };
    const equipamento: ContaContrato = {
      id: 'ctt-equipamento',
      nome: 'Equipamento',
      valor: 200,
      tipo: 'parcelada',
      diaVencimento: 15,
      inicioCompetencia: deslocarMes(mesAtual, -2),
      parcelas: 6,
    };
    const conserto: ContaContrato = {
      id: 'ctt-conserto',
      nome: 'Conserto',
      valor: 350,
      tipo: 'avulsa',
      diaVencimento: 12,
      inicioCompetencia: mesAtual,
    };
    this.contas.push(aluguel, energia, internet, equipamento, conserto);
    this.garantirLancamentos(mesAtual);

    for (const lancamento of this.lancamentosConta) {
      const passado = compararCompetencia(lancamento.competencia, mesAtual) < 0;
      const internetDoMes = lancamento.contratoId === internet.id && lancamento.competencia === mesAtual && diaHoje >= 10;
      if (passado || internetDoMes) {
        lancamento.status = 'pago';
        lancamento.pagoEm = new Date(
          Number(lancamento.vencimento.slice(0, 4)),
          Number(lancamento.vencimento.slice(5, 7)) - 1,
          Number(lancamento.vencimento.slice(8, 10)),
          11,
        ).toISOString();
      }
    }

    this.sangrias.push(
      { id: 'san-demo-1', descricao: 'Retirada pessoal', valor: 400, data: vencimentoNoMes(mesAtual, 1) },
      { id: 'san-demo-2', descricao: 'Pagamento fornecedor', valor: 180, data: vencimentoNoMes(mesAtual, Math.min(14, diaHoje)) },
    );
    if (diaHoje >= 7) {
      this.sangrias.push({
        id: 'san-demo-3',
        descricao: 'Retirada pessoal',
        valor: 250,
        data: vencimentoNoMes(mesAnterior, 7),
      });
    }

    this.semearClientesForaDoGiro();
  }

  private semearClientesForaDoGiro(): void {
    const renata = montarCliente({
      id: 'cli-renata',
      nome: 'Renata Lima',
      telefone: '(11) 98440-2291',
      nascimento: nascimentoNesteMes(29, 22),
      consentimentoSaude: true,
      tags: ['VIP'],
      anamnese: {
        ...anamneseVazia(),
        procedimentos: ['Coloração'],
        cor: '8.31',
        temProgressiva: false,
        observacoes: 'Loiro bege, sem platinar.',
      },
    });
    const helena = montarCliente({
      id: 'cli-helena',
      nome: 'Helena Dias',
      telefone: '(11) 97611-8080',
      nascimento: '1984-12-03',
      observacoes: 'Pediu para não receber mensagem por enquanto.',
      consentimentoSaude: true,
      tags: ['Alergia'],
      ativo: false,
      anamnese: {
        ...anamneseVazia(),
        procedimentos: ['Coloração'],
        alergias: 'PPD em tintas escuras.',
        temProgressiva: false,
        observacoes: 'Evitar tintas escuras.',
      },
    });
    this.clientes.push(renata, helena);

    const dataRenata = isoDiasAtras(40);
    this.agendamentos.push({
      id: 'ag-renata-retorno',
      data: dataRenata,
      hora: '15:00',
      cliente: renata.nome,
      clienteId: renata.id,
      servico: 'Coloração',
      servicoId: 'srv-coloracao-lista',
      profissional: 'Paula',
      profissionalId: 'pro-paula',
      status: 'Concluído',
      preco: 150,
    });
    this.fichas.push({
      id: 'fv-renata',
      clienteId: renata.id,
      agendamentoId: 'ag-renata-retorno',
      data: dataRenata,
      servico: 'Coloração',
      profissional: 'Paula',
      produtos: [
        {
          marca: 'L\'Oréal',
          linha: 'Majirel',
          cor: '8.31',
          oxidante: '20 volumes',
          proporcao: '1:1,5',
          tempoPausa: '35 min',
        },
      ],
      observacoes: 'Bege fechou bem. Evitar 9.',
      retorno: 'Retoque em 30 dias',
      fotos: [],
      valor: 150,
    });

    const dataHelena = isoDiasAtras(100);
    this.agendamentos.push({
      id: 'ag-helena-retorno',
      data: dataHelena,
      hora: '11:00',
      cliente: helena.nome,
      clienteId: helena.id,
      servico: 'Hidratação',
      servicoId: 'srv-hidratacao',
      profissional: 'Ana',
      profissionalId: 'pro-ana',
      status: 'Concluído',
      preco: 80,
    });
  }

  salvarCliente(dados: ClienteCadastro): ResultadoOperacao {
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

    const tags = [...new Set((dados.tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
    const registro = {
      nome,
      telefone,
      nascimento,
      email,
      observacoes: dados.observacoes?.trim() ?? '',
      consentimentoSaude: !!dados.consentimentoSaude,
      tags,
      ativo: dados.ativo !== false,
    };

    if (dados.id) {
      const atual = this.clientes.find((cliente) => cliente.id === dados.id);
      if (!atual) {
        return { ok: false, mensagem: 'Cliente não encontrada.' };
      }
      Object.assign(atual, registro);
      this.atualizarNomeCliente(atual.id, nome);
      return { ok: true, mensagem: 'Cliente atualizada.', id: atual.id };
    }

    const criado = montarCliente({ id: this.novoId('cli'), ...registro });
    this.clientes.push(criado);
    return { ok: true, mensagem: 'Cliente cadastrada.', id: criado.id };
  }

  salvarAnamnese(clienteId: string, anamnese: AnamneseCapilar, consentimento: boolean): ResultadoOperacao {
    const cliente = this.clientes.find((item) => item.id === clienteId);
    if (!cliente) {
      return { ok: false, mensagem: 'Cliente não encontrada.' };
    }
    const alergias = anamnese.alergias.trim();
    const observacoes = anamnese.observacoes.trim();
    const cor = anamnese.cor.trim();
    if (alergias && !consentimento) {
      return { ok: false, mensagem: 'Marque o consentimento para guardar a alergia.' };
    }
    cliente.consentimentoSaude = consentimento || cliente.consentimentoSaude;
    const temProgressiva = anamnese.temProgressiva;
    cliente.anamnese = {
      procedimentos: anamnese.procedimentos.filter((item) => PROCEDIMENTOS_FICHA.includes(item)),
      cor,
      temProgressiva,
      formol: temProgressiva ? anamnese.formol : '',
      alergias,
      observacoes,
    };
    const semAlergia = cliente.tags.filter((tag) => tag.toLowerCase() !== 'alergia');
    cliente.tags = alergias ? [...semAlergia, 'Alergia'] : semAlergia;
    return { ok: true, mensagem: 'Ficha de anamnese salva.', id: cliente.id };
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
    const vendas = this.movimentacoes.filter((item) => item.tipo === 'venda' && item.clienteId === clienteId);
    const comVenda = new Set(vendas.map((item) => item.agendamentoId).filter((id): id is string => !!id));
    const semVenda = concluidos.filter((item) => !item.vendaId && !comVenda.has(item.id));
    const totalGasto = arredondar(
      somar(vendas.map((item) => item.valor)) + somar(semVenda.map((item) => item.preco)) + somar(manuais.map((item) => item.valor)),
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
      proximo,
    };
  }

  salvarFicha(dados: FichaVisitaCadastro): ResultadoOperacao {
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
    const fotos = (dados.fotos ?? []).filter((foto) => foto.dados.startsWith('data:image/'));
    if (fotos.length > 4) {
      return { ok: false, mensagem: 'A ficha aceita até 4 fotos.' };
    }
    if (fotos.length && !cliente.consentimentoSaude) {
      return { ok: false, mensagem: 'Marque o consentimento na ficha da cliente antes de guardar fotos.' };
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

    const ficha: FichaVisita = {
      id: dados.id ?? this.novoId('fv'),
      clienteId: cliente.id,
      agendamentoId: dados.agendamentoId,
      data: dados.data,
      servico,
      profissional,
      produtos,
      observacoes: dados.observacoes?.trim() ?? '',
      retorno: dados.retorno?.trim() ?? '',
      fotos,
      valor,
    };
    if (dados.id) {
      const index = this.fichas.findIndex((item) => item.id === dados.id);
      if (index < 0) {
        return { ok: false, mensagem: 'Atendimento não encontrado.' };
      }
      this.fichas[index] = ficha;
      return { ok: true, mensagem: 'Ficha do atendimento atualizada.', id: ficha.id };
    }
    this.fichas.push(ficha);
    return { ok: true, mensagem: 'Ficha do atendimento registrada.', id: ficha.id };
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

  salvarDadosSalao(dados: DadosSalao): ResultadoOperacao {
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
    this.dadosSalao = {
      nome,
      telefone: this.formatarTelefone(dados.telefone),
      endereco,
    };
    return { ok: true, mensagem: 'Dados do salão salvos.' };
  }

  salvarDescontoMaximo(percentual: number): ResultadoOperacao {
    const valor = Number(percentual);
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
      return { ok: false, mensagem: 'Informe um desconto máximo entre 0 e 100%.' };
    }
    this.descontoMaximoPercentual = arredondar(valor);
    return { ok: true, mensagem: 'Desconto máximo salvo.' };
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

  salvarHorarios(horarios: HorarioFuncionamento[]): ResultadoOperacao {
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

    this.substituir(this.horarios, normalizados);
    return { ok: true, mensagem: 'Horários salvos.' };
  }

  listarBloqueios(): BloqueioAgenda[] {
    return [...this.bloqueios].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio) || a.id.localeCompare(b.id));
  }

  salvarBloqueio(dados: BloqueioCadastro): ResultadoOperacao {
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

    const registro: BloqueioAgenda = {
      id: dados.id ?? this.novoId('blq'),
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      horaInicio,
      horaFim,
      diaInteiro: dados.diaInteiro,
      motivo,
    };

    if (dados.id) {
      const indice = this.bloqueios.findIndex((item) => item.id === dados.id);
      if (indice < 0) {
        return { ok: false, mensagem: 'Bloqueio não encontrado.' };
      }
      this.bloqueios[indice] = registro;
      return { ok: true, mensagem: 'Bloqueio atualizado.', id: registro.id };
    }

    this.bloqueios.push(registro);
    return { ok: true, mensagem: 'Bloqueio salvo.', id: registro.id };
  }

  removerBloqueio(id: string): ResultadoOperacao {
    const indice = this.bloqueios.findIndex((item) => item.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Bloqueio não encontrado.' };
    }
    this.bloqueios.splice(indice, 1);
    return { ok: true, mensagem: 'Bloqueio removido.' };
  }

  listarUsuarios(): UsuarioSalao[] {
    return this.usuarios.map((usuario) => ({ ...usuario, acessos: [...usuario.acessos] }));
  }

  cadastrarOperador(dados: UsuarioOperadorCadastro): ResultadoOperacao {
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
    const usuario: UsuarioSalao = {
      id: this.novoId('usr'),
      nome,
      perfil: 'OPERADOR',
      ativo: true,
      acessos,
    };
    this.usuarios.push(usuario);
    return { ok: true, mensagem: 'Funcionária cadastrada.', id: usuario.id };
  }

  definirAcessos(id: string, acessosInformados: ModuloAcesso[]): ResultadoOperacao {
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
    usuario.acessos = acessos;
    return { ok: true, mensagem: 'Acessos atualizados.' };
  }

  definirUsuarioAtivo(id: string, ativo: boolean): ResultadoOperacao {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      return { ok: false, mensagem: 'Usuário não encontrado.' };
    }
    if (usuario.perfil === 'ADMIN') {
      return { ok: false, mensagem: 'A conta da administradora não pode ser desativada.' };
    }
    usuario.ativo = ativo;
    return { ok: true, mensagem: ativo ? 'Funcionária reativada.' : 'Funcionária desativada.' };
  }

  salvarProduto(dados: ProdutoCadastro): ResultadoOperacao {
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

    if (dados.id) {
      const atual = this.produtos.find((produto) => produto.id === dados.id);
      if (!atual) {
        return { ok: false, mensagem: 'Produto não encontrado.' };
      }
      atual.nome = nome;
      atual.categoria = categoria.nome;
      atual.uso = dados.uso;
      atual.unidade = unidade;
      atual.codigoBarras = codigoBarras;
      atual.precoCusto = precoCusto;
      atual.preco = preco;
      atual.estoqueMinimo = estoqueMinimo;
      atual.estoqueAtual = estoqueAtual;
      this.atualizarStatus(atual);
      return { ok: true, mensagem: 'Produto atualizado.', id: atual.id };
    }

    const criado: ProdutoEstoque = {
      id: this.novoId('prd'),
      nome,
      categoria: categoria.nome,
      uso: dados.uso,
      unidade,
      codigoBarras,
      precoCusto,
      preco,
      estoqueMinimo,
      estoqueAtual,
      status: 'normal',
    };
    this.atualizarStatus(criado);
    this.produtos.push(criado);
    return { ok: true, mensagem: 'Produto cadastrado.', id: criado.id };
  }

  movimentarProduto(id: string, tipo: 'entrada' | 'saida', quantidadeInformada: number): ResultadoOperacao {
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

    produto.estoqueAtual += tipo === 'entrada' ? quantidade : -quantidade;
    this.atualizarStatus(produto);
    return {
      ok: true,
      mensagem: tipo === 'entrada' ? 'Entrada registrada.' : 'Saída registrada.',
      id: produto.id,
    };
  }

  removerProduto(id: string): ResultadoOperacao {
    const indice = this.produtos.findIndex((produto) => produto.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Produto não encontrado.' };
    }
    this.produtos.splice(indice, 1);
    return { ok: true, mensagem: 'Produto excluído.' };
  }

  listarCategorias(tipo: TipoCategoria): CategoriaSalao[] {
    return this.categorias.filter((categoria) => categoria.tipo === tipo).map((categoria) => ({ ...categoria }));
  }

  produtosNaCategoria(nome: string): number {
    const alvo = nome.trim().toLowerCase();
    return this.produtos.filter((produto) => produto.categoria.trim().toLowerCase() === alvo).length;
  }

  salvarCategoria(dados: CategoriaCadastro): ResultadoOperacao {
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

    if (dados.id) {
      const atual = this.categorias.find((categoria) => categoria.id === dados.id);
      if (!atual || atual.tipo !== dados.tipo) {
        return { ok: false, mensagem: 'Categoria não encontrada.' };
      }
      if (atual.tipo === 'estoque') {
        for (const produto of this.produtos) {
          if (produto.categoria.trim().toLowerCase() === atual.nome.trim().toLowerCase()) {
            produto.categoria = nome;
          }
        }
      }
      atual.nome = nome;
      return { ok: true, mensagem: 'Categoria atualizada.' };
    }

    const criada: CategoriaSalao = { id: this.novoId('cat'), nome, tipo: dados.tipo };
    this.categorias.push(criada);
    return { ok: true, mensagem: 'Categoria salva.', id: criada.id };
  }

  removerCategoria(id: string): ResultadoOperacao {
    const indice = this.categorias.findIndex((categoria) => categoria.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Categoria não encontrada.' };
    }
    const categoria = this.categorias[indice];
    if (categoria.tipo === 'estoque' && this.produtosNaCategoria(categoria.nome) > 0) {
      return { ok: false, mensagem: 'Esta categoria ainda tem produtos no estoque.' };
    }
    this.categorias.splice(indice, 1);
    return { ok: true, mensagem: 'Categoria removida.' };
  }

  listarFormas(): FormaConfigurada[] {
    return this.formas.map((forma) => ({ ...forma }));
  }

  salvarFormas(formas: FormaConfigurada[]): ResultadoOperacao {
    const validacao = this.validarFormas(formas, 'formas');
    if (!validacao.ok) {
      return validacao;
    }
    this.aplicarFormas(validacao.formas, 'formas');
    return { ok: true, mensagem: 'Formas de pagamento salvas.' };
  }

  salvarTaxas(formas: FormaConfigurada[]): ResultadoOperacao {
    const validacao = this.validarFormas(formas, 'taxas');
    if (!validacao.ok) {
      return validacao;
    }
    this.aplicarFormas(validacao.formas, 'taxas');
    return { ok: true, mensagem: 'Taxas salvas.' };
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

  alterarSenha(dados: TrocaSenha): ResultadoOperacao {
    if (dados.atual !== this.senha) {
      return { ok: false, mensagem: 'A senha atual não confere.' };
    }
    const nova = dados.nova.trim();
    if (nova.length < 6) {
      return { ok: false, mensagem: 'A nova senha precisa ter ao menos 6 caracteres.' };
    }
    if (nova !== dados.confirmacao.trim()) {
      return { ok: false, mensagem: 'A confirmação não confere com a nova senha.' };
    }
    if (nova === this.senha) {
      return { ok: false, mensagem: 'Escolha uma senha diferente da atual.' };
    }
    this.senha = nova;
    return { ok: true, mensagem: 'Senha alterada.' };
  }

  exportarDados(): string {
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

  restaurarDados(texto: string): ResultadoOperacao {
    let bruto: unknown;
    try {
      bruto = JSON.parse(texto);
    } catch {
      return { ok: false, mensagem: 'O arquivo não é um backup válido.' };
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
        fotos: (ficha.fotos ?? []).map((foto) => ({ ...foto })),
      })),
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
      observacoes: typeof bruto.observacoes === 'string' ? bruto.observacoes : '',
      consentimentoSaude: !!bruto.consentimentoSaude,
      tags: Array.isArray(bruto.tags) ? bruto.tags.filter((tag) => typeof tag === 'string') : [],
      ativo: bruto.ativo !== false,
      anamnese: normalizarAnamnese(anamnese),
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
