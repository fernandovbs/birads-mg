import type { BiRadsCategory } from '../data/types'
import { BIRADS_CATEGORIAS } from '../data/biradsData'

interface BiRadsSelectorProps {
  label: string
  value?: BiRadsCategory
  onChange: (v: BiRadsCategory | undefined) => void
}

export default function BiRadsSelector({ label, value, onChange }: BiRadsSelectorProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {BIRADS_CATEGORIAS.map(b => (
          <button
            key={b.categoria}
            type="button"
            onClick={() => onChange(value === b.categoria ? undefined : b.categoria)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
              value === b.categoria
                ? `${b.cor} ${b.corTexto} border-transparent`
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {b.categoria}
          </button>
        ))}
      </div>
      {value && (
        <p className={`mt-2 text-sm font-medium ${BIRADS_CATEGORIAS.find(b => b.categoria === value)?.corTexto ?? ''}`}>
          {BIRADS_CATEGORIAS.find(b => b.categoria === value)?.label}
        </p>
      )}
    </div>
  )
}
