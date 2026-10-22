import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  FormaPagamento,
  LinhaParticipacao,
  ProdutoEstoque,
  SalaoEstadoService,
  StatusAgendamento,
  arredondar,
  competenciaDe,
  dataIso,
  diferencaDias,
  inicioDaSemana,
  somarDias,
  VariacaoPeriodo,
  variacaoPeriodo,
  vencimentoNoMes,
} from '../../core/salao-estado.service';
import { Notificacoes } from '../notificacoes/notificacoes';

type Periodo = 'hoje' | 'semana' | 'mes' | 'personalizado';

type Variacao = VariacaoPeriodo;

interface DiaReceita {
  data: string;
  rotulo: string;
  total: number;
  altura: number;
}

interface LinhaProfissional {
  nome: string;
  atendimentos: number;
}

@Component({
  selector: 'app-relatorio',
  imports: [FormsModule, CurrencyPipe, DecimalPipe, RouterLink, Notificacoes],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css',
})
export class Relatorio {
  readonly estado = inject(SalaoEstadoService);
  readonly hoje = new Date();
  readonly hojeIso = dataIso(this.hoje);

  periodo: Periodo = 'mes';
  inicioPersonalizado = vencimentoNoMes(competenciaDe(this.hojeIso), 1);
  fimPersonalizado = this.hojeIso;

  get intervalo(): { inicio: string; fim: string } {
    if (this.periodo === 'hoje') {
      return { inicio: this.hojeIso, fim: this.hojeIso };
    }
    if (this.periodo === 'semana') {
      return { inicio: inicioDaSemana(this.hojeIso), fim: this.hojeIso };
    }
    if (this.periodo === 'personalizado') {
      return { inicio: this.inicioPersonalizado, fim: this.fimPersonalizado };
    }
    return { inicio: vencimentoNoMes(competenciaDe(this.hojeIso), 1), fim: this.hojeIso };
  }

