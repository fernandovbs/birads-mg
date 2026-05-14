import type { Localizacao as LocalizacaoType, MamaLado, Profundidade } from '../data/types'
import { MAMA_LADO, QUADRANTE, POSICAO_HORARIA, PROFUNDIDADE } from '../data/biradsData'
import FieldGroup from './ui/FieldGroup'
import OptionChip from './ui/OptionChip'

interface LocalizacaoProps {
  value: LocalizacaoType
  onChange: (loc: LocalizacaoType) => void
  hideBilateral?: boolean
}

export default function LocalizacaoForm({ value, onChange, hideBilateral = false }: LocalizacaoProps) {
  const set = <K extends keyof LocalizacaoType>(key: K, val: LocalizacaoType[K]) =>
    onChange({ ...value, [key]: val })

  const lados = hideBilateral ? MAMA_LADO.filter(l => l.value !== 'bilateral') : MAMA_LADO

  return (
    <div className="space-y-4">
      <FieldGroup label="Mama">
        {lados.map(l => (
          <OptionChip
            key={l.value}
            label={l.label}
            active={value.mama === l.value}
            onClick={() => set('mama', l.value as MamaLado)}
          />
        ))}
      </FieldGroup>

      <FieldGroup label="Quadrante">
        {QUADRANTE.map(q => (
          <OptionChip
            key={q.value}
            label={q.value}
            active={value.quadrante === q.value}
            onClick={() => set('quadrante', value.quadrante === q.value ? undefined : q.value)}
          />
        ))}
      </FieldGroup>

      <FieldGroup label="Posição Horária">
        {POSICAO_HORARIA.map(h => (
          <OptionChip
            key={h}
            label={h}
            active={value.posicaoHoraria === h}
            onClick={() => set('posicaoHoraria', value.posicaoHoraria === h ? undefined : h)}
          />
        ))}
      </FieldGroup>

      <FieldGroup label="Profundidade">
        {PROFUNDIDADE.map(p => (
          <OptionChip
            key={p.value}
            label={p.label}
            active={value.profundidade === p.value}
            onClick={() => set('profundidade', value.profundidade === p.value ? undefined : p.value as Profundidade)}
          />
        ))}
      </FieldGroup>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Distância do Mamilo (cm)</p>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex: 2.5"
          value={value.distanciaMamilo ?? ''}
          onChange={e => set('distanciaMamilo', e.target.value || undefined)}
          className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
