import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuscaCliente } from '../clientes/busca-cliente/busca-cliente';
import { Notificacoes } from '../notificacoes/notificacoes';
import {
  AgendamentoDia,
  arredondar,
  CaixaRegistro,
  dataIso,
  FormaPagamento,
  ItemPedido,
  Movimentacao,
  ocupaAgenda,
  PagamentoRegistrado,
  rotuloStatusAgendamento,
  SalaoEstadoService,
  TipoMovimento,
} from '../../core/salao-estado.service';

type AbaCaixa = 'caixa' | 'historico' | 'relatorios' | 'pendentes';
type FormatoRelatorio = 'resumido' | 'detalhado';

interface LinhaVenda {
  tipo: 'servico' | 'produto';
  id: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Sugestao {
  tipo: 'servico' | 'produto';
  id: string;
  nome: string;
  preco: number;
  detalhe: string;
}

interface RascunhoAtendimento {
  agendamentoId: string;
  cliente: string;
  profissional: string;
  profissionalId: string;
  hora: string;
  servicos: { id: string; nome: string; preco: number; confirmar: boolean }[];
  produtos: LinhaVenda[];
  desconto: number | null;
  forma: FormaPagamento;
  parcelas: number;
  dividir: boolean;
  forma2: FormaPagamento;
  valor2: number | null;
  termo: string;
  temCliente: boolean;
  registrarFicha: boolean;
  observacaoFicha: string;
  retornoFicha: string;
}

@Component({
  selector: 'app-caixa',
  imports: [FormsModule, CurrencyPipe, BuscaCliente, Notificacoes],
  templateUrl: './caixa.html',
  styleUrl: './caixa.css',
})
export class Caixa {
  readonly estado = inject(SalaoEstadoService);
  readonly hoje = new Date();
  readonly dataExtenso = this.formatarData(this.hoje);
  readonly hojeIso = this.dataInput(this.hoje);

  aba: AbaCaixa = 'caixa';
  termoBusca = '';
  termoItem = '';
  mensagem = '';
  mensagemTipo: 'ok' | 'erro' = 'ok';
  processando = false;

  saldoInicial: number | null = null;
  profissionalId = '';
  clienteId = '';
  clienteNome = '';
  linhas: LinhaVenda[] = [];
  desconto: number | null = 0;
  forma: FormaPagamento = 'Pix';
  parcelas = 1;
  dividir = false;
  forma2: FormaPagamento = 'Dinheiro';
  valor2: number | null = null;

  mostrarMovimento = false;
  tipoMovimento: 'entrada' | 'saida' = 'saida';
  valorMovimento: number | null = null;
  descricaoMovimento = '';
  formaMovimento: FormaPagamento = 'Dinheiro';

  mostrarFechamento = false;
  valorContado: number | null = null;

  caixaSelecionadoId: string | null = null;
  filtroTipo: 'todos' | TipoMovimento = 'todos';
  filtroForma: 'todas' | FormaPagamento = 'todas';
  filtroInicio = '';
  filtroFim = '';

  formatoRelatorio: FormatoRelatorio = 'resumido';
  relInicio = this.hojeIso;
  relFim = this.hojeIso;
  relProfissional = 'todos';
  relForma: 'todas' | FormaPagamento = 'todas';
  relTipo: 'todos' | TipoMovimento = 'todos';

  rascunho: RascunhoAtendimento | null = null;

  get placeholderBusca(): string {
    if (this.aba === 'historico') {
      return 'Buscar no histórico';
    }
    if (this.aba === 'relatorios') {
      return 'Buscar no relatório';
    }
    if (this.aba === 'pendentes') {
      return 'Buscar atendimento';
    }
    return 'Buscar serviço ou produto';
  }

  get termoCabecalho(): string {
    return this.aba === 'caixa' ? this.termoItem : this.termoBusca;
  }

  set termoCabecalho(valor: string) {
    if (this.aba === 'caixa') {
      this.termoItem = valor;
      return;
    }
    this.termoBusca = valor;
  }

  get caixaAberto(): CaixaRegistro | undefined {
    return this.estado.caixaAbertoAtual;
  }

