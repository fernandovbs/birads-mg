import type {
  Achado,
  NoduloDados,
  CalcificacoesDados,
  DistorcaoArquiteturalDados,
  AssimetriaDados,
  AchadosAssociados,
  ClassificacaoAchado,
  ClassificacaoMama,
  ResultadoClassificacao,
  BiRadsCategory,
  ExameAnterior,
} from '../data/types'

// ─── Ordem numérica das categorias ────────────────────────────────────────────

const ORDEM: Record<BiRadsCategory, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3,
  '4A': 4, '4B': 5, '4C': 6, '5': 7, '6': 8,
}

function maior(a: BiRadsCategory, b: BiRadsCategory): BiRadsCategory {
  return ORDEM[a] >= ORDEM[b] ? a : b
}

function elevarMinimo(cat: BiRadsCategory, minimo: BiRadsCategory): BiRadsCategory {
  return ORDEM[cat] < ORDEM[minimo] ? minimo : cat
}

// ─── Achados associados suspeitos ─────────────────────────────────────────────

function achadosAssociadosSuspeitos(aa: AchadosAssociados): string[] {
  const lista: string[] = []
  if (aa.retracaoCutanea)        lista.push('retração cutânea')
  if (aa.espessamentoCutaneo)    lista.push('espessamento cutâneo')
  if (aa.retracaoMamilar)        lista.push('retração mamilar')
  if (aa.linfonodoAxilarSuspeito) lista.push('linfonodo axilar suspeito')
  if (aa.derrameMamilar && aa.derrameMamilarTipo === 'sangue')
                                  lista.push('derrame mamilar sanguinolento')
  return lista
}

// ─── Nódulo ───────────────────────────────────────────────────────────────────
// Matriz ACR BI-RADS 2025: Forma × Margem → Categoria base; Densidade modifica

function classificarNodulo(dados: NoduloDados): ClassificacaoAchado {
  const { forma, margem, densidade, achadosAssociados: aa } = dados
  const razoes: string[] = []
  const modificadores: string[] = []
  let incompleto = false

  if (!forma || !margem || !densidade) {
    incompleto = true
    return {
      achadoId: dados.id, tipo: 'nodulo',
      categoria: '0', razoes: ['Nódulo incompleto: forma, margem e densidade são obrigatórios.'],
      modificadores: [], incompleto: true,
    }
  }

  // Componente gorduroso → BI-RADS 2 independente de forma/margem
  if (densidade === 'gordurosa') {
    razoes.push('Componente gorduroso: achado tipicamente benigno (cisto oleoso, hamartoma, linfonodo intramamário).')
    return finalizarNodulo(dados.id, '2', razoes, modificadores, aa, incompleto)
  }

  // Matriz Forma × Margem
  let cat: BiRadsCategory

  if (margem === 'circunscrita') {
    if (forma === 'oval' || forma === 'redondo') {
      cat = '3'
      razoes.push(`${capitalizar(forma)} + circunscrita → provavelmente benigno.`)
    } else {
      // irregular + circunscrita
      cat = '4A'
      razoes.push('Irregular + circunscrita → baixa suspeição de malignidade.')
    }
  } else if (margem === 'obscurecida') {
    if (forma === 'oval' || forma === 'redondo') {
      cat = '3'
      razoes.push(`${capitalizar(forma)} + obscurecida → provavelmente benigno (margem pode estar encoberta por tecido adjacente).`)
    } else {
      // irregular + obscurecida
      cat = '4A'
      razoes.push('Irregular + obscurecida → baixa suspeição.')
    }
  } else if (margem === 'microlobulada') {
    if (forma === 'oval' || forma === 'redondo') {
      cat = '4A'
      razoes.push(`${capitalizar(forma)} + microlobulada → baixa suspeição.`)
    } else {
      // irregular + microlobulada
      cat = '4B'
      razoes.push('Irregular + microlobulada → moderada suspeição.')
    }
  } else if (margem === 'indistinta') {
    cat = '4B'
    razoes.push(`${capitalizar(forma)} + indistinta → moderada suspeição.`)
  } else {
    // espiculada
    if (forma === 'oval' || forma === 'redondo') {
      cat = '4B'
      razoes.push(`${capitalizar(forma)} + espiculada → moderada suspeição.`)
    } else {
      // irregular + espiculada
      if (densidade === 'alta') {
        cat = '5'
        razoes.push('Irregular + espiculada + alta densidade → altamente sugestivo de malignidade.')
      } else {
        cat = '4C'
        razoes.push('Irregular + espiculada → alta suspeição de malignidade.')
      }
    }
  }

  // Modificador: alta densidade pode elevar suspeição (exceto quando já inclui no raciocínio)
  if (densidade === 'alta' && !['4C', '5'].includes(cat)) {
    if (cat === '3') {
      cat = '4A'
      modificadores.push('Alta densidade em nódulo oval/redondo/circunscrito eleva para BI-RADS 4A.')
    } else {
      modificadores.push('Alta densidade reforça a suspeição.')
    }
  }

  return finalizarNodulo(dados.id, cat, razoes, modificadores, aa, incompleto)
}

