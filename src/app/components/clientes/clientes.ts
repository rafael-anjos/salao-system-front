import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AnamneseCapilar,
  anamneseVazia,
  Cliente,
  CONDICOES_CABELO,
  CondicaoCabelo,
  COUROS_CABELUDOS,
  dataIso,
  FichaVisita,
  linkWhatsapp,
  SalaoEstadoService,
  TIPOS_CABELO,
  TIPOS_QUIMICA,
  TipoQuimica,
} from '../../core/salao-estado.service';

type FiltroCliente = 'todos' | 'aniversario' | 'retorno-30' | 'retorno-60' | 'retorno-90' | 'inativos';
type AbaPerfil = 'resumo' | 'anamnese' | 'atendimentos';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit, OnDestroy {
  readonly estado = inject(SalaoEstadoService);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private assinatura: Subscription | null = null;

  readonly filtros: { id: FiltroCliente; nome: string }[] = [
    { id: 'todos', nome: 'Todos' },
    { id: 'aniversario', nome: 'Aniversariantes do mês' },
    { id: 'retorno-30', nome: 'Sem retorno há 30 dias' },
    { id: 'retorno-60', nome: 'Sem retorno há 60 dias' },
    { id: 'retorno-90', nome: 'Sem retorno há 90 dias' },
    { id: 'inativos', nome: 'Inativos' },
  ];
  readonly tiposCabelo = TIPOS_CABELO;
  readonly couros = COUROS_CABELUDOS;
  readonly quimicas = TIPOS_QUIMICA;
  readonly condicoesOpcoes = CONDICOES_CABELO;

  filtro: FiltroCliente = 'todos';
  termo = '';
  clienteId: string | null = null;
  aba: AbaPerfil = 'resumo';

  mostrarCadastro = false;
  editandoId = '';
  nome = '';
  telefone = '';
  nascimento = '';
  email = '';
  observacoes = '';
  tagsTexto = '';
  consentimento = false;
  inativa = false;
  erroCadastro = '';

  anamnese: AnamneseCapilar = anamneseVazia();
  consentimentoAnamnese = false;
  erroAnamnese = '';
  avisoAnamnese = '';

  mostrarFicha = false;
  erroFicha = '';
  fichaData = '';
  fichaServico = '';
  fichaProfissional = '';
  fichaObservacoes = '';
  fichaRetorno = '';
  fichaValor: number | null = null;

  ngOnInit(): void {
    this.assinatura = this.rota.paramMap.subscribe((params) => {
      this.clienteId = params.get('id');
      this.aba = 'resumo';
      this.erroAnamnese = '';
      this.avisoAnamnese = '';
      this.copiarAnamnese();
    });
  }

  ngOnDestroy(): void {
    this.assinatura?.unsubscribe();
  }

  get cliente(): Cliente | undefined {
    return this.estado.clientes.find((item) => item.id === this.clienteId);
  }

  get formula(): FichaVisita | null {
    return this.cliente ? this.estado.ultimaFormula(this.cliente.id) : null;
  }

  get resumo() {
    return this.cliente ? this.estado.resumoCliente(this.cliente.id) : null;
  }

  get fichas(): FichaVisita[] {
    return this.cliente ? this.estado.fichasDaCliente(this.cliente.id) : [];
  }

  get clientesVisiveis(): Cliente[] {
    const termo = this.termo.trim().toLowerCase();
    const digitos = this.termo.replace(/\D/g, '');
    const mes = String(new Date().getMonth() + 1).padStart(2, '0');
    return this.estado.clientes
      .filter((cliente) => {
        if (termo) {
          const nome = cliente.nome.toLowerCase().includes(termo);
          const telefone = !!digitos && cliente.telefone.replace(/\D/g, '').includes(digitos);
          if (!nome && !telefone) {
            return false;
          }
        }
        if (this.filtro === 'inativos') {
          return !cliente.ativo;
        }
        if (this.filtro === 'aniversario') {
          return cliente.nascimento.slice(5, 7) === mes;
        }
        if (this.filtro.startsWith('retorno-')) {
          const limite = Number(this.filtro.slice(8));
          const dias = this.diasSemVisita(cliente.id);
          return cliente.ativo && dias !== null && dias >= limite;
        }
        return true;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  get mensagemPronta(): boolean {
    return this.filtro === 'aniversario' || this.filtro.startsWith('retorno-');
  }

  get tituloCadastro(): string {
    return this.editandoId ? 'Editar cliente' : 'Novo cliente';
  }

  abrirCadastro(): void {
    this.editandoId = '';
    this.nome = '';
    this.telefone = '';
    this.nascimento = '';
    this.email = '';
    this.observacoes = '';
    this.tagsTexto = '';
    this.consentimento = false;
    this.inativa = false;
    this.erroCadastro = '';
    this.mostrarCadastro = true;
  }

  abrirEdicao(cliente: Cliente): void {
    this.editandoId = cliente.id;
    this.nome = cliente.nome;
    this.telefone = cliente.telefone;
    this.nascimento = cliente.nascimento;
    this.email = cliente.email;
    this.observacoes = cliente.observacoes;
    this.tagsTexto = cliente.tags.join(', ');
    this.consentimento = cliente.consentimentoSaude;
    this.inativa = !cliente.ativo;
    this.erroCadastro = '';
    this.mostrarCadastro = true;
  }

  fecharCadastro(): void {
    this.mostrarCadastro = false;
  }

  salvarCadastro(): void {
    const resultado = this.estado.salvarCliente({
      id: this.editandoId || undefined,
      nome: this.nome,
      telefone: this.telefone,
      nascimento: this.nascimento,
      email: this.email,
      observacoes: this.observacoes,
      tags: this.tagsTexto.split(',').map((tag) => tag.trim()).filter(Boolean),
      consentimentoSaude: this.consentimento,
      ativo: !this.inativa,
    });
    if (!resultado.ok) {
      this.erroCadastro = resultado.mensagem;
      return;
    }
    this.mostrarCadastro = false;
    if (!this.editandoId && resultado.id) {
      void this.router.navigate(['/clientes', resultado.id]);
    }
  }

  abrirPerfil(cliente: Cliente): void {
    void this.router.navigate(['/clientes', cliente.id]);
  }

  voltarLista(): void {
    void this.router.navigate(['/clientes']);
  }

  agendar(cliente: Cliente): void {
    void this.router.navigate(['/agenda'], { queryParams: { cliente: cliente.id } });
  }

  abrirWhatsapp(cliente: Cliente, comTexto = false): void {
    if (!cliente.telefone) {
      return;
    }
    const texto = comTexto ? this.textoMensagem(cliente) : '';
    window.open(linkWhatsapp(cliente.telefone, texto), '_blank', 'noopener');
  }

  textoMensagem(cliente: Cliente): string {
    const nome = cliente.nome.split(' ')[0];
    if (this.filtro === 'aniversario') {
      return `Olá, ${nome}! Aqui é a Paula, do Eula Moraes Studio. Feliz aniversário! Quando quiser, reservo um horário para você.`;
    }
    return `Olá, ${nome}! Aqui é a Paula, do Eula Moraes Studio. Já faz um tempo desde o seu último atendimento. Quer marcar o retoque?`;
  }

  resumoDe(cliente: Cliente) {
    return this.estado.resumoCliente(cliente.id);
  }

  formatarDia(iso: string | null | undefined): string {
    if (!iso || iso.length < 10) {
      return 'Não informado';
    }
    return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
  }

  salvarAnamnese(): void {
    if (!this.cliente) {
      return;
    }
    const resultado = this.estado.salvarAnamnese(this.cliente.id, this.anamnese, this.consentimentoAnamnese);
    if (!resultado.ok) {
      this.erroAnamnese = resultado.mensagem;
      this.avisoAnamnese = '';
      return;
    }
    this.erroAnamnese = '';
    this.avisoAnamnese = resultado.mensagem;
    this.copiarAnamnese();
  }

  quimicaAtiva(tipo: TipoQuimica): boolean {
    return this.anamnese.quimica.some((item) => item.tipo === tipo);
  }

  alternarQuimica(tipo: TipoQuimica, marcado: boolean): void {
    if (marcado) {
      this.anamnese.quimica = [...this.anamnese.quimica, { tipo, dataAproximada: '' }];
      return;
    }
    this.anamnese.quimica = this.anamnese.quimica.filter((item) => item.tipo !== tipo);
  }

  dataQuimica(tipo: TipoQuimica): string {
    return this.anamnese.quimica.find((item) => item.tipo === tipo)?.dataAproximada ?? '';
  }

  definirDataQuimica(tipo: TipoQuimica, valor: string): void {
    const atual = this.anamnese.quimica.find((item) => item.tipo === tipo);
    if (atual) {
      atual.dataAproximada = valor;
    }
  }

  condicaoAtiva(condicao: CondicaoCabelo): boolean {
    return this.anamnese.condicoes.includes(condicao);
  }

  alternarCondicao(condicao: CondicaoCabelo, marcado: boolean): void {
    if (marcado) {
      this.anamnese.condicoes = [...this.anamnese.condicoes, condicao];
      return;
    }
    this.anamnese.condicoes = this.anamnese.condicoes.filter((item) => item !== condicao);
  }

  abrirFicha(): void {
    const cliente = this.cliente;
    if (!cliente) {
      return;
    }
    const profissional = this.estado.profissionais.find((item) => item.nome === this.estado.usuarioAtual);
    this.fichaData = dataIso();
    this.fichaServico = this.estado.listarServicos(true)[0]?.nome ?? '';
    this.fichaProfissional = profissional?.nome ?? this.estado.listarProfissionais(true)[0]?.nome ?? '';
    this.fichaObservacoes = '';
    this.fichaRetorno = '';
    this.fichaValor = null;
    this.erroFicha = '';
    this.mostrarFicha = true;
  }

  fecharFicha(): void {
    this.mostrarFicha = false;
  }

  salvarFicha(): void {
    if (!this.cliente) {
      return;
    }
    const resultado = this.estado.salvarFicha({
      clienteId: this.cliente.id,
      data: this.fichaData,
      servico: this.fichaServico,
      profissional: this.fichaProfissional,
      produtos: [],
      observacoes: this.fichaObservacoes,
      retorno: this.fichaRetorno,
      fotos: [],
      valor: Number(this.fichaValor ?? 0),
    });
    if (!resultado.ok) {
      this.erroFicha = resultado.mensagem;
      return;
    }
    this.mostrarFicha = false;
    this.aba = 'atendimentos';
  }

  @HostListener('document:keydown.escape')
  fecharPorTecla(): void {
    if (this.mostrarFicha) {
      this.fecharFicha();
      return;
    }
    if (this.mostrarCadastro) {
      this.fecharCadastro();
    }
  }

  private copiarAnamnese(): void {
    const cliente = this.cliente;
    if (!cliente) {
      return;
    }
    this.anamnese = structuredClone(cliente.anamnese);
    this.consentimentoAnamnese = cliente.consentimentoSaude;
  }

  private diasSemVisita(clienteId: string): number | null {
    const ultima = this.estado.resumoCliente(clienteId).ultimaVisita;
    if (!ultima) {
      return null;
    }
    const visita = new Date(`${ultima}T12:00:00`);
    const hoje = new Date();
    hoje.setHours(12, 0, 0, 0);
    return Math.floor((hoje.getTime() - visita.getTime()) / 86_400_000);
  }

}
