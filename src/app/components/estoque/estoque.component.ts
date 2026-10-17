import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ProdutoEstoque,
  SalaoEstadoService,
  StatusEstoque,
  UsoProduto,
} from '../../core/salao-estado.service';

type AbaEstoque = 'produtos' | 'categorias';
type FiltroUso = 'todos' | UsoProduto;
type PainelEstoque = 'produto' | 'categoria' | 'movimento' | 'excluir-produto' | 'excluir-categoria';

interface CategoriaEstoque {
  id: string;
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
  painel: PainelEstoque | null = null;
  termoBusca = '';
  categoriaSelecionada = '';
  filtroUso: FiltroUso = 'todos';
  somenteAbaixo = false;
  erro = '';

  editandoProdutoId: string | null = null;
  editandoCategoriaId: string | null = null;
  produtoAlvo: ProdutoEstoque | null = null;
  categoriaAlvo: CategoriaEstoque | null = null;
  movimentoTipo: 'entrada' | 'saida' = 'entrada';

  nome = '';
  uso: UsoProduto | '' = '';
  categoria = '';
  unidade = '';
  codigoBarras = '';
  precoCusto: number | null = null;
  preco: number | null = null;
  estoqueMinimo: number | null = null;
  estoqueAtual: number | null = null;
  quantidade: number | null = null;
  nomeCategoria = '';

  get produtos(): ProdutoEstoque[] {
    return this.estado.produtos;
  }

  get categorias(): CategoriaEstoque[] {
    return this.estado.listarCategorias('estoque').map((categoria) => {
      const produtos = this.produtos.filter(
        (produto) => produto.categoria.toLowerCase() === categoria.nome.toLowerCase(),
      );
      return {
        id: categoria.id,
        nome: categoria.nome,
        cadastrados: produtos.length,
        criticos: produtos.filter((produto) => produto.status === 'critico').length,
        baixo: produtos.filter((produto) => produto.status === 'baixo').length,
        normal: produtos.filter((produto) => produto.status === 'normal').length,
      };
    });
  }

