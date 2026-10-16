import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export type StatusAgendamento = 'Confirmado' | 'Em andamento' | 'Aguardando' | 'Concluído';

export interface AgendamentoDoDia {
  hora: string;
  cliente: string;
  servico: string;
  status: StatusAgendamento;
  preco: number;
}

export interface Notificacao {
  horario: string;
  texto: string;
}

export interface AlertaEstoque {
  produto: string;
  quantidade: number;
  minimo: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  hoje = new Date();
  saudacao = this.montarSaudacao();
  dataExtenso = this.formatarData(this.hoje);
  caixaAberto = true;

  agendaDoDia: AgendamentoDoDia[] = [
    {
      hora: '09:00',
      cliente: 'Maria Silva',
      servico: 'Coloração',
      status: 'Concluído',
      preco: 280,
    },
    {
      hora: '10:30',
      cliente: 'Ana Costa',
      servico: 'Corte e escova',
      status: 'Em andamento',
      preco: 150,
    },
    {
      hora: '13:00',
      cliente: 'Juliana Alves',
      servico: 'Manicure e pedicure',
      status: 'Confirmado',
      preco: 90,
    },
    {
      hora: '15:00',
      cliente: 'Carla Mendes',
      servico: 'Hidratação',
      status: 'Confirmado',
      preco: 180,
    },
    {
      hora: '16:30',
      cliente: 'Beatriz Nunes',
      servico: 'Design de sobrancelha',
      status: 'Aguardando',
      preco: 70,
    },
    {
      hora: '18:00',
      cliente: 'Fernanda Rocha',
      servico: 'Escova progressiva',
      status: 'Confirmado',
      preco: 320,
    },
  ];

  notificacoes: Notificacao[] = [
    { horario: '16:12', texto: 'Beatriz Nunes confirmou o horário das 16:30.' },
    { horario: '12:40', texto: 'Pagamento de R$ 280 recebido de Maria Silva.' },
    { horario: '08:02', texto: 'Caixa aberto por Paula.' },
    { horario: '07:50', texto: 'Toner 9.1 abaixo do mínimo do estoque.' },
  ];

  estoqueBaixo: AlertaEstoque[] = [
    { produto: 'Toner 9.1', quantidade: 2, minimo: 6 },
    { produto: 'Luvas descartáveis', quantidade: 8, minimo: 20 },
    { produto: 'Removedor de esmalte', quantidade: 1, minimo: 4 },
  ];

  get totalAgendamentos(): number {
    return this.agendaDoDia.length;
  }

  get receitaHoje(): number {
    return this.agendaDoDia.reduce((soma, item) => soma + item.preco, 0);
  }

  get alertasEstoque(): number {
    return this.estoqueBaixo.length;
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
