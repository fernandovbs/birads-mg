import type { BiRadsCategory } from './types'

// ─── Composição Mamária ────────────────────────────────────────────────────────

export const COMPOSICAO_MAMARIA = [
  {
    value: 'a',
    label: 'a) Predominantemente gordurosa',
    descricao: 'As mamas são quase inteiramente compostas por tecido adiposo. Pequenas massas podem ser identificadas com boa sensibilidade.',
  },
  {
    value: 'b',
    label: 'b) Tecido fibroglandular disperso',
    descricao: 'Há áreas dispersas de tecido fibroglandular. A sensibilidade da mamografia pode ser levemente reduzida.',
  },
  {
    value: 'c',
    label: 'c) Mamas heterogeneamente densas',
    descricao: 'O tecido denso pode obscurecer pequenas massas. Isso pode reduzir a sensibilidade da mamografia.',
  },
  {
    value: 'd',
    label: 'd) Mamas extremamente densas',
    descricao: 'A densidade mamária pode reduzir significativamente a sensibilidade da mamografia.',
  },
] as const

// ─── Nódulo ───────────────────────────────────────────────────────────────────

export const NODULO_FORMA = [
  { value: 'oval', label: 'Oval' },
  { value: 'redondo', label: 'Redondo' },
  { value: 'irregular', label: 'Irregular' },
] as const

export const NODULO_MARGEM = [
  { value: 'circunscrita', label: 'Circunscrita', risco: 'baixo' },
  { value: 'obscurecida', label: 'Obscurecida', risco: 'medio' },
  { value: 'microlobulada', label: 'Microlobulada', risco: 'medio' },
  { value: 'indistinta', label: 'Indistinta', risco: 'alto' },
  { value: 'espiculada', label: 'Espiculada', risco: 'alto' },
] as const

export const NODULO_DENSIDADE = [
  { value: 'alta', label: 'Alta densidade', risco: 'alto' },
  { value: 'isodensa', label: 'Isodensa', risco: 'medio' },
  { value: 'baixa', label: 'Baixa densidade', risco: 'baixo' },
  { value: 'gordurosa', label: 'Com componente gorduroso', risco: 'baixo' },
] as const

// ─── Calcificações ────────────────────────────────────────────────────────────

export const CALC_MORFOLOGIA_BENIGNA = [
  { value: 'pele', label: 'De pele' },
  { value: 'vasculares', label: 'Vasculares' },
  { value: 'pipoca', label: 'Grosseiras ou "em pipoca"' },
  { value: 'bastonetes', label: 'Grosseiras em bastonetes' },
  { value: 'redondas', label: 'Redondas' },
  { value: 'casca-ovo', label: 'Em casca de ovo / periféricas' },
  { value: 'distroficas', label: 'Distróficas' },
  { value: 'leite-calcio', label: 'Leite de cálcio' },
  { value: 'sutura', label: 'De sutura' },
] as const

export const CALC_MORFOLOGIA_SUSPEITA = [
  { value: 'amorfas', label: 'Amorfas', risco: 'intermediario' },
  { value: 'grosseiras-heterogeneas', label: 'Grosseiras heterogêneas', risco: 'intermediario' },
  { value: 'pleomorficas-finas', label: 'Pleomórficas finas', risco: 'alto' },
  { value: 'lineares-finas', label: 'Lineares finas ou lineares ramificadas', risco: 'alto' },
] as const

export const CALC_DISTRIBUICAO = [
  { value: 'difusa', label: 'Difusa' },
  { value: 'regional', label: 'Regional' },
  { value: 'agrupada', label: 'Agrupada' },
  { value: 'linear', label: 'Linear' },
  { value: 'segmentar', label: 'Segmentar' },
] as const

// ─── Distorção Arquitetural ───────────────────────────────────────────────────

export const DISTORCAO_ASSOCIACAO = [
  { value: 'sem-nodulo', label: 'Sem nódulo associado' },
  { value: 'com-nodulo', label: 'Com nódulo associado' },
  { value: 'com-calcificacoes', label: 'Com calcificações associadas' },
  { value: 'cicatriz', label: 'Associada a cicatriz cirúrgica prévia' },
] as const

// ─── Assimetria ───────────────────────────────────────────────────────────────

export const ASSIMETRIA_TIPO = [
  {
    value: 'assimetria',
    label: 'Assimetria',
    descricao: 'Tecido fibroglandular visível em uma projeção apenas, sem volume tridimensional.',
  },
  {
    value: 'global',
    label: 'Assimetria Global',
    descricao: 'Maior volume de tecido fibroglandular em uma mama comparada à contralateral, envolvendo pelo menos um quadrante.',
  },
  {
    value: 'focal',
    label: 'Assimetria Focal',
    descricao: 'Tecido com volume tridimensional em mais de uma projeção, porém sem margem convexa ou efeito de massa.',
  },
  {
    value: 'desenvolvimento',
    label: 'Assimetria em Desenvolvimento',
    descricao: 'Achado novo, maior ou mais proeminente em comparação a exame prévio.',
  },
] as const

// ─── Achados Associados ───────────────────────────────────────────────────────

