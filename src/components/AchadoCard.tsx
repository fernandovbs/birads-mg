import { useState } from 'react'
import type { Achado } from '../data/types'
import NoduloForm from './achados/NoduloForm'
import CalcificacoesForm from './achados/CalcificacoesForm'
import DistorcaoForm from './achados/DistorcaoForm'
import AssimetriaForm from './achados/AssimetriaForm'

const TIPO_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  nodulo:       { label: 'Nódulo',                   icon: '◉', color: 'bg-blue-50 border-blue-200' },
  calcificacao: { label: 'Calcificações',             icon: '✦', color: 'bg-yellow-50 border-yellow-200' },
  distorcao:    { label: 'Distorção Arquitetural',    icon: '⌁', color: 'bg-purple-50 border-purple-200' },
  assimetria:   { label: 'Assimetria',                icon: '⊿', color: 'bg-teal-50 border-teal-200' },
}

interface AchadoCardProps {
  achado: Achado
  index: number
  onChange: (a: Achado) => void
  onRemove: () => void
  exameAnteriorDisponivel: boolean
}

export default function AchadoCard({ achado, index, onChange, onRemove, exameAnteriorDisponivel }: AchadoCardProps) {
  const [open, setOpen] = useState(true)
  const meta = TIPO_LABELS[achado.tipo]!

  return (
    <div className={`rounded-xl border ${meta.color} overflow-hidden`}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.icon}</span>
          <span className="font-semibold text-gray-800 text-sm">
            {meta.label} {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Remover
          </button>
          <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 bg-white border-t border-gray-100">
          <div className="pt-4">
            {achado.tipo === 'nodulo' && (
              <NoduloForm
                value={achado.dados as Parameters<typeof NoduloForm>[0]['value']}
                onChange={d => onChange({ ...achado, dados: d })}
              />
            )}
            {achado.tipo === 'calcificacao' && (
              <CalcificacoesForm
                value={achado.dados as Parameters<typeof CalcificacoesForm>[0]['value']}
                onChange={d => onChange({ ...achado, dados: d })}
              />
            )}
            {achado.tipo === 'distorcao' && (
              <DistorcaoForm
                value={achado.dados as Parameters<typeof DistorcaoForm>[0]['value']}
                onChange={d => onChange({ ...achado, dados: d })}
                exameAnteriorDisponivel={exameAnteriorDisponivel}
              />
            )}
            {achado.tipo === 'assimetria' && (
              <AssimetriaForm
                value={achado.dados as Parameters<typeof AssimetriaForm>[0]['value']}
                onChange={d => onChange({ ...achado, dados: d })}
                exameAnteriorDisponivel={exameAnteriorDisponivel}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
