import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalaoEstadoService, Servico } from '../../core/salao-estado.service';
import { Notificacoes } from '../notificacoes/notificacoes';

type ListaServicos = 'ativos' | 'inativos';
type Painel = 'formulario' | null;

@Component({
  selector: 'app-servicos',
  imports: [FormsModule, CurrencyPipe, Notificacoes],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css',
})
export class Servicos {
  private readonly estado = inject(SalaoEstadoService);
  private readonly cd = inject(ChangeDetectorRef);

  lista: ListaServicos = 'ativos';
  termoBusca = '';
  painel: Painel = null;
  editandoId: string | null = null;
  alvo: Servico | null = null;
  nome = '';
  descricao = '';
  preco: number | null = null;
  duracaoMinutos: number | null = null;
  erro = '';
  erroAcao = '';
  processandoId = '';

  get ativos(): Servico[] {
    return this.estado.listarServicos(true);
  }

  get servicosVisiveis(): Servico[] {
    const busca = this.termoBusca.trim().toLowerCase();
    const origem = this.estado
      .listarServicos(false)
      .filter((servico) => (this.lista === 'ativos' ? servico.ativo : !servico.ativo));

    return origem.filter((servico) => {
      if (!busca) {
        return true;
      }
      return (
        servico.nome.toLowerCase().includes(busca) ||
        servico.descricao.toLowerCase().includes(busca)
      );
    });
  }

  get totalAtivos(): number {
    return this.ativos.length;
  }

  get precoMedio(): number {
    if (!this.ativos.length) {
      return 0;
    }
    const soma = this.ativos.reduce((total, servico) => total + servico.preco, 0);
    return soma / this.ativos.length;
  }

  get duracaoMedia(): number {
    if (!this.ativos.length) {
      return 0;
    }
    const soma = this.ativos.reduce((total, servico) => total + servico.duracaoMinutos, 0);
    return Math.round(soma / this.ativos.length);
  }

  get tituloPainel(): string {
    return this.editandoId ? 'Editar serviço' : 'Novo serviço';
  }

  mudarLista(lista: ListaServicos): void {
    this.lista = lista;
    this.fecharPainel();
  }

  abrirCadastro(): void {
    this.editandoId = null;
    this.alvo = null;
    this.nome = '';
    this.descricao = '';
    this.preco = null;
    this.duracaoMinutos = null;
    this.erro = '';
    this.painel = 'formulario';
  }

  abrirEdicao(servico: Servico): void {
    this.editandoId = servico.id;
    this.alvo = servico;
    this.nome = servico.nome;
    this.descricao = servico.descricao;
    this.preco = servico.preco;
    this.duracaoMinutos = servico.duracaoMinutos;
    this.erro = '';
    this.painel = 'formulario';
  }

  async alternarStatus(servico: Servico): Promise<void> {
    if (this.processandoId) {
      return;
    }
    this.erroAcao = '';
    this.processandoId = servico.id;
    const resultado = await this.estado.definirServicoAtivo(servico.id, !servico.ativo);
    this.processandoId = '';
    if (!resultado.ok) {
      this.erroAcao = resultado.mensagem;
    }
    this.cd.detectChanges();
  }

  fecharPainel(): void {
    this.painel = null;
    this.erro = '';
    this.alvo = null;
  }

  async salvar(): Promise<void> {
    const resultado = await this.estado.salvarServico({
      id: this.editandoId ?? undefined,
      nome: this.nome,
      descricao: this.descricao,
      preco: Number(this.preco),
      duracaoMinutos: Number(this.duracaoMinutos),
    });

    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    if (!this.editandoId) {
      this.lista = 'ativos';
    }
    this.fecharPainel();
    this.cd.detectChanges();
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.painel) {
      this.fecharPainel();
    }
  }

  formatarDuracao(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    if (horas === 0) {
      return `${resto} min`;
    }
    if (resto === 0) {
      return `${horas} h`;
    }
    return `${horas} h ${resto}`;
  }
}