  get caixaEmFoco(): CaixaRegistro | undefined {
    if (this.caixaSelecionadoId) {
      const escolhido = this.estado.caixas.find((caixa) => caixa.id === this.caixaSelecionadoId);
      if (escolhido) {
        return escolhido;
      }
    }
    return this.estado.caixaAbertoAtual ?? this.estado.caixas.at(-1);
  }

  get resumoAberto() {
    const caixa = this.caixaAberto;
    return caixa ? this.estado.resumoCaixa(caixa.id) : null;
  }

  get linhasServico(): LinhaVenda[] {
    return this.linhas.filter((linha) => linha.tipo === 'servico');
  }

  get linhasProduto(): LinhaVenda[] {
    return this.linhas.filter((linha) => linha.tipo === 'produto');
  }

  get subtotal(): number {
    return arredondar(this.linhas.reduce((total, linha) => total + linha.quantidade * linha.precoUnitario, 0));
  }

  get descontoAplicado(): number {
    return this.descontoValido(this.desconto, this.subtotal);
  }

  get totalVenda(): number {
    return arredondar(this.subtotal - this.descontoAplicado);
  }

  get descontoInvalido(): boolean {
    return this.textoDesconto !== '';
  }

  get textoDesconto(): string {
    return this.mensagemDesconto(this.desconto, this.subtotal);
  }

  get sugestoes(): Sugestao[] {
    const termo = this.termoItem.trim().toLowerCase();
    if (termo.length < 1) {
      return [];
    }

    const servicos: Sugestao[] = this.estado.servicos
      .filter((servico) => servico.ativo && !servico.legado && servico.nome.toLowerCase().includes(termo))
      .map((servico) => ({
        tipo: 'servico',
        id: servico.id,
        nome: servico.nome,
        preco: servico.preco,
        detalhe: 'Serviço',
      }));

    const produtos: Sugestao[] = this.estado.produtos
      .filter((produto) => produto.uso === 'venda' && produto.nome.toLowerCase().includes(termo))
      .map((produto) => ({
        tipo: 'produto',
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        detalhe: `${produto.estoqueAtual} em estoque`,
      }));

    return [...servicos, ...produtos].slice(0, 8);
  }

  get sugestoesAtendimento(): Sugestao[] {
    const termo = this.rascunho?.termo.trim().toLowerCase() ?? '';
    if (!termo) {
      return [];
    }
    return this.estado.produtos
      .filter((produto) => produto.uso === 'venda' && produto.nome.toLowerCase().includes(termo))
      .map((produto) => ({
        tipo: 'produto' as const,
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        detalhe: `${produto.estoqueAtual} em estoque`,
      }))
      .slice(0, 6);
  }

  get historico(): Movimentacao[] {
    const caixa = this.caixaEmFoco;
    if (!caixa) {
      return [];
    }
    return this.filtrarMovimentos(
      this.estado.movimentacoes.filter((item) => item.caixaId === caixa.id),
      this.filtroInicio,
      this.filtroFim,
      this.filtroProfissionalHistorico,
      this.filtroForma,
      this.filtroTipo,
      this.termoBusca,
    );
  }

  private get filtroProfissionalHistorico(): string {
    return 'todos';
  }

  get lancamentosRelatorio(): Movimentacao[] {
    return this.filtrarMovimentos(
      this.estado.movimentacoes,
      this.relInicio,
      this.relFim,
      this.relProfissional,
      this.relForma,
      this.relTipo,
      this.aba === 'relatorios' ? this.termoBusca : '',
    );
  }

  get totaisRelatorio() {
    return this.estado.agregar(this.lancamentosRelatorio);
  }

  get caixasDoPeriodo(): CaixaRegistro[] {
    return this.estado.caixas.filter((caixa) => this.dentroDoPeriodo(caixa.abertoEm, this.relInicio, this.relFim));
  }

  get filtroRelatorioExtra(): boolean {
    return (
      this.relProfissional !== 'todos' ||
      this.relForma !== 'todas' ||
      this.relTipo !== 'todos' ||
      this.termoBusca.trim().length > 0
    );
  }

  rotuloStatus(status: AgendamentoDia['status']): string {
    return rotuloStatusAgendamento(status);
  }

