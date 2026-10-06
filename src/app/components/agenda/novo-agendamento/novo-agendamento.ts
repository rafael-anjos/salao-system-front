import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-novo-agendamento',
  imports: [],
  templateUrl: './novo-agendamento.html',
  styleUrl: './novo-agendamento.css',
})
export class NovoAgendamento {
  @Output() cancelar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  onCancelar(){
    this.cancelar.emit();
  }

  onSalvar(){
    this.salvar.emit();
  }
}
