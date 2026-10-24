import type {
  AgendamentoDia,
  AnamneseCapilar,
  BloqueioAgenda,
  CaixaRegistro,
  CategoriaSalao,
  Cliente,
  ContaVisivel,
  DadosSalao,
  FichaAtendimento,
  FichaVisita,
  FormaConfigurada,
  FormaPagamento,
  HorarioFuncionamento,
  ItemMovimento,
  LinhaParticipacao,
  ModuloAcesso,
  Movimentacao,
  Notificacao,
  PagamentoRegistrado,
  ProcedimentoAtendimento,
  ProdutoEstoque,
  Profissional,
  ProgressivaAtendimento,
  Sangria,
  Servico,
  StatusAgendamento,
  StatusCaixa,
  StatusConta,
  StatusEstoque,
  TipoConta,
  TipoMovimento,
  TotaisPeriodo,
  UsuarioSalao,
} from '../salao-estado.service';
import type {
  AgendamentoApi,
  AnamneseApi,
  BloqueioApi,
  CaixaApi,
  CategoriaApi,
  ClienteApi,
  ContaVisivelApi,
  DadosSalaoApi,
  FichaAtendimentoApi,
  FichaVisitaApi,
  FormaConfigApi,
  HorarioApi,
  ItemMovimentoApi,
  LinhaParticipacaoApi,
  MovimentacaoApi,
  NotificacaoApi,
  PagamentoApi,
  ProdutoApi,
  ProfissionalApi,
  SangriaApi,
  ServicoApi,
  TotaisPeriodoApi,
  UsuarioApi,
} from './api.models';
import { dataDe, horaDe, idTexto, numeroDe, textoDe } from './api.util';

const FORMAS: FormaPagamento[] = ['Dinheiro', 'Pix', 'Cartão de débito', 'Cartão de crédito'];
const STATUS_AGENDA: StatusAgendamento[] = [
  'Confirmado',
  'Em andamento',
  'Aguardando',
  'Concluído',
  'Cancelado',
  'Falta',
];
const MODULOS: ModuloAcesso[] = [
  'inicio',
  'agenda',
  'clientes',
  'caixa',
  'financeiro',
  'estoque',
  'relatorios',
  'servicos',
  'profissionais',
  'configuracoes',
];
const PROCEDIMENTOS: ProcedimentoAtendimento[] = ['Coloração', 'Mechas', 'Correção de cor', 'Progressiva', 'Outro'];

function anamneseVazia(): AnamneseCapilar {
  return {
    tipoCabelo: '',
    comprimento: '',
    espessura: '',
    porosidade: '',
    couroCabeludo: '',
    quimica: [],
    condicoes: [],
    alergias: '',
    testeMecha: null,
    testeMechaData: '',
    observacoesSaude: '',
    cuidadosCasa: '',
    preferencias: '',
  };
}

export function mapearDadosSalao(api: DadosSalaoApi | undefined): DadosSalao {
  return {
    nome: textoDe(api?.nome) || 'Eula Moraes Studio',
    telefone: textoDe(api?.telefone),
    endereco: textoDe(api?.endereco),
  };
}

export function mapearHorario(api: HorarioApi): HorarioFuncionamento {
  return {
    dia: numeroDe(api.dia),
    abertura: horaDe(api.abertura) || '09:00',
    fechamento: horaDe(api.fechamento) || '19:00',
    ativo: api.ativo !== false,
  };
}

export function mapearForma(api: FormaConfigApi): FormaConfigurada | null {
  const forma = FORMAS.find((item) => item === api.forma);
  if (!forma) {
    return null;
  }
  return {
    forma,
    ativa: api.ativa !== false,
    taxaPercentual: numeroDe(api.taxaPercentual),
    maxParcelas: Math.max(1, Math.floor(numeroDe(api.maxParcelas, 1))),
  };
}

export function mapearUsuario(api: UsuarioApi): UsuarioSalao {
  return {
    id: idTexto(api.id),
    usuario: textoDe(api.usuario),
    nome: textoDe(api.nome),
    perfil: api.perfil === 'OPERADOR' ? 'OPERADOR' : 'ADMIN',
    ativo: api.ativo !== false,
    acessos: (api.acessos ?? []).filter((item): item is ModuloAcesso => MODULOS.includes(item as ModuloAcesso)),
  };
}