  get pendentes(): AgendamentoDia[] {
    const termo = this.termoBusca.trim().toLowerCase();
    return this.estado.agendamentos
      .filter((item) => ocupaAgenda(item.status) && item.status !== 'Concluído' && !item.vendaId && item.data <= dataIso())
      .filter((item) => {
        if (!termo) {
          return true;
        }
        return `${item.cliente} ${item.servico} ${item.profissional}`.toLowerCase().includes(termo);
      })
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  get subtotalAtendimento(): number {
    if (!this.rascunho) {
      return 0;
    }
    const servicos = this.rascunho.servicos
      .filter((item) => item.confirmar)
      .reduce((total, item) => total + item.preco, 0);
    const produtos = this.rascunho.produtos.reduce(
      (total, item) => total + item.quantidade * item.precoUnitario,
      0,
    );
    return arredondar(servicos + produtos);
  }

  get descontoAtendimento(): number {
    if (!this.rascunho) {
      return 0;
    }
    return this.descontoValido(this.rascunho.desconto, this.subtotalAtendimento);
  }

  get totalAtendimento(): number {
    return arredondar(this.subtotalAtendimento - this.descontoAtendimento);
  }

  get descontoAtendimentoInvalido(): boolean {
    return this.textoDescontoAtendimento !== '';
  }

  get textoDescontoAtendimento(): string {
    if (!this.rascunho) {
      return '';
    }
    return this.mensagemDesconto(this.rascunho.desconto, this.subtotalAtendimento);
  }

  get diferencaContagem(): number | null {
    if (!this.resumoAberto || this.valorContado === null || this.valorContado === undefined) {
      return null;
    }
    const contado = Number(this.valorContado);
    if (!Number.isFinite(contado)) {
      return null;
    }
    return arredondar(contado - this.resumoAberto.esperadoDinheiro);
  }

  mudarAba(aba: AbaCaixa): void {
    this.aba = aba;
    this.mensagem = '';
    if (aba === 'historico' && this.caixaAberto) {
      this.caixaSelecionadoId = this.caixaAberto.id;
    }
  }

  abrirCaixa(): void {
    if (this.saldoInicial === null || this.saldoInicial === undefined) {
      this.publicar('erro', 'Informe o saldo inicial.');
      return;
    }
    const resultado = this.estado.abrirCaixa(Number(this.saldoInicial));
    this.publicar(resultado.ok ? 'ok' : 'erro', resultado.mensagem);
    if (resultado.ok && resultado.id) {
      this.caixaSelecionadoId = resultado.id;
      this.saldoInicial = null;
    }
  }

  adicionarSugestao(sugestao: Sugestao, destino: LinhaVenda[] = this.linhas): void {
    if (!this.caixaAberto) {
      this.publicar('erro', 'Abra o caixa para registrar a venda.');
      return;
    }
    const existente = destino.find((linha) => linha.tipo === sugestao.tipo && linha.id === sugestao.id);
    if (existente) {
      existente.quantidade += 1;
      this.normalizarQuantidade(existente);
      return;
    }
    if (sugestao.tipo === 'produto') {
      const produto = this.estado.produtos.find((item) => item.id === sugestao.id);
      if (!produto || produto.estoqueAtual < 1) {
        this.publicar('erro', `${sugestao.nome} está sem estoque.`);
        return;
      }
    }
    destino.push({
      tipo: sugestao.tipo,
      id: sugestao.id,
      nome: sugestao.nome,
      quantidade: 1,
      precoUnitario: sugestao.preco,
    });
    this.termoItem = '';
    if (this.rascunho) {
      this.rascunho.termo = '';
    }
  }

  removerLinha(linha: LinhaVenda, destino: LinhaVenda[] = this.linhas): void {
    const indice = destino.indexOf(linha);
    if (indice >= 0) {
      destino.splice(indice, 1);
    }
  }

  normalizarQuantidade(linha: LinhaVenda): void {
    let quantidade = Math.floor(Number(linha.quantidade));
    if (!Number.isFinite(quantidade) || quantidade < 1) {
      quantidade = 1;
    }
    if (linha.tipo === 'produto') {
      const produto = this.estado.produtos.find((item) => item.id === linha.id);
      const maximo = produto?.estoqueAtual ?? 0;
      if (quantidade > maximo) {
        quantidade = Math.max(1, maximo);
        this.publicar('erro', `Só há ${maximo} un. de ${linha.nome} em estoque.`);
      }
    }
    linha.quantidade = quantidade;
  }

  finalizarVenda(): void {
    if (this.processando) {
      return;
    }
    const itens = this.paraPedido(this.linhas);
    const desconto = Number(this.desconto ?? 0);
    const pagamentos = this.montarPagamentos(this.totalVenda, this.forma, this.parcelas, this.dividir, this.forma2, this.valor2);
    if (!pagamentos) {
      return;
    }
    const avisoDesconto = this.mensagemDesconto(this.desconto, this.subtotal);
    if (avisoDesconto) {
      this.publicar('erro', avisoDesconto);
      return;
    }

    this.processando = true;
    const copia = this.linhas.map((linha) => ({ ...linha }));
    this.linhas = [];
    const resultado = this.estado.registrarVenda({
      profissionalId: this.profissionalId,
      clienteId: this.clienteId || null,
      clienteNome: this.clienteId ? undefined : this.clienteNome,
      itens,
      desconto,
      pagamentos,
    });
    this.processando = false;

    if (!resultado.ok) {
      this.linhas = copia;
      this.publicar('erro', resultado.mensagem);
      return;
    }

    this.desconto = 0;
    this.dividir = false;
    this.valor2 = null;
    this.termoItem = '';
    this.clienteId = '';
    this.clienteNome = '';
    this.publicar('ok', `${resultado.mensagem} ${resultado.id}.`);
  }

  definirCliente(evento: { id: string; nome: string }): void {
    this.clienteId = evento.id;
    this.clienteNome = evento.nome;
  }

  abrirMovimento(): void {
    if (!this.caixaAberto) {
      this.publicar('erro', 'Abra o caixa para registrar a movimentação.');
      return;
    }
    this.mostrarMovimento = true;
    this.tipoMovimento = 'saida';
    this.valorMovimento = null;
    this.descricaoMovimento = '';
    this.formaMovimento = 'Dinheiro';
  }

  confirmarMovimento(): void {
    if (this.processando) {
      return;
    }
    if (this.valorMovimento === null || this.valorMovimento === undefined) {
      this.publicar('erro', 'Informe um valor maior que zero.');
      return;
    }
    this.processando = true;
    const resultado = this.estado.registrarMovimento({
      tipo: this.tipoMovimento,
      valor: Number(this.valorMovimento),
      descricao: this.descricaoMovimento,
      forma: this.formaMovimento,
    });
    this.processando = false;
    this.publicar(resultado.ok ? 'ok' : 'erro', resultado.mensagem);
    if (resultado.ok) {
      this.mostrarMovimento = false;
    }
  }

  abrirFechamento(): void {
    if (!this.caixaAberto) {
      this.publicar('erro', 'Não há caixa aberto para fechar.');
      return;
    }
    this.valorContado = null;
    this.mostrarFechamento = true;
  }

  confirmarFechamento(): void {
    if (this.processando) {
      return;
    }
    if (this.valorContado === null || this.valorContado === undefined) {
      this.publicar('erro', 'Informe o valor contado em dinheiro.');
      return;
    }
    this.processando = true;
    const resultado = this.estado.fecharCaixa(Number(this.valorContado));
    this.processando = false;
    this.publicar(resultado.ok ? 'ok' : 'erro', resultado.mensagem);
    if (resultado.ok) {
      this.mostrarFechamento = false;
      this.caixaSelecionadoId = resultado.id ?? this.caixaSelecionadoId;
    }
  }

  abrirAtendimento(agendamento: AgendamentoDia): void {
    if (!this.caixaAberto) {
      this.publicar('erro', 'Abra o caixa para finalizar o atendimento.');
      return;
    }
    if (agendamento.vendaId || agendamento.status === 'Concluído') {
      this.publicar('erro', 'Este atendimento já foi finalizado.');
      return;
    }
    this.rascunho = {
      agendamentoId: agendamento.id,
      cliente: agendamento.cliente,
      profissional: agendamento.profissional,
      profissionalId: agendamento.profissionalId,
      hora: agendamento.hora,
      servicos: [
        {
          id: agendamento.servicoId,
          nome: agendamento.servico,
          preco: agendamento.preco,
          confirmar: true,
        },
      ],
      produtos: [],
      desconto: 0,
      forma: 'Pix',
      parcelas: 1,
      dividir: false,
      forma2: 'Dinheiro',
      valor2: null,
      termo: '',
      temCliente: !!agendamento.clienteId,
      registrarFicha: false,
      observacaoFicha: '',
      retornoFicha: '',
    };
  }

  confirmarAtendimento(): void {
    if (!this.rascunho || this.processando) {
      return;
    }
    const avisoDesconto = this.mensagemDesconto(this.rascunho.desconto, this.subtotalAtendimento);
    if (avisoDesconto) {
      this.publicar('erro', avisoDesconto);
      return;
    }
    const servicos: ItemPedido[] = this.rascunho.servicos
      .filter((item) => item.confirmar)
      .map((item) => ({ tipo: 'servico', id: item.id, quantidade: 1 }));
    const produtos = this.paraPedido(this.rascunho.produtos);
    const pagamentos = this.montarPagamentos(
      this.totalAtendimento,
      this.rascunho.forma,
      this.rascunho.parcelas,
      this.rascunho.dividir,
      this.rascunho.forma2,
      this.rascunho.valor2,
    );
    if (!pagamentos) {
      return;
    }

    const fichaPedida = this.rascunho.registrarFicha;
    const fichaRascunho = { ...this.rascunho };
    const valorFicha = this.totalAtendimento;
    this.processando = true;
    const resultado = this.estado.registrarVenda({
      profissionalId: this.rascunho.profissionalId,
      clienteId: this.estado.agendamentos.find((item) => item.id === this.rascunho?.agendamentoId)?.clienteId ?? null,
      itens: [...servicos, ...produtos],
      desconto: Number(this.rascunho.desconto ?? 0),
      pagamentos,
      agendamentoId: this.rascunho.agendamentoId,
    });
    this.processando = false;

    if (!resultado.ok) {
      this.publicar('erro', resultado.mensagem);
      return;
    }
    this.rascunho = null;
    if (fichaPedida) {
      const agendamento = this.estado.agendamentos.find((item) => item.id === fichaRascunho.agendamentoId);
      const ficha = this.estado.salvarFicha({
        clienteId: agendamento?.clienteId ?? '',
        agendamentoId: fichaRascunho.agendamentoId,
        data: agendamento?.data ?? dataIso(),
        servico: agendamento?.servico ?? fichaRascunho.servicos.filter((item) => item.confirmar).map((item) => item.nome).join(', '),
        profissional: fichaRascunho.profissional,
        produtos: [],
        observacoes: fichaRascunho.observacaoFicha,
        retorno: fichaRascunho.retornoFicha,
        fotos: [],
        valor: valorFicha,
      });
      if (!ficha.ok) {
        this.publicar('erro', `Venda registrada. A ficha não foi salva: ${ficha.mensagem}`);
        return;
      }
      this.publicar('ok', `${resultado.mensagem} ${resultado.id}. Ficha técnica registrada.`);
      return;
    }
    this.publicar('ok', `${resultado.mensagem} ${resultado.id}.`);
  }

  resumoDoCaixa(caixaId: string) {
    return this.estado.resumoCaixa(caixaId);
  }

  rotuloTipo(tipo: TipoMovimento): string {
    const rotulos: Record<TipoMovimento, string> = {
      entrada: 'Entrada',
      saida: 'Saída',
      venda: 'Venda',
      estorno: 'Estorno',
    };
    return rotulos[tipo];
  }

  textoItens(movimento: Movimentacao): string {
    if (!movimento.itens.length) {
      return movimento.descricao;
    }
    return movimento.itens
      .map((item) => (item.quantidade > 1 ? `${item.nome} × ${item.quantidade}` : item.nome))
      .join(', ');
  }

  textoPagamento(movimento: Movimentacao): string {
    return movimento.pagamentos
      .map((pagamento) =>
        pagamento.parcelas && pagamento.parcelas > 1 ? `${pagamento.forma} ${pagamento.parcelas}x` : pagamento.forma,
      )
      .join(' · ');
  }

  get parcelasCredito(): number[] {
    const maximo = this.estado.maxParcelasCredito();
    return Array.from({ length: maximo }, (_, indice) => indice + 1);
  }

  hora(iso: string | undefined): string {
    if (!iso) {
      return '';
    }
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  }

  dataHora(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  textoDiferenca(valor: number): string {
    if (valor === 0) {
      return 'Sem diferença';
    }
    if (valor > 0) {
      return 'Sobra';
    }
    return 'Falta';
  }

  private montarPagamentos(
    total: number,
    forma: FormaPagamento,
    parcelas: number,
    dividir: boolean,
    forma2: FormaPagamento,
    valor2: number | null,
  ): PagamentoRegistrado[] | null {
    if (!dividir) {
      if (total === 0) {
        return [this.comParcelas(forma, 0, parcelas)];
      }
      return [this.comParcelas(forma, total, parcelas)];
    }
    const segunda = arredondar(Number(valor2));
    if (!Number.isFinite(segunda) || segunda <= 0 || segunda >= total) {
      this.publicar('erro', 'Informe um valor parcial menor que o total.');
      return null;
    }
    if (forma2 === forma) {
      this.publicar('erro', 'Use formas de pagamento diferentes na divisão.');
      return null;
    }
    return [
      this.comParcelas(forma, arredondar(total - segunda), parcelas),
      this.comParcelas(forma2, segunda, parcelas),
    ];
  }

  private comParcelas(forma: FormaPagamento, valor: number, parcelas: number): PagamentoRegistrado {
    if (forma !== 'Cartão de crédito') {
      return { forma, valor };
    }
    const maximo = this.estado.maxParcelasCredito();
    const escolhida = Math.min(maximo, Math.max(1, Math.floor(Number(parcelas) || 1)));
    return { forma, valor, parcelas: escolhida };
  }

  private paraPedido(linhas: LinhaVenda[]): ItemPedido[] {
    return linhas.map((linha) => ({
      tipo: linha.tipo,
      id: linha.id,
      quantidade: linha.quantidade,
    }));
  }

  private filtrarMovimentos(
    origem: Movimentacao[],
    inicio: string,
    fim: string,
    profissionalId: string,
    forma: 'todas' | FormaPagamento,
    tipo: 'todos' | TipoMovimento,
    termo: string,
  ): Movimentacao[] {
    const busca = termo.trim().toLowerCase();
    return origem
      .filter((item) => this.dentroDoPeriodo(item.dataHora, inicio, fim))
      .filter((item) => profissionalId === 'todos' || item.profissionalId === profissionalId)
      .filter((item) => forma === 'todas' || item.pagamentos.some((pagamento) => pagamento.forma === forma))
      .filter((item) => tipo === 'todos' || item.tipo === tipo)
      .filter((item) => {
        if (!busca) {
          return true;
        }
        const texto = [
          item.id,
          item.descricao,
          item.cliente,
          item.profissional,
          item.responsavel,
          this.textoItens(item),
          this.textoPagamento(item),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return texto.includes(busca);
      })
      .sort((a, b) => b.dataHora.localeCompare(a.dataHora));
  }

  private dentroDoPeriodo(iso: string, inicio: string, fim: string): boolean {
    const dia = this.dataInput(new Date(iso));
    if (inicio && dia < inicio) {
      return false;
    }
    if (fim && dia > fim) {
      return false;
    }
    return true;
  }

  private descontoValido(desconto: number | null, subtotal: number): number {
    const valor = Number(desconto ?? 0);
    const teto = this.estado.tetoDesconto(subtotal);
    if (!Number.isFinite(valor) || valor < 0 || valor > subtotal || valor > teto) {
      return 0;
    }
    return arredondar(valor);
  }

  private mensagemDesconto(desconto: number | null, subtotal: number): string {
    if (desconto === null || desconto === undefined) {
      return '';
    }
    const valor = Number(desconto);
    if (!Number.isFinite(valor)) {
      return 'Informe um desconto válido.';
    }
    if (valor < 0) {
      return 'O desconto não pode ser negativo.';
    }
    if (valor > subtotal) {
      return 'O desconto não pode ultrapassar o subtotal.';
    }
    const teto = this.estado.tetoDesconto(subtotal);
    if (valor > teto) {
      return `O desconto máximo desta venda é ${this.formatarReais(teto)}.`;
    }
    return '';
  }

  private formatarReais(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private publicar(tipo: 'ok' | 'erro', texto: string): void {
    this.mensagemTipo = tipo;
    this.mensagem = texto;
  }

  private formatarData(data: Date): string {
    const texto = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(data);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  private dataInput(data: Date): string {
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${data.getFullYear()}-${mes}-${dia}`;
  }
}
