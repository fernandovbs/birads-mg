import { useState, useCallback, useMemo } from 'react'
import type {
  LaudoState, Achado, TipoAchado,
  NoduloDados, CalcificacoesDados, DistorcaoArquiteturalDados, AssimetriaDados,
  BiRadsCategory, ModoClassificacao,
} from './data/types'
import { COMPOSICAO_MAMARIA, BIRADS_CATEGORIAS } from './data/biradsData'
import { classificarAchados } from './utils/biradsClassifier'
import AchadoCard from './components/AchadoCard'
import BiRadsSelector from './components/BiRadsSelector'
import LaudoPreview from './components/LaudoPreview'
import ClassificacaoAutoPanel from './components/ClassificacaoAutoPanel'
import DocumentacaoTab from './components/DocumentacaoTab'
import SectionCard from './components/ui/SectionCard'
import OptionChip from './components/ui/OptionChip'

// ─── Estado inicial ────────────────────────────────────────────────────────────

const emptyAchadosAssociados = {
  retracaoCutanea: false, espessamentoCutaneo: false, retracaoMamilar: false,
  derrameMamilar: false, derrameMamilarTipo: undefined,
  linfonodoAxilarSuspeito: false, distorcaoArquitetural: false, calcificacoes: false,
}

const emptyLocalizacao = { mama: 'direita' as const }

function criarAchado(tipo: TipoAchado): Achado {
  const id = crypto.randomUUID()
  switch (tipo) {
    case 'nodulo': return {
      id, tipo,
      dados: { id, forma: '', margem: '', densidade: '', localizacao: { ...emptyLocalizacao }, achadosAssociados: { ...emptyAchadosAssociados } } as NoduloDados,
    }
    case 'calcificacao': return {
      id, tipo,
      dados: { id, tipo: 'suspeita', morfologia: '', distribuicao: '', localizacao: { ...emptyLocalizacao } } as CalcificacoesDados,
    }
    case 'distorcao': return {
      id, tipo,
      dados: { id, associadaA: [], localizacao: { ...emptyLocalizacao }, achadosAssociados: { ...emptyAchadosAssociados } } as DistorcaoArquiteturalDados,
    }
    case 'assimetria': return {
      id, tipo,
      dados: { id, tipo: 'focal', localizacao: { ...emptyLocalizacao }, achadosAssociados: { ...emptyAchadosAssociados } } as AssimetriaDados,
    }
  }
}

const TIPO_BOTOES: { tipo: TipoAchado; label: string; icon: string }[] = [
  { tipo: 'nodulo',       label: 'Nódulo',                icon: '◉' },
  { tipo: 'calcificacao', label: 'Calcificações',          icon: '✦' },
  { tipo: 'distorcao',    label: 'Distorção Arquitetural', icon: '⌁' },
  { tipo: 'assimetria',   label: 'Assimetria',             icon: '⊿' },
]

const initialState: LaudoState = {
  composicaoMamaria: '',
  achados: [],
  modoClassificacao: 'automatico',
  biradsDireita: undefined,
  biradsEsquerda: undefined,
  biradsFinal: undefined,
  observacoes: '',
}

// ─── App ───────────────────────────────────────────────────────────────────────

type AppTab = 'form' | 'classificacao' | 'laudo' | 'documentacao'

