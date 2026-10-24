import { Component, HostListener, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BloqueioAgenda,
  CategoriaSalao,
  FormaConfigurada,
  HorarioFuncionamento,
  MODULOS_ACESSO,
  ModuloAcesso,
  SalaoEstadoService,
  TipoCategoria,
  UsuarioSalao,
  nomeDia as rotuloDia,
} from '../../core/salao-estado.service';
import { Notificacoes } from '../notificacoes/notificacoes';

type Aba = 'salao' | 'horarios' | 'bloqueios' | 'senha' | 'usuarios' | 'categorias' | 'formas' | 'taxas' | 'desconto' | 'backup';
type Painel =
  | 'bloqueio'
  | 'remover'
  | 'usuario'
  | 'acessos'
  | 'status-usuario'
  | 'categoria'
  | 'remover-categoria'
  | 'restaurar'
  | null;

@Component({
  selector: 'app-configuracoes',
  imports: [FormsModule, DecimalPipe, Notificacoes],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {
  private readonly estado = inject(SalaoEstadoService);

  readonly usuario = this.estado.usuarioAtual;
  readonly opcoes: { id: Aba; nome: string; texto: string }[] = [
    {
      id: 'salao',
      nome: 'Dados do salão',
      texto: 'Nome, telefone e endereço do estúdio.',
    },
    {
      id: 'horarios',
      nome: 'Horários',
      texto: 'Abertura e fechamento de cada dia da semana.',
    },
    {
      id: 'bloqueios',
      nome: 'Bloqueios',
      texto: 'Feriados, folgas e horários fechados.',
    },
    {
      id: 'senha',
      nome: 'Senha',
      texto: 'Senha da conta usada nesta sessão.',
    },
    {
      id: 'usuarios',
      nome: 'Usuários e permissões',
      texto: 'Funcionárias, situação da conta e telas liberadas.',
    },
    {
      id: 'categorias',
      nome: 'Categorias',
      texto: 'Grupos de estoque e de despesa.',
    },
    {
      id: 'formas',
      nome: 'Formas de pagamento',
      texto: 'Pix, dinheiro, débito, crédito e parcelas.',
    },
    {
      id: 'taxas',
      nome: 'Taxas da maquininha',
      texto: 'Porcentagem descontada do lucro de cada forma.',
    },
    {
      id: 'desconto',
      nome: 'Desconto máximo',
      texto: 'Teto do desconto que o caixa pode aplicar numa venda.',
    },
    {
      id: 'backup',
      nome: 'Backup e exportação',
      texto: 'Cópia dos cadastros e dos movimentos desta sessão.',
    },
  ];

  readonly modulos = MODULOS_ACESSO;

  aba: Aba | null = null;
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

  usuarioAlvo: UsuarioSalao | null = null;
  nomeUsuario = '';
  acessosMarcados: ModuloAcesso[] = [];

  tipoCategoria: TipoCategoria = 'estoque';
  categoriaAlvo: CategoriaSalao | null = null;
  nomeCategoria = '';

  formasEdicao: FormaConfigurada[] = [];
  nomeSalao = '';
  telefoneSalao = '';
  enderecoSalao = '';
  descontoMaximo = this.estado.descontoMaximoPercentual;
  textoBackup = '';

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
    if (this.painel === 'usuario') {
      return 'Nova funcionária';
    }
    if (this.painel === 'acessos') {
      return 'Acesso';
    }
    if (this.painel === 'status-usuario') {
      return this.usuarioAlvo?.ativo ? 'Desativar funcionária' : 'Reativar funcionária';
    }
    if (this.painel === 'remover-categoria') {
      return 'Remover categoria';
    }
    if (this.painel === 'restaurar') {
      return 'Restaurar backup';
    }
    if (this.painel === 'categoria') {
      if (this.categoriaAlvo) {
        return 'Editar categoria';
      }
      return this.tipoCategoria === 'estoque' ? 'Nova categoria de estoque' : 'Nova categoria de despesa';
    }
    return this.editandoId ? 'Editar bloqueio' : 'Novo bloqueio';
  }

  get usuarios(): UsuarioSalao[] {
    return this.estado.listarUsuarios();
  }

  get categoriasVisiveis(): CategoriaSalao[] {
    return this.estado.listarCategorias(this.tipoCategoria);
  }

  get exemploDesconto(): number {
    const percentual = Number(this.descontoMaximo);
    if (!Number.isFinite(percentual)) {
      return 0;
    }
    return Math.round(Math.min(100, Math.max(0, percentual)) * 100) / 100;
  }

  nomeDia(dia: number): string {
    return rotuloDia(dia);
  }

  mudarAba(aba: Aba): void {
    this.aba = aba;
    this.erro = '';
    this.aviso = '';
    this.fecharPainel();
    if (aba === 'formas' || aba === 'taxas') {
      this.formasEdicao = this.estado.listarFormas();
    }
    if (aba === 'salao') {
      const dados = this.estado.listarDadosSalao();
      this.nomeSalao = dados.nome;
      this.telefoneSalao = dados.telefone;
      this.enderecoSalao = dados.endereco;
    }
    if (aba === 'desconto') {
      this.descontoMaximo = this.estado.descontoMaximoPercentual;
    }
  }

  voltar(): void {
    this.aba = null;
    this.erro = '';
    this.aviso = '';
    this.fecharPainel();
  }

  alternarDia(horario: HorarioFuncionamento): void {
    horario.ativo = !horario.ativo;
    this.aviso = '';
  }

  async salvarSalao(): Promise<void> {
    const resultado = await this.estado.salvarDadosSalao({
      nome: this.nomeSalao,
      telefone: this.telefoneSalao,
      endereco: this.enderecoSalao,
    });
    this.erro = resultado.ok ? '' : resultado.mensagem;
    this.aviso = resultado.ok ? resultado.mensagem : '';
    if (resultado.ok) {
      const dados = this.estado.listarDadosSalao();
      this.nomeSalao = dados.nome;
      this.telefoneSalao = dados.telefone;
      this.enderecoSalao = dados.endereco;
    }
  }

  async salvarDesconto(): Promise<void> {
    const resultado = await this.estado.salvarDescontoMaximo(this.descontoMaximo);
    this.erro = resultado.ok ? '' : resultado.mensagem;
    this.aviso = resultado.ok ? resultado.mensagem : '';
    if (resultado.ok) {
      this.descontoMaximo = this.estado.descontoMaximoPercentual;
    }
  }

  async salvarHorarios(): Promise<void> {
    const resultado = await this.estado.salvarHorarios(this.horarios);
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
    this.usuarioAlvo = null;
    this.categoriaAlvo = null;
  }

  async salvarBloqueio(): Promise<void> {
    const resultado = await this.estado.salvarBloqueio({
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

  async confirmarRemocao(): Promise<void> {
    if (!this.alvo) {
      return;
    }
    const resultado = await this.estado.removerBloqueio(this.alvo.id);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  abrirUsuario(): void {
    this.usuarioAlvo = null;
    this.nomeUsuario = '';
    this.acessosMarcados = ['inicio', 'agenda', 'clientes', 'caixa'];
    this.erro = '';
    this.painel = 'usuario';
  }

  abrirAcessos(usuario: UsuarioSalao): void {
    if (usuario.perfil === 'ADMIN') {
      return;
    }
    this.usuarioAlvo = usuario;
    this.acessosMarcados = [...usuario.acessos];
    this.erro = '';
    this.painel = 'acessos';
  }

  abrirStatusUsuario(usuario: UsuarioSalao): void {
    if (usuario.perfil === 'ADMIN') {
      return;
    }
    this.usuarioAlvo = usuario;
    this.erro = '';
    this.painel = 'status-usuario';
  }

  temAcesso(id: ModuloAcesso): boolean {
    return this.acessosMarcados.includes(id);
  }

  alternarAcesso(id: ModuloAcesso, evento: Event): void {
    const marcado = (evento.target as HTMLInputElement).checked;
    if (marcado) {
      this.acessosMarcados = [...this.acessosMarcados, id];
      return;
    }
    this.acessosMarcados = this.acessosMarcados.filter((acesso) => acesso !== id);
  }

  async salvarUsuario(): Promise<void> {
    const resultado = await this.estado.cadastrarOperador({
      nome: this.nomeUsuario,
      acessos: this.acessosMarcados,
    });
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  async salvarAcessos(): Promise<void> {
    if (!this.usuarioAlvo) {
      return;
    }
    const resultado = await this.estado.definirAcessos(this.usuarioAlvo.id, this.acessosMarcados);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  async confirmarStatusUsuario(): Promise<void> {
    if (!this.usuarioAlvo) {
      return;
    }
    const resultado = await this.estado.definirUsuarioAtivo(this.usuarioAlvo.id, !this.usuarioAlvo.ativo);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  resumoAcessos(usuario: UsuarioSalao): string {
    if (usuario.perfil === 'ADMIN') {
      return 'Todas as telas';
    }
    const nomes = this.modulos.filter((modulo) => usuario.acessos.includes(modulo.id)).map((modulo) => modulo.nome);
    if (nomes.length === 0) {
      return 'Nenhuma tela';
    }
    if (nomes.length <= 3) {
      return nomes.join(', ');
    }
    return `${nomes.slice(0, 2).join(', ')} e mais ${nomes.length - 2}`;
  }

  rotuloPerfil(usuario: UsuarioSalao): string {
    return usuario.perfil === 'ADMIN' ? 'Administradora' : 'Operador';
  }

  mudarTipoCategoria(tipo: TipoCategoria): void {
    this.tipoCategoria = tipo;
    this.erro = '';
    this.aviso = '';
    this.fecharPainel();
  }

  abrirCategoria(): void {
    this.categoriaAlvo = null;
    this.nomeCategoria = '';
    this.erro = '';
    this.painel = 'categoria';
  }

  abrirEdicaoCategoria(categoria: CategoriaSalao): void {
    this.categoriaAlvo = categoria;
    this.nomeCategoria = categoria.nome;
    this.erro = '';
    this.painel = 'categoria';
  }

  abrirRemocaoCategoria(categoria: CategoriaSalao): void {
    if (categoria.tipo === 'estoque' && this.estado.produtosNaCategoria(categoria.nome) > 0) {
      this.erro = 'Esta categoria ainda tem produtos no estoque.';
      this.aviso = '';
      return;
    }
    this.categoriaAlvo = categoria;
    this.erro = '';
    this.painel = 'remover-categoria';
  }

  async salvarCategoria(): Promise<void> {
    const resultado = await this.estado.salvarCategoria({
      id: this.categoriaAlvo?.id,
      nome: this.nomeCategoria,
      tipo: this.tipoCategoria,
    });
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  async confirmarRemocaoCategoria(): Promise<void> {
    if (!this.categoriaAlvo) {
      return;
    }
    const resultado = await this.estado.removerCategoria(this.categoriaAlvo.id);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  produtosDaCategoria(nome: string): number {
    return this.estado.produtosNaCategoria(nome);
  }

  alternarForma(forma: FormaConfigurada): void {
    forma.ativa = !forma.ativa;
    this.aviso = '';
  }

  async salvarFormas(): Promise<void> {
    const resultado = await this.estado.salvarFormas(this.formasEdicao);
    this.erro = resultado.ok ? '' : resultado.mensagem;
    this.aviso = resultado.ok ? resultado.mensagem : '';
    if (resultado.ok) {
      this.formasEdicao = this.estado.listarFormas();
    }
  }

  async salvarTaxas(): Promise<void> {
    const resultado = await this.estado.salvarTaxas(this.formasEdicao);
    this.erro = resultado.ok ? '' : resultado.mensagem;
    this.aviso = resultado.ok ? resultado.mensagem : '';
    if (resultado.ok) {
      this.formasEdicao = this.estado.listarFormas();
    }
  }

  exemploTaxa(forma: FormaConfigurada): number {
    const taxa = Number(forma.taxaPercentual);
    if (!Number.isFinite(taxa)) {
      return 0;
    }
    return Math.round(taxa * 100) / 100;
  }

  async exportarBackup(): Promise<void> {
    const conteudo = await this.estado.exportarDados();
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }));
    const link = document.createElement('a');
    const dia = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `backup-eula-moraes-${dia}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.erro = '';
    this.aviso = 'Backup exportado.';
  }

  escolherBackup(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    if (!arquivo) {
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => {
      this.textoBackup = String(leitor.result ?? '');
      this.erro = '';
      this.painel = 'restaurar';
    };
    leitor.readAsText(arquivo);
  }

  async confirmarRestauracao(): Promise<void> {
    const resultado = await this.estado.restaurarDados(this.textoBackup);
    if (!resultado.ok) {
      this.erro = resultado.mensagem;
      return;
    }
    this.horarios = this.estado.listarHorarios();
    this.formasEdicao = this.estado.listarFormas();
    const dados = this.estado.listarDadosSalao();
    this.nomeSalao = dados.nome;
    this.telefoneSalao = dados.telefone;
    this.enderecoSalao = dados.endereco;
    this.descontoMaximo = this.estado.descontoMaximoPercentual;
    this.textoBackup = '';
    this.aviso = resultado.mensagem;
    this.fecharPainel();
  }

  async alterarSenha(): Promise<void> {
    const resultado = await this.estado.alterarSenha({
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
