import type { ResultadoClassificacao, Achado, BiRadsCategory } from '../data/types'
import { BIRADS_CATEGORIAS } from '../data/biradsData'
import { corCategoria, labelCategoria } from '../utils/biradsClassifier'

const TIPO_LABEL: Record<string, string> = {
  nodulo: 'Nódulo', calcificacao: 'Calcificações',
  distorcao: 'Distorção Arquitetural', assimetria: 'Assimetria',
}

interface Props {
  resultado: ResultadoClassificacao
  achados: Achado[]
}

function BadgeCategoria({ cat }: { cat: BiRadsCategory }) {
  const { bg, text, border } = corCategoria(cat)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${bg} ${text} ${border}`}>
      {labelCategoria(cat)}
    </span>
  )
}

function MamaBadge({ label, cat, info }: { label: string; cat: BiRadsCategory; info: typeof BIRADS_CATEGORIAS[0] }) {
  const { bg, text } = corCategoria(cat)
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${text} opacity-70`}>{label}</p>
      <p className={`text-2xl font-black ${text}`}>{labelCategoria(cat)}</p>
      <p className={`text-xs mt-1 ${text} opacity-80`}>
        Prob. malignidade: {info.malignidade}
      </p>
      <p className={`text-xs mt-2 ${text} opacity-90 leading-relaxed`}>{info.conduta}</p>
    </div>
  )
}

export default function ClassificacaoAutoPanel({ resultado, achados }: Props) {
  const { porAchado, direita, esquerda, avisos } = resultado

  const tipoCount: Record<string, number> = {}

  return (
    <div className="space-y-5">
      {/* Resultado por mama */}
      {(direita || esquerda) && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Classificação Final por Mama
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {direita && (
              <MamaBadge
                label="Mama Direita"
                cat={direita.categoria}
                info={BIRADS_CATEGORIAS.find(b => b.categoria === direita.categoria)!}
              />
            )}
            {esquerda && (
              <MamaBadge
                label="Mama Esquerda"
                cat={esquerda.categoria}
                info={BIRADS_CATEGORIAS.find(b => b.categoria === esquerda.categoria)!}
              />
            )}
          </div>
        </div>
      )}

      {/* Avisos */}
      {avisos.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Avisos</p>
          <ul className="space-y-1">
            {avisos.map((av, i) => (
              <li key={i} className="text-sm text-amber-800 flex gap-2">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{av}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raciocínio por achado */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Raciocínio por Achado
        </p>
        <div className="space-y-3">
          {porAchado.map(classi => {
            const achado = achados.find(a => a.id === classi.achadoId)
            if (!achado) return null
            tipoCount[achado.tipo] = (tipoCount[achado.tipo] ?? 0) + 1
            const idx = tipoCount[achado.tipo]!
            const { bg, text, border } = corCategoria(classi.categoria)

            return (
              <div key={classi.achadoId} className={`rounded-xl border ${border} overflow-hidden`}>
                {/* Header do achado */}
                <div className={`flex items-center justify-between px-4 py-2.5 ${bg}`}>
                  <span className={`text-sm font-semibold ${text}`}>
                    {TIPO_LABEL[achado.tipo]} {idx}
                  </span>
                  <BadgeCategoria cat={classi.categoria} />
                </div>

                {/* Razões */}
                <div className="px-4 py-3 bg-white space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Determinante da Classificação
                    </p>
                    <ul className="space-y-1">
                      {classi.razoes.map((r, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-blue-400 mt-0.5 shrink-0">›</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {classi.modificadores.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Modificadores
                      </p>
                      <ul className="space-y-1">
                        {classi.modificadores.map((m, i) => (
                          <li key={i} className="text-sm text-amber-700 flex gap-2">
                            <span className="mt-0.5 shrink-0">↑</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {classi.incompleto && (
                    <p className="text-xs text-red-500 bg-red-50 rounded px-2 py-1">
                      Achado incompleto — preencha todos os campos obrigatórios.
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabela de referência compacta */}
      <details className="rounded-xl border border-gray-200 overflow-hidden">
        <summary className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
          Referência rápida — Probabilidade de malignidade por categoria
        </summary>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BIRADS_CATEGORIAS.map(b => {
            const { bg, text } = corCategoria(b.categoria)
            return (
              <div key={b.categoria} className={`rounded-lg px-3 py-2 ${bg}`}>
                <p className={`text-xs font-bold ${text}`}>{b.categoria}</p>
                <p className={`text-xs ${text} opacity-80`}>{b.malignidade}</p>
              </div>
            )
          })}
        </div>
      </details>
    </div>
  )
}
