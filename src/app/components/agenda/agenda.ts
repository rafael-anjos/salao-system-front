import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Calendario } from './calendario/calendario';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-agenda-component',
  imports: [Navbar, Calendario, DatePipe],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class AgendaComponent implements OnInit{
  dataAtual: Date = new Date();
  diasSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasAgenda: Date[] = [];

  ngOnInit(){
    this.construirAgenda();
  }

  construirAgenda() {
    const ano = this.dataAtual.getFullYear();
    const mes = this.dataAtual.getMonth();

    const primeiroDiaDaSemana = 0;
    const ultimoDiaDaSemana = 6;

    const dataInicial = new Date(ano, mes, 0);
    while (dataInicial.getDay() !== primeiroDiaDaSemana) {
      dataInicial.setDate(dataInicial.getDate() - 1);
    }

    const dataFinal = new Date(ano, mes , 0);
    while (dataFinal.getDay() !== ultimoDiaDaSemana) {
      dataFinal.setDate(dataFinal.getDate() + 1);
    }

    this.diasAgenda = [];
    for (
      let data = new Date(dataInicial.getTime());
      data <= dataFinal;
      data.setDate(data.getDate() + 1)
    ) {
      this.diasAgenda.push(new Date(data.getTime()));
    }
  }

}
