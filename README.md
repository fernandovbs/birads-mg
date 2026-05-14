# BI-RADS MG® 2025 — Gerador de Laudo Mamográfico

Ferramenta educacional e de apoio à decisão para descrição sistemática e geração de laudos mamográficos estruturados, segundo o léxico ACR BI-RADS® MG (5.ª edição, 2013; atualização 2025).

Desenvolvida como parte de projeto de mestrado na Faculdade de Ciências Médicas da UNICAMP.

---

## Funcionalidades

- **Formulário estruturado** com todos os descritores do léxico ACR BI-RADS MG para os quatro tipos de achado:
  - Nódulo (forma, margem, densidade, tamanho)
  - Calcificações (morfologia benigna/suspeita, distribuição)
  - Distorção Arquitetural
  - Assimetria (4 subtipos)
- **Localização completa** por mama, quadrante, posição horária, profundidade e distância do mamilo
- **Achados associados** com impacto automático na classificação
- **Classificação BI-RADS automática** baseada nas regras da matriz ACR 2025, com raciocínio detalhado por achado e agregação por mama
- **Classificação manual** como alternativa, por mama ou bilateral
- **Gerador de texto de laudo** estruturado com conduta recomendada, copiável para RIS/PACS
- **Documentação técnica** integrada na aba Referências:
  - Regras de classificação com 17 referências bibliográficas
  - Estrutura completa do formulário e ordem lógica de composição

---

## Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18 | Interface |
| TypeScript | 5 | Tipagem estática |
| Vite | 6 | Build e dev server |
| Tailwind CSS | 3 | Estilização |
| react-markdown | 10 | Renderização da documentação |
| remark-gfm | 4 | Tabelas GFM no markdown |

---

## Como rodar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

> **Node.js 18+** requerido.

---

## Estrutura do projeto

```
src/
├── App.tsx                        # Componente raiz, navegação por abas
├── data/
│   ├── biradsData.ts              # Léxico BI-RADS MG completo (dados)
│   └── types.ts                   # Interfaces TypeScript
├── utils/
│   ├── biradsClassifier.ts        # Motor de classificação automática ACR 2025
│   └── laudoGenerator.ts          # Gerador de texto estruturado do laudo
└── components/
    ├── AchadoCard.tsx             # Card colapsável por achado
    ├── AchadosAssociadosForm.tsx  # Achados associados (toggles)
    ├── BiRadsSelector.tsx         # Seletor BI-RADS manual
    ├── ClassificacaoAutoPanel.tsx # Painel de classificação automática
    ├── DocumentacaoTab.tsx        # Aba de documentação técnica
    ├── LaudoPreview.tsx           # Preview e cópia do laudo
    ├── Localizacao.tsx            # Formulário de localização
    ├── achados/
    │   ├── NoduloForm.tsx
    │   ├── CalcificacoesForm.tsx
    │   ├── DistorcaoForm.tsx
    │   └── AssimetriaForm.tsx
    └── ui/
        ├── FieldGroup.tsx
        ├── OptionChip.tsx
        └── SectionCard.tsx

REGRAS_CLASSIFICACAO_BIRADS.md    # Documentação das regras ACR + referências
ESTRUTURA_FORMULARIO_LAUDO.md     # Documentação da estrutura do formulário
```

---

## Fluxo de uso

```
1. Achados
   └─ Composição mamária → adicionar achados → localização → achados associados

2. Classificação
   ├─ Automático: inferência pelas regras ACR 2025 com raciocínio por achado
   └─ Manual: atribuição direta por mama ou bilateral

3. Laudo
   └─ Texto estruturado gerado automaticamente → copiar para o sistema
```

---

## Referência normativa

> D'Orsi CJ, Sickles EA, Mendelson EB, Morris EA et al. *ACR BI-RADS® Atlas, Breast Imaging Reporting and Data System.* Reston, VA: American College of Radiology, 2013. 5.ª edição. Com atualização 2025.

A lista completa de 17 referências bibliográficas está disponível na aba **Referências → Regras de Classificação** dentro da própria aplicação.

---

## Aviso

Esta ferramenta é de **apoio educacional e à decisão**. Não substitui o julgamento clínico do radiologista. A classificação automática é determinística com base nos descritores selecionados e deve ser revisada pelo profissional responsável pelo laudo.
