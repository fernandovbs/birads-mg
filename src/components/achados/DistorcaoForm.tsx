import type { DistorcaoArquiteturalDados, ComparacaoStatus } from '../../data/types'
import { DISTORCAO_ASSOCIACAO } from '../../data/biradsData'
import FieldGroup from '../ui/FieldGroup'
import OptionChip from '../ui/OptionChip'
import LocalizacaoForm from '../Localizacao'
import AchadosAssociadosForm from '../AchadosAssociadosForm'

const COMPARACAO_OPTIONS: { value: ComparacaoStatus; label: string }[] = [
  { value: 'novo',       label: 'Achado novo' },
  { value: 'estavel',    label: 'Estável' },
  { value: 'crescente',  label: 'Em crescimento' },
  { value: 'regressivo', label: 'Em regressão' },
]

interface DistorcaoFormProps {
  value: DistorcaoArquiteturalDados
  onChange: (v: DistorcaoArquiteturalDados) => void
  exameAnteriorDisponivel: boolean
}

export default function DistorcaoForm({ value, onChange, exameAnteriorDisponivel }: DistorcaoFormProps) {
  const toggleAssociacao = (v: string) => {
    const atual = value.associadaA
    const novas = atual.includes(v) ? atual.filter(x => x !== v) : [...atual, v]
    onChange({ ...value, associadaA: novas })
  }

  return (
    <div className="space-y-5">
      <FieldGroup label="Associada a">
        {DISTORCAO_ASSOCIACAO.map(a => (
          <OptionChip
            key={a.value}
            label={a.label}
            active={value.associadaA.includes(a.value)}
            onClick={() => toggleAssociacao(a.value)}
          />
        ))}
      </FieldGroup>

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
