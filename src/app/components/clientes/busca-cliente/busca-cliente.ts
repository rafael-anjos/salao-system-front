import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente, SalaoEstadoService } from '../../../core/salao-estado.service';

@Component({
  selector: 'app-busca-cliente',
  imports: [FormsModule],
  templateUrl: './busca-cliente.html',
  styleUrl: './busca-cliente.css',
})
export class BuscaCliente implements OnChanges {
  private readonly estado = inject(SalaoEstadoService);
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input() clienteId = '';
  @Input() nomeLivre = '';
  @Input() rotulo = 'Cliente';
  @Input() placeholder = 'Nome ou telefone';
  @Input() obrigatorio = false;
  @Input() desabilitado = false;
  @Output() clienteChange = new EventEmitter<{ id: string; nome: string }>();
  @Output() criado = new EventEmitter<Cliente>();

  readonly idCampo = `busca-cliente-${Math.random().toString(36).slice(2, 8)}`;
  readonly idLista = `${this.idCampo}-lista`;
  texto = '';
  aberta = false;
  rapido = false;
  nomeRapido = '';
  telefoneRapido = '';
  erroRapido = '';
  private ultimoId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['clienteId'] && !changes['nomeLivre']) {
      return;
    }
    if (this.clienteId === this.ultimoId && this.texto) {
      return;
    }
    this.ultimoId = this.clienteId;
    const cliente = this.estado.clientes.find((item) => item.id === this.clienteId);
    this.texto = cliente?.nome ?? (this.clienteId ? '' : this.nomeLivre);
  }

  get sugestoes(): Cliente[] {
    const termo = this.texto.trim().toLowerCase();
    const digitos = this.texto.replace(/\D/g, '');
    return this.estado.clientes
      .filter((cliente) => {
        if (!termo) {
          return true;
        }
        const nome = cliente.nome.toLowerCase().includes(termo);
        const telefone = !!digitos && cliente.telefone.replace(/\D/g, '').includes(digitos);
        return nome || telefone;
      })
      .slice(0, 6);
  }

  aoDigitar(valor: string): void {
    this.texto = valor;
    this.aberta = true;
    this.ultimoId = '';
    this.clienteChange.emit({ id: '', nome: valor });
  }

  escolher(cliente: Cliente): void {
    this.texto = cliente.nome;
    this.ultimoId = cliente.id;
    this.aberta = false;
    this.clienteChange.emit({ id: cliente.id, nome: cliente.nome });
  }

  abrirRapido(): void {
    this.rapido = true;
    this.erroRapido = '';
    this.nomeRapido = this.clienteId ? '' : this.texto.trim();
    this.telefoneRapido = '';
    this.aberta = false;
  }

  fecharRapido(): void {
    this.rapido = false;
    this.erroRapido = '';
  }

  async salvarRapido(): Promise<void> {
    const resultado = await this.estado.salvarCliente({
      nome: this.nomeRapido,
      telefone: this.telefoneRapido,
    });
    if (!resultado.ok || !resultado.id) {
      this.erroRapido = resultado.mensagem;
      return;
    }
    const cliente = this.estado.clientes.find((item) => item.id === resultado.id);
    if (!cliente) {
      this.erroRapido = 'Cliente não encontrada.';
      return;
    }
    this.rapido = false;
    this.escolher(cliente);
    this.criado.emit(cliente);
  }

  @HostListener('document:click', ['$event'])
  fecharLista(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.aberta = false;
    }
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.rapido) {
      this.fecharRapido();
      return;
    }
    this.aberta = false;
  }
}