export function mapearAnamnese(api: AnamneseApi | undefined): AnamneseCapilar {
  const base = anamneseVazia();
  if (!api) {
    return base;
  }
  return {
    ...base,
    tipoCabelo: (api.tipoCabelo as AnamneseCapilar['tipoCabelo']) || '',
    comprimento: textoDe(api.comprimento),
    espessura: (api.espessura as AnamneseCapilar['espessura']) || '',
    porosidade: (api.porosidade as AnamneseCapilar['porosidade']) || '',
    couroCabeludo: (api.couroCabeludo as AnamneseCapilar['couroCabeludo']) || '',
    quimica: (api.quimica ?? [])
      .filter((item) => !!item.tipo)
      .map((item) => ({
        tipo: item.tipo as AnamneseCapilar['quimica'][number]['tipo'],
        dataAproximada: textoDe(item.dataAproximada),
      })),
    condicoes: (api.condicoes ?? []) as AnamneseCapilar['condicoes'],
    alergias: textoDe(api.alergias),
    testeMecha: api.testeMecha ?? null,
    testeMechaData: textoDe(api.testeMechaData),
    observacoesSaude: textoDe(api.observacoesSaude),
    cuidadosCasa: textoDe(api.cuidadosCasa),
    preferencias: textoDe(api.preferencias),
  };
}

export function mapearCliente(api: ClienteApi): Cliente {
  const anamnese = mapearAnamnese(api.anamnese);
  const saude = textoDe(api.observacoesSaude) || anamnese.observacoesSaude;
  anamnese.observacoesSaude = saude;
  return {
    id: idTexto(api.id),
    nome: textoDe(api.nome),
    telefone: textoDe(api.telefone),
    nascimento: dataDe(api.nascimento),
    email: textoDe(api.email),
    instagram: textoDe(api.instagram),
    observacoes: textoDe(api.observacoes),
    observacoesSaude: saude,
    consentimentoSaude: !!api.consentimentoSaude,
    tags: [...(api.tags ?? [])],
    ativo: api.ativo !== false,
    anamnese,
  };
}

export function mapearServico(api: ServicoApi): Servico {
  return {
    id: idTexto(api.id),
    nome: textoDe(api.nome),
    descricao: textoDe(api.descricao),
    preco: numeroDe(api.preco),
    duracaoMinutos: Math.max(1, Math.floor(numeroDe(api.duracaoMinutos, 60))),
    ativo: api.ativo !== false,
    legado: !!api.legado,
  };
}

export function mapearProfissional(api: ProfissionalApi): Profissional {
  return {
    id: idTexto(api.id),
    nome: textoDe(api.nome),
    telefone: textoDe(api.telefone),
    ativo: api.ativo !== false,
  };
}

export function mapearProduto(api: ProdutoApi): ProdutoEstoque {
  const status: StatusEstoque =
    api.status === 'critico' || api.status === 'baixo' || api.status === 'normal' ? api.status : 'normal';
  return {
    id: idTexto(api.id),
    nome: textoDe(api.nome),
    categoria: textoDe(api.categoriaNome || api.categoria),
    estoqueAtual: Math.floor(numeroDe(api.estoqueAtual)),
    estoqueMinimo: Math.floor(numeroDe(api.estoqueMinimo)),
    preco: numeroDe(api.preco ?? api.precoVenda),
    precoCusto: numeroDe(api.precoCusto),
    status,
    uso: api.uso === 'salao' ? 'salao' : 'venda',
    unidade: textoDe(api.unidade || api.unidadeMedida),
    codigoBarras: textoDe(api.codigoBarras),
  };
}

export function mapearCategoria(api: CategoriaApi): CategoriaSalao {
  return {
    id: idTexto(api.id),
    nome: textoDe(api.nome),
    tipo: api.tipo === 'despesa' ? 'despesa' : 'estoque',
  };
}

export function mapearAgendamento(api: AgendamentoApi): AgendamentoDia {
  const status = STATUS_AGENDA.includes(api.status as StatusAgendamento)
    ? (api.status as StatusAgendamento)
    : 'Confirmado';
  return {
    id: idTexto(api.id),
    data: dataDe(api.data),
    hora: horaDe(api.hora),
    cliente: textoDe(api.cliente),
    clienteId: idTexto(api.clienteId),
    servico: textoDe(api.servico),
    servicoId: idTexto(api.servicoId),
    profissional: textoDe(api.profissional),
    profissionalId: idTexto(api.profissionalId),
    status,
    preco: numeroDe(api.preco),
    observacao: textoDe(api.observacao) || undefined,
    vendaId: api.vendaId != null ? idTexto(api.vendaId) : undefined,
  };
}

