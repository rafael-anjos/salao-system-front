import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuscaCliente } from '../../clientes/busca-cliente/busca-cliente';
import { ContextoFicha } from '../../ficha-atendimento/contexto-ficha';
import { AgendamentoDia, Profissional, SalaoEstadoService, Servico } from '../../../core/salao-estado.service';

@Component({
  selector: 'app-novo-agendamento',
  imports: [FormsModule, BuscaCliente, ContextoFicha],
  templateUrl: './novo-agendamento.html',
  styleUrl: './novo-agendamento.css',
})
export class NovoAgendamento implements OnInit {
  private readonly estado = inject(SalaoEstadoService);

  @Input() agendamento: AgendamentoDia | null = null;
  @Input() dataInicial = '';
  @Input() horaInicial = '';
  @Input() clienteIdInicial = '';
  @Output() cancelar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  clienteNome = '';
  clienteId = '';
  servicoId = '';
  profissionalId = '';
  data = '';
  hora = '';
  observacao = '';
  erro = '';
  vinculoFicha = '';

  ngOnInit() {
    this.vinculoFicha = this.agendamento?.id ?? `tmp-${Date.now()}`;
    if (this.agendamento) {
      this.clienteNome =
        !this.agendamento.clienteId && this.agendamento.cliente === 'Serviço avulso' ? '' : this.agendamento.cliente;
      this.clienteId = this.agendamento.clienteId;
      this.servicoId = this.agendamento.servicoId;
      this.profissionalId = this.agendamento.profissionalId;
      this.data = this.agendamento.data;
      this.hora = this.agendamento.hora;
      this.observacao = this.agendamento.observacao ?? '';
      return;
    }

    this.data = this.dataInicial;
    this.hora = this.horaInicial;
    if (this.clienteIdInicial) {
      const cliente = this.estado.clientes.find((item) => item.id === this.clienteIdInicial);
      if (cliente) {
        this.clienteNome = cliente.nome;
        this.clienteId = cliente.id;
      }
    }
    const padrao = this.profissionais.find((item) => item.nome === this.estado.usuarioAtual);
    this.profissionalId = padrao?.id ?? this.profissionais[0]?.id ?? '';
  }

  get titulo(): string {
    if (this.somenteLeitura) {
      return 'Agendamento';
    }
    return this.agendamento ? 'Editar agendamento' : 'Novo Agendamento';
  }

  get somenteLeitura(): boolean {
    return !!this.agendamento && (this.agendamento.status === 'Concluído' || !!this.agendamento.vendaId);
  }

  definirCliente(evento: { id: string; nome: string }): void {
    if (evento.id && evento.id !== this.clienteId) {
      this.estado.acompanharFicha([this.vinculoFicha, this.agendamento?.id ?? ''], evento.id, this.data);
    }
    this.clienteId = evento.id;
    this.clienteNome = evento.nome;
  }

  get servicos(): Servico[] {
    const ativos = this.estado.listarServicos(true);
    if (!this.agendamento) {
      return ativos;
    }
    const atual = this.estado.servicos.find((item) => item.id === this.agendamento?.servicoId);
    if (!atual || ativos.some((item) => item.id === atual.id)) {
      return ativos;
    }
    return [atual, ...ativos];
  }

  get profissionais(): Profissional[] {
    const ativas = this.estado.listarProfissionais(true);
    if (!this.agendamento) {
      return ativas;
    }
    const atual = this.estado.profissionais.find((item) => item.id === this.agendamento?.profissionalId);
    if (!atual || ativas.some((item) => item.id === atual.id)) {
      return ativas;
    }
    return [atual, ...ativas];
  }

  onCancelar() {
    this.cancelar.emit();
  }

  onSalvar() {
    if (this.somenteLeitura) {
      this.onCancelar();
      return;
    }

    const resultado = this.estado.salvarAgendamento({
      id: this.agendamento?.id,
      clienteNome: this.clienteNome,
      clienteId: this.clienteId || undefined,
      servicoId: this.servicoId,
      profissionalId: this.profissionalId,
      data: this.data,
      hora: this.hora,
      observacao: this.observacao,
    });

    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    if (resultado.id && this.vinculoFicha !== resultado.id) {
      this.estado.assumirVinculo(this.vinculoFicha, resultado.id);
    }

    this.salvar.emit();
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    this.onCancelar();
  }
}
