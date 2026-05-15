import type { AssimetriaDados, ComparacaoStatus } from '../../data/types'
import { ASSIMETRIA_TIPO } from '../../data/biradsData'
import LocalizacaoForm from '../Localizacao'
import AchadosAssociadosForm from '../AchadosAssociadosForm'
import FieldGroup from '../ui/FieldGroup'
import OptionChip from '../ui/OptionChip'

const COMPARACAO_OPTIONS: { value: ComparacaoStatus; label: string }[] = [
  { value: 'novo',       label: 'Achado novo' },
  { value: 'estavel',    label: 'Estável' },
  { value: 'crescente',  label: 'Em crescimento' },
  { value: 'regressivo', label: 'Em regressão' },
]

interface AssimetriaFormProps {
  value: AssimetriaDados
  onChange: (v: AssimetriaDados) => void
  exameAnteriorDisponivel: boolean
}

export default function AssimetriaForm({ value, onChange, exameAnteriorDisponivel }: AssimetriaFormProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tipo de Assimetria</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ASSIMETRIA_TIPO.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ ...value, tipo: t.value })}
              className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                value.tipo === t.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className={`text-sm font-semibold ${value.tipo === t.value ? 'text-blue-700' : 'text-gray-700'}`}>
                {value.tipo === t.value && '✓ '}{t.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.descricao}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <LocalizacaoForm
          value={value.localizacao}
          onChange={loc => onChange({ ...value, localizacao: loc })}
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <AchadosAssociadosForm
          value={value.achadosAssociados}
          onChange={aa => onChange({ ...value, achadosAssociados: aa })}
        />
      </div>

      {exameAnteriorDisponivel && (
        <div className="border-t border-gray-100 pt-4">
          <FieldGroup label="Comparação com exame anterior">
            {COMPARACAO_OPTIONS.map(opt => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                active={value.comparacaoComAnterior === opt.value}
                onClick={() => onChange({
                  ...value,
                  comparacaoComAnterior: value.comparacaoComAnterior === opt.value ? undefined : opt.value,
                })}
              />
            ))}
          </FieldGroup>
        </div>
      )}
    </div>
  )
}
