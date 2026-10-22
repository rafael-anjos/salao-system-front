import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FichaAtendimento, SalaoEstadoService, resumoFichaAtendimento } from '../../core/salao-estado.service';
import { FichaAtendimentoPainel } from './ficha-atendimento';

@Component({
  selector: 'app-fichas-anteriores',
  imports: [FichaAtendimentoPainel],
  templateUrl: './fichas-anteriores.html',
  styleUrl: './fichas-anteriores.css',
})
export class FichasAnteriores {
  private readonly estado = inject(SalaoEstadoService);

  @Input() clienteId = '';
  @Input() agendamentoId = '';
  @Input() vinculo = '';
  @Output() fechar = new EventEmitter<void>();
  @Output() copiar = new EventEmitter<FichaAtendimento>();

  leituraId = '';

  get fichas(): FichaAtendimento[] {
    return this.estado.fichasAnteriores(this.clienteId, this.agendamentoId, this.vinculo);
  }

  resumo(ficha: FichaAtendimento): string {
    return resumoFichaAtendimento(ficha);
  }

  formatar(iso: string): string {
    if (iso.length < 10) {
      return iso;
    }
    return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
  }

  ver(ficha: FichaAtendimento): void {
    this.leituraId = ficha.id;
  }
}
