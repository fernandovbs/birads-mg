import type { DistorcaoArquiteturalDados } from '../../data/types'
import { DISTORCAO_ASSOCIACAO } from '../../data/biradsData'
import FieldGroup from '../ui/FieldGroup'
import OptionChip from '../ui/OptionChip'
import LocalizacaoForm from '../Localizacao'
import AchadosAssociadosForm from '../AchadosAssociadosForm'

interface DistorcaoFormProps {
  value: DistorcaoArquiteturalDados
  onChange: (v: DistorcaoArquiteturalDados) => void
}

export default function DistorcaoForm({ value, onChange }: DistorcaoFormProps) {
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
    </div>
  )
}