export default function App() {
  const [state, setState] = useState<LaudoState>(initialState)
  const [activeTab, setActiveTab] = useState<AppTab>('form')
  const [classificacaoModo, setClassificacaoModo] = useState<'separado' | 'unico'>('separado')

  // Classificação automática reativa
  const classificacaoAuto = useMemo(
    () => state.achados.length > 0 ? classificarAchados(state.achados) : null,
    [state.achados],
  )

  const setModoClassificacao = (modo: ModoClassificacao) =>
    setState(s => ({ ...s, modoClassificacao: modo }))

  const addAchado = useCallback((tipo: TipoAchado) => {
    setState(s => ({ ...s, achados: [...s.achados, criarAchado(tipo)] }))
  }, [])

  const updateAchado = useCallback((id: string, achado: Achado) => {
    setState(s => ({ ...s, achados: s.achados.map(a => a.id === id ? achado : a) }))
  }, [])

  const removeAchado = useCallback((id: string) => {
    setState(s => ({ ...s, achados: s.achados.filter(a => a.id !== id) }))
  }, [])

  const resetForm = () => {
    if (window.confirm('Deseja limpar todo o formulário?')) {
      setState(initialState)
      setActiveTab('form')
    }
  }

  // Dados para o preview do laudo
  const classificacaoParaLaudo =
    state.modoClassificacao === 'automatico' && classificacaoAuto
      ? classificacaoAuto
      : undefined

  // Indicador de achados incompletos no modo automático
  const achadosIncompletos = classificacaoAuto
    ? classificacaoAuto.porAchado.filter(c => c.incompleto).length
    : 0

  const TABS: { id: AppTab; label: string }[] = [
    { id: 'form',           label: 'Achados' },
    { id: 'classificacao',  label: 'Classificação' },
    { id: 'laudo',          label: 'Laudo' },
    { id: 'documentacao',   label: 'Referências' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">BI-RADS MG® 2025</h1>
              <p className="text-xs text-gray-500">Gerador de Laudo Mamográfico Estruturado</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Limpar
            </button>
          </div>
          {/* Navegação por abas */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.id === 'classificacao' && state.modoClassificacao === 'automatico' && state.achados.length > 0 && (
                  <span className={`ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    {achadosIncompletos > 0 ? '!' : '✓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* ── ABA: ACHADOS ── */}
        {activeTab === 'form' && (
          <div className="space-y-5">
            {/* Composição Mamária */}
            <SectionCard
              title="Composição Mamária"
              subtitle="Selecione a categoria de densidade mamária (ACR BI-RADS 2025)"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPOSICAO_MAMARIA.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setState(s => ({ ...s, composicaoMamaria: c.value }))}
                    className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      state.composicaoMamaria === c.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${state.composicaoMamaria === c.value ? 'text-blue-700' : 'text-gray-700'}`}>
                      {state.composicaoMamaria === c.value && '✓ '}{c.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.descricao}</p>
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Achados */}
            <SectionCard
              title="Achados"
              subtitle="Adicione e configure os achados identificados no exame"
            >
              <div className="flex flex-wrap gap-2 mb-5">
                {TIPO_BOTOES.map(b => (
                  <button
                    key={b.tipo}
                    type="button"
                    onClick={() => addAchado(b.tipo)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>{b.icon}</span>
                    <span>+ {b.label}</span>
                  </button>
                ))}
              </div>

              {state.achados.length === 0 ? (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Nenhum achado adicionado.</p>
                  <p className="text-gray-400 text-xs mt-1">Use os botões acima para adicionar achados ao laudo.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.achados.map(achado => (
                    <AchadoCard
                      key={achado.id}
                      achado={achado}
                      index={state.achados.filter(a => a.tipo === achado.tipo).findIndex(a => a.id === achado.id)}
                      onChange={a => updateAchado(achado.id, a)}
                      onRemove={() => removeAchado(achado.id)}
                    />
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Observações */}
            <SectionCard title="Observações Adicionais">
              <textarea
                rows={3}
                placeholder="Informações complementares, comparação com exame anterior, etc."
                value={state.observacoes ?? ''}
                onChange={e => setState(s => ({ ...s, observacoes: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </SectionCard>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('classificacao')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Classificar →
              </button>
            </div>
          </div>
        )}

        {/* ── ABA: CLASSIFICAÇÃO ── */}
        {activeTab === 'classificacao' && (
          <div className="space-y-5">
            {/* Toggle modo */}
            <SectionCard
              title="Modo de Classificação BI-RADS"
              subtitle="Escolha entre classificação automática (baseada nos achados) ou atribuição manual"
            >
              <div className="flex gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setModoClassificacao('automatico')}
                  className={`flex-1 flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                    state.modoClassificacao === 'automatico'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mt-0.5">⚡</span>
                  <div>
                    <p className={`text-sm font-semibold ${state.modoClassificacao === 'automatico' ? 'text-blue-700' : 'text-gray-700'}`}>
                      {state.modoClassificacao === 'automatico' && '✓ '}Automático
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      A ferramenta infere o BI-RADS segundo as regras do ACR 2025, com raciocínio detalhado por achado.
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setModoClassificacao('manual')}
                  className={`flex-1 flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                    state.modoClassificacao === 'manual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mt-0.5">✏️</span>
                  <div>
                    <p className={`text-sm font-semibold ${state.modoClassificacao === 'manual' ? 'text-blue-700' : 'text-gray-700'}`}>
                      {state.modoClassificacao === 'manual' && '✓ '}Manual
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      O radiologista atribui a categoria BI-RADS diretamente para cada mama ou bilateralmente.
                    </p>
                  </div>
                </button>
              </div>

              {/* ── AUTOMÁTICO ── */}
              {state.modoClassificacao === 'automatico' && (
                <>
                  {state.achados.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm">Nenhum achado cadastrado.</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('form')}
                        className="mt-2 text-blue-500 text-xs hover:underline"
                      >
                        ← Voltar para adicionar achados
                      </button>
                    </div>
                  ) : classificacaoAuto ? (
                    <ClassificacaoAutoPanel
                      resultado={classificacaoAuto}
                      achados={state.achados}
                    />
                  ) : null}
                </>
              )}

              {/* ── MANUAL ── */}
              {state.modoClassificacao === 'manual' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <OptionChip
                      label="Separado por mama"
                      active={classificacaoModo === 'separado'}
                      onClick={() => setClassificacaoModo('separado')}
                    />
                    <OptionChip
                      label="Bilateral único"
                      active={classificacaoModo === 'unico'}
                      onClick={() => setClassificacaoModo('unico')}
                    />
                  </div>

                  {classificacaoModo === 'separado' ? (
                    <div className="space-y-5">
                      <BiRadsSelector
                        label="Mama Direita"
                        value={state.biradsDireita}
                        onChange={v => setState(s => ({ ...s, biradsDireita: v as BiRadsCategory | undefined }))}
                      />
                      <BiRadsSelector
                        label="Mama Esquerda"
                        value={state.biradsEsquerda}
                        onChange={v => setState(s => ({ ...s, biradsEsquerda: v as BiRadsCategory | undefined }))}
                      />
                    </div>
                  ) : (
                    <BiRadsSelector
                      label="Bilateral"
                      value={state.biradsFinal}
                      onChange={v => setState(s => ({ ...s, biradsFinal: v as BiRadsCategory | undefined }))}
                    />
                  )}

                  {/* Referência */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Referência — Probabilidade de Malignidade
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BIRADS_CATEGORIAS.map(b => (
                        <div key={b.categoria} className={`rounded-lg px-3 py-2 ${b.cor}`}>
                          <p className={`text-xs font-bold ${b.corTexto}`}>{b.categoria}</p>
                          <p className={`text-xs ${b.corTexto} opacity-80`}>{b.malignidade}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Achados
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('laudo')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Ver Laudo →
              </button>
            </div>
          </div>
        )}

        {/* ── ABA: LAUDO ── */}
        {activeTab === 'laudo' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('classificacao')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Classificação
                </button>
                <h2 className="text-lg font-bold text-gray-900">Laudo Gerado</h2>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                state.modoClassificacao === 'automatico'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {state.modoClassificacao === 'automatico' ? '⚡ Classificação automática' : '✏️ Classificação manual'}
              </span>
            </div>

            <LaudoPreview
              state={state}
              classificacaoAuto={classificacaoParaLaudo}
            />
          </div>
        )}

        {/* ── ABA: REFERÊNCIAS ── */}
        {activeTab === 'documentacao' && <DocumentacaoTab />}
      </main>
    </div>
  )
}
