import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoEstoque, SalaoEstadoService, StatusEstoque } from '../../core/salao-estado.service';

type AbaEstoque = 'produtos' | 'categorias';
type FiltroUso = 'todos' | 'salao' | 'venda';

interface CategoriaEstoque {
  nome: string;
  cadastrados: number;
  criticos: number;
  baixo: number;
  normal: number;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css'],
})
export class EstoqueComponent {
  private readonly estado = inject(SalaoEstadoService);
  abaAtiva: AbaEstoque = 'produtos';
  mostrarCadastro = false;
  termoBusca = '';
  categoriaSelecionada = '';
  filtroUso: FiltroUso = 'todos';

  get produtos(): ProdutoEstoque[] {
    return this.estado.produtos;
  }

  categorias: CategoriaEstoque[] = [
    { nome: 'Coloração', cadastrados: 3, criticos: 3, baixo: 0, normal: 0 },
    { nome: 'Tratamento', cadastrados: 1, criticos: 0, baixo: 1, normal: 0 },
    { nome: 'Finalização', cadastrados: 1, criticos: 0, baixo: 0, normal: 1 },
  ];

  get produtosFiltrados(): ProdutoEstoque[] {
    const busca = this.termoBusca.trim().toLowerCase();

    return this.produtos.filter((produto) => {
      const porUso = this.filtroUso === 'todos' || produto.uso === this.filtroUso;
      const porCategoria =
        !this.categoriaSelecionada ||
        produto.categoria.toLowerCase() === this.categoriaSelecionada;
      const porNome = !busca || produto.nome.toLowerCase().includes(busca);
      return porUso && porCategoria && porNome;
    });
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get totalCriticos(): number {
    return this.produtos.filter((produto) => produto.status === 'critico').length;
  }

  get totalBaixos(): number {
    return this.produtos.filter((produto) => produto.status === 'baixo').length;
  }

  get totalAbaixoDoMinimo(): number {
    return this.totalCriticos + this.totalBaixos;
  }

  get rotuloCadastro(): string {
    return this.abaAtiva === 'produtos' ? 'Novo Produto' : 'Nova Categoria';
  }

  mudarAba(aba: AbaEstoque): void {
    this.abaAtiva = aba;
    this.mostrarCadastro = false;
  }

  mudarFiltroUso(filtro: FiltroUso): void {
    this.filtroUso = filtro;
  }

  abrirCadastro(): void {
    this.mostrarCadastro = true;
  }

  fecharCadastro(): void {
    this.mostrarCadastro = false;
  }

  rotuloStatus(status: StatusEstoque): string {
    if (status === 'critico') {
      return 'Crítico';
    }
    if (status === 'baixo') {
      return 'Baixo';
    }
    return 'Normal';
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
