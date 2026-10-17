import { Injectable } from '@angular/core';

/**
 * Estado compartilhado da sessão.
 * Não há API no projeto: Estoque e Dashboard leem estes mesmos cadastros.
 * Os dados duram enquanto a aplicação está aberta.
 */
export type StatusAgendamento = 'Confirmado' | 'Em andamento' | 'Aguardando' | 'Concluído';
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

export interface Cliente {
  id: string;
  nome: string;
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
  status: StatusEstoque;
  uso: UsoProduto;
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
  readonly salao = 'Eula Moraes Studio';
  readonly usuarioAtualId = 'usr-paula';
  readonly usuarioAtual = 'Paula';
  readonly formas: FormaConfigurada[] = [
    { forma: 'Dinheiro', ativa: true, taxaPercentual: 0, maxParcelas: 1 },
    { forma: 'Pix', ativa: true, taxaPercentual: 0, maxParcelas: 1 },
    { forma: 'Cartão de débito', ativa: true, taxaPercentual: 0, maxParcelas: 1 },
    { forma: 'Cartão de crédito', ativa: true, taxaPercentual: 0, maxParcelas: 6 },
  ];

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
    { dia: 6, abertura: '08:00', fechamento: '16:00', ativo: true },
    { dia: 0, abertura: '09:00', fechamento: '13:00', ativo: false },
  ];

  /**
   * Bloqueios da sessão.
   * Contrato previsto: GET /api/disponibilidade/bloqueados e POST/DELETE /api/disponibilidade/bloqueio.
   */
  readonly bloqueios: BloqueioAgenda[] = [
    {
      id: 'blq-finados',
      dataInicio: '2026-11-02',
      dataFim: '2026-11-02',
      horaInicio: '',
      horaFim: '',
      diaInteiro: true,
      motivo: 'Feriado — Finados',
    },
    {
      id: 'blq-folga',
      dataInicio: '2026-10-20',
      dataFim: '2026-10-20',
      horaInicio: '14:00',
      horaFim: '19:00',
      diaInteiro: false,
      motivo: 'Folga da equipe',
    },
  ];

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
    { id: 'cli-maria', nome: 'Maria Silva' },
    { id: 'cli-ana', nome: 'Ana Costa' },
    { id: 'cli-juliana', nome: 'Juliana Alves' },
    { id: 'cli-carla', nome: 'Carla Mendes' },
    { id: 'cli-beatriz', nome: 'Beatriz Nunes' },
    { id: 'cli-fernanda', nome: 'Fernanda Rocha' },
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
      cliente: cliente?.nome,
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

    if (!clienteNome) {
      return { ok: false, mensagem: 'Informe o nome do cliente.' };
    }
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

    const inicio = this.minutos(hora);
    const duracao = servico.duracaoMinutos;
    const conflito = this.agendamentos.some((item) => {
      if (item.id === atual?.id || item.data !== dados.data) {
        return false;
      }
      const outroServico = this.servicos.find((cadastro) => cadastro.id === item.servicoId);
      const outraDuracao = outroServico?.duracaoMinutos ?? 60;
      const outroInicio = this.minutos(item.hora);
      const mesmoHorario = inicio < outroInicio + outraDuracao && outroInicio < inicio + duracao;
      if (!mesmoHorario) {
        return false;
      }
      return item.profissionalId === profissional.id || item.cliente.trim().toLowerCase() === clienteNome.toLowerCase();
    });
    if (conflito) {
      return { ok: false, mensagem: 'Esse horário já está ocupado para a profissional ou para o cliente.' };
    }

    const cliente = this.obterOuCriarCliente(clienteNome);
    if (atual) {
      atual.data = dados.data;
      atual.hora = hora;
      atual.cliente = cliente.nome;
      atual.clienteId = cliente.id;
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
      cliente: cliente.nome,
      clienteId: cliente.id,
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

    for (const plano of vendas) {
      if (plano.dia > diaHoje) {
        continue;
      }
      const servico = this.servicos.find((item) => item.id === plano.servicoId);
      const profissional = this.profissionais.find((item) => item.id === plano.profissionalId);
      if (!servico || !profissional) {
        continue;
      }
      this.movimentacoes.push({
        id: this.novoId('V'),
        caixaId: plano.caixaId,
        dataHora: new Date(plano.ano, plano.mes - 1, plano.dia, 12).toISOString(),
        tipo: 'venda',
        descricao: servico.nome,
        profissional: profissional.nome,
        profissionalId: profissional.id,
        itens: [{ tipo: 'servico', id: servico.id, nome: servico.nome, quantidade: 1, precoUnitario: servico.preco }],
        pagamentos: [{ forma: plano.forma, valor: servico.preco }],
        valor: servico.preco,
        desconto: 0,
        responsavel: this.usuarioAtual,
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
  }

  private obterOuCriarCliente(nome: string): Cliente {
    const existente = this.clientes.find((cliente) => cliente.nome.trim().toLowerCase() === nome.toLowerCase());
    if (existente) {
      return existente;
    }
    const criado: Cliente = { id: this.novoId('cli'), nome };
    this.clientes.push(criado);
    return criado;
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

  private formasCompletas(formas: FormaConfigurada[]): boolean {
    if (formas.length !== FORMAS_PAGAMENTO.length) {
      return false;
    }
    return FORMAS_PAGAMENTO.every((nome) => formas.some((forma) => forma.forma === nome));
  }

  private comoLista<T>(valor: unknown): T[] | null {
    return Array.isArray(valor) ? (valor as T[]) : null;
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
