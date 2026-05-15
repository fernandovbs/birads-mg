import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import regrasBirads from '../../REGRAS_CLASSIFICACAO_BIRADS.md?raw'
import estruturaFormulario from '../../ESTRUTURA_FORMULARIO_LAUDO.md?raw'

// ─── Componentes de renderização Markdown ─────────────────────────────────────

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-2 pb-3 border-b-2 border-blue-100">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mt-10 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-gray-700 mt-6 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 text-sm text-gray-700 mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-gray-700 leading-relaxed">{children}</li>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-100">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-sm text-gray-700 align-top">{children}</td>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto mb-4 font-mono leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? '')
    if (isBlock) return <code className={className ?? ''}>{children}</code>
    return (
      <code className="bg-blue-50 text-blue-800 text-xs rounded px-1.5 py-0.5 font-mono border border-blue-100">
        {children}
      </code>
    )
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-300 pl-4 py-1 text-sm text-gray-600 italic my-4 bg-blue-50 rounded-r-lg">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-gray-200 my-8" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
    >
      {children}
    </a>
  ),
}

// ─── Índices de navegação por documento ──────────────────────────────────────

const INDICE_REGRAS = [
  { id: 'r-intro',       label: '1. Introdução' },
  { id: 'r-categorias',  label: '2. Categorias' },
  { id: 'r-nodulo',      label: '3.1 Nódulo' },
  { id: 'r-calc',        label: '3.2 Calcificações' },
  { id: 'r-distorcao',   label: '3.3 Distorção' },
  { id: 'r-assimetria',  label: '3.4 Assimetria' },
  { id: 'r-associados',  label: '4. Modificadores' },
  { id: 'r-agregacao',   label: '5. Agregação' },
  { id: 'r-fluxo',       label: '6. Fluxo' },
  { id: 'r-limitacoes',  label: '7. Limitações' },
  { id: 'r-referencias', label: '8. Referências' },
  { id: 'r-codigo',      label: '9. Código' },
]

const INDICE_FORMULARIO = [
  { id: 'f-visao',          label: '1. Fluxo geral' },
  { id: 'f-composicao',     label: '2.1 Composição' },
  { id: 'f-exame-anterior', label: '2.2 Exames Anteriores' },
  { id: 'f-achados',        label: '2.3 Achados' },
  { id: 'f-nodulo',         label: '2.3.1 Nódulo' },
  { id: 'f-calc',           label: '2.3.2 Calcificações' },
  { id: 'f-distorcao',      label: '2.3.3 Distorção' },
  { id: 'f-assimetria',     label: '2.3.4 Assimetria' },
  { id: 'f-localizacao',    label: '2.4 Localização' },
  { id: 'f-associados',     label: '2.5 Achados Assoc.' },
  { id: 'f-obs',            label: '2.6 Observações' },
  { id: 'f-classif',        label: '3. Classificação' },
  { id: 'f-laudo',          label: '4. Laudo' },
  { id: 'f-estrutura',      label: '5. Estrutura texto' },
  { id: 'f-ordem',          label: '6. Ordem lógica' },
  { id: 'f-campos',         label: '7. Campos' },
  { id: 'f-correspondencia', label: '8. Mapeamento' },
]

// ─── Configuração dos documentos ──────────────────────────────────────────────

type DocId = 'regras' | 'formulario'

const DOCS: { id: DocId; label: string; subtitle: string; content: string; indice: typeof INDICE_REGRAS }[] = [
  {
    id: 'regras',
    label: 'Regras de Classificação',
    subtitle: 'ACR BI-RADS® Atlas 5.ª ed. (2013) · Atualização 2025',
    content: regrasBirads,
    indice: INDICE_REGRAS,
  },
  {
    id: 'formulario',
    label: 'Estrutura do Formulário',
    subtitle: 'Seções, campos, opções e ordem lógica de composição do laudo',
    content: estruturaFormulario,
    indice: INDICE_FORMULARIO,
  },
]

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DocumentacaoTab() {
  const [docAtivo, setDocAtivo] = useState<DocId>('regras')
  const doc = DOCS.find(d => d.id === docAtivo)!

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Cabeçalho com seletor de documento */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Documentação Técnica</h2>
          <p className="text-xs text-gray-500 mt-0.5">BI-RADS MG® 2025 — BI-RADS Report Builder</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          {DOCS.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDocAtivo(d.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                docAtivo === d.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtítulo do documento ativo */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500 italic">{doc.subtitle}</p>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-3 py-0.5">
          Documentação técnica
        </span>
      </div>

      {/* Índice de seções */}
      <nav className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-x-4 gap-y-1">
        {doc.indice.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* Âncoras e conteúdo */}
      <div className="px-6 sm:px-8 py-6">
        {/* Âncoras invisíveis para navegação */}
        {doc.indice.map(s => <span key={s.id} id={s.id} />)}

        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {doc.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
