import type {
  LaudoState,
  Achado,
  NoduloDados,
  CalcificacoesDados,
  DistorcaoArquiteturalDados,
  AssimetriaDados,
  Localizacao,
  AchadosAssociados,
  ResultadoClassificacao,
  BiRadsCategory,
} from '../data/types'
import {
  COMPOSICAO_MAMARIA,
  NODULO_FORMA,
  NODULO_MARGEM,
  NODULO_DENSIDADE,
  CALC_MORFOLOGIA_BENIGNA,
  CALC_MORFOLOGIA_SUSPEITA,
  CALC_DISTRIBUICAO,
  ASSIMETRIA_TIPO,
  DISTORCAO_ASSOCIACAO,
  BIRADS_CATEGORIAS,
} from '../data/biradsData'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function label<T extends { value: string; label: string }>(list: readonly T[], value: string): string {
  return list.find(i => i.value === value)?.label ?? value
}

function formatLocalizacao(loc: Localizacao): string {
  const partes: string[] = []

  if (loc.mama === 'bilateral') {
    partes.push('bilateralmente')
  } else if (loc.mama) {
    partes.push(`mama ${loc.mama}`)
  }

  if (loc.posicaoHoraria) partes.push(`às ${loc.posicaoHoraria}`)
  if (loc.quadrante) partes.push(loc.quadrante)
  if (loc.profundidade) {
    const map: Record<string, string> = { anterior: '1/3 anterior', medio: '1/3 médio', posterior: '1/3 posterior' }
    partes.push(map[loc.profundidade] ?? loc.profundidade)
  }
  if (loc.distanciaMamilo) partes.push(`a ${loc.distanciaMamilo} cm do mamilo`)

  return partes.length > 0 ? partes.join(', ') : ''
}

function formatAchadosAssociados(aa: AchadosAssociados): string {
  const achados: string[] = []
  if (aa.retracaoCutanea) achados.push('retração cutânea')
  if (aa.espessamentoCutaneo) achados.push('espessamento cutâneo')
  if (aa.retracaoMamilar) achados.push('retração mamilar')
  if (aa.derrameMamilar) {
    const tipo = aa.derrameMamilarTipo ? ` (${aa.derrameMamilarTipo})` : ''
    achados.push(`derrame mamilar espontâneo${tipo}`)
  }
  if (aa.linfonodoAxilarSuspeito) achados.push('linfonodo axilar suspeito')
  if (aa.distorcaoArquitetural) achados.push('distorção arquitetural associada')
  if (aa.calcificacoes) achados.push('calcificações associadas')
  if (achados.length === 0) return ''
  return `Achados associados: ${achados.join(', ')}.`
}

// ─── Geradores por tipo de achado ─────────────────────────────────────────────

function gerarTextoNodulo(dados: NoduloDados, idx: number): string {
  const linhas: string[] = []

  const forma = label(NODULO_FORMA, dados.forma)
  const margem = label(NODULO_MARGEM, dados.margem)
  const densidade = label(NODULO_DENSIDADE, dados.densidade)
  const tam = dados.tamanho ? `, medindo ${dados.tamanho} cm` : ''

  linhas.push(`Nódulo ${idx + 1}: Opacidade nodular de forma ${forma.toLowerCase()}, com margem ${margem.toLowerCase()} e ${densidade.toLowerCase()}${tam}.`)

  const loc = formatLocalizacao(dados.localizacao)
  if (loc) linhas.push(`Localização: ${loc}.`)

  const aa = formatAchadosAssociados(dados.achadosAssociados)
  if (aa) linhas.push(aa)

  return linhas.join('\n')
}

function gerarTextoCalcificacao(dados: CalcificacoesDados, idx: number): string {
  const linhas: string[] = []

  let morfLabel = ''
  if (dados.tipo === 'benigna') {
    morfLabel = label(CALC_MORFOLOGIA_BENIGNA, dados.morfologia)
  } else {
    morfLabel = label(CALC_MORFOLOGIA_SUSPEITA, dados.morfologia)
  }
  const dist = label(CALC_DISTRIBUICAO, dados.distribuicao)
  const tipoStr = dados.tipo === 'benigna' ? 'morfologia tipicamente benigna' : 'morfologia suspeita'

  linhas.push(`Calcificações ${idx + 1}: Calcificações de ${tipoStr}, ${morfLabel.toLowerCase()}, com distribuição ${dist.toLowerCase()}.`)

  const loc = formatLocalizacao(dados.localizacao)
  if (loc) linhas.push(`Localização: ${loc}.`)

  return linhas.join('\n')
}