export function mapearCaixa(api: CaixaApi): CaixaRegistro {
  const status: StatusCaixa = api.status === 'fechado' ? 'fechado' : 'aberto';
  return {
    id: idTexto(api.id),
    abertoEm: textoDe(api.dataAbertura),
    fechadoEm: api.dataFechamento || undefined,
    responsavelAbertura: textoDe(api.nomeProfissional),
    responsavelFechamento: status === 'fechado' ? textoDe(api.nomeProfissional) : undefined,
    saldoInicial: numeroDe(api.saldoInicial),
    status,
    valorContado: api.valorContado == null ? undefined : numeroDe(api.valorContado),
    diferencaDinheiro: api.diferencaDinheiro == null ? undefined : numeroDe(api.diferencaDinheiro),
  };
}

function mapearItem(api: ItemMovimentoApi): ItemMovimento {
  return {
    tipo: api.tipo === 'produto' ? 'produto' : 'servico',
    id: idTexto(api.id),
    nome: textoDe(api.nome),
    quantidade: Math.max(1, Math.floor(numeroDe(api.quantidade, 1))),
    precoUnitario: numeroDe(api.precoUnitario),
  };
}

function mapearPagamento(api: PagamentoApi): PagamentoRegistrado | null {
  const forma = FORMAS.find((item) => item === api.forma);
  if (!forma) {
    return null;
  }
  return {
    forma,
    valor: numeroDe(api.valor),
    parcelas: api.parcelas == null ? undefined : Math.floor(numeroDe(api.parcelas, 1)),
  };
}

export function mapearMovimentacao(api: MovimentacaoApi, responsavel = ''): Movimentacao {
  const tipo: TipoMovimento =
    api.tipo === 'entrada' || api.tipo === 'saida' || api.tipo === 'venda' || api.tipo === 'estorno'
      ? api.tipo
      : 'entrada';
  return {
    id: idTexto(api.id),
    caixaId: idTexto(api.caixaId),
    dataHora: textoDe(api.dataHora),
    tipo,
    descricao: textoDe(api.descricao),
    cliente: textoDe(api.cliente) || undefined,
    clienteId: api.clienteId != null ? idTexto(api.clienteId) : undefined,
    profissional: textoDe(api.profissional) || undefined,
    profissionalId: api.profissionalId != null ? idTexto(api.profissionalId) : undefined,
    itens: (api.itens ?? []).map(mapearItem),
    pagamentos: (api.pagamentos ?? []).map(mapearPagamento).filter((item): item is PagamentoRegistrado => !!item),
    valor: numeroDe(api.valor),
    desconto: numeroDe(api.desconto),
    responsavel,
    agendamentoId: api.agendamentoId != null ? idTexto(api.agendamentoId) : undefined,
  };
}

export function mapearBloqueio(api: BloqueioApi): BloqueioAgenda {
  const inicio = dataDe(api.dataInicio || api.data);
  return {
    id: idTexto(api.id),
    dataInicio: inicio,
    dataFim: dataDe(api.dataFim || inicio),
    horaInicio: horaDe(api.horaInicio),
    horaFim: horaDe(api.horaFim),
    diaInteiro: api.diaInteiro !== false && !api.horaInicio && !api.horaFim,
    motivo: textoDe(api.motivo),
  };
}

export function mapearNotificacao(api: NotificacaoApi): Notificacao {
  return {
    id: idTexto(api.id),
    titulo: textoDe(api.titulo) || 'Aviso',
    texto: textoDe(api.texto),
    data: dataDe(api.data),
    lida: !!api.lida,
  };
}

export function mapearConta(api: ContaVisivelApi): ContaVisivel {
  const tipo: TipoConta = api.tipo === 'parcelada' || api.tipo === 'avulsa' || api.tipo === 'fixa' ? api.tipo : 'avulsa';
  const status: StatusConta = api.status === 'pago' ? 'pago' : 'pendente';
  return {
    lancamentoId: idTexto(api.lancamentoId),
    contratoId: idTexto(api.contratoId),
    nome: textoDe(api.nome),
    valor: numeroDe(api.valor),
    vencimento: dataDe(api.vencimento),
    tipo,
    status,
    numeroParcela: api.numeroParcela == null ? undefined : Math.floor(numeroDe(api.numeroParcela)),
    parcelas: api.parcelas == null ? undefined : Math.floor(numeroDe(api.parcelas)),
    vencida: !!api.vencida,
    podeEncerrar: !!api.podeEncerrar,
  };
}

