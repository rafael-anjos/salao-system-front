import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  dataIso,
  ProdutoEstoque,
  rotuloStatusAgendamento,
  SalaoEstadoService,
  StatusAgendamento,
} from '../../core/salao-estado.service';
import { Notificacoes } from '../notificacoes/notificacoes';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, Notificacoes],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly estado = inject(SalaoEstadoService);
  hoje = new Date();
  saudacao = this.montarSaudacao();
  dataExtenso = this.formatarData(this.hoje);

  get agendaDoDia() {
    const hoje = dataIso(this.hoje);
    return this.estado.agendamentos
      .filter((item) => item.data === hoje)
      .sort((a, b) => a.hora.localeCompare(b.hora) || a.cliente.localeCompare(b.cliente, 'pt-BR'));
  }

  get caixaAberto(): boolean {
    return this.estado.caixaAberto;
  }

  get estoqueBaixo(): ProdutoEstoque[] {
    const peso = (status: ProdutoEstoque['status']) => (status === 'critico' ? 0 : 1);
    return this.estado.produtos
      .filter((produto) => produto.status === 'critico' || produto.status === 'baixo')
      .sort((a, b) => peso(a.status) - peso(b.status) || a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  get notificacoes(): string[] {
    const notas: string[] = [];
    const emAberto = this.agendaDoDia.filter(
      (item) => item.status === 'Confirmado' || item.status === 'Aguardando' || item.status === 'Em andamento',
    ).length;
    if (emAberto === 1) {
      notas.push('1 horário ainda em aberto hoje.');
    } else if (emAberto > 1) {
      notas.push(`${emAberto} horários ainda em aberto hoje.`);
    }
    notas.push(this.caixaAberto ? 'Caixa aberto.' : 'Caixa fechado.');
    for (const produto of this.estoqueBaixo) {
      notas.push(`${produto.nome} abaixo do mínimo: ${produto.estoqueAtual} de ${produto.estoqueMinimo}.`);
    }
    return notas;
  }

  get totalAgendamentos(): number {
    return this.agendaDoDia.length;
  }

  get receitaHoje(): number {
    const hoje = dataIso(this.hoje);
    return this.estado.totaisPeriodo(hoje, hoje).vendas;
  }

  get alertasEstoque(): number {
    return this.estoqueBaixo.length;
  }

  rotuloStatus(status: StatusAgendamento): string {
    return rotuloStatusAgendamento(status);
  }

  private montarSaudacao(): string {
    const hora = this.hoje.getHours();
    if (hora < 12) {
      return 'Bom dia, Paula';
    }
    if (hora < 18) {
      return 'Boa tarde, Paula';
    }
    return 'Boa noite, Paula';
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
}
