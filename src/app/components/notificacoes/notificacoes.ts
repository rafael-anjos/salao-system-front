import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notificacao, SalaoEstadoService } from '../../core/salao-estado.service';

type AbaNotificacao = 'nao-lidas' | 'lidas';

@Component({
  selector: 'app-notificacoes',
  imports: [FormsModule],
  templateUrl: './notificacoes.html',
  styleUrl: './notificacoes.css',
})
export class Notificacoes {
  private readonly estado = inject(SalaoEstadoService);

  aberto = false;
  aba: AbaNotificacao = 'nao-lidas';
  inicio = '';
  fim = '';
  erro = '';

  get naoLidas(): number {
    return this.estado.quantidadeNaoLidas();
  }

  get visiveis(): Notificacao[] {
    return this.estado.listarNotificacoes(this.aba === 'lidas', this.inicio, this.fim);
  }

  get rotuloVazio(): string {
    if (this.inicio || this.fim) {
      return 'Nenhuma notificação neste período.';
    }
    return this.aba === 'nao-lidas' ? 'Nenhuma notificação não lida.' : 'Nenhuma notificação lida.';
  }

  abrir(): void {
    this.aba = 'nao-lidas';
    this.inicio = '';
    this.fim = '';
    this.erro = '';
    this.aberto = true;
  }

  fechar(): void {
    this.aberto = false;
    this.erro = '';
  }

  mudarAba(aba: AbaNotificacao): void {
    this.aba = aba;
    this.erro = '';
  }

  filtrar(): void {
    if (this.inicio && this.fim && this.inicio > this.fim) {
      this.erro = 'A data inicial não pode ser depois da final.';
      return;
    }
    this.erro = '';
  }

  marcar(item: Notificacao): void {
    if (item.lida) {
      return;
    }
    void this.estado.marcarComoLida(item.id);
  }

  formatar(iso: string): string {
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.aberto) {
      this.fechar();
    }
  }
}