export function mapearSangria(api: SangriaApi): Sangria {
  return {
    id: idTexto(api.id),
    descricao: textoDe(api.descricao),
    valor: numeroDe(api.valor),
    data: dataDe(api.data),
  };
}

export function mapearFichaVisita(api: FichaVisitaApi): FichaVisita {
  return {
    id: idTexto(api.id),
    clienteId: idTexto(api.clienteId),
    agendamentoId: api.agendamentoId != null ? idTexto(api.agendamentoId) : undefined,
    data: dataDe(api.data),
    servico: textoDe(api.servico),
    profissional: textoDe(api.profissional),
    produtos: (api.produtos ?? []).map((produto) => ({
      marca: textoDe(produto.marca),
      linha: textoDe(produto.linha),
      cor: textoDe(produto.cor),
      oxidante: textoDe(produto.oxidante),
      proporcao: textoDe(produto.proporcao),
      tempoPausa: textoDe(produto.tempoPausa),
    })),
    observacoes: textoDe(api.observacoes),
    retorno: textoDe(api.retorno),
    fotos: (api.fotos ?? []).map((foto) => ({
      id: idTexto(foto.id) || `${Date.now()}`,
      momento: foto.momento === 'depois' ? 'depois' : 'antes',
      dados: textoDe(foto.dados),
    })),
    valor: numeroDe(api.valor),
    vendaId: api.vendaId != null ? idTexto(api.vendaId) : undefined,
  };
}

export function mapearFichaAtendimento(api: FichaAtendimentoApi): FichaAtendimento {
  const progressiva: ProgressivaAtendimento =
    api.progressiva === 'com' || api.progressiva === 'sem' || api.progressiva === 'nao' ? api.progressiva : '';
  return {
    id: idTexto(api.id),
    clienteId: idTexto(api.clienteId),
    agendamentoId: api.agendamentoId != null ? idTexto(api.agendamentoId) : undefined,
    atendimentoId: api.atendimentoId != null ? idTexto(api.atendimentoId) : undefined,
    vinculo: textoDe(api.vinculo) || undefined,
    data: dataDe(api.data),
    status: api.status === 'finalizada' ? 'finalizada' : 'rascunho',
    procedimentos: (api.procedimentos ?? []).filter((item): item is ProcedimentoAtendimento =>
      PROCEDIMENTOS.includes(item as ProcedimentoAtendimento),
    ),
    cor: textoDe(api.cor),
    progressiva,
    alergia: textoDe(api.alergia),
    observacoes: textoDe(api.observacoes),
  };
}

export function mapearLinha(api: LinhaParticipacaoApi | undefined): LinhaParticipacao {
  return {
    nome: textoDe(api?.nome),
    quantidade: Math.floor(numeroDe(api?.quantidade)),
    total: numeroDe(api?.total),
    percentual: numeroDe(api?.percentual),
  };
}

export function mapearTotais(api: TotaisPeriodoApi | undefined): TotaisPeriodo {
  return {
    entradas: numeroDe(api?.entradas),
    saidas: numeroDe(api?.saidas),
    lucro: numeroDe(api?.lucro),
    vendas: numeroDe(api?.vendas),
    quantidadeVendas: Math.floor(numeroDe(api?.quantidadeVendas)),
    ticket: numeroDe(api?.ticket),
  };
}

export function anamneseParaApi(anamnese: AnamneseCapilar, consentimento: boolean) {
  return {
    tipoCabelo: anamnese.tipoCabelo || undefined,
    comprimento: anamnese.comprimento,
    espessura: anamnese.espessura || undefined,
    porosidade: anamnese.porosidade || undefined,
    couroCabeludo: anamnese.couroCabeludo || undefined,
    quimica: anamnese.quimica.map((item) => ({ tipo: item.tipo, dataAproximada: item.dataAproximada })),
    condicoes: anamnese.condicoes,
    alergias: anamnese.alergias,
    testeMecha: anamnese.testeMecha ?? undefined,
    testeMechaData: anamnese.testeMechaData || undefined,
    observacoesSaude: anamnese.observacoesSaude,
    cuidadosCasa: anamnese.cuidadosCasa,
    preferencias: anamnese.preferencias,
    consentimento,
  };
}
