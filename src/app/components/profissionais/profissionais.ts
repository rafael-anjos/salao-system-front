import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profissional, SalaoEstadoService } from '../../core/salao-estado.service';

type ListaProfissionais = 'ativas' | 'inativas';
type Painel = 'formulario' | 'status' | null;

@Component({
  selector: 'app-profissionais',
  imports: [FormsModule],
  templateUrl: './profissionais.html',
  styleUrl: './profissionais.css',
})
export class Profissionais {
  private readonly estado = inject(SalaoEstadoService);

  lista: ListaProfissionais = 'ativas';
  termoBusca = '';
  painel: Painel = null;
  editandoId: string | null = null;
  alvo: Profissional | null = null;
  nome = '';
  telefone = '';
  erro = '';

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
    if (this.painel === 'status') {
      return this.alvo?.ativo ? 'Desativar profissional' : 'Reativar profissional';
    }
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

  abrirStatus(profissional: Profissional): void {
    this.alvo = profissional;
    this.erro = '';
    this.painel = 'status';
  }

  fecharPainel(): void {
    this.painel = null;
    this.erro = '';
    this.alvo = null;
  }

  salvar(): void {
    const resultado = this.estado.salvarProfissional({
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
  }

  confirmarStatus(): void {
    if (!this.alvo) {
      return;
    }

    const resultado = this.estado.definirProfissionalAtivo(this.alvo.id, !this.alvo.ativo);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    this.fecharPainel();
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.painel) {
      this.fecharPainel();
    }
  }
}