  get produtosFiltrados(): ProdutoEstoque[] {
    const busca = this.termoBusca.trim().toLowerCase();

    return this.produtos.filter((produto) => {
      const porUso = this.filtroUso === 'todos' || produto.uso === this.filtroUso;
      const porCategoria =
        !this.categoriaSelecionada ||
        produto.categoria.toLowerCase() === this.categoriaSelecionada;
      const porNome =
        !busca ||
        produto.nome.toLowerCase().includes(busca) ||
        (produto.codigoBarras ?? '').toLowerCase().includes(busca);
      const porAlerta = !this.somenteAbaixo || produto.status !== 'normal';
      return porUso && porCategoria && porNome && porAlerta;
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

  get tituloPainel(): string {
    if (this.painel === 'movimento') {
      return this.movimentoTipo === 'entrada' ? 'Entrada de estoque' : 'Saída de estoque';
    }
    if (this.painel === 'excluir-produto') {
      return 'Excluir produto';
    }
    if (this.painel === 'excluir-categoria') {
      return 'Excluir categoria';
    }
    if (this.painel === 'categoria') {
      return this.editandoCategoriaId ? 'Editar categoria' : 'Nova categoria';
    }
    return this.editandoProdutoId ? 'Editar produto' : 'Novo produto';
  }

  mudarAba(aba: AbaEstoque): void {
    this.abaAtiva = aba;
    this.fecharPainel();
  }

  mudarFiltroUso(filtro: FiltroUso): void {
    this.filtroUso = filtro;
  }

  alternarCriticos(): void {
    this.somenteAbaixo = !this.somenteAbaixo;
  }

  verCategoria(categoria: CategoriaEstoque): void {
    this.abaAtiva = 'produtos';
    this.categoriaSelecionada = categoria.nome.toLowerCase();
    this.somenteAbaixo = false;
    this.termoBusca = '';
    this.filtroUso = 'todos';
  }

  abrirCadastro(): void {
    this.erro = '';
    if (this.abaAtiva === 'categorias') {
      this.editandoCategoriaId = null;
      this.nomeCategoria = '';
      this.painel = 'categoria';
      return;
    }
    this.limparProduto();
    this.painel = 'produto';
  }

  abrirEdicao(produto: ProdutoEstoque): void {
    this.editandoProdutoId = produto.id;
    this.nome = produto.nome;
    this.uso = produto.uso;
    this.categoria = produto.categoria;
    this.unidade = produto.unidade ?? '';
    this.codigoBarras = produto.codigoBarras ?? '';
    this.precoCusto = produto.precoCusto ?? null;
    this.preco = produto.preco;
    this.estoqueMinimo = produto.estoqueMinimo;
    this.estoqueAtual = produto.estoqueAtual;
    this.erro = '';
    this.painel = 'produto';
  }

  abrirMovimento(produto: ProdutoEstoque, tipo: 'entrada' | 'saida'): void {
    this.produtoAlvo = produto;
    this.movimentoTipo = tipo;
    this.quantidade = null;
    this.erro = '';
    this.painel = 'movimento';
  }

  abrirExclusao(produto: ProdutoEstoque): void {
    this.produtoAlvo = produto;
    this.erro = '';
    this.painel = 'excluir-produto';
  }

  abrirEdicaoCategoria(categoria: CategoriaEstoque): void {
    this.editandoCategoriaId = categoria.id;
    this.nomeCategoria = categoria.nome;
    this.erro = '';
    this.painel = 'categoria';
  }

  abrirExclusaoCategoria(categoria: CategoriaEstoque): void {
    this.categoriaAlvo = categoria;
    this.erro = '';
    this.painel = 'excluir-categoria';
  }

  fecharPainel(): void {
    this.painel = null;
    this.erro = '';
    this.produtoAlvo = null;
    this.categoriaAlvo = null;
  }

  salvarProduto(): void {
    const resultado = this.estado.salvarProduto({
      id: this.editandoProdutoId ?? undefined,
      nome: this.nome,
      categoria: this.categoria,
      uso: this.uso as UsoProduto,
      unidade: this.unidade,
      codigoBarras: this.codigoBarras,
      precoCusto: Number(this.precoCusto),
      preco: Number(this.preco),
      estoqueMinimo: Number(this.estoqueMinimo),
      estoqueAtual: Number(this.estoqueAtual),
    });

    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    this.fecharPainel();
  }

  confirmarMovimento(): void {
    if (!this.produtoAlvo) {
      return;
    }

    const resultado = this.estado.movimentarProduto(
      this.produtoAlvo.id,
      this.movimentoTipo,
      Number(this.quantidade),
    );
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    this.fecharPainel();
  }

  confirmarExclusao(): void {
    if (!this.produtoAlvo) {
      return;
    }

    const resultado = this.estado.removerProduto(this.produtoAlvo.id);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    this.fecharPainel();
  }

  salvarCategoria(): void {
    const resultado = this.estado.salvarCategoria({
      id: this.editandoCategoriaId ?? undefined,
      nome: this.nomeCategoria,
      tipo: 'estoque',
    });

    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    this.fecharPainel();
  }

  confirmarExclusaoCategoria(): void {
    if (!this.categoriaAlvo) {
      return;
    }

    const resultado = this.estado.removerCategoria(this.categoriaAlvo.id);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }

    if (this.categoriaSelecionada === this.categoriaAlvo.nome.toLowerCase()) {
      this.categoriaSelecionada = '';
    }
    this.fecharPainel();
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

  rotuloUso(uso: UsoProduto): string {
    return uso === 'venda' ? 'Venda' : 'Uso no salão';
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.painel) {
      this.fecharPainel();
    }
  }

  private limparProduto(): void {
    this.editandoProdutoId = null;
    this.nome = '';
    this.uso = '';
    this.categoria = '';
    this.unidade = '';
    this.codigoBarras = '';
    this.precoCusto = null;
    this.preco = null;
    this.estoqueMinimo = null;
    this.estoqueAtual = null;
  }
}
