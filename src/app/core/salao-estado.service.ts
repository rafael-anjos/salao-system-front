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

@Injectable({ providedIn: 'root' })
export class SalaoEstadoService {
  readonly salao = 'Eula Moraes Studio';
  readonly usuarioAtual = 'Paula';
  readonly formasPagamento = FORMAS_PAGAMENTO;

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
    const pagamentos = (pedido.pagamentos ?? []).map((pagamento) => ({
      forma: pagamento.forma,
      valor: arredondar(Number(pagamento.valor)),
    }));

    if (!pagamentos.length || pagamentos.some((pagamento) => !this.formasPagamento.includes(pagamento.forma))) {
      return { ok: false, mensagem: 'Selecione a forma de pagamento.' };
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
    const porForma = new Map<FormaPagamento, number>();

    for (const movimento of movimentos) {
      const sinal = movimento.tipo === 'saida' || movimento.tipo === 'estorno' ? -1 : 1;
      for (const pagamento of movimento.pagamentos) {
        porForma.set(pagamento.forma, arredondar((porForma.get(pagamento.forma) ?? 0) + sinal * pagamento.valor));
      }
    }

    return {
      vendas: somar(vendas.map((item) => item.valor)),
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
      porForma: this.formasPagamento
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

  private novoId(prefixo: string): string {
    this.sequencia += 1;
    return `${prefixo}-${String(this.sequencia).padStart(3, '0')}`;
  }
}
