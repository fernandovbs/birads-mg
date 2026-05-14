export type BiRadsCategory = '0' | '1' | '2' | '3' | '4A' | '4B' | '4C' | '5' | '6'

export type MamaLado = 'direita' | 'esquerda' | 'bilateral'
export type Profundidade = 'anterior' | 'medio' | 'posterior'

export interface Localizacao {
  mama: MamaLado
  posicaoHoraria?: string
  quadrante?: string
  profundidade?: Profundidade
  distanciaMamilo?: string
}

export interface AchadosAssociados {
  retracaoCutanea: boolean
  espessamentoCutaneo: boolean
  retracaoMamilar: boolean
  derrameMamilar: boolean
  derrameMamilarTipo?: string
  linfonodoAxilarSuspeito: boolean
  distorcaoArquitetural: boolean
  calcificacoes: boolean
}

export interface NoduloDados {
  id: string
  forma: string
  margem: string
  densidade: string
  tamanho?: string
  localizacao: Localizacao
  achadosAssociados: AchadosAssociados
}

export interface CalcificacoesDados {
  id: string
  tipo: 'benigna' | 'suspeita'
  morfologia: string
  distribuicao: string
  localizacao: Localizacao
}

export interface DistorcaoArquiteturalDados {
  id: string
  associadaA: string[]
  localizacao: Localizacao
  achadosAssociados: AchadosAssociados
}

export interface AssimetriaDados {
  id: string
  tipo: string
  localizacao: Localizacao
  achadosAssociados: AchadosAssociados
}

export type TipoAchado = 'nodulo' | 'calcificacao' | 'distorcao' | 'assimetria'

export interface Achado {
  id: string
  tipo: TipoAchado
  dados: NoduloDados | CalcificacoesDados | DistorcaoArquiteturalDados | AssimetriaDados
}

export type ModoClassificacao = 'manual' | 'automatico'

export interface ClassificacaoAchado {
  achadoId: string
  tipo: TipoAchado
  categoria: BiRadsCategory
  razoes: string[]
  modificadores: string[]
  incompleto: boolean
}

export interface ClassificacaoMama {
  categoria: BiRadsCategory
  achadoPrincipal: string
  contribuintes: string[]
}

export interface ResultadoClassificacao {
  porAchado: ClassificacaoAchado[]
  direita?: ClassificacaoMama
  esquerda?: ClassificacaoMama
  bilateral?: ClassificacaoMama
  avisos: string[]
}

export interface LaudoState {
  composicaoMamaria: string
  achados: Achado[]
  modoClassificacao: ModoClassificacao
  biradsDireita?: BiRadsCategory
  biradsEsquerda?: BiRadsCategory
  biradsFinal?: BiRadsCategory
  observacoes?: string
}
