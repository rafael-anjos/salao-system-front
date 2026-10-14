import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calendario',
  imports: [DatePipe],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  @Output() dataSelecionada = new EventEmitter<Date>();

  dataAtual: Date = new Date();
  diaSelecionado: Date = new Date();
  diasCalendario: Date[] = [];

  ngOnInit() {
    this.construirCalendario();
  }

  construirCalendario() {
    const ano = this.dataAtual.getFullYear();
    const mes = this.dataAtual.getMonth();

    const dataInicial = new Date(ano, mes, 1);
    while (dataInicial.getDay() !== 0) {
      dataInicial.setDate(dataInicial.getDate() - 1);
    }

    const dataFinal = new Date(ano, mes + 1, 0);
    while (dataFinal.getDay() !== 6) {
      dataFinal.setDate(dataFinal.getDate() + 1);
    }

    this.diasCalendario = [];
    for (
      let data = new Date(dataInicial.getTime());
      data <= dataFinal;
      data.setDate(data.getDate() + 1)
    ) {
      this.diasCalendario.push(new Date(data.getTime()));
    }
  }

  alterarMes(offsetMes: number) {
    this.dataAtual = new Date(
      this.dataAtual.getFullYear(),
      this.dataAtual.getMonth() + offsetMes,
      1
    );
    this.construirCalendario();
  }

  selecionarDia(dia: Date) {
    this.diaSelecionado = new Date(dia.getTime());
    if (dia.getMonth() !== this.dataAtual.getMonth()) {
      this.dataAtual = new Date(dia.getFullYear(), dia.getMonth(), 1);
      this.construirCalendario();
    }
    this.dataSelecionada.emit(new Date(dia.getTime()));
  }

  ehHoje(dia: Date): boolean {
    const hoje = new Date();
    return (
      dia.getDate() === hoje.getDate() &&
      dia.getMonth() === hoje.getMonth() &&
      dia.getFullYear() === hoje.getFullYear()
    );
  }

  ehSelecionado(dia: Date): boolean {
    return (
      dia.getDate() === this.diaSelecionado.getDate() &&
      dia.getMonth() === this.diaSelecionado.getMonth() &&
      dia.getFullYear() === this.diaSelecionado.getFullYear()
    );
  }
}