export const ACHADOS_ASSOCIADOS = [
  { value: 'retracaoCutanea', label: 'Retração cutânea' },
  { value: 'espessamentoCutaneo', label: 'Espessamento cutâneo' },
  { value: 'retracaoMamilar', label: 'Retração mamilar' },
  { value: 'derrameMamilar', label: 'Derrame mamilar espontâneo' },
  { value: 'linfonodoAxilarSuspeito', label: 'Linfonodo axilar suspeito' },
  { value: 'distorcaoArquitetural', label: 'Distorção arquitetural associada' },
  { value: 'calcificacoes', label: 'Calcificações associadas' },
] as const

export const DERRAME_MAMILAR_TIPO = [
  { value: 'sangue', label: 'Sanguinolento' },
  { value: 'claro', label: 'Claro/seroso' },
  { value: 'leitoso', label: 'Leitoso' },
  { value: 'opaco', label: 'Opaco' },
] as const

// ─── Localização ──────────────────────────────────────────────────────────────

export const MAMA_LADO = [
  { value: 'direita', label: 'Mama Direita' },
  { value: 'esquerda', label: 'Mama Esquerda' },
  { value: 'bilateral', label: 'Bilateral' },
] as const

export const QUADRANTE = [
  { value: 'QSE', label: 'QSE — Quadrante Superior Externo' },
  { value: 'QSI', label: 'QSI — Quadrante Superior Interno' },
  { value: 'QIE', label: 'QIE — Quadrante Inferior Externo' },
  { value: 'QII', label: 'QII — Quadrante Inferior Interno' },
  { value: 'UQS', label: 'UQS — União dos Quadrantes Superiores' },
  { value: 'UQI', label: 'UQI — União dos Quadrantes Inferiores' },
  { value: 'UQE', label: 'UQE — União dos Quadrantes Externos' },
  { value: 'UQMI', label: 'UQMI — União dos Quadrantes Mediais/Internos' },
  { value: 'central', label: 'Região Central' },
  { value: 'retroareolar', label: 'Retroareolar' },
  { value: 'axila', label: 'Prolongamento Axilar' },
] as const

export const POSICAO_HORARIA = [
  '12h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h',
] as const

export const PROFUNDIDADE = [
  { value: 'anterior', label: '1/3 Anterior' },
  { value: 'medio', label: '1/3 Médio' },
  { value: 'posterior', label: '1/3 Posterior' },
] as const

// ─── Classificação BI-RADS ────────────────────────────────────────────────────

export interface BiRadsInfo {
  categoria: BiRadsCategory
  label: string
  malignidade: string
  conduta: string
  cor: string
  corTexto: string
}

export const BIRADS_CATEGORIAS: BiRadsInfo[] = [
  {
    categoria: '0',
    label: 'BI-RADS 0 — Incompleto',
    malignidade: '—',
    conduta: 'Complementação diagnóstica: compressão localizada, magnificação, incidências adicionais e/ou ultrassonografia.',
    cor: 'bg-gray-100',
    corTexto: 'text-gray-700',
  },
  {
    categoria: '1',
    label: 'BI-RADS 1 — Negativo',
    malignidade: '0%',
    conduta: 'Rastreamento mamográfico de rotina anual.',
    cor: 'bg-green-100',
    corTexto: 'text-green-800',
  },
  {
    categoria: '2',
    label: 'BI-RADS 2 — Benigno',
    malignidade: '0%',
    conduta: 'Rastreamento mamográfico de rotina anual.',
    cor: 'bg-blue-100',
    corTexto: 'text-blue-800',
  },
  {
    categoria: '3',
    label: 'BI-RADS 3 — Provavelmente Benigno',
    malignidade: '< 2%',
    conduta: 'Controle mamográfico em curto intervalo: 6 meses (mama ipsilateral), seguido de 12 e 24 meses bilateralmente.',
    cor: 'bg-yellow-100',
    corTexto: 'text-yellow-800',
  },
  {
    categoria: '4A',
    label: 'BI-RADS 4A — Baixa Suspeição de Malignidade',
    malignidade: '> 2% a ≤ 10%',
    conduta: 'Biópsia tecidual guiada por imagem.',
    cor: 'bg-orange-100',
    corTexto: 'text-orange-800',
  },
  {
    categoria: '4B',
    label: 'BI-RADS 4B — Moderada Suspeição de Malignidade',
    malignidade: '> 10% a ≤ 50%',
    conduta: 'Biópsia tecidual guiada por imagem.',
    cor: 'bg-orange-200',
    corTexto: 'text-orange-900',
  },
  {
    categoria: '4C',
    label: 'BI-RADS 4C — Alta Suspeição de Malignidade',
    malignidade: '> 50% a < 95%',
    conduta: 'Biópsia tecidual guiada por imagem.',
    cor: 'bg-red-100',
    corTexto: 'text-red-800',
  },
  {
    categoria: '5',
    label: 'BI-RADS 5 — Altamente Sugestivo de Malignidade',
    malignidade: '≥ 95%',
    conduta: 'Biópsia tecidual guiada por imagem. Indicação de procedimento cirúrgico após diagnóstico.',
    cor: 'bg-red-200',
    corTexto: 'text-red-900',
  },
  {
    categoria: '6',
    label: 'BI-RADS 6 — Malignidade Comprovada por Biópsia',
    malignidade: '100%',
    conduta: 'Tratamento conforme estadiamento clínico e protocolo oncológico.',
    cor: 'bg-red-900',
    corTexto: 'text-white',
  },
]

export function getBiradsInfo(categoria: BiRadsCategory): BiRadsInfo {
  return BIRADS_CATEGORIAS.find(b => b.categoria === categoria) ?? BIRADS_CATEGORIAS[0]!
}
