import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AnamneseCapilar,
  anamneseVazia,
  Cliente,
  dataIso,
  FichaVisita,
  FotoVisita,
  linkWhatsapp,
  ProcedimentoFicha,
  PROCEDIMENTOS_FICHA,
  SalaoEstadoService,
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
  readonly procedimentos = PROCEDIMENTOS_FICHA;

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
  fichaFotos: FotoVisita[] = [];

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

  procedimentoAtivo(tipo: ProcedimentoFicha): boolean {
    return this.anamnese.procedimentos.includes(tipo);
  }

  alternarProcedimento(tipo: ProcedimentoFicha, marcado: boolean): void {
    if (marcado) {
      this.anamnese.procedimentos = [...this.anamnese.procedimentos, tipo];
      return;
    }
    this.anamnese.procedimentos = this.anamnese.procedimentos.filter((item) => item !== tipo);
  }

  get progressivaTexto(): string {
    if (this.anamnese.temProgressiva === true) {
      return 'sim';
    }
    if (this.anamnese.temProgressiva === false) {
      return 'nao';
    }
    return '';
  }

  definirProgressiva(valor: string): void {
    if (valor === 'sim') {
      this.anamnese.temProgressiva = true;
      return;
    }
    this.anamnese.temProgressiva = valor === 'nao' ? false : null;
    this.anamnese.formol = '';
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
    this.fichaFotos = [];
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
      fotos: this.fichaFotos,
      valor: Number(this.fichaValor ?? 0),
    });
    if (!resultado.ok) {
      this.erroFicha = resultado.mensagem;
      return;
    }
    this.mostrarFicha = false;
    this.aba = 'atendimentos';
  }

  async escolherFoto(event: Event, momento: 'antes' | 'depois'): Promise<void> {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    if (!arquivo) {
      return;
    }
    if (!arquivo.type.startsWith('image/')) {
      this.erroFicha = 'Escolha um arquivo de imagem.';
      return;
    }
    if (arquivo.size > 1_200_000) {
      this.erroFicha = 'Cada foto precisa ter menos de 1,2 MB.';
      return;
    }
    const dados = await this.lerArquivo(arquivo);
    const demais = this.fichaFotos.filter((foto) => foto.momento !== momento);
    this.fichaFotos = [...demais, { id: `${momento}-${Date.now()}`, momento, dados }];
    this.erroFicha = '';
  }

  fotoDe(momento: 'antes' | 'depois'): FotoVisita | undefined {
    return this.fichaFotos.find((foto) => foto.momento === momento);
  }

  fotosDaFicha(ficha: FichaVisita, momento: 'antes' | 'depois'): FotoVisita[] {
    return ficha.fotos.filter((foto) => foto.momento === momento);
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

  private lerArquivo(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(String(leitor.result ?? ''));
      leitor.onerror = () => reject(leitor.error);
      leitor.readAsDataURL(arquivo);
    });
  }
}