function finalizarNodulo(
  id: string, cat: BiRadsCategory, razoes: string[], modificadores: string[],
  aa: AchadosAssociados, incompleto: boolean,
): ClassificacaoAchado {
  const suspeitos = achadosAssociadosSuspeitos(aa)
  if (suspeitos.length > 0) {
    const catAnterior = cat
    cat = elevarMinimo(cat, '4A')
    if (cat !== catAnterior) {
      modificadores.push(`Achados associados suspeitos (${suspeitos.join(', ')}) elevam para no mínimo BI-RADS 4A.`)
    } else {
      modificadores.push(`Achados associados suspeitos presentes: ${suspeitos.join(', ')}.`)
    }
  }
  return { achadoId: id, tipo: 'nodulo', categoria: cat, razoes, modificadores, incompleto }
}

// ─── Calcificações ────────────────────────────────────────────────────────────
// Matriz ACR BI-RADS 2025: Morfologia × Distribuição

function classificarCalcificacao(dados: CalcificacoesDados): ClassificacaoAchado {
  const { tipo, morfologia, distribuicao } = dados
  const razoes: string[] = []
  const modificadores: string[] = []

  if (!morfologia || !distribuicao) {
    return {
      achadoId: dados.id, tipo: 'calcificacao',
      categoria: '0', razoes: ['Calcificação incompleta: morfologia e distribuição são obrigatórias.'],
      modificadores: [], incompleto: true,
    }
  }

  // Morfologia benigna → sempre BI-RADS 2
  if (tipo === 'benigna') {
    razoes.push('Morfologia tipicamente benigna → achado benigno.')
    return { achadoId: dados.id, tipo: 'calcificacao', categoria: '2', razoes, modificadores, incompleto: false }
  }

  // Morfologia suspeita — Matriz por morfologia × distribuição
  let cat: BiRadsCategory

  if (morfologia === 'amorfas') {
    if (distribuicao === 'difusa' || distribuicao === 'regional') {
      cat = '3'
      razoes.push(`Amorfas + ${distribuicao} → provavelmente benignas.`)
    } else if (distribuicao === 'agrupada' || distribuicao === 'linear') {
      cat = '4A'
      razoes.push(`Amorfas + ${distribuicao} → baixa suspeição.`)
    } else {
      // segmentar
      cat = '4B'
      razoes.push('Amorfas + segmentar → moderada suspeição.')
    }
  } else if (morfologia === 'grosseiras-heterogeneas') {
    if (distribuicao === 'difusa' || distribuicao === 'regional') {
      cat = '3'
      razoes.push(`Grosseiras heterogêneas + ${distribuicao} → provavelmente benignas.`)
    } else {
      // agrupada, linear, segmentar
      cat = '4B'
      razoes.push(`Grosseiras heterogêneas + ${distribuicao} → moderada suspeição.`)
    }
  } else if (morfologia === 'pleomorficas-finas') {
    if (distribuicao === 'difusa' || distribuicao === 'regional') {
      cat = '3'
      razoes.push(`Pleomórficas finas + ${distribuicao} → provavelmente benignas.`)
    } else if (distribuicao === 'agrupada') {
      cat = '4B'
      razoes.push('Pleomórficas finas + agrupada → moderada suspeição.')
    } else {
      // linear, segmentar
      cat = '4C'
      razoes.push(`Pleomórficas finas + ${distribuicao} → alta suspeição.`)
    }
  } else {
    // lineares-finas (moldes ductais)
    if (distribuicao === 'difusa') {
      cat = '4C'
      razoes.push('Lineares finas (ramificadas) + difusa → alta suspeição.')
    } else {
      // regional, agrupada, linear, segmentar → BI-RADS 5
      cat = '5'
      razoes.push(`Lineares finas (ramificadas) + ${distribuicao} → altamente sugestivo de malignidade (molde ductal).`)
    }
  }

  return { achadoId: dados.id, tipo: 'calcificacao', categoria: cat, razoes, modificadores, incompleto: false }
}

