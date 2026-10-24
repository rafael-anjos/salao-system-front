import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FichaAtendimento,
  PROCEDIMENTOS_ATENDIMENTO,
  ProcedimentoAtendimento,
  ProgressivaAtendimento,
  SalaoEstadoService,
  dataIso,
} from '../../core/salao-estado.service';

@Component({
  selector: 'app-ficha-atendimento',
  imports: [FormsModule],
  templateUrl: './ficha-atendimento.html',
  styleUrl: './ficha-atendimento.css',
})
export class FichaAtendimentoPainel implements OnChanges {
  readonly estado = inject(SalaoEstadoService);
  readonly procedimentos = PROCEDIMENTOS_ATENDIMENTO;

  @Input() clienteId = '';
  @Input() fichaId = '';
  @Input() agendamentoId = '';
  @Input() atendimentoId = '';
  @Input() vinculo = '';
  @Input() data = '';
  @Input() somenteLeitura = false;
  @Input() permitirReabrir = false;
  @Input() copia: FichaAtendimento | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salva = new EventEmitter<string>();

  escolhidos: ProcedimentoAtendimento[] = [];
  cor = '';
  progressiva: ProgressivaAtendimento = '';
  temAlergia = false;
  alergia = '';
  observacoes = '';
  erro = '';
  aviso = '';
  reaberta = false;
  pedindoSenha = false;
  senhaAdmin = '';
  erroSenha = '';
  private ignorarCarga = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ignorarCarga && changes['fichaId'] && !changes['copia'] && !changes['clienteId']) {
      this.ignorarCarga = false;
      return;
    }
    if (changes['fichaId'] || changes['copia'] || changes['clienteId'] || changes['data']) {
      this.ignorarCarga = false;
      this.carregar();
    }
  }

  get atual(): FichaAtendimento | undefined {
    return this.estado.fichasAtendimento.find((ficha) => ficha.id === this.fichaId);
  }

  get travada(): boolean {
    if (this.reaberta) {
      return false;
    }
    if (this.somenteLeitura) {
      return true;
    }
    const atual = this.atual;
    return !!atual && atual.status === 'finalizada' && atual.data !== dataIso();
  }

  get podeReabrir(): boolean {
    const atual = this.atual;
    return this.permitirReabrir && !!atual && atual.status === 'finalizada' && atual.data !== dataIso() && !this.reaberta;
  }

  get temAnterior(): boolean {
    return !!this.estado.ultimaFichaAtendimento(this.clienteId, this.fichaId || undefined);
  }

  get tituloEstado(): string {
    const atual = this.atual;
    if (!atual) {
      return 'Nova ficha deste atendimento';
    }
    if (atual.status === 'rascunho') {
      return 'Rascunho. Pode finalizar depois.';
    }
    if (this.travada) {
      return 'Finalizada. Só leitura.';
    }
    return 'Finalizada hoje. Ainda dá para ajustar.';
  }

  ativo(tipo: ProcedimentoAtendimento): boolean {
    return this.escolhidos.includes(tipo);
  }

  alternar(tipo: ProcedimentoAtendimento, marcado: boolean): void {
    if (this.travada) {
      return;
    }
    if (marcado) {
      this.escolhidos = [...this.escolhidos, tipo];
      return;
    }
    this.escolhidos = this.escolhidos.filter((item) => item !== tipo);
  }

  copiarUltima(): void {
    const ultima = this.estado.ultimaFichaAtendimento(this.clienteId, this.fichaId || undefined);
    if (!ultima || this.travada) {
      return;
    }
    this.aplicar(ultima);
  }

  async salvar(status: 'rascunho' | 'finalizada'): Promise<void> {
    if (this.travada) {
      return;
    }
    const alergia = this.temAlergia ? this.alergia.trim() : '';
    if (this.temAlergia && !alergia) {
      this.erro = 'Escreva qual é a alergia.';
      this.aviso = '';
      return;
    }
    if (status === 'finalizada' && this.escolhidos.length === 0) {
      this.erro = 'Marque ao menos um procedimento para finalizar.';
      this.aviso = '';
      return;
    }
    if (status === 'finalizada' && !this.progressiva) {
      this.erro = 'Informe se há progressiva no cabelo.';
      this.aviso = '';
      return;
    }
    const resultado = await this.estado.salvarFichaAtendimento(
      {
        id: this.fichaId || undefined,
        clienteId: this.clienteId,
        agendamentoId: this.agendamentoId || undefined,
        atendimentoId: this.atendimentoId || undefined,
        vinculo: this.vinculo || undefined,
        data: this.data || dataIso(),
        status: this.atual?.status === 'finalizada' ? 'finalizada' : status,
        procedimentos: this.escolhidos,
        cor: this.cor,
        progressiva: this.progressiva,
        alergia,
        observacoes: this.observacoes,
      },
      this.reaberta ? this.senhaAdmin : undefined,
    );
    if (!resultado.ok || !resultado.id) {
      this.erro = resultado.mensagem;
      this.aviso = '';
      return;
    }
    this.fichaId = resultado.id;
    this.erro = '';
    this.aviso = resultado.mensagem;
    this.ignorarCarga = true;
    this.salva.emit(resultado.id);
  }

  pedirSenha(): void {
    this.pedindoSenha = true;
    this.senhaAdmin = '';
    this.erroSenha = '';
  }

  confirmarSenha(): void {
    if (!this.senhaAdmin.trim()) {
      this.erroSenha = 'Informe a senha da administração.';
      return;
    }
    this.reaberta = true;
    this.pedindoSenha = false;
    this.erroSenha = '';
  }

  private carregar(): void {
    this.erro = '';
    this.aviso = '';
    this.reaberta = false;
    this.pedindoSenha = false;
    this.senhaAdmin = '';
    this.erroSenha = '';
    if (this.copia) {
      this.aplicar(this.copia);
      return;
    }
    const existente = this.fichaId
      ? this.estado.fichasAtendimento.find((ficha) => ficha.id === this.fichaId)
      : undefined;
    if (existente) {
      this.aplicar(existente);
      return;
    }
    const cliente = this.estado.clientes.find((item) => item.id === this.clienteId);
    this.escolhidos = [];
    this.cor = '';
    this.progressiva = '';
    this.alergia = cliente?.anamnese.alergias ?? '';
    this.temAlergia = !!this.alergia.trim();
    this.observacoes = '';
  }

  private aplicar(origem: FichaAtendimento): void {
    this.escolhidos = [...origem.procedimentos];
    this.cor = origem.cor;
    this.progressiva = origem.progressiva;
    this.alergia = origem.alergia;
    this.temAlergia = !!origem.alergia.trim();
    this.observacoes = origem.observacoes;
  }
}