  get periodoValido(): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(this.intervalo.inicio)
      && /^\d{4}-\d{2}-\d{2}$/.test(this.intervalo.fim)
      && this.intervalo.inicio <= this.intervalo.fim;
  }

  get intervaloAnterior(): { inicio: string; fim: string } {
    const { inicio, fim } = this.intervalo;
    if (this.periodo === 'hoje') {
      const ontem = somarDias(this.hojeIso, -1);
      return { inicio: ontem, fim: ontem };
    }
    if (this.periodo === 'semana') {
      return { inicio: somarDias(inicio, -7), fim: somarDias(fim, -7) };
    }
    if (this.periodo === 'mes') {
      const mesAnterior = competenciaDe(somarDias(vencimentoNoMes(competenciaDe(this.hojeIso), 1), -1));
      const dia = Number(this.hojeIso.slice(8, 10));
      return { inicio: vencimentoNoMes(mesAnterior, 1), fim: vencimentoNoMes(mesAnterior, dia) };
    }
    const dias = diferencaDias(inicio, fim);
    const fimAnterior = somarDias(inicio, -1);
    return { inicio: somarDias(fimAnterior, -dias), fim: fimAnterior };
  }

  get textoPeriodo(): string {
    return `${this.formatarDia(this.intervalo.inicio)} – ${this.formatarDia(this.intervalo.fim)}`;
  }

  get rotuloComparacao(): string {
    if (this.periodo === 'hoje') {
      return 'ontem';
    }
    if (this.periodo === 'semana') {
      return 'a semana anterior';
    }
    if (this.periodo === 'mes') {
      return 'o mês anterior';
    }
    return 'o período anterior';
  }

  get agendamentosPeriodo() {
    if (!this.periodoValido) {
      return [];
    }
    return this.estado.agendamentos.filter(
      (item) => item.data >= this.intervalo.inicio && item.data <= this.intervalo.fim,
    );
  }

  get vendasPeriodo() {
    if (!this.periodoValido) {
      return [];
    }
    return this.estado.movimentacoes.filter((item) => {
      if (item.tipo !== 'venda') {
        return false;
      }
      const dia = dataIso(new Date(item.dataHora));
      return dia >= this.intervalo.inicio && dia <= this.intervalo.fim;
    });
  }

  get totalAgendamentos(): number {
    return this.agendamentosPeriodo.length;
  }

  get agendamentosHoje(): number {
    return this.estado.agendamentos.filter((item) => item.data === this.hojeIso).length;
  }

  get periodoIncluiHoje(): boolean {
    return this.periodoValido && this.intervalo.inicio <= this.hojeIso && this.hojeIso <= this.intervalo.fim;
  }

  get receita(): number {
    if (!this.periodoValido) {
      return 0;
    }
    return this.estado.totaisPeriodo(this.intervalo.inicio, this.intervalo.fim).vendas;
  }

  get receitaAnterior(): number {
    if (!this.periodoValido) {
      return 0;
    }
    return this.estado.totaisPeriodo(this.intervaloAnterior.inicio, this.intervaloAnterior.fim).vendas;
  }

  get variacaoReceita(): Variacao {
    return variacaoPeriodo(this.receita, this.receitaAnterior);
  }

  get totalDescontos(): number {
    return arredondar(this.vendasPeriodo.reduce((total, venda) => total + venda.desconto, 0));
  }

  get quantidadeDescontos(): number {
    return this.vendasPeriodo.filter((venda) => venda.desconto > 0).length;
  }

  get atendimentosPagos(): number {
    return this.vendasPeriodo.filter((venda) => venda.itens.some((item) => item.tipo === 'servico')).length;
  }

  get percentualPagos(): number | null {
    if (!this.totalAgendamentos) {
      return null;
    }
    return arredondar((this.atendimentosPagos / this.totalAgendamentos) * 100);
  }

  get concluidos(): number {
    return this.contarStatus('Concluído');
  }

  get cancelados(): number {
    return this.contarStatus('Cancelado');
  }

  get faltas(): number {
    return this.contarStatus('Falta');
  }

  get emAberto(): number {
    return this.agendamentosPeriodo.filter(
      (item) => item.status === 'Confirmado' || item.status === 'Aguardando' || item.status === 'Em andamento',
    ).length;
  }

  get taxaCancelamento(): number | null {
    if (!this.totalAgendamentos) {
      return null;
    }
    return arredondar((this.cancelados / this.totalAgendamentos) * 100);
  }

  get servicos(): LinhaParticipacao[] {
    if (!this.periodoValido) {
      return [];
    }
    return this.estado.receitaPorServico(this.intervalo.inicio, this.intervalo.fim);
  }

  get origemReceita() {
    if (!this.periodoValido) {
      return {
        servicos: { nome: 'Serviços', quantidade: 0, total: 0, percentual: 0 },
        revenda: { nome: 'Revenda', quantidade: 0, total: 0, percentual: 0 },
      };
    }
    return this.estado.receitaServicoProduto(this.intervalo.inicio, this.intervalo.fim);
  }

  get profissionais(): LinhaProfissional[] {
    const mapa = new Map<string, number>();
    for (const agendamento of this.agendamentosPeriodo) {
      mapa.set(agendamento.profissional, (mapa.get(agendamento.profissional) ?? 0) + 1);
    }
    return [...mapa.entries()]
      .map(([nome, atendimentos]) => ({ nome, atendimentos }))
      .sort((a, b) => b.atendimentos - a.atendimentos || a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  get totalProfissionais(): number {
    return this.profissionais.reduce((total, linha) => total + linha.atendimentos, 0);
  }

  get formas(): LinhaParticipacao[] {
    if (!this.periodoValido) {
      return [];
    }
    const base = this.estado.receitaPorForma(this.intervalo.inicio, this.intervalo.fim);
    const contagem = new Map<FormaPagamento, number>();
    for (const movimento of this.estado.movimentacoes) {
      if (movimento.tipo !== 'venda' && movimento.tipo !== 'entrada') {
        continue;
      }
      const dia = dataIso(new Date(movimento.dataHora));
      if (dia < this.intervalo.inicio || dia > this.intervalo.fim) {
        continue;
      }
      for (const pagamento of movimento.pagamentos) {
        contagem.set(pagamento.forma, (contagem.get(pagamento.forma) ?? 0) + 1);
      }
    }
    return base.map((linha) => ({
      ...linha,
      quantidade: contagem.get(linha.nome as FormaPagamento) ?? 0,
    }));
  }

  get receitaPorDia(): DiaReceita[] {
    if (!this.periodoValido) {
      return [];
    }
    const dias: string[] = [];
    let cursor = this.intervalo.inicio;
    while (cursor <= this.intervalo.fim && dias.length < 120) {
      dias.push(cursor);
      cursor = somarDias(cursor, 1);
    }
    const totais = new Map<string, number>();
    for (const venda of this.vendasPeriodo) {
      const dia = dataIso(new Date(venda.dataHora));
      totais.set(dia, arredondar((totais.get(dia) ?? 0) + venda.valor));
    }
    const maximo = Math.max(0, ...dias.map((dia) => totais.get(dia) ?? 0));
    return dias.map((data) => {
      const total = totais.get(data) ?? 0;
      return {
        data,
        rotulo: String(Number(data.slice(8, 10))),
        total,
        altura: maximo ? (total / maximo) * 100 : 0,
      };
    });
  }

  get maiorDia(): number {
    return this.receitaPorDia.reduce((maximo, dia) => Math.max(maximo, dia.total), 0);
  }

  get estoqueBaixo(): ProdutoEstoque[] {
    const peso = (status: ProdutoEstoque['status']) => (status === 'critico' ? 0 : 1);
    return this.estado.produtos
      .filter((produto) => produto.status === 'critico' || produto.status === 'baixo')
      .sort((a, b) => peso(a.status) - peso(b.status) || a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  mudarPeriodo(periodo: Periodo): void {
    this.periodo = periodo;
  }

  imprimir(): void {
    window.print();
  }

  textoVariacao(variacao: Variacao): string {
    if (variacao.sentido === 'estavel') {
      return `Igual a ${this.rotuloComparacao}`;
    }
    if (variacao.percentual === null) {
      return variacao.sentido === 'subiu' ? `↑ Subiu vs ${this.rotuloComparacao}` : `↓ Caiu vs ${this.rotuloComparacao}`;
    }
    const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
      Math.abs(variacao.percentual),
    );
    const seta = variacao.sentido === 'subiu' ? '↑' : '↓';
    return `${seta} ${numero}% vs ${this.rotuloComparacao}`;
  }

  textoDescontos(): string {
    if (!this.quantidadeDescontos) {
      return 'Nenhum desconto aplicado';
    }
    const palavra = this.quantidadeDescontos === 1 ? 'desconto aplicado' : 'descontos aplicados';
    return `${this.quantidadeDescontos} ${palavra}`;
  }

  textoPagos(): string {
    if (this.percentualPagos === null) {
      return 'Nenhum agendamento no período';
    }
    const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
      this.percentualPagos,
    );
    return `${numero}% dos agendamentos`;
  }

  rotuloBarra(dia: DiaReceita): string {
    const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dia.total);
    return `${this.formatarDia(dia.data)}: ${valor}`;
  }

  formatarEixo(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  rotuloEstoque(status: ProdutoEstoque['status']): string {
    return status === 'critico' ? 'Crítico' : 'Baixo';
  }

  private contarStatus(status: StatusAgendamento): number {
    return this.agendamentosPeriodo.filter((item) => item.status === status).length;
  }

  private formatarDia(iso: string): string {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(ano, mes - 1, dia));
  }
}