const COMPARACAO_TEXTO: Record<string, string> = {
  novo:       'achado novo, não identificado no exame anterior',
  estavel:    'estável em relação ao exame anterior',
  crescente:  'em crescimento em relação ao exame anterior',
  regressivo: 'em regressão em relação ao exame anterior',
}

function gerarTextoDistorcao(dados: DistorcaoArquiteturalDados, idx: number): string {
  const linhas: string[] = []

  const assoc = dados.associadaA.map(v => label(DISTORCAO_ASSOCIACAO, v)).join(', ')
  linhas.push(`Distorção Arquitetural ${idx + 1}: Distorção da arquitetura do parênquima mamário${assoc ? ' — ' + assoc.toLowerCase() : ''}.`)

  const loc = formatLocalizacao(dados.localizacao)
  if (loc) linhas.push(`Localização: ${loc}.`)

  const aa = formatAchadosAssociados(dados.achadosAssociados)
  if (aa) linhas.push(aa)

  if (dados.comparacaoComAnterior) {
    linhas.push(`Comparação: ${COMPARACAO_TEXTO[dados.comparacaoComAnterior]}.`)
  }

  return linhas.join('\n')
}

function gerarTextoAssimetria(dados: AssimetriaDados, idx: number): string {
  const linhas: string[] = []

  const tipo = label(ASSIMETRIA_TIPO, dados.tipo)
  linhas.push(`Assimetria ${idx + 1}: ${tipo}.`)

  const loc = formatLocalizacao(dados.localizacao)
  if (loc) linhas.push(`Localização: ${loc}.`)

  const aa = formatAchadosAssociados(dados.achadosAssociados)
  if (aa) linhas.push(aa)

  if (dados.comparacaoComAnterior) {
    linhas.push(`Comparação: ${COMPARACAO_TEXTO[dados.comparacaoComAnterior]}.`)
  }

  return linhas.join('\n')
}

function gerarTextoAchado(achado: Achado, counters: Record<string, number>): string {
  const idx = counters[achado.tipo] ?? 0
  counters[achado.tipo] = idx + 1

  switch (achado.tipo) {
    case 'nodulo':
      return gerarTextoNodulo(achado.dados as NoduloDados, idx)
    case 'calcificacao':
      return gerarTextoCalcificacao(achado.dados as CalcificacoesDados, idx)
    case 'distorcao':
      return gerarTextoDistorcao(achado.dados as DistorcaoArquiteturalDados, idx)
    case 'assimetria':
      return gerarTextoAssimetria(achado.dados as AssimetriaDados, idx)
  }
}

// ─── Gerador principal ────────────────────────────────────────────────────────