// ─── Distorção Arquitetural ───────────────────────────────────────────────────

function classificarDistorcao(dados: DistorcaoArquiteturalDados, exameAnteriorDisponivel: boolean): ClassificacaoAchado {
  const { associadaA, achadosAssociados: aa } = dados
  const razoes: string[] = []
  const modificadores: string[] = []

  const temCicatriz  = associadaA.includes('cicatriz')
  const temNodulo    = associadaA.includes('com-nodulo')
  const temCalc      = associadaA.includes('com-calcificacoes')

  let cat: BiRadsCategory

  if (temCicatriz && !temNodulo && !temCalc) {
    cat = '2'
    razoes.push('Distorção associada a cicatriz cirúrgica prévia sem nódulo ou calcificações → benigna.')
  } else if (temNodulo || temCalc) {
    cat = '4C'
    const extras = [temNodulo && 'nódulo', temCalc && 'calcificações'].filter(Boolean).join(' e ')
    razoes.push(`Distorção arquitetural com ${extras} associados → alta suspeição.`)
  } else if (!exameAnteriorDisponivel) {
    cat = '0'
    razoes.push('Distorção arquitetural sem exame anterior disponível para comparação → exame incompleto, necessita complementação diagnóstica (BI-RADS 0).')
  } else if (dados.comparacaoComAnterior === 'crescente') {
    cat = '4C'
    razoes.push('Distorção arquitetural em crescimento em relação ao exame anterior → progressão documentada eleva suspeição para alta (BI-RADS 4C).')
  } else {
    cat = '4B'
    razoes.push('Distorção arquitetural sem cicatriz associada, com exame anterior disponível → moderada suspeição.')
  }

  const suspeitos = achadosAssociadosSuspeitos(aa)
  if (suspeitos.length > 0) {
    const antes = cat
    cat = elevarMinimo(cat, '4A')
    if (cat !== antes) {
      modificadores.push(`Achados associados suspeitos (${suspeitos.join(', ')}) elevam para no mínimo BI-RADS 4A.`)
    } else {
      modificadores.push(`Achados associados suspeitos: ${suspeitos.join(', ')}.`)
    }
  }

  return { achadoId: dados.id, tipo: 'distorcao', categoria: cat, razoes, modificadores, incompleto: false }
}

// ─── Assimetria ───────────────────────────────────────────────────────────────

