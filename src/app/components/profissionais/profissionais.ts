import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profissional, SalaoEstadoService } from '../../core/salao-estado.service';
import { Notificacoes } from '../notificacoes/notificacoes';

type ListaProfissionais = 'ativas' | 'inativas';
type Painel = 'formulario' | null;

@Component({
  selector: 'app-profissionais',
  imports: [FormsModule, Notificacoes],
  templateUrl: './profissionais.html',
  styleUrl: './profissionais.css',
})
export class Profissionais {
  private readonly estado = inject(SalaoEstadoService);
  private readonly cd = inject(ChangeDetectorRef);

  lista: ListaProfissionais = 'ativas';
  termoBusca = '';
  painel: Painel = null;
  editandoId: string | null = null;
  alvo: Profissional | null = null;
  nome = '';
  telefone = '';
  erro = '';
  erroAcao = '';
  processandoId = '';

  get ativas(): Profissional[] {
    return this.estado.listarProfissionais(true);
  }

  get profissionaisVisiveis(): Profissional[] {
    const busca = this.termoBusca.trim().toLowerCase();
    const origem = this.estado
      .listarProfissionais(false)
      .filter((profissional) => (this.lista === 'ativas' ? profissional.ativo : !profissional.ativo));

    return origem.filter((profissional) => {
      if (!busca) {
        return true;
      }
      return (
        profissional.nome.toLowerCase().includes(busca) ||
        profissional.telefone.toLowerCase().includes(busca)
      );
    });
  }

  get totalAtivas(): number {
    return this.ativas.length;
  }

  get totalInativas(): number {
    return this.estado.listarProfissionais(false).filter((profissional) => !profissional.ativo).length;
  }

  get totalAtendimentos(): number {
    return this.estado.agendamentos.length;
  }

  get tituloPainel(): string {
    return this.editandoId ? 'Editar profissional' : 'Nova profissional';
  }

  atendimentos(id: string): number {
    return this.estado.atendimentosDoProfissional(id);
  }

  mudarLista(lista: ListaProfissionais): void {
    this.lista = lista;
    this.fecharPainel();
  }

  abrirCadastro(): void {
    this.editandoId = null;
    this.alvo = null;
    this.nome = '';
    this.telefone = '';
    this.erro = '';
    this.painel = 'formulario';
  }

  abrirEdicao(profissional: Profissional): void {
    this.editandoId = profissional.id;
    this.alvo = profissional;
    this.nome = profissional.nome;
    this.telefone = profissional.telefone;
    this.erro = '';
    this.painel = 'formulario';
  }

  async alternarStatus(profissional: Profissional): Promise<void> {
    if (this.processandoId) {
      return;
    }
    this.erroAcao = '';
    this.processandoId = profissional.id;
    const resultado = await this.estado.definirProfissionalAtivo(profissional.id, !profissional.ativo);
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
    const resultado = await this.estado.salvarProfissional({
      id: this.editandoId ?? undefined,
      nome: this.nome,
      telefone: this.telefone,
    });

    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    if (!this.editandoId) {
      this.lista = 'ativas';
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
}
