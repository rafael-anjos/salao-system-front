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
}

export interface Cliente {
  id: string;
  nome: string;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
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
  hora: string;
  cliente: string;
  clienteId: string;
  servico: string;
  servicoId: string;
  profissional: string;
  profissionalId: string;
  status: StatusAgendamento;
  preco: number;
  vendaId?: string;
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
    { id: 'pro-eula', nome: 'Eula Moraes' },
    { id: 'pro-paula', nome: 'Paula' },
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
    { id: 'srv-coloracao', nome: 'Coloração', preco: 280 },
    { id: 'srv-corte', nome: 'Corte e escova', preco: 150 },
    { id: 'srv-mani', nome: 'Manicure e pedicure', preco: 90 },
    { id: 'srv-hidra', nome: 'Hidratação', preco: 180 },
    { id: 'srv-sobran', nome: 'Design de sobrancelha', preco: 70 },
    { id: 'srv-progressiva', nome: 'Escova progressiva', preco: 320 },
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
