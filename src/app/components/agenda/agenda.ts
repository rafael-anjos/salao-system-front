import { Component, OnInit } from '@angular/core';
import { Calendario } from './calendario/calendario';
import { DatePipe } from '@angular/common';
import { NovoAgendamento } from './novo-agendamento/novo-agendamento';

@Component({
  selector: 'app-agenda-component',
  imports: [Calendario, NovoAgendamento, DatePipe],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class AgendaComponent implements OnInit {
  dataAtual: Date = new Date();
  diasSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  horas: string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];
  diasAgenda: Date[] = [];
  mostrarFormulario = false;

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
  }

  onDataCalendario(data: Date) {
    this.dataAtual = data;
    this.construirAgenda();
  }

  ngOnInit() {
    this.construirAgenda();
  }

  ehHoje(dia: Date): boolean {
    const hoje = new Date();
    return (
      dia.getDate() === hoje.getDate() &&
      dia.getMonth() === hoje.getMonth() &&
      dia.getFullYear() === hoje.getFullYear()
    );
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
}