export function gerarLaudo(
  state: LaudoState,
  classificacaoAuto?: ResultadoClassificacao,
): string {
  const linhas: string[] = []

  linhas.push('MAMOGRAFIA BILATERAL')
  linhas.push('')
  linhas.push('TÉCNICA: Exame realizado nas incidências craniocaudal (CC) e médio-lateral-oblíqua (MLO) bilateralmente.')
  linhas.push('')

  // Exame anterior
  if (state.exameAnterior.disponivel) {
    const partes = ['EXAME ANTERIOR:']
    if (state.exameAnterior.data) {
      const [ano, mes, dia] = state.exameAnterior.data.split('-')
      partes.push(`Mamografia de ${dia}/${mes}/${ano}`)
      if (state.exameAnterior.local) partes.push(`— ${state.exameAnterior.local}`)
      partes.push('. Estudo comparativo realizado.')
    } else if (state.exameAnterior.local) {
      partes.push(`${state.exameAnterior.local}. Estudo comparativo realizado.`)
    } else {
      partes.push('Disponível. Estudo comparativo realizado.')
    }
    linhas.push(partes.join(' '))
  } else {
    linhas.push('EXAME ANTERIOR: Não disponível para comparação.')
  }
  linhas.push('')

  // Composição
  if (state.composicaoMamaria) {
    const comp = COMPOSICAO_MAMARIA.find(c => c.value === state.composicaoMamaria)
    linhas.push('COMPOSIÇÃO MAMÁRIA:')
    linhas.push(comp ? comp.label : state.composicaoMamaria)
    linhas.push('')
  }

  // Achados
  if (state.achados.length > 0) {
    linhas.push('ACHADOS:')
    linhas.push('')
    const counters: Record<string, number> = {}
    for (const achado of state.achados) {
      linhas.push(gerarTextoAchado(achado, counters))
      linhas.push('')
    }
  } else {
    linhas.push('ACHADOS:')
    linhas.push('Não foram identificados achados adicionais.')
    linhas.push('')
  }

  // Observações
  if (state.observacoes?.trim()) {
    linhas.push('OBSERVAÇÕES:')
    linhas.push(state.observacoes.trim())
    linhas.push('')
  }

  // Classificação BI-RADS
  linhas.push('CONCLUSÃO:')

  // Modo automático tem prioridade quando fornecido
  if (classificacaoAuto) {
    const { direita, esquerda } = classificacaoAuto
    if (direita) {
      const info = BIRADS_CATEGORIAS.find(b => b.categoria === direita.categoria)
      linhas.push(`Mama Direita: ${info?.label ?? 'BI-RADS ' + direita.categoria}`)
    }
    if (esquerda) {
      const info = BIRADS_CATEGORIAS.find(b => b.categoria === esquerda.categoria)
      linhas.push(`Mama Esquerda: ${info?.label ?? 'BI-RADS ' + esquerda.categoria}`)
    }

    // Conduta
    const cats = new Set<BiRadsCategory>()
    if (direita) cats.add(direita.categoria)
    if (esquerda) cats.add(esquerda.categoria)

    const condutas = [...cats]
      .map(c => BIRADS_CATEGORIAS.find(b => b.categoria === c)?.conduta)
      .filter(Boolean)

    if (condutas.length > 0) {
      linhas.push('')
      linhas.push('CONDUTA:')
      condutas.forEach(c => linhas.push(c!))
    }
  } else {
    // Modo manual
    const temDireita  = state.biradsDireita  !== undefined
    const temEsquerda = state.biradsEsquerda !== undefined
    const temFinal    = state.biradsFinal    !== undefined

    if (temDireita || temEsquerda) {
      if (temDireita && state.biradsDireita) {
        const info = BIRADS_CATEGORIAS.find(b => b.categoria === state.biradsDireita)
        linhas.push(`Mama Direita: ${info?.label ?? 'BI-RADS ' + state.biradsDireita}`)
      }
      if (temEsquerda && state.biradsEsquerda) {
        const info = BIRADS_CATEGORIAS.find(b => b.categoria === state.biradsEsquerda)
        linhas.push(`Mama Esquerda: ${info?.label ?? 'BI-RADS ' + state.biradsEsquerda}`)
      }
    } else if (temFinal && state.biradsFinal) {
      const info = BIRADS_CATEGORIAS.find(b => b.categoria === state.biradsFinal)
      linhas.push(`Bilateral: ${info?.label ?? 'BI-RADS ' + state.biradsFinal}`)
    }

    const categoriasUsadas = new Set<string>()
    if (state.biradsDireita)  categoriasUsadas.add(state.biradsDireita)
    if (state.biradsEsquerda) categoriasUsadas.add(state.biradsEsquerda)
    if (state.biradsFinal)    categoriasUsadas.add(state.biradsFinal)

    const condutasUnicas = [...categoriasUsadas]
      .map(c => BIRADS_CATEGORIAS.find(b => b.categoria === c)?.conduta)
      .filter(Boolean)

    if (condutasUnicas.length > 0) {
      linhas.push('')
      linhas.push('CONDUTA:')
      condutasUnicas.forEach(c => linhas.push(c!))
    }
  }

  return linhas.join('\n')
}
