import { useState } from 'react'
import type { LaudoState, ResultadoClassificacao, BiRadsCategory } from '../data/types'
import { gerarLaudo } from '../utils/laudoGenerator'
import { BIRADS_CATEGORIAS } from '../data/biradsData'

interface LaudoPreviewProps {
  state: LaudoState
  classificacaoAuto?: ResultadoClassificacao
}

export default function LaudoPreview({ state, classificacaoAuto }: LaudoPreviewProps) {
  const [copiado, setCopiado] = useState(false)
  const texto = gerarLaudo(state, classificacaoAuto)

  const copiar = async () => {
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  // Categoria mais alta para o banner (usa auto se disponível, senão manual)
  const categoriaMaisAlta = (() => {
    const ordem: Record<string, number> = {
      '0': 0, '1': 1, '2': 2, '3': 3, '4A': 4, '4B': 5, '4C': 6, '5': 7, '6': 8,
    }
    let cats: (BiRadsCategory | undefined)[]
    if (classificacaoAuto) {
      cats = [classificacaoAuto.direita?.categoria, classificacaoAuto.esquerda?.categoria]
    } else {
      cats = [state.biradsDireita, state.biradsEsquerda, state.biradsFinal]
    }
    const validas = cats.filter(Boolean) as BiRadsCategory[]
    if (validas.length === 0) return null
    return validas.reduce((a, b) => (ordem[a] ?? -1) >= (ordem[b] ?? -1) ? a : b)
  })()

  const infoFinal = categoriaMaisAlta
    ? BIRADS_CATEGORIAS.find(b => b.categoria === categoriaMaisAlta)
    : null

  return (
    <div className="space-y-4">
      {infoFinal && (
        <div className={`rounded-xl p-4 ${infoFinal.cor}`}>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${infoFinal.corTexto} opacity-70`}>
                Classificação Final {classificacaoAuto ? '(automática)' : '(manual)'}
              </p>
              <p className={`text-lg font-bold ${infoFinal.corTexto}`}>{infoFinal.label}</p>
              <p className={`text-sm mt-1 ${infoFinal.corTexto} opacity-80`}>
                Probabilidade de malignidade: {infoFinal.malignidade}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-black/10">
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${infoFinal.corTexto} opacity-70`}>
              Conduta Recomendada
            </p>
            <p className={`text-sm ${infoFinal.corTexto}`}>{infoFinal.conduta}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Texto do Laudo</h3>
          <button
            type="button"
            onClick={copiar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {copiado ? '✓ Copiado!' : '⧉ Copiar'}
          </button>
        </div>
        <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50">
          {texto}
        </pre>
      </div>
    </div>
  )
}
