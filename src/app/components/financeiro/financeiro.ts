import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  competenciaDe,
  ContaVisivel,
  dataIso,
  LinhaParticipacao,
  SalaoEstadoService,
  somarDias,
  StatusConta,
  TipoConta,
  TotaisPeriodo,
  vencimentoNoMes,
} from '../../core/salao-estado.service';

type AbaFinanceiro = 'resumo' | 'contas' | 'sangrias' | 'receitas' | 'comparativo';
type Periodo = 'hoje' | 'semana' | 'mes' | 'personalizado';
type Sentido = 'subiu' | 'caiu' | 'estavel' | 'sem-base';

interface Variacao {
  sentido: Sentido;
  percentual: number | null;
}

@Component({
  selector: 'app-financeiro',
  imports: [FormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css',
})
export class Financeiro {
  readonly estado = inject(SalaoEstadoService);
  readonly hoje = new Date();
  readonly hojeIso = dataIso(this.hoje);

  aba: AbaFinanceiro = 'resumo';
  periodo: Periodo = 'mes';
  inicioPersonalizado = vencimentoNoMes(competenciaDe(this.hojeIso), 1);
  fimPersonalizado = this.hojeIso;

  mostrarConta = false;
  nomeConta = '';
  valorConta: number | null = null;
  tipoConta: TipoConta = 'fixa';
  diaConta: number | null = 5;
  dataConta = this.hojeIso;
  parcelasConta: number | null = 6;
  statusConta: StatusConta = 'pendente';
  erroConta = '';

  mostrarSangria = false;
  descricaoSangria = '';
  valorSangria: number | null = null;
  dataSangria = this.hojeIso;
  erroSangria = '';

  confirmandoId: string | null = null;
  mensagem = '';
  mensagemTipo: 'ok' | 'erro' = 'ok';
  processando = false;

  @HostListener('document:keydown.escape')
  fecharPeloTeclado(): void {
    this.mostrarConta = false;
    this.mostrarSangria = false;
  }

  get intervalo(): { inicio: string; fim: string } {
    if (this.periodo === 'hoje') {
      return { inicio: this.hojeIso, fim: this.hojeIso };
    }
    if (this.periodo === 'semana') {
      return { inicio: this.inicioSemana(this.hojeIso), fim: this.hojeIso };
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
    const dias = this.diferencaDias(inicio, fim);
    const fimAnterior = somarDias(inicio, -1);
    return { inicio: somarDias(fimAnterior, -dias), fim: fimAnterior };
  }

  get mesContas(): string {
    return competenciaDe(this.periodoValido ? this.intervalo.fim : this.hojeIso);
  }

  get totais(): TotaisPeriodo {
    if (!this.periodoValido) {
      return { entradas: 0, saidas: 0, lucro: 0, vendas: 0, quantidadeVendas: 0, ticket: 0 };
    }
    return this.estado.totaisPeriodo(this.intervalo.inicio, this.intervalo.fim);
  }

  get totaisAnteriores(): TotaisPeriodo {
    if (!this.periodoValido) {
      return { entradas: 0, saidas: 0, lucro: 0, vendas: 0, quantidadeVendas: 0, ticket: 0 };
    }
    return this.estado.totaisPeriodo(this.intervaloAnterior.inicio, this.intervaloAnterior.fim);
  }

  get contasMes(): ContaVisivel[] {
    return this.estado.contasDoMes(this.mesContas);
  }

  get contasPendentes(): number {
    return this.estado.contasAPagar(this.mesContas);
  }

  get vencidas(): ContaVisivel[] {
    return this.contasMes.filter((conta) => conta.vencida);
  }

  get totalVencido(): number {
    return this.vencidas.reduce((total, conta) => total + conta.valor, 0);
  }

  get servicos(): LinhaParticipacao[] {
    if (!this.periodoValido) {
      return [];
    }
    return this.estado.receitaPorServico(this.intervalo.inicio, this.intervalo.fim);
  }

  get formas() {
    if (!this.periodoValido) {
      return [];
    }
    return this.estado.receitaPorForma(this.intervalo.inicio, this.intervalo.fim);
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

  get variacaoLucro(): Variacao {
    return this.variacao(this.totais.lucro, this.totaisAnteriores.lucro);
  }

  get textoPeriodo(): string {
    return `${this.formatarDia(this.intervalo.inicio)} – ${this.formatarDia(this.intervalo.fim)}`;
  }

  get textoPeriodoAnterior(): string {
    return `${this.formatarDia(this.intervaloAnterior.inicio)} – ${this.formatarDia(this.intervaloAnterior.fim)}`;
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

  get nomeMesContas(): string {
    const [ano, mes] = this.mesContas.split('-').map(Number);
    const nome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(ano, mes - 1, 1));
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  }

  mudarAba(aba: AbaFinanceiro): void {
    this.aba = aba;
    this.mensagem = '';
    this.confirmandoId = null;
  }

  mudarPeriodo(periodo: Periodo): void {
    this.periodo = periodo;
    this.mensagem = '';
  }

  abrirConta(): void {
    this.mostrarConta = true;
    this.erroConta = '';
    this.nomeConta = '';
    this.valorConta = null;
    this.tipoConta = 'fixa';
    this.diaConta = 5;
    this.dataConta = this.hojeIso;
    this.parcelasConta = 6;
    this.statusConta = 'pendente';
  }

  salvarConta(): void {
    if (this.processando) {
      return;
    }
    this.processando = true;
    const resultado = this.estado.criarConta({
      nome: this.nomeConta,
      valor: Number(this.valorConta),
      tipo: this.tipoConta,
      diaVencimento: Number(this.diaConta),
      vencimento: this.dataConta,
      parcelas: Number(this.parcelasConta),
      status: this.statusConta,
    });
    this.processando = false;
    if (!resultado.ok) {
      this.erroConta = resultado.mensagem;
      return;
    }
    this.mostrarConta = false;
    this.aba = 'contas';
    this.publicar('ok', resultado.mensagem);
  }

  pagar(conta: ContaVisivel): void {
    if (this.processando) {
      return;
    }
    this.processando = true;
    const resultado = this.estado.marcarContaPaga(conta.lancamentoId);
    this.processando = false;
    this.publicar(resultado.ok ? 'ok' : 'erro', resultado.mensagem);
  }

  pedirEncerramento(conta: ContaVisivel): void {
    this.confirmandoId = conta.contratoId;
  }

  encerrar(conta: ContaVisivel): void {
    const resultado = this.estado.encerrarContaFixa(conta.contratoId);
    this.confirmandoId = null;
    this.publicar(resultado.ok ? 'ok' : 'erro', resultado.mensagem);
  }

  abrirSangria(): void {
    this.mostrarSangria = true;
    this.erroSangria = '';
    this.descricaoSangria = '';
    this.valorSangria = null;
    this.dataSangria = this.hojeIso;
  }

  salvarSangria(): void {
    if (this.processando) {
      return;
    }
    this.processando = true;
    const resultado = this.estado.registrarSangria({
      descricao: this.descricaoSangria,
      valor: Number(this.valorSangria),
      data: this.dataSangria,
    });
    this.processando = false;
    if (!resultado.ok) {
      this.erroSangria = resultado.mensagem;
      return;
    }
    this.mostrarSangria = false;
    this.aba = 'sangrias';
    this.publicar('ok', resultado.mensagem);
  }

  rotuloTipo(tipo: TipoConta): string {
    if (tipo === 'fixa') {
      return 'Fixa';
    }
    if (tipo === 'parcelada') {
      return 'Parcelada';
    }
    return 'Avulsa';
  }

  textoVariacao(variacao: Variacao): string {
    if (variacao.sentido === 'estavel') {
      return 'Ficou igual';
    }
    if (variacao.percentual === null) {
      return variacao.sentido === 'subiu' ? '↑ Cresceu' : '↓ Caiu';
    }
    const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
      Math.abs(variacao.percentual),
    );
    return variacao.sentido === 'subiu' ? `↑ Cresceu ${numero}%` : `↓ Caiu ${numero}%`;
  }

  formatarData(iso: string): string {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia));
  }

  private variacao(atual: number, anterior: number): Variacao {
    const diferenca = Math.round((atual - anterior) * 100) / 100;
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

  private publicar(tipo: 'ok' | 'erro', texto: string): void {
    this.mensagemTipo = tipo;
    this.mensagem = texto;
  }

  private inicioSemana(iso: string): string {
    const [ano, mes, dia] = iso.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    const semana = data.getDay();
    const delta = semana === 0 ? -6 : 1 - semana;
    return somarDias(iso, delta);
  }

  private diferencaDias(inicio: string, fim: string): number {
    const [anoA, mesA, diaA] = inicio.split('-').map(Number);
    const [anoB, mesB, diaB] = fim.split('-').map(Number);
    const a = new Date(anoA, mesA - 1, diaA).getTime();
    const b = new Date(anoB, mesB - 1, diaB).getTime();
    return Math.round((b - a) / 86400000);
  }

  private formatarDia(iso: string): string {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(ano, mes - 1, dia));
  }
}
