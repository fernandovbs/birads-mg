import type { NoduloDados } from '../../data/types'
import { NODULO_FORMA, NODULO_MARGEM, NODULO_DENSIDADE } from '../../data/biradsData'
import FieldGroup from '../ui/FieldGroup'
import OptionChip from '../ui/OptionChip'
import LocalizacaoForm from '../Localizacao'
import AchadosAssociadosForm from '../AchadosAssociadosForm'

interface NoduloFormProps {
  value: NoduloDados
  onChange: (v: NoduloDados) => void
}

export default function NoduloForm({ value, onChange }: NoduloFormProps) {
  const set = <K extends keyof NoduloDados>(key: K, val: NoduloDados[K]) =>
    onChange({ ...value, [key]: val })

  return (
    <div className="space-y-5">
      <FieldGroup label="Forma" required>
        {NODULO_FORMA.map(f => (
          <OptionChip
            key={f.value}
            label={f.label}
            active={value.forma === f.value}
            onClick={() => set('forma', f.value)}
          />
        ))}
      </FieldGroup>

      <FieldGroup label="Margem" required>
        {NODULO_MARGEM.map(m => (
          <OptionChip
            key={m.value}
            label={m.label}
            active={value.margem === m.value}
            color={m.risco === 'alto' ? 'red' : m.risco === 'medio' ? 'yellow' : 'green'}
            onClick={() => set('margem', m.value)}
          />
        ))}
      </FieldGroup>

      <FieldGroup label="Densidade" required>
        {NODULO_DENSIDADE.map(d => (
          <OptionChip
            key={d.value}
            label={d.label}
            active={value.densidade === d.value}
            color={d.risco === 'alto' ? 'red' : d.risco === 'medio' ? 'yellow' : 'green'}
            onClick={() => set('densidade', d.value)}
          />
        ))}
      </FieldGroup>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Maior Diâmetro (cm)</p>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex: 1.5"
          value={value.tamanho ?? ''}
          onChange={e => set('tamanho', e.target.value || undefined)}
          className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <LocalizacaoForm
          value={value.localizacao}
          onChange={loc => set('localizacao', loc)}
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <AchadosAssociadosForm
          value={value.achadosAssociados}
          onChange={aa => set('achadosAssociados', aa)}
        />
      </div>
    </div>
  )
}
