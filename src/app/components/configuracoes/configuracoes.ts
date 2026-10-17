import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BloqueioAgenda,
  HorarioFuncionamento,
  SalaoEstadoService,
  nomeDia as rotuloDia,
} from '../../core/salao-estado.service';

type Aba = 'horarios' | 'bloqueios' | 'senha';
type Painel = 'bloqueio' | 'remover' | null;

@Component({
  selector: 'app-configuracoes',
  imports: [FormsModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {
  private readonly estado = inject(SalaoEstadoService);

  readonly usuario = this.estado.usuarioAtual;

  aba: Aba = 'horarios';
  painel: Painel = null;
  horarios: HorarioFuncionamento[] = this.estado.listarHorarios();
  editandoId: string | null = null;
  alvo: BloqueioAgenda | null = null;

  dataInicio = '';
  dataFim = '';
  horaInicio = '';
  horaFim = '';
  diaInteiro = true;
  motivo = '';

  senhaAtual = '';
  senhaNova = '';
  senhaConfirmacao = '';

  erro = '';
  aviso = '';

  get diasAbertos(): number {
    return this.estado.listarHorarios().filter((horario) => horario.ativo).length;
  }

  get bloqueios(): BloqueioAgenda[] {
    return this.estado.listarBloqueios();
  }

  get tituloPainel(): string {
    if (this.painel === 'remover') {
      return 'Remover bloqueio';
    }
    return this.editandoId ? 'Editar bloqueio' : 'Novo bloqueio';
  }

  nomeDia(dia: number): string {
    return rotuloDia(dia);
  }

  mudarAba(aba: Aba): void {
    this.aba = aba;
    this.erro = '';
    this.aviso = '';
    this.fecharPainel();
  }

  alternarDia(horario: HorarioFuncionamento): void {
    horario.ativo = !horario.ativo;
    this.aviso = '';
  }

  salvarHorarios(): void {
    const resultado = this.estado.salvarHorarios(this.horarios);
    this.erro = resultado.ok ? '' : resultado.mensagem;
    this.aviso = resultado.ok ? resultado.mensagem : '';
    if (resultado.ok) {
      this.horarios = this.estado.listarHorarios();
    }
  }

  abrirBloqueio(): void {
    this.editandoId = null;
    this.alvo = null;
    this.dataInicio = '';
    this.dataFim = '';
    this.horaInicio = '';
    this.horaFim = '';
    this.diaInteiro = true;
    this.motivo = '';
    this.erro = '';
    this.painel = 'bloqueio';
  }

  abrirEdicao(bloqueio: BloqueioAgenda): void {
    this.editandoId = bloqueio.id;
    this.alvo = bloqueio;
    this.dataInicio = bloqueio.dataInicio;
    this.dataFim = bloqueio.dataFim;
    this.horaInicio = bloqueio.horaInicio;
    this.horaFim = bloqueio.horaFim;
    this.diaInteiro = bloqueio.diaInteiro;
    this.motivo = bloqueio.motivo;
    this.erro = '';
    this.painel = 'bloqueio';
  }

  abrirRemocao(bloqueio: BloqueioAgenda): void {
    this.alvo = bloqueio;
    this.erro = '';
    this.painel = 'remover';
  }

  fecharPainel(): void {
    this.painel = null;
    this.erro = '';
    this.alvo = null;
  }

  salvarBloqueio(): void {
    const resultado = this.estado.salvarBloqueio({
      id: this.editandoId ?? undefined,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim || this.dataInicio,
      horaInicio: this.horaInicio,
      horaFim: this.horaFim,
      diaInteiro: this.diaInteiro,
      motivo: this.motivo,
    });

    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  confirmarRemocao(): void {
    if (!this.alvo) {
      return;
    }
    const resultado = this.estado.removerBloqueio(this.alvo.id);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  alterarSenha(): void {
    const resultado = this.estado.alterarSenha({
      atual: this.senhaAtual,
      nova: this.senhaNova,
      confirmacao: this.senhaConfirmacao,
    });
    this.erro = resultado.ok ? '' : resultado.mensagem;
    this.aviso = resultado.ok ? resultado.mensagem : '';
    if (resultado.ok) {
      this.senhaAtual = '';
      this.senhaNova = '';
      this.senhaConfirmacao = '';
    }
  }

  periodo(bloqueio: BloqueioAgenda): string {
    const inicio = this.formatarData(bloqueio.dataInicio);
    if (bloqueio.dataInicio === bloqueio.dataFim) {
      return inicio;
    }
    return `${inicio} – ${this.formatarData(bloqueio.dataFim)}`;
  }

  horarioBloqueio(bloqueio: BloqueioAgenda): string {
    if (bloqueio.diaInteiro) {
      return 'Dia inteiro';
    }
    return `${bloqueio.horaInicio} – ${bloqueio.horaFim}`;
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.painel) {
      this.fecharPainel();
    }
  }

  private formatarData(iso: string): string {
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
