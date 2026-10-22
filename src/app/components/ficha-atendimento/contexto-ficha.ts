import { Component, Input, inject } from '@angular/core';
import { FichaAtendimento, SalaoEstadoService } from '../../core/salao-estado.service';
import { FichaAtendimentoPainel } from './ficha-atendimento';
import { FichasAnteriores } from './fichas-anteriores';

@Component({
  selector: 'app-contexto-ficha',
  imports: [FichaAtendimentoPainel, FichasAnteriores],
  templateUrl: './contexto-ficha.html',
  styleUrl: './contexto-ficha.css',
})
export class ContextoFicha {
  private readonly estado = inject(SalaoEstadoService);

  @Input() clienteId = '';
  @Input() agendamentoId = '';
  @Input() vinculo = '';
  @Input() data = '';
  private pedidoAtual = 0;

  @Input() set abrirPedido(valor: number) {
    if (valor > 0 && valor !== this.pedidoAtual) {
      this.pedidoAtual = valor;
      this.abrirFicha();
    }
  }

  mostrarFicha = false;
  mostrarAnteriores = false;
  fichaId = '';
  copia: FichaAtendimento | null = null;
  somenteLeitura = false;

  get alergia(): string {
    return this.estado.clientes.find((cliente) => cliente.id === this.clienteId)?.anamnese.alergias.trim() ?? '';
  }

  get anteriores() {
    return this.estado.fichasAnteriores(this.clienteId, this.agendamentoId, this.vinculo);
  }

  abrirFicha(origem?: FichaAtendimento): void {
    const existente = this.estado.fichaDoContexto(this.clienteId, this.agendamentoId, this.vinculo);
    this.copia = origem ?? null;
    this.fichaId = existente?.id ?? '';
    this.somenteLeitura = false;
    this.mostrarAnteriores = false;
    this.mostrarFicha = true;
  }

  abrirAnteriores(): void {
    this.mostrarAnteriores = true;
  }

  fecharFicha(): void {
    this.mostrarFicha = false;
    this.copia = null;
  }
}
