import type { CalcificacoesDados } from '../../data/types'
import {
  CALC_MORFOLOGIA_BENIGNA,
  CALC_MORFOLOGIA_SUSPEITA,
  CALC_DISTRIBUICAO,
} from '../../data/biradsData'
import FieldGroup from '../ui/FieldGroup'
import OptionChip from '../ui/OptionChip'
import LocalizacaoForm from '../Localizacao'

interface CalcificacoesFormProps {
  value: CalcificacoesDados
  onChange: (v: CalcificacoesDados) => void
}

export default function CalcificacoesForm({ value, onChange }: CalcificacoesFormProps) {
  const set = <K extends keyof CalcificacoesDados>(key: K, val: CalcificacoesDados[K]) =>
    onChange({ ...value, [key]: val })

  return (
    <div className="space-y-5">
      <FieldGroup label="Morfologia" required>
        <div className="w-full">
          <p className="text-xs text-gray-500 mb-2 font-medium">Tipo</p>
          <div className="flex gap-2 mb-4">
            <OptionChip
              label="Tipicamente Benigna"
              active={value.tipo === 'benigna'}
              color="green"
              onClick={() => set('tipo', 'benigna')}
            />
            <OptionChip
              label="Suspeita"
              active={value.tipo === 'suspeita'}
              color="red"
              onClick={() => set('tipo', 'suspeita')}
            />
          </div>

          {value.tipo === 'benigna' && (
            <>
              <p className="text-xs text-gray-500 mb-2">Morfologia tipicamente benigna:</p>
              <div className="flex flex-wrap gap-2">
                {CALC_MORFOLOGIA_BENIGNA.map(m => (
                  <OptionChip
                    key={m.value}
                    label={m.label}
                    active={value.morfologia === m.value}
                    color="green"
                    onClick={() => set('morfologia', m.value)}
                  />
                ))}
              </div>
            </>
          )}

          {value.tipo === 'suspeita' && (
            <>
              <p className="text-xs text-gray-500 mb-2">Morfologia suspeita:</p>
              <div className="flex flex-wrap gap-2">
                {CALC_MORFOLOGIA_SUSPEITA.map(m => (
                  <OptionChip
                    key={m.value}
                    label={m.label}
                    active={value.morfologia === m.value}
                    color={m.risco === 'alto' ? 'red' : 'orange'}
                    onClick={() => set('morfologia', m.value)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </FieldGroup>

      <FieldGroup label="Distribuição" required>
        {CALC_DISTRIBUICAO.map(d => (
          <OptionChip
            key={d.value}
            label={d.label}
            active={value.distribuicao === d.value}
            onClick={() => set('distribuicao', d.value)}
          />
        ))}
      </FieldGroup>

      <div className="border-t border-gray-100 pt-4">
        <LocalizacaoForm
          value={value.localizacao}
          onChange={loc => set('localizacao', loc)}
        />
      </div>
    </div>
  )
}
