import { CurrencyPipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';

type Tipo = 'receita' | 'despesa';
type Status = 'recebido' | 'pendente' | 'vencido' | 'paga' | 'vencida' | 'cancelado' | 'estornado';
type Recorrencia = 'mensal' | 'anual' | 'única';

interface Lancamento {
  id: number;
  tipo: Tipo;
  data: string;
  descricao: string;
  categoria: string;
  grupo: string;
  bruto: number;
  desconto: number;
  taxa: number;
  status: Status;
  vencimento: string;
  forma: string;
  pessoa: string;
  recorrencia: Recorrencia;
}

interface Rascunho {
  tipo: Tipo;
  data: string;
  descricao: string;
  grupo: string;
  categoria: string;
  bruto: string;
  desconto: string;
  taxa: string;
  vencimento: string;
  forma: string;
  pessoa: string;
  recorrencia: Recorrencia;
  jaEntrou: boolean;
}

@Component({
  selector: 'app-financeiro',
  imports: [CurrencyPipe],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css',
})
export class Financeiro {
  modalAberto = false;
  erro = '';
  aviso = '';
  confirmacao = '';

  readonly formas = ['Dinheiro', 'Pix', 'Cartão de crédito', 'Cartão de débito', 'Transferência'];
  readonly recorrencias: Recorrencia[] = ['única', 'mensal', 'anual'];
  readonly ordemGrupos = ['Fixas', 'Variáveis', 'Pessoal', 'Impostos e taxas', 'Outras'];
  readonly categoriasReceita = ['Serviços', 'Produtos', 'Pacotes e assinaturas', 'Outros'];
  readonly categoriasDespesa: Record<string, string[]> = {
    Fixas: ['Aluguel', 'Água', 'Luz', 'Internet', 'Sistema', 'Contador', 'Seguros'],
    Variáveis: ['Produtos e insumos', 'Material de limpeza', 'Manutenção', 'Marketing'],
    Pessoal: ['Salários', 'Comissões', 'Vale-transporte', 'Encargos'],
    'Impostos e taxas': ['Impostos', 'Taxas'],
    Outras: ['Retirada do sócio', 'Investimentos', 'Equipamentos'],
  };

  private seq = 1;
  private readonly hojeIso = this.iso(new Date());

  lancamentos: Lancamento[] = [];
  rascunho = this.rascunhoVazio();

  get ativos(): Lancamento[] {
    return this.lancamentos.filter((item) => item.status !== 'cancelado' && item.status !== 'estornado');
  }

  get receitas(): Lancamento[] {
    return this.ativos.filter((item) => item.tipo === 'receita');
  }

  get despesas(): Lancamento[] {
    return this.ativos.filter((item) => item.tipo === 'despesa');
  }

  get recebido(): number {
    return this.receitas.filter((item) => item.status === 'recebido').reduce((soma, item) => soma + this.liquido(item), 0);
  }

  get aReceber(): number {
    return this.receitas.filter((item) => this.emAberto(item)).reduce((soma, item) => soma + this.liquido(item), 0);
  }

  get totalDespesas(): number {
    return this.despesas.reduce((soma, item) => soma + this.liquido(item), 0);
  }

  get lucro(): number {
    const pagas = this.despesas.filter((item) => item.status === 'paga').reduce((soma, item) => soma + this.liquido(item), 0);
    return this.recebido - pagas;
  }

  get saldo(): number {
    return this.lancamentos.reduce((soma, item) => {
      if (item.status === 'recebido') {
        return soma + this.liquido(item);
      }
      if (item.status === 'paga') {
        return soma - this.liquido(item);
      }
      return soma;
    }, 0);
  }

  get receitasPorForma(): { nome: string; valor: number }[] {
    return this.agrupar(this.receitas, (item) => item.forma || 'Sem forma');
  }

  get despesasPorGrupo(): { nome: string; valor: number }[] {
    return this.ordemGrupos
      .map((nome) => ({
        nome,
        valor: this.despesas.filter((item) => item.grupo === nome).reduce((soma, item) => soma + this.liquido(item), 0),
      }))
      .filter((grupo) => grupo.valor > 0);
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.modalAberto) {
      this.fechar();
    }
  }

  abrir(): void {
    this.erro = '';
    this.rascunho = this.rascunhoVazio();
    this.modalAberto = true;
  }

  fechar(): void {
    this.modalAberto = false;
    this.erro = '';
  }

  definirTipo(tipo: Tipo): void {
    if (this.rascunho.tipo === tipo) {
      return;
    }
    const atual = this.rascunho;
    const proximo = this.rascunhoVazio(tipo);
    proximo.descricao = atual.descricao;
    proximo.bruto = atual.bruto;
    proximo.data = atual.data;
    proximo.vencimento = atual.vencimento;
    proximo.pessoa = atual.pessoa;
    proximo.recorrencia = atual.recorrencia;
    this.rascunho = proximo;
  }

  definirGrupo(grupo: string): void {
    this.rascunho.grupo = grupo;
    this.rascunho.categoria = this.categoriasDespesa[grupo][0];
  }

  salvar(): void {
    const r = this.rascunho;
    const bruto = this.numero(r.bruto);
    const desconto = this.numero(r.desconto);
    const taxa = this.numero(r.taxa);
    if (!r.descricao.trim()) {
      this.erro = 'Informe a descrição do lançamento.';
      return;
    }
    if (!r.data) {
      this.erro = 'Informe a data do lançamento.';
      return;
    }
    if (!(bruto > 0)) {
      this.erro = 'O valor precisa ser maior que zero.';
      return;
    }
    if (desconto < 0 || taxa < 0 || desconto + taxa > bruto) {
      this.erro = 'Desconto e taxa não podem passar do valor nem ser negativos.';
      return;
    }
    let status: Status = 'pendente';
    if (r.jaEntrou) {
      status = r.tipo === 'receita' ? 'recebido' : 'paga';
    } else if (r.vencimento && r.vencimento < this.hojeIso) {
      status = r.tipo === 'receita' ? 'vencido' : 'vencida';
    }
    this.lancamentos = [
      {
        id: this.seq++,
        tipo: r.tipo,
        data: r.data,
        descricao: r.descricao.trim(),
        categoria: r.categoria,
        grupo: r.tipo === 'despesa' ? r.grupo : 'Receitas',
        bruto,
        desconto,
        taxa,
        status,
        vencimento: r.vencimento || r.data,
        forma: r.tipo === 'receita' ? r.forma : '',
        pessoa: r.pessoa.trim() || (r.tipo === 'receita' ? 'Cliente' : 'Fornecedor'),
        recorrencia: r.recorrencia,
      },
      ...this.lancamentos,
    ];
    this.aviso = r.tipo === 'receita' ? 'Receita lançada.' : 'Despesa lançada.';
    this.fechar();
  }

  quitar(item: Lancamento): void {
    item.status = item.tipo === 'receita' ? 'recebido' : 'paga';
    this.confirmacao = '';
    this.aviso = item.tipo === 'receita' ? 'Conta marcada como recebida.' : 'Conta marcada como paga.';
    this.lancamentos = [...this.lancamentos];
  }

  pedir(acao: 'estornar' | 'cancelar', item: Lancamento): void {
    this.confirmacao = `${acao}:${item.id}`;
  }

  estornar(item: Lancamento): void {
    item.status = 'estornado';
    this.confirmacao = '';
    this.aviso = 'Lançamento estornado.';
    this.lancamentos = [...this.lancamentos];
  }

  cancelar(item: Lancamento): void {
    item.status = 'cancelado';
    this.confirmacao = '';
    this.aviso = 'Lançamento cancelado.';
    this.lancamentos = [...this.lancamentos];
  }

  exportarExcel(): void {
    const linhas = [
      ['Data', 'Tipo', 'Descrição', 'Categoria', 'Pessoa', 'Valor', 'Status', 'Vencimento'],
      ...this.lancamentos.map((item) => [
        this.formatar(item.data),
        item.tipo,
        item.descricao,
        item.categoria,
        item.pessoa,
        this.liquido(item).toFixed(2).replace('.', ','),
        this.rotuloStatus(item.status),
        this.formatar(item.vencimento),
      ]),
    ];
    const csv = linhas.map((linha) => linha.map((celula) => `"${String(celula).replaceAll('"', '""')}"`).join(';')).join('\n');
    this.baixar('financeiro.csv', `\uFEFF${csv}`, 'text/csv;charset=utf-8');
    this.aviso = 'Planilha gerada.';
  }

  exportarPdf(): void {
    const janela = window.open('', '_blank', 'noopener,noreferrer');
    if (!janela) {
      this.erro = 'O navegador bloqueou o relatório. Permita pop-ups neste site e tente de novo.';
      return;
    }
    const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    janela.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Financeiro</title>
      <style>body{font-family:Montserrat,sans-serif;color:#1c3112;padding:32px}table{border-collapse:collapse;width:100%;margin-top:16px}td{border-bottom:1px solid #ddd;padding:8px}</style>
      </head><body><h1>Financeiro</h1>
      <p>Recebido ${moeda(this.recebido)} · A receber ${moeda(this.aReceber)} · Despesas ${moeda(this.totalDespesas)} · Lucro ${moeda(this.lucro)}</p>
      </body></html>`);
    janela.document.close();
    janela.focus();
    janela.print();
  }

  formatar(iso: string): string {
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  liquido(item: Lancamento): number {
    return Math.max(0, item.bruto - item.desconto - item.taxa);
  }

  emAberto(item: Lancamento): boolean {
    return item.status === 'pendente' || item.status === 'vencido' || item.status === 'vencida';
  }

  podeQuitar(item: Lancamento): boolean {
    return this.emAberto(item);
  }

  podeEstornar(item: Lancamento): boolean {
    return item.status === 'recebido' || item.status === 'paga';
  }

  podeCancelar(item: Lancamento): boolean {
    return this.emAberto(item);
  }

  rotuloStatus(status: Status): string {
    const nomes: Record<Status, string> = {
      recebido: 'Recebido',
      pendente: 'Pendente',
      vencido: 'Vencido',
      paga: 'Paga',
      vencida: 'Vencida',
      cancelado: 'Cancelado',
      estornado: 'Estornado',
    };
    return nomes[status];
  }

  private agrupar(lista: Lancamento[], chave: (item: Lancamento) => string): { nome: string; valor: number }[] {
    const mapa = new Map<string, number>();
    for (const item of lista) {
      const nome = chave(item);
      mapa.set(nome, (mapa.get(nome) ?? 0) + this.liquido(item));
    }
    return [...mapa.entries()].filter(([, valor]) => valor > 0).map(([nome, valor]) => ({ nome, valor }));
  }

  private rascunhoVazio(tipo: Tipo = 'receita'): Rascunho {
    return {
      tipo,
      data: this.hojeIso,
      descricao: '',
      grupo: 'Fixas',
      categoria: tipo === 'receita' ? 'Serviços' : 'Aluguel',
      bruto: '',
      desconto: '',
      taxa: '',
      vencimento: this.hojeIso,
      forma: 'Pix',
      pessoa: '',
      recorrencia: 'única',
      jaEntrou: tipo === 'receita',
    };
  }

  private numero(valor: string): number {
    return Number(String(valor).replace(',', '.')) || 0;
  }

  private iso(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private baixar(nome: string, conteudo: string, tipo: string): void {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nome;
    link.click();
    URL.revokeObjectURL(url);
  }
}
