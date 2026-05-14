import type { AchadosAssociados } from '../data/types'
import { ACHADOS_ASSOCIADOS, DERRAME_MAMILAR_TIPO } from '../data/biradsData'

interface AchadosAssociadosFormProps {
  value: AchadosAssociados
  onChange: (aa: AchadosAssociados) => void
}

export default function AchadosAssociadosForm({ value, onChange }: AchadosAssociadosFormProps) {
  const toggle = (key: keyof AchadosAssociados) => {
    if (key === 'derrameMamilarTipo') return
    onChange({ ...value, [key]: !value[key as keyof typeof value] })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Achados Associados</p>
      <div className="flex flex-wrap gap-2">
        {ACHADOS_ASSOCIADOS.map(a => {
          const active = Boolean(value[a.value as keyof AchadosAssociados])
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => toggle(a.value as keyof AchadosAssociados)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                active
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {active && <span className="mr-1.5 text-xs">✓</span>}
              {a.label}
            </button>
          )
        })}
      </div>

      {value.derrameMamilar && (
        <div className="mt-2 ml-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tipo de Derrame Mamilar</p>
          <div className="flex flex-wrap gap-2">
            {DERRAME_MAMILAR_TIPO.map(d => (
              <button
                key={d.value}
                type="button"
                onClick={() => onChange({ ...value, derrameMamilarTipo: value.derrameMamilarTipo === d.value ? undefined : d.value })}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                  value.derrameMamilarTipo === d.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