function classificarAssimetria(dados: AssimetriaDados, exameAnteriorDisponivel: boolean): ClassificacaoAchado {
  const { tipo, achadosAssociados: aa } = dados
  const razoes: string[] = []
  const modificadores: string[] = []

  if (!tipo) {
    return {
      achadoId: dados.id, tipo: 'assimetria',
      categoria: '0', razoes: ['Tipo de assimetria não especificado.'],
      modificadores: [], incompleto: true,
    }
  }

  let cat: BiRadsCategory

  if (tipo === 'assimetria') {
    cat = '0'
    razoes.push('Assimetria visível em apenas uma projeção → necessita complementação diagnóstica (compressão localizada, US).')
  } else if (tipo === 'global') {
    if (!exameAnteriorDisponivel) {
      cat = '0'
      razoes.push('Assimetria global sem exame anterior disponível para comparação → exame incompleto, necessita comparação com mamografia prévia (BI-RADS 0).')
    } else if (dados.comparacaoComAnterior === 'novo' || dados.comparacaoComAnterior === 'crescente') {
      cat = '4B'
      const desc = dados.comparacaoComAnterior === 'novo'
        ? 'nova (não identificada no exame anterior)'
        : 'em crescimento em relação ao exame anterior'
      razoes.push(`Assimetria global ${desc} → comportamento equivalente a assimetria em desenvolvimento → moderada suspeição.`)
    } else {
      cat = '3'
      razoes.push('Assimetria global estável em relação ao exame anterior, sem achados associados → provavelmente benigna (variação anatômica).')
    }
  } else if (tipo === 'focal') {
    if (!exameAnteriorDisponivel) {
      cat = '0'
      razoes.push('Assimetria focal sem exame anterior disponível para comparação → exame incompleto, necessita complementação diagnóstica (BI-RADS 0).')
    } else if (dados.comparacaoComAnterior === 'novo' || dados.comparacaoComAnterior === 'crescente') {
      cat = '4B'
      const desc = dados.comparacaoComAnterior === 'novo'
        ? 'nova (não identificada no exame anterior)'
        : 'em crescimento em relação ao exame anterior'
      razoes.push(`Assimetria focal ${desc} → comportamento equivalente a assimetria em desenvolvimento → moderada suspeição.`)
    } else {
      cat = '3'
      razoes.push('Assimetria focal estável em relação ao exame anterior, sem achados associados → provavelmente benigna.')
    }
  } else {
    // desenvolvimento — por definição implica comparação com exame anterior
    cat = '4B'
    razoes.push('Assimetria em desenvolvimento → moderada suspeição (novo achado ou crescimento em relação a exame anterior).')
  }

  const suspeitos = achadosAssociadosSuspeitos(aa)
  if (suspeitos.length > 0) {
    const antes = cat
    if (cat === '3' || cat === '0') {
      cat = '4A'
    }
    cat = elevarMinimo(cat, '4A')
    if (cat !== antes) {
      modificadores.push(`Achados associados suspeitos (${suspeitos.join(', ')}) elevam para no mínimo BI-RADS 4A.`)
    } else {
      modificadores.push(`Achados associados suspeitos: ${suspeitos.join(', ')}.`)
    }
  }

  return { achadoId: dados.id, tipo: 'assimetria', categoria: cat, razoes, modificadores, incompleto: !tipo }
}

// ─── Agregação por mama ────────────────────────────────────────────────────────

function agregarPorMama(achados: Achado[], classificacoes: ClassificacaoAchado[]) {
  const porMama: Record<string, ClassificacaoAchado[]> = { direita: [], esquerda: [], bilateral: [] }

  achados.forEach(achado => {
    const classi = classificacoes.find(c => c.achadoId === achado.id)
    if (!classi) return
    const locDados = (achado.dados as { localizacao: { mama: string } }).localizacao
    const lado = locDados.mama
    if (lado === 'bilateral') {
      porMama['direita']!.push(classi)
      porMama['esquerda']!.push(classi)
    } else if (lado === 'direita' || lado === 'esquerda') {
      porMama[lado]!.push(classi)
    }
  })

  function resolverMama(lista: ClassificacaoAchado[]): ClassificacaoMama | undefined {
    if (lista.length === 0) return undefined
    const principal = lista.reduce((a, b) => ORDEM[a.categoria] >= ORDEM[b.categoria] ? a : b)
    return {
      categoria: principal.categoria,
      achadoPrincipal: principal.achadoId,
      contribuintes: lista.map(c => c.achadoId),
    }
  }

  return {
    direita:   resolverMama(porMama['direita']!),
    esquerda:  resolverMama(porMama['esquerda']!),
    bilateral: undefined as ClassificacaoMama | undefined,
  }
}

