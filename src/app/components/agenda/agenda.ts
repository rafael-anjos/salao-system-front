import { DatePipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { AgendamentoDia, dataIso, rotuloStatusAgendamento, SalaoEstadoService, StatusAgendamento } from '../../core/salao-estado.service';
import { Calendario } from './calendario/calendario';
import { NovoAgendamento } from './novo-agendamento/novo-agendamento';

interface BlocoAgenda {
  item: AgendamentoDia;
  top: number;
  height: number;
  left: number;
  width: number;
}

interface MenuAgendamento {
  x: number;
  y: number;
  item: AgendamentoDia;
}

interface DestinoMovimento {
  data: string;
  hora: string;
}

interface FaixaFechada {
  top: number;
  height: number;
}

const PASSO_MINUTOS = 15;

@Component({
  selector: 'app-agenda-component',
  imports: [Calendario, NovoAgendamento, DatePipe],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class AgendaComponent implements OnInit, OnDestroy {
  private readonly estado = inject(SalaoEstadoService);
  private cliqueTimer: ReturnType<typeof setTimeout> | null = null;
  private fecharMenuNoClique = false;

  dataAtual: Date = new Date();
  diasSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasAgenda: Date[] = [];
  mostrarFormulario = false;
  editando: AgendamentoDia | null = null;
  dataInicial = '';
  horaInicial = '';
  movendo: AgendamentoDia | null = null;
  destino: DestinoMovimento | null = null;
  menu: MenuAgendamento | null = null;
  aviso = '';

  get horas(): string[] {
    const faixa = this.faixaDaGrade();
    const lista: string[] = [];
    for (let minuto = faixa.inicio; minuto < faixa.fim; minuto += 60) {
      const hora = Math.floor(minuto / 60);
      lista.push(`${String(hora).padStart(2, '0')}:00`);
    }
    return lista;
  }

  abrirFormulario() {
    this.cancelarMovimento();
    this.menu = null;
    this.editando = null;
    this.dataInicial = dataIso(new Date());
    this.horaInicial = '';
    this.mostrarFormulario = true;
  }

  abrirNoHorario(dia: Date, hora: string) {
    this.cancelarMovimento();
    this.editando = null;
    this.dataInicial = dataIso(dia);
    this.horaInicial = hora;
    this.mostrarFormulario = true;
  }

  abrirEdicao(agendamento: AgendamentoDia) {
    this.cancelarMovimento();
    this.editando = agendamento;
    this.dataInicial = agendamento.data;
    this.horaInicial = agendamento.hora;
    this.mostrarFormulario = true;
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.editando = null;
  }

  clicarHora(event: MouseEvent, dia: Date, horaBase: string) {
    event.stopPropagation();
    if (this.fecharMenuNoClique) {
      this.fecharMenuNoClique = false;
      return;
    }
    const coluna = (event.currentTarget as HTMLElement).closest('.dia-eventos') as HTMLElement;
    const hora = this.horaPeloPonteiro(coluna, event.clientY);
    if (this.horaInteiraFechada(dia, horaBase)) {
      if (this.movendo) {
        this.aviso = 'O salão está fechado nesse horário.';
      }
      return;
    }
    if (this.movendo) {
      this.confirmarMovimento(dataIso(dia), hora);
      return;
    }
    let horaMarcacao = horaBase;
    if (this.estado.minutoFechado(dataIso(dia), horaBase)) {
      if (this.estado.minutoFechado(dataIso(dia), hora)) {
        return;
      }
      horaMarcacao = hora;
    }
    this.abrirNoHorario(dia, horaMarcacao);
  }

  clicarFechado(event: MouseEvent) {
    event.stopPropagation();
    if (this.movendo) {
      this.aviso = 'O salão está fechado nesse horário.';
    }
  }

  clicarCompromisso(event: MouseEvent, item: AgendamentoDia) {
    event.stopPropagation();
    if (this.fecharMenuNoClique) {
      this.fecharMenuNoClique = false;
      return;
    }
    if (this.movendo) {
      if (this.movendo.id === item.id) {
        this.cancelarMovimento();
      }
      return;
    }
    if (this.cliqueTimer) {
      clearTimeout(this.cliqueTimer);
    }
    this.cliqueTimer = setTimeout(() => {
      this.cliqueTimer = null;
      this.abrirEdicao(item);
    }, 250);
  }

  iniciarMovimento(event: MouseEvent, item: AgendamentoDia) {
    event.preventDefault();
    event.stopPropagation();
    if (this.cliqueTimer) {
      clearTimeout(this.cliqueTimer);
      this.cliqueTimer = null;
    }
    this.menu = null;
    if (this.bloqueado(item)) {
      this.aviso = 'Este atendimento já foi finalizado.';
      return;
    }
    this.aviso = '';
    this.movendo = item;
    this.destino = { data: item.data, hora: item.hora };
  }

  atualizarDestino(event: MouseEvent, dia: Date) {
    if (!this.movendo) {
      return;
    }
    const hora = this.horaPeloPonteiro(event.currentTarget as HTMLElement, event.clientY);
    const data = dataIso(dia);
    if (this.estado.minutoFechado(data, hora)) {
      return;
    }
    if (this.destino?.data === data && this.destino.hora === hora) {
      return;
    }
    this.destino = { data, hora };
  }

  abrirMenu(event: MouseEvent, item: AgendamentoDia) {
    event.preventDefault();
    event.stopPropagation();
    if (this.cliqueTimer) {
      clearTimeout(this.cliqueTimer);
      this.cliqueTimer = null;
    }
    const largura = 220;
    const altura = 168;
    this.menu = {
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - largura)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - altura)),
      item,
    };
  }

  definirStatus(status: 'Aguardando' | 'Confirmado') {
    const item = this.menu?.item;
    this.menu = null;
    if (!item) {
      return;
    }
    const resultado = this.estado.alterarStatusAgendamento(item.id, status);
    this.aviso = resultado.ok ? '' : resultado.mensagem;
  }

  excluirSelecionado() {
    const item = this.menu?.item;
    this.menu = null;
    if (!item) {
      return;
    }
    if (this.movendo?.id === item.id) {
      this.cancelarMovimento();
    }
    const resultado = this.estado.excluirAgendamento(item.id);
    this.aviso = resultado.ok ? '' : resultado.mensagem;
  }

  onDataCalendario(data: Date) {
    this.dataAtual = data;
    this.construirAgenda();
  }

  ngOnInit() {
    this.construirAgenda();
  }

  ngOnDestroy() {
    if (this.cliqueTimer) {
      clearTimeout(this.cliqueTimer);
    }
  }

  ehHoje(dia: Date): boolean {
    const hoje = new Date();
    return (
      dia.getDate() === hoje.getDate() &&
      dia.getMonth() === hoje.getMonth() &&
      dia.getFullYear() === hoje.getFullYear()
    );
  }

  horaInteiraFechada(dia: Date, hora: string): boolean {
    const base = Number(hora.slice(0, 2));
    return [0, 15, 30, 45].every((minuto) =>
      this.estado.minutoFechado(dataIso(dia), `${String(base).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`),
    );
  }

  faixasFechadas(dia: Date): FaixaFechada[] {
    const marcas = this.horas.map((hora) => this.horaInteiraFechada(dia, hora));
    const faixas: FaixaFechada[] = [];
    let inicio = -1;
    const fechar = (fim: number) => {
      if (inicio < 0) {
        return;
      }
      faixas.push({
        top: (inicio * 100) / this.horas.length,
        height: ((fim - inicio) * 100) / this.horas.length,
      });
      inicio = -1;
    };
    marcas.forEach((fechada, indice) => {
      if (fechada && inicio < 0) {
        inicio = indice;
      }
      if (!fechada) {
        fechar(indice);
      }
    });
    fechar(marcas.length);
    return faixas;
  }

  blocosDoDia(dia: Date): BlocoAgenda[] {
    const span = this.horas.length * 60;
    const blocos = this.estado.agendamentos
      .filter((item) => item.data === dataIso(dia))
      .map((item) => {
        const inicio = this.minutos(item.hora);
        const duracao = this.duracaoDe(item);
        const top = Math.max(0, ((inicio - this.inicioGrade) / span) * 100);
        const height = Math.max(0, Math.min(100 - top, (duracao / span) * 100));
        return {
          item,
          inicio,
          fim: inicio + duracao,
          top,
          height,
          left: 0,
          width: 100,
          lane: 0,
        };
      })
      .sort((a, b) => a.inicio - b.inicio || a.fim - b.fim);

    let cluster: typeof blocos = [];
    let clusterFim = -1;
    let ocupadas: number[] = [];

    const fecharCluster = () => {
      if (!cluster.length) {
        return;
      }
      const faixas = Math.max(...cluster.map((bloco) => bloco.lane)) + 1;
      for (const bloco of cluster) {
        bloco.left = (bloco.lane / faixas) * 100;
        bloco.width = 100 / faixas;
      }
      cluster = [];
      clusterFim = -1;
      ocupadas = [];
    };

    for (const bloco of blocos) {
      if (cluster.length && bloco.inicio >= clusterFim) {
        fecharCluster();
      }
      let lane = ocupadas.findIndex((fim) => fim <= bloco.inicio);
      if (lane < 0) {
        lane = ocupadas.length;
        ocupadas.push(bloco.fim);
      } else {
        ocupadas[lane] = bloco.fim;
      }
      bloco.lane = lane;
      cluster.push(bloco);
      clusterFim = Math.max(clusterFim, bloco.fim);
    }
    fecharCluster();

    return blocos;
  }

  previsao(dia: Date): { top: number; height: number } | null {
    if (!this.movendo || !this.destino || this.destino.data !== dataIso(dia)) {
      return null;
    }
    if (this.destino.data === this.movendo.data && this.destino.hora === this.movendo.hora) {
      return null;
    }
    const span = this.horas.length * 60;
    const inicio = this.minutos(this.destino.hora);
    const duracao = this.duracaoDe(this.movendo);
    const top = ((inicio - this.inicioGrade) / span) * 100;
    return {
      top: Math.max(0, top),
      height: Math.max(0, Math.min(100 - Math.max(0, top), (duracao / span) * 100)),
    };
  }

  duracaoDe(item: AgendamentoDia): number {
    return this.estado.servicos.find((servico) => servico.id === item.servicoId)?.duracaoMinutos ?? 60;
  }

  rotuloStatus(status: StatusAgendamento): string {
    return rotuloStatusAgendamento(status);
  }

  bloqueado(item: AgendamentoDia): boolean {
    return item.status === 'Concluído' || !!item.vendaId;
  }

  construirAgenda() {
    const inicio = new Date(this.dataAtual);
    inicio.setHours(0, 0, 0, 0);
    inicio.setDate(inicio.getDate() - inicio.getDay());

    this.diasAgenda = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicio);
      dia.setDate(inicio.getDate() + i);
      this.diasAgenda.push(dia);
    }
  }

  @HostListener('document:keydown.escape')
  cancelarPorTecla() {
    this.menu = null;
    this.cancelarMovimento();
  }

  @HostListener('document:mousedown', ['$event'])
  prepararClique(event: MouseEvent) {
    if (!this.menu) {
      return;
    }
    const alvo = event.target as HTMLElement;
    if (!alvo.closest('.menu-agendamento')) {
      this.menu = null;
      this.fecharMenuNoClique = true;
    }
  }

  @HostListener('document:click')
  limparCliqueMenu() {
    this.fecharMenuNoClique = false;
  }

  private confirmarMovimento(data: string, hora: string) {
    const item = this.movendo;
    if (!item) {
      return;
    }
    if (item.data === data && item.hora === hora) {
      this.cancelarMovimento();
      return;
    }
    const resultado = this.estado.moverAgendamento(item.id, data, hora);
    if (!resultado.ok) {
      this.aviso = resultado.mensagem;
      return;
    }
    this.aviso = '';
    this.cancelarMovimento();
  }

  private cancelarMovimento() {
    this.movendo = null;
    this.destino = null;
  }

  private horaPeloPonteiro(coluna: HTMLElement, clientY: number): string {
    const rect = coluna.getBoundingClientRect();
    const ratio = rect.height ? (clientY - rect.top) / rect.height : 0;
    const limite = this.inicioGrade + (this.horas.length - 1) * 60 + 45;
    const bruto = this.inicioGrade + Math.min(1, Math.max(0, ratio)) * this.horas.length * 60;
    const minutos = Math.min(limite, Math.max(this.inicioGrade, Math.round(bruto / PASSO_MINUTOS) * PASSO_MINUTOS));
    const hora = Math.floor(minutos / 60);
    const minuto = minutos % 60;
    return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
  }

  private get inicioGrade(): number {
    return this.faixaDaGrade().inicio;
  }

  private faixaDaGrade(): { inicio: number; fim: number } {
    const ativos = this.estado.horarios.filter((horario) => horario.ativo);
    if (!ativos.length) {
      return { inicio: 8 * 60, fim: 19 * 60 };
    }
    let inicio = 24 * 60;
    let fim = 0;
    for (const horario of ativos) {
      inicio = Math.min(inicio, this.minutos(horario.abertura));
      fim = Math.max(fim, this.minutos(horario.fechamento));
    }
    const horaInicio = Math.floor(inicio / 60);
    const horaFim = Math.max(horaInicio + 1, Math.ceil(fim / 60));
    return { inicio: horaInicio * 60, fim: horaFim * 60 };
  }

  private minutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }
}
