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

  private sequencia = 0;

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

  listarHorarios(): HorarioFuncionamento[] {
    return this.horarios.map((horario) => ({ ...horario }));
  }

  salvarHorarios(horarios: HorarioFuncionamento[]): ResultadoOperacao {
    if (horarios.length !== DIAS_SEMANA.length) {
      return { ok: false, mensagem: 'Informe o horário de todos os dias da semana.' };
    }

    const vistos = new Set<number>();
    for (const horario of horarios) {
      if (!DIAS_SEMANA.some((dia) => dia.dia === horario.dia) || vistos.has(horario.dia)) {
        return { ok: false, mensagem: 'Dia da semana inválido.' };
      }
      vistos.add(horario.dia);
      if (!horario.ativo) {
        continue;
      }
      const abertura = this.normalizarHora(horario.abertura);
      const fechamento = this.normalizarHora(horario.fechamento);
      if (!abertura || !fechamento) {
        return { ok: false, mensagem: `Informe abertura e fechamento de ${nomeDia(horario.dia)}.` };
      }
      if (this.minutos(abertura) >= this.minutos(fechamento)) {
        return { ok: false, mensagem: `O fechamento de ${nomeDia(horario.dia)} precisa ser depois da abertura.` };
      }
    }

    for (const horario of horarios) {
      const atual = this.horarios.find((item) => item.dia === horario.dia);
      if (!atual) {
        return { ok: false, mensagem: 'Dia da semana inválido.' };
      }
      atual.ativo = horario.ativo;
      const abertura = this.normalizarHora(horario.abertura);
      const fechamento = this.normalizarHora(horario.fechamento);
      if (abertura) {
        atual.abertura = abertura;
      }
      if (fechamento) {
        atual.fechamento = fechamento;
      }
    }

    return { ok: true, mensagem: 'Horários salvos.' };
  }

  listarBloqueios(): BloqueioAgenda[] {
    return [...this.bloqueios].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio) || a.horaInicio.localeCompare(b.horaInicio));
  }

  salvarBloqueio(dados: BloqueioCadastro): ResultadoOperacao {
    const motivo = dados.motivo.trim();
    if (motivo.length < 3) {
      return { ok: false, mensagem: 'Informe o motivo do bloqueio.' };
    }
    if (!dataIsoValida(dados.dataInicio) || !dataIsoValida(dados.dataFim)) {
      return { ok: false, mensagem: 'Informe a data do bloqueio.' };
    }
    if (dados.dataFim < dados.dataInicio) {
      return { ok: false, mensagem: 'A data final precisa ser igual ou posterior à inicial.' };
    }

    let horaInicio = '';
    let horaFim = '';
    if (!dados.diaInteiro) {
      horaInicio = this.normalizarHora(dados.horaInicio);
      horaFim = this.normalizarHora(dados.horaFim);
      if (!horaInicio || !horaFim) {
        return { ok: false, mensagem: 'Informe o horário do bloqueio ou marque o dia inteiro.' };
      }
      if (this.minutos(horaInicio) >= this.minutos(horaFim)) {
        return { ok: false, mensagem: 'O horário final precisa ser depois do inicial.' };
      }
    }

    if (dados.id) {
      const atual = this.bloqueios.find((item) => item.id === dados.id);
      if (!atual) {
        return { ok: false, mensagem: 'Bloqueio não encontrado.' };
      }
      atual.dataInicio = dados.dataInicio;
      atual.dataFim = dados.dataFim;
      atual.horaInicio = horaInicio;
      atual.horaFim = horaFim;
      atual.diaInteiro = dados.diaInteiro;
      atual.motivo = motivo;
      return { ok: true, mensagem: 'Bloqueio atualizado.', id: atual.id };
    }

    const criado: BloqueioAgenda = {
      id: this.novoId('blq'),
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      horaInicio,
      horaFim,
      diaInteiro: dados.diaInteiro,
      motivo,
    };
    this.bloqueios.push(criado);
    return { ok: true, mensagem: 'Bloqueio registrado.', id: criado.id };
  }

  removerBloqueio(id: string): ResultadoOperacao {
    const indice = this.bloqueios.findIndex((item) => item.id === id);
    if (indice < 0) {
      return { ok: false, mensagem: 'Bloqueio não encontrado.' };
    }
    this.bloqueios.splice(indice, 1);
    return { ok: true, mensagem: 'Bloqueio removido.', id };
  }

  listarUsuarios(): UsuarioSalao[] {
    return [...this.usuarios]
      .sort((a, b) => Number(b.perfil === 'ADMIN') - Number(a.perfil === 'ADMIN') || a.nome.localeCompare(b.nome, 'pt-BR'))
      .map((usuario) => ({ ...usuario, acessos: [...usuario.acessos] }));
  }

  cadastrarOperador(dados: UsuarioOperadorCadastro): ResultadoOperacao {
    const nome = dados.nome.trim();
    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome da funcionária.' };
    }
    if (this.usuarios.some((usuario) => usuario.nome.toLowerCase() === nome.toLowerCase())) {
      return { ok: false, mensagem: 'Já existe uma funcionária com esse nome.' };
    }
    const acessos = this.normalizarAcessos(dados.acessos);
    if (!acessos) {
      return { ok: false, mensagem: 'Há uma tela de acesso inválida.' };
    }
    if (acessos.length === 0) {
      return { ok: false, mensagem: 'Marque ao menos uma tela.' };
    }
    const criado: UsuarioSalao = {
      id: this.novoId('usr'),
      nome,
      perfil: 'OPERADOR',
      ativo: true,
      acessos,
    };
    this.usuarios.push(criado);
    return { ok: true, mensagem: 'Funcionária cadastrada.', id: criado.id };
  }

  definirUsuarioAtivo(id: string, ativo: boolean): ResultadoOperacao {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      return { ok: false, mensagem: 'Usuária não encontrada.' };
    }
    if (usuario.id === this.usuarioAtualId) {
      return { ok: false, mensagem: 'A conta em uso não pode ser desativada.' };
    }
    if (usuario.perfil === 'ADMIN') {
      return { ok: false, mensagem: 'A administradora permanece ativa.' };
    }
    if (usuario.ativo === ativo) {
      return {
        ok: false,
        mensagem: ativo ? 'Esta funcionária já está ativa.' : 'Esta funcionária já está inativa.',
      };
    }
    usuario.ativo = ativo;
    return {
      ok: true,
      mensagem: ativo ? 'Funcionária reativada.' : 'Funcionária desativada.',
      id: usuario.id,
    };
  }

  definirAcessos(id: string, acessosInformados: ModuloAcesso[]): ResultadoOperacao {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) {
      return { ok: false, mensagem: 'Usuária não encontrada.' };
    }
    if (usuario.perfil === 'ADMIN') {
      return { ok: false, mensagem: 'A administradora acessa todas as telas.' };
    }
    const acessos = this.normalizarAcessos(acessosInformados);
    if (!acessos) {
      return { ok: false, mensagem: 'Há uma tela de acesso inválida.' };
    }
    if (acessos.length === 0) {
      return { ok: false, mensagem: 'Marque ao menos uma tela.' };
    }
    usuario.acessos = acessos;
    return { ok: true, mensagem: 'Acesso atualizado.', id: usuario.id };
  }

  listarCategorias(tipo: TipoCategoria): CategoriaSalao[] {
    return this.categorias
      .filter((categoria) => categoria.tipo === tipo)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
      .map((categoria) => ({ ...categoria }));
  }

  salvarCategoria(dados: CategoriaCadastro): ResultadoOperacao {
    const nome = dados.nome.trim();
    if (nome.length < 2) {
      return { ok: false, mensagem: 'Informe o nome da categoria.' };
    }
    const repetida = this.categorias.some(
      (categoria) =>
        categoria.tipo === dados.tipo &&
        categoria.id !== dados.id &&
        categoria.nome.toLowerCase() === nome.toLowerCase(),
    );
    if (repetida) {
      return { ok: false, mensagem: 'Já existe uma categoria com esse nome.' };
    }

    if (dados.id) {
      const atual = this.categorias.find((categoria) => categoria.id === dados.id && categoria.tipo === dados.tipo);
      if (!atual) {
        return { ok: false, mensagem: 'Categoria não encontrada.' };
      }
      if (atual.tipo === 'estoque' && atual.nome !== nome) {
        for (const produto of this.produtos) {
          if (produto.categoria.toLowerCase() === atual.nome.toLowerCase()) {
            produto.categoria = nome;
          }
        }
      }
      atual.nome = nome;
      return { ok: true, mensagem: 'Categoria atualizada.', id: atual.id };
    }

    const criada: CategoriaSalao = { id: this.novoId('cat'), nome, tipo: dados.tipo };
    this.categorias.push(criada);
    return { ok: true, mensagem: 'Categoria registrada.', id: criada.id };
  }

  removerCategoria(id: string): ResultadoOperacao {
    const categoria = this.categorias.find((item) => item.id === id);
    if (!categoria) {
      return { ok: false, mensagem: 'Categoria não encontrada.' };
    }
    if (categoria.tipo === 'estoque' && this.produtosNaCategoria(categoria.nome) > 0) {
      return { ok: false, mensagem: 'Esta categoria ainda tem produtos no estoque.' };
    }
    const indice = this.categorias.findIndex((item) => item.id === id);
    this.categorias.splice(indice, 1);
    return { ok: true, mensagem: 'Categoria removida.', id };
  }

  listarFormas(): FormaConfigurada[] {
    return this.formas.map((forma) => ({ ...forma }));
  }

  maxParcelasCredito(): number {
    return this.formas.find((forma) => forma.forma === 'Cartão de crédito')?.maxParcelas ?? 1;
  }

  taxaDe(forma: FormaPagamento): number {
    return this.formas.find((item) => item.forma === forma)?.taxaPercentual ?? 0;
  }

  salvarFormas(informadas: FormaConfigurada[]): ResultadoOperacao {
    if (!this.formasCompletas(informadas)) {
      return { ok: false, mensagem: 'Informe todas as formas de pagamento.' };
    }
    if (!informadas.some((forma) => forma.ativa)) {
      return { ok: false, mensagem: 'Deixe ao menos uma forma ativa.' };
    }
    const credito = informadas.find((forma) => forma.forma === 'Cartão de crédito');
    const maximo = Math.floor(Number(credito?.maxParcelas));
    if (!Number.isInteger(maximo) || maximo < 1 || maximo > 24) {
      return { ok: false, mensagem: 'O crédito aceita de 1 a 24 parcelas.' };
    }

    for (const atual of this.formas) {
      const informada = informadas.find((forma) => forma.forma === atual.forma);
      if (!informada) {
        continue;
      }
      atual.ativa = informada.ativa;
      if (atual.forma === 'Cartão de crédito') {
        atual.maxParcelas = maximo;
      }
    }
    return { ok: true, mensagem: 'Formas de pagamento salvas.' };
  }

  salvarTaxas(informadas: FormaConfigurada[]): ResultadoOperacao {
    if (!this.formasCompletas(informadas)) {
      return { ok: false, mensagem: 'Informe a taxa de cada forma de pagamento.' };
    }
    const taxas = new Map<FormaPagamento, number>();
    for (const informada of informadas) {
      const taxa = arredondar(Number(informada.taxaPercentual));
      if (!Number.isFinite(taxa) || taxa < 0 || taxa > 100) {
        return { ok: false, mensagem: `Informe a taxa de ${informada.forma} entre 0 e 100%.` };
      }
      taxas.set(informada.forma, taxa);
    }
    for (const atual of this.formas) {
      atual.taxaPercentual = taxas.get(atual.forma) ?? atual.taxaPercentual;
    }
    return { ok: true, mensagem: 'Taxas salvas.' };
  }

  exportarDados(): string {
    return JSON.stringify(
      {
        versao: 1,
        exportadoEm: new Date().toISOString(),
        sequencia: this.sequencia,
        horarios: this.horarios.map((item) => ({ ...item })),
        bloqueios: this.bloqueios.map((item) => ({ ...item })),
        profissionais: this.profissionais.map((item) => ({ ...item })),
        clientes: this.clientes.map((item) => ({ ...item })),
        servicos: this.servicos.map((item) => ({ ...item })),
        produtos: this.produtos.map((item) => ({ ...item })),
        agendamentos: this.agendamentos.map((item) => ({ ...item })),
        caixas: this.caixas.map((item) => ({ ...item })),
        movimentacoes: this.movimentacoes.map((item) => ({
          ...item,
          itens: item.itens.map((linha) => ({ ...linha })),
          pagamentos: item.pagamentos.map((pagamento) => ({ ...pagamento })),
        })),
        usuarios: this.usuarios.map((item) => ({ ...item, acessos: [...item.acessos] })),
        categorias: this.categorias.map((item) => ({ ...item })),
        formas: this.listarFormas(),
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
    if (dados['versao'] !== 1) {
      return { ok: false, mensagem: 'Este backup é de uma versão diferente.' };
    }

    const horarios = this.comoLista<HorarioFuncionamento>(dados['horarios']);
    const bloqueios = this.comoLista<BloqueioAgenda>(dados['bloqueios']);
    const profissionais = this.comoLista<Profissional>(dados['profissionais']);
    const clientes = this.comoLista<Cliente>(dados['clientes']);
    const servicos = this.comoLista<Servico>(dados['servicos']);
    const produtos = this.comoLista<ProdutoEstoque>(dados['produtos']);
    const agendamentos = this.comoLista<AgendamentoDia>(dados['agendamentos']);
    const caixas = this.comoLista<CaixaRegistro>(dados['caixas']);
    const movimentacoes = this.comoLista<Movimentacao>(dados['movimentacoes']);
    const usuarios = this.comoLista<UsuarioSalao>(dados['usuarios']);
    const categorias = this.comoLista<CategoriaSalao>(dados['categorias']);
    const formas = this.comoLista<FormaConfigurada>(dados['formas']);

    if (!horarios || horarios.length !== DIAS_SEMANA.length) {
      return { ok: false, mensagem: 'O backup não tem os horários da semana.' };
    }
    if (
      !bloqueios ||
      !profissionais ||
      !clientes ||
      !servicos ||
      !produtos ||
      !agendamentos ||
      !caixas ||
      !movimentacoes ||
      !categorias
    ) {
      return { ok: false, mensagem: 'O backup está incompleto.' };
    }
    if (!usuarios?.some((usuario) => usuario.id === this.usuarioAtualId && usuario.perfil === 'ADMIN')) {
      return { ok: false, mensagem: 'O backup precisa incluir a conta em uso.' };
    }
    if (!formas || !this.formasCompletas(formas)) {
      return { ok: false, mensagem: 'O backup não tem as formas de pagamento.' };
    }

    this.substituir(this.horarios, horarios);
    this.substituir(this.bloqueios, bloqueios);
    this.substituir(this.profissionais, profissionais);
    this.substituir(this.clientes, clientes);
    this.substituir(this.servicos, servicos);
    this.substituir(this.produtos, produtos);
    this.substituir(this.agendamentos, agendamentos);
    this.substituir(this.caixas, caixas);
    this.substituir(this.movimentacoes, movimentacoes);
    this.substituir(this.usuarios, usuarios.map((usuario) => ({ ...usuario, acessos: [...usuario.acessos] })));
    this.substituir(this.categorias, categorias);
    for (const atual of this.formas) {
      const restaurada = formas.find((forma) => forma.forma === atual.forma);
      if (!restaurada) {
        continue;
      }
      atual.ativa = restaurada.ativa;
      atual.taxaPercentual = restaurada.taxaPercentual;
      atual.maxParcelas = restaurada.forma === 'Cartão de crédito' ? restaurada.maxParcelas : 1;
    }
    if (typeof dados['sequencia'] === 'number' && dados['sequencia'] > this.sequencia) {
      this.sequencia = dados['sequencia'];
    }
    return { ok: true, mensagem: 'Backup restaurado.' };
  }

  produtosNaCategoria(nome: string): number {
    return this.produtos.filter((produto) => produto.categoria.toLowerCase() === nome.toLowerCase()).length;
  }

  alterarSenha(dados: TrocaSenha): ResultadoOperacao {
    if (!dados.atual || dados.atual !== this.senha) {
      return { ok: false, mensagem: 'A senha atual não confere.' };
    }
    if (dados.nova.length < 6) {
      return { ok: false, mensagem: 'A nova senha precisa ter pelo menos 6 caracteres.' };
    }
    if (dados.nova !== dados.confirmacao) {
      return { ok: false, mensagem: 'A confirmação não confere com a nova senha.' };
    }
    if (dados.nova === dados.atual) {
      return { ok: false, mensagem: 'A nova senha precisa ser diferente da atual.' };
    }
    this.senha = dados.nova;
    return { ok: true, mensagem: 'Senha alterada.' };
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