// ─── Entrada principal ────────────────────────────────────────────────────────

export function classificarAchados(achados: Achado[], exameAnterior?: ExameAnterior): ResultadoClassificacao {
  const exameAnteriorDisponivel = exameAnterior?.disponivel ?? false
  const porAchado: ClassificacaoAchado[] = achados.map(achado => {
    switch (achado.tipo) {
      case 'nodulo':       return classificarNodulo(achado.dados as NoduloDados)
      case 'calcificacao': return classificarCalcificacao(achado.dados as CalcificacoesDados)
      case 'distorcao':    return classificarDistorcao(achado.dados as DistorcaoArquiteturalDados, exameAnteriorDisponivel)
      case 'assimetria':   return classificarAssimetria(achado.dados as AssimetriaDados, exameAnteriorDisponivel)
    }
  })

  const { direita, esquerda } = agregarPorMama(achados, porAchado)

  const avisos: string[] = []
  const incompletos = porAchado.filter(c => c.incompleto)
  if (incompletos.length > 0) {
    avisos.push(`${incompletos.length} achado(s) com campos incompletos — classificação parcialmente estimada.`)
  }

  // Múltiplos BI-RADS 3 NÃO se somam automaticamente para 4 (regra ACR)
  const tres3Direita = porAchado.filter(c => {
    const a = achados.find(x => x.id === c.achadoId)
    const lado = (a?.dados as { localizacao: { mama: string } })?.localizacao?.mama
    return c.categoria === '3' && (lado === 'direita' || lado === 'bilateral')
  })
  if (tres3Direita.length >= 3) {
    avisos.push('Mama direita: 3 ou mais achados BI-RADS 3 — considerar biópsia (múltiplos achados provavelmente benignos).')
  }

  const tres3Esquerda = porAchado.filter(c => {
    const a = achados.find(x => x.id === c.achadoId)
    const lado = (a?.dados as { localizacao: { mama: string } })?.localizacao?.mama
    return c.categoria === '3' && (lado === 'esquerda' || lado === 'bilateral')
  })
  if (tres3Esquerda.length >= 3) {
    avisos.push('Mama esquerda: 3 ou mais achados BI-RADS 3 — considerar biópsia (múltiplos achados provavelmente benignos).')
  }

  return { porAchado, direita, esquerda, bilateral: undefined, avisos }
}

export function labelCategoria(cat: BiRadsCategory): string {
  const labels: Record<BiRadsCategory, string> = {
    '0': 'BI-RADS 0', '1': 'BI-RADS 1', '2': 'BI-RADS 2', '3': 'BI-RADS 3',
    '4A': 'BI-RADS 4A', '4B': 'BI-RADS 4B', '4C': 'BI-RADS 4C',
    '5': 'BI-RADS 5', '6': 'BI-RADS 6',
  }
  return labels[cat]
}

export function corCategoria(cat: BiRadsCategory): { bg: string; text: string; border: string } {
  const mapa: Record<BiRadsCategory, { bg: string; text: string; border: string }> = {
    '0':  { bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-300' },
    '1':  { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300' },
    '2':  { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300' },
    '3':  { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
    '4A': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    '4B': { bg: 'bg-orange-200', text: 'text-orange-900', border: 'border-orange-400' },
    '4C': { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300' },
    '5':  { bg: 'bg-red-200',    text: 'text-red-900',    border: 'border-red-400' },
    '6':  { bg: 'bg-red-900',    text: 'text-white',      border: 'border-red-900' },
  }
  return mapa[cat]
}

function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export { maior }
