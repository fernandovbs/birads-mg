# Estrutura do Formulário de Laudo Mamográfico BI-RADS MG

**Sistema:** BI-RADS Report Builder  
**Versão:** 0.1.0  
**Data:** Maio de 2026

---

## 1. Visão Geral do Fluxo

O formulário está organizado em três abas sequenciais que refletem o raciocínio radiológico estruturado:

```
Aba 1: ACHADOS
  └─ 1.1 Composição Mamária       ← pré-requisito do laudo
  └─ 1.2 Achados (0..N)           ← núcleo diagnóstico
  └─ 1.3 Observações Adicionais   ← contexto complementar
        ↓
Aba 2: CLASSIFICAÇÃO
  └─ 2.1 Modo Automático          ← inferência pelas regras ACR 2025
     ou
  └─ 2.2 Modo Manual              ← atribuição direta pelo radiologista
        ↓
Aba 3: LAUDO
  └─ 3.1 Banner de classificação  ← categoria final + conduta
  └─ 3.2 Texto estruturado        ← laudo copiável
```

> **Ordem lógica obrigatória:** composição mamária → achados (um por vez, do mais relevante ao menos relevante) → achados associados → localização → classificação → laudo.

---

## 2. Aba 1 — Achados

### 2.1 Composição Mamária

**Tipo de campo:** seleção única (obrigatória)  
**Posição no laudo gerado:** primeiro parágrafo, após a técnica

| Valor | Rótulo | Significado clínico |
|-------|--------|---------------------|
| `a` | a) Predominantemente gordurosa | < 25 % de tecido fibroglandular; alta sensibilidade mamográfica |
| `b` | b) Tecido fibroglandular disperso | 25–50 % de tecido fibroglandular; sensibilidade levemente reduzida |
| `c` | c) Mamas heterogeneamente densas | 51–75 % de tecido fibroglandular; pode obscurecer pequenas massas |
| `d` | d) Mamas extremamente densas | > 75 % de tecido fibroglandular; redução significativa da sensibilidade |

> A composição mamária afeta a interpretação de todos os achados e deve ser selecionada antes de qualquer descrição de achado. Categorias `c` e `d` sugerem considerar exames complementares (US, RM) para rastreamento.

---

### 2.2 Achados

Múltiplos achados podem ser adicionados. Cada achado é independente e possui seu próprio formulário colapsável. A ordem de adição determina a numeração no laudo (Nódulo 1, Nódulo 2, Calcificações 1, etc.).

**Tipos de achado disponíveis:**

| Ícone | Tipo | Quando usar |
|-------|------|-------------|
| ◉ | **Nódulo** | Opacidade com volume tridimensional, visível em duas projeções |
| ✦ | **Calcificações** | Depósitos de cálcio, benignos ou suspeitos |
| ⌁ | **Distorção Arquitetural** | Alteração da arquitetura sem massa definida |
| ⊿ | **Assimetria** | Diferença de volume ou densidade entre as mamas |

---

#### 2.2.1 Nódulo

##### Campos obrigatórios para classificação automática

**Forma** — seleção única

| Valor | Rótulo | Perfil de risco |
|-------|--------|-----------------|
| `oval` | Oval | Baixo |
| `redondo` | Redondo | Baixo |
| `irregular` | Irregular | Alto |

**Margem** — seleção única — codificação visual por risco

| Valor | Rótulo | Risco | Cor no formulário |
|-------|--------|-------|-------------------|
| `circunscrita` | Circunscrita | Baixo | Verde |
| `obscurecida` | Obscurecida | Médio | Amarelo |
| `microlobulada` | Microlobulada | Médio | Amarelo |
| `indistinta` | Indistinta | Alto | Vermelho |
| `espiculada` | Espiculada | Alto | Vermelho |

**Densidade** — seleção única — codificação visual por risco

| Valor | Rótulo | Risco | Cor no formulário |
|-------|--------|-------|-------------------|
| `alta` | Alta densidade | Alto | Vermelho |
| `isodensa` | Isodensa | Médio | Amarelo |
| `baixa` | Baixa densidade | Baixo | Verde |
| `gordurosa` | Com componente gorduroso | Baixo (benigno) | Verde |

##### Campo opcional

**Maior Diâmetro (cm)** — entrada de texto livre (numérico decimal)  
Exemplo: `1.5`. Incluído no texto do laudo quando preenchido.

---

#### 2.2.2 Calcificações

##### Morfologia — seleção em dois níveis

**Nível 1 — Tipo** — seleção única obrigatória

| Valor | Rótulo |
|-------|--------|
| `benigna` | Tipicamente Benigna |
| `suspeita` | Suspeita |

**Nível 2 — Morfologia específica** — seleção única, condicional ao tipo escolhido

*Morfologias tipicamente benignas* (exibidas quando tipo = `benigna`):

| Valor | Rótulo |
|-------|--------|
| `pele` | De pele |
| `vasculares` | Vasculares |
| `pipoca` | Grosseiras ou "em pipoca" |
| `bastonetes` | Grosseiras em bastonetes |
| `redondas` | Redondas |
| `casca-ovo` | Em casca de ovo / periféricas |
| `distroficas` | Distróficas |
| `leite-calcio` | Leite de cálcio |
| `sutura` | De sutura |

*Morfologias suspeitas* (exibidas quando tipo = `suspeita`):

| Valor | Rótulo | Nível de risco | Cor no formulário |
|-------|--------|----------------|-------------------|
| `amorfas` | Amorfas | Intermediário | Laranja |
| `grosseiras-heterogeneas` | Grosseiras heterogêneas | Intermediário | Laranja |
| `pleomorficas-finas` | Pleomórficas finas | Alto | Vermelho |
| `lineares-finas` | Lineares finas ou lineares ramificadas | Alto | Vermelho |

##### Distribuição — seleção única obrigatória

| Valor | Rótulo |
|-------|--------|
| `difusa` | Difusa |
| `regional` | Regional |
| `agrupada` | Agrupada |
| `linear` | Linear |
| `segmentar` | Segmentar |

> Calcificações **não possuem** o bloco de Achados Associados — apenas localização.

---

#### 2.2.3 Distorção Arquitetural

##### Associada a — seleção múltipla (0 a N opções)

| Valor | Rótulo |
|-------|--------|
| `sem-nodulo` | Sem nódulo associado |
| `com-nodulo` | Com nódulo associado |
| `com-calcificacoes` | Com calcificações associadas |
| `cicatriz` | Associada a cicatriz cirúrgica prévia |

> A combinação de valores é livre. A presença de `cicatriz` sem nódulo ou calcificações resulta em BI-RADS 2 na classificação automática.

---

#### 2.2.4 Assimetria

##### Tipo — seleção única obrigatória — exibição em grade de cards

| Valor | Rótulo | Descrição exibida no card |
|-------|--------|---------------------------|
| `assimetria` | Assimetria | Tecido fibroglandular visível em uma projeção apenas, sem volume tridimensional. |
| `global` | Assimetria Global | Maior volume de tecido fibroglandular em uma mama comparada à contralateral, envolvendo pelo menos um quadrante. |
| `focal` | Assimetria Focal | Tecido com volume tridimensional em mais de uma projeção, porém sem margem convexa ou efeito de massa. |
| `desenvolvimento` | Assimetria em Desenvolvimento | Achado novo, maior ou mais proeminente em comparação a exame prévio. |

---

### 2.3 Localização — bloco compartilhado por todos os tipos de achado

Aparece em todos os formulários de achado. Todos os campos são opcionais para o preenchimento do formulário, mas a **mama** é usada pela classificação automática para agregar os achados por lado.

**Mama** — seleção única

| Valor | Rótulo |
|-------|--------|
| `direita` | Mama Direita |
| `esquerda` | Mama Esquerda |
| `bilateral` | Bilateral |

> Quando `bilateral`, o achado contribui para a classificação de **ambas** as mamas. O valor padrão ao criar um achado é `direita`.

**Quadrante** — seleção única opcional (toggle — clicar novamente desmarca)

| Valor | Rótulo completo |
|-------|-----------------|
| `QSE` | QSE — Quadrante Superior Externo |
| `QSI` | QSI — Quadrante Superior Interno |
| `QIE` | QIE — Quadrante Inferior Externo |
| `QII` | QII — Quadrante Inferior Interno |
| `UQS` | UQS — União dos Quadrantes Superiores |
| `UQI` | UQI — União dos Quadrantes Inferiores |
| `UQE` | UQE — União dos Quadrantes Externos |
| `UQMI` | UQMI — União dos Quadrantes Mediais/Internos |
| `central` | Região Central |
| `retroareolar` | Retroareolar |
| `axila` | Prolongamento Axilar |

**Posição Horária** — seleção única opcional (toggle)

`12h` · `1h` · `2h` · `3h` · `4h` · `5h` · `6h` · `7h` · `8h` · `9h` · `10h` · `11h`

**Profundidade** — seleção única opcional (toggle)

| Valor | Rótulo |
|-------|--------|
| `anterior` | 1/3 Anterior |
| `medio` | 1/3 Médio |
| `posterior` | 1/3 Posterior |

**Distância do Mamilo (cm)** — entrada de texto livre (numérico decimal)  
Exemplo: `2.5`

---

### 2.4 Achados Associados — bloco compartilhado por nódulo, distorção e assimetria

**Seleção múltipla independente** — cada item é um toggle booleano. Qualquer combinação é válida.

| Chave interna | Rótulo exibido | Impacto na classificação automática |
|---------------|---------------|--------------------------------------|
| `retracaoCutanea` | Retração cutânea | Eleva para ≥ BI-RADS 4A |
| `espessamentoCutaneo` | Espessamento cutâneo | Eleva para ≥ BI-RADS 4A |
| `retracaoMamilar` | Retração mamilar | Eleva para ≥ BI-RADS 4A |
| `derrameMamilar` | Derrame mamilar espontâneo | Eleva para ≥ BI-RADS 4A (apenas tipo sanguinolento) |
| `linfonodoAxilarSuspeito` | Linfonodo axilar suspeito | Eleva para ≥ BI-RADS 4A |
| `distorcaoArquitetural` | Distorção arquitetural associada | Registrado no laudo; não eleva automaticamente (deve ser cadastrado como achado separado) |
| `calcificacoes` | Calcificações associadas | Registrado no laudo; não eleva automaticamente |

**Tipo de Derrame Mamilar** — campo condicional, exibido apenas quando `derrameMamilar = true`  
Seleção única opcional (toggle):

| Valor | Rótulo | Impacto |
|-------|--------|---------|
| `sangue` | Sanguinolento | Eleva para ≥ BI-RADS 4A |
| `claro` | Claro/seroso | Sem elevação automática |
| `leitoso` | Leitoso | Sem elevação automática |
| `opaco` | Opaco | Sem elevação automática |

---

### 2.5 Observações Adicionais

**Tipo:** área de texto livre (3 linhas visíveis, redimensionável desativado)  
**Posição no laudo:** seção `OBSERVAÇÕES`, antes da `CONCLUSÃO`  
**Uso típico:** comparação com exame anterior, dados clínicos relevantes, limitações técnicas do exame

---

## 3. Aba 2 — Classificação BI-RADS

### 3.1 Modo Automático (padrão)

A classificação é inferida em tempo real à medida que os achados são preenchidos na Aba 1. O resultado é atualizado reativamente sem necessidade de ação do usuário.

**Exibições disponíveis neste modo:**

- **Classificação por mama** — badge com BI-RADS final para Mama Direita e Mama Esquerda (quando houver achados em cada lado)
- **Raciocínio por achado** — card expandido para cada achado com:
  - Categoria calculada
  - Determinantes (razões da classificação)
  - Modificadores (achados associados que alteraram a categoria)
  - Alerta de campo incompleto
- **Avisos** — alertas sobre múltiplos achados BI-RADS 3 (≥ 3 na mesma mama) ou achados incompletos
- **Tabela de referência** — probabilidades de malignidade por categoria (colapsável)

**Indicador na aba:** badge numérico (`✓` quando todos os achados estão completos, `!` quando há incompletos)

### 3.2 Modo Manual

O radiologista atribui a categoria diretamente. Dois sub-modos disponíveis:

**Sub-modo Separado por Mama** (padrão no modo manual):

| Campo | Tipo | Opções |
|-------|------|--------|
| Mama Direita | Seleção única | 0 · 1 · 2 · 3 · 4A · 4B · 4C · 5 · 6 |
| Mama Esquerda | Seleção única | 0 · 1 · 2 · 3 · 4A · 4B · 4C · 5 · 6 |

**Sub-modo Bilateral Único:**

| Campo | Tipo | Opções |
|-------|------|--------|
| Bilateral | Seleção única | 0 · 1 · 2 · 3 · 4A · 4B · 4C · 5 · 6 |

> Em ambos os sub-modos, clicar na categoria selecionada novamente a desmarca (toggle). A tabela de referência com probabilidades de malignidade é sempre exibida no modo manual.

### 3.3 Categorias BI-RADS disponíveis para seleção

| Categoria | Denominação | Prob. de malignidade | Conduta gerada no laudo |
|-----------|-------------|----------------------|-------------------------|
| `0` | Incompleto | — | Complementação diagnóstica |
| `1` | Negativo | 0 % | Rastreamento anual |
| `2` | Benigno | 0 % | Rastreamento anual |
| `3` | Provavelmente Benigno | < 2 % | Controle em 6/12/24 meses |
| `4A` | Baixa Suspeição | > 2 % a ≤ 10 % | Biópsia guiada por imagem |
| `4B` | Moderada Suspeição | > 10 % a ≤ 50 % | Biópsia guiada por imagem |
| `4C` | Alta Suspeição | > 50 % a < 95 % | Biópsia guiada por imagem |
| `5` | Altamente Sugestivo | ≥ 95 % | Biópsia + considerar cirurgia |
| `6` | Malignidade Comprovada | 100 % | Tratamento oncológico |

---

## 4. Aba 3 — Laudo

### 4.1 Banner de classificação

Exibido no topo quando há pelo menos uma categoria definida. Mostra:
- Categoria mais alta entre as mamas
- Probabilidade de malignidade
- Conduta recomendada
- Indicação de modo (automático ou manual)

### 4.2 Texto do laudo

Gerado automaticamente. Inclui botão **Copiar** (copia para a área de transferência).

---

## 5. Estrutura do Texto de Laudo Gerado

O texto segue a seguinte estrutura fixa, com seções condicionais:

```
MAMOGRAFIA BILATERAL

TÉCNICA: Exame realizado nas incidências craniocaudal (CC) e
médio-lateral-oblíqua (MLO) bilateralmente.

COMPOSIÇÃO MAMÁRIA:                          ← somente se preenchida
[categoria selecionada]

ACHADOS:

[Tipo de achado] N: [descrição dos descritores]
Localização: [mama] [posição horária] [quadrante] [profundidade] [distância do mamilo]
Achados associados: [lista]                  ← somente se houver

[repete para cada achado]

OBSERVAÇÕES:                                 ← somente se preenchidas
[texto livre]

CONCLUSÃO:
Mama Direita: BI-RADS [X] — [denominação]   ← modo separado
Mama Esquerda: BI-RADS [X] — [denominação]
  ou
Bilateral: BI-RADS [X] — [denominação]      ← modo bilateral

CONDUTA:
[texto da conduta correspondente à categoria]
```

### 5.1 Formato de texto por tipo de achado

**Nódulo:**
```
Nódulo N: Opacidade nodular de forma [forma], com margem [margem]
e [densidade][, medindo X cm].
Localização: [localização completa].
Achados associados: [lista].
```

**Calcificações:**
```
Calcificações N: Calcificações de [morfologia tipicamente benigna |
morfologia suspeita], [morfologia específica], com distribuição [distribuição].
Localização: [localização completa].
```

**Distorção Arquitetural:**
```
Distorção Arquitetural N: Distorção da arquitetura do parênquima
mamário[ — associação(ões)].
Localização: [localização completa].
Achados associados: [lista].
```

**Assimetria:**
```
Assimetria N: [tipo de assimetria].
Localização: [localização completa].
Achados associados: [lista].
```

---

## 6. Ordem Lógica Recomendada para Composição do Laudo

A sequência abaixo representa o fluxo ideal para obter um laudo completo e minimizar retrabalho:

```
PASSO 1 — Composição Mamária
  ┌─ Selecione a categoria a/b/c/d
  └─ Isso define o contexto de sensibilidade para todos os achados

PASSO 2 — Primeiro achado (mais relevante clinicamente)
  ├─ 2a. Selecione o tipo (nódulo, calcificação, distorção, assimetria)
  ├─ 2b. Preencha os descritores específicos do tipo
  │       Nódulo:       forma → margem → densidade → tamanho (opcional)
  │       Calcificações: tipo → morfologia → distribuição
  │       Distorção:    associações (multi-select)
  │       Assimetria:   tipo (card)
  ├─ 2c. Localização
  │       mama → posição horária → quadrante → profundidade → distância
  └─ 2d. Achados associados (se aplicável ao tipo)
          ativar toggles → especificar tipo de derrame (se derrame ativo)

PASSO 3 — Achados adicionais
  └─ Repita o Passo 2 para cada achado adicional

PASSO 4 — Observações Adicionais (opcional)
  └─ Preencha apenas se houver contexto clínico relevante

PASSO 5 — Classificação
  ├─ Modo Automático (padrão): revisar o raciocínio gerado
  │   ├─ Verifique se todos os achados estão sem alerta de incompleto
  │   └─ Confirme a classificação por mama
  └─ Modo Manual: selecionar categoria por mama ou bilateral

PASSO 6 — Laudo
  └─ Revisar o texto gerado e copiar para o sistema de destino (RIS/PACS/editor)
```

### 6.1 Critérios de completude por tipo de achado

| Tipo de achado | Campos mínimos para classificação automática válida |
|----------------|-----------------------------------------------------|
| Nódulo | Forma + Margem + Densidade + Mama |
| Calcificações | Tipo morfológico + Morfologia específica + Distribuição + Mama |
| Distorção | Mama (associações são opcionais) |
| Assimetria | Tipo + Mama |

> Achados com campos mínimos ausentes recebem **BI-RADS 0** automaticamente e exibem um alerta `!` no badge da aba Classificação.

### 6.2 Dependências entre campos

| Campo | Depende de | Comportamento |
|-------|-----------|---------------|
| Morfologia específica de calcificações | Tipo morfológico (`benigna` / `suspeita`) | Exibição condicional — lista diferente para cada tipo |
| Tipo de derrame mamilar | `derrameMamilar = true` nos Achados Associados | Campo oculto até que o toggle de derrame seja ativado |
| Classificação por mama direita/esquerda | Sub-modo "Separado por mama" selecionado | Dois campos independentes |
| Classificação bilateral | Sub-modo "Bilateral único" selecionado | Campo único |

---

## 7. Comportamento de Seleção dos Campos

| Tipo de controle | Comportamento | Exemplos |
|-----------------|---------------|---------|
| **Chip de seleção única** | Clicar seleciona; não é possível desmarcar sem selecionar outra opção | Forma, Margem, Densidade, Tipo morfológico, Tipo de assimetria |
| **Chip de toggle** | Clicar seleciona; clicar novamente desmarca (permite estado vazio) | Quadrante, Posição horária, Profundidade, BI-RADS manual |
| **Toggle booleano** | Ativado/desativado por clique; múltiplas seleções simultâneas | Achados associados, Associações da distorção |
| **Card de seleção** | Cartão clicável com título e descrição; seleção única | Composição mamária, Tipo de assimetria, Modo de classificação |
| **Entrada de texto** | Campo livre numérico | Tamanho do nódulo (cm), Distância do mamilo (cm) |
| **Área de texto** | Campo livre multi-linha | Observações adicionais |

---

## 8. Correspondência entre Campos do Formulário e Dados do Sistema

| Campo no formulário | Chave interna | Arquivo de dados |
|---------------------|--------------|-----------------|
| Composição Mamária | `composicaoMamaria` (string `'a'`\|`'b'`\|`'c'`\|`'d'`) | `COMPOSICAO_MAMARIA` em `biradsData.ts` |
| Forma do nódulo | `NoduloDados.forma` | `NODULO_FORMA` |
| Margem do nódulo | `NoduloDados.margem` | `NODULO_MARGEM` |
| Densidade do nódulo | `NoduloDados.densidade` | `NODULO_DENSIDADE` |
| Tamanho do nódulo | `NoduloDados.tamanho` (string\|undefined) | — |
| Tipo morfológico calcificações | `CalcificacoesDados.tipo` (`'benigna'`\|`'suspeita'`) | — |
| Morfologia calcificações | `CalcificacoesDados.morfologia` | `CALC_MORFOLOGIA_BENIGNA` / `CALC_MORFOLOGIA_SUSPEITA` |
| Distribuição calcificações | `CalcificacoesDados.distribuicao` | `CALC_DISTRIBUICAO` |
| Associações da distorção | `DistorcaoArquiteturalDados.associadaA` (string[]) | `DISTORCAO_ASSOCIACAO` |
| Tipo de assimetria | `AssimetriaDados.tipo` | `ASSIMETRIA_TIPO` |
| Mama | `localizacao.mama` | `MAMA_LADO` |
| Quadrante | `localizacao.quadrante` (string\|undefined) | `QUADRANTE` |
| Posição horária | `localizacao.posicaoHoraria` (string\|undefined) | `POSICAO_HORARIA` |
| Profundidade | `localizacao.profundidade` (string\|undefined) | `PROFUNDIDADE` |
| Distância do mamilo | `localizacao.distanciaMamilo` (string\|undefined) | — |
| Achados associados | `achadosAssociados.*` (boolean) | `ACHADOS_ASSOCIADOS` |
| Tipo de derrame | `achadosAssociados.derrameMamilarTipo` (string\|undefined) | `DERRAME_MAMILAR_TIPO` |
| Modo de classificação | `LaudoState.modoClassificacao` (`'automatico'`\|`'manual'`) | — |
| BI-RADS Mama Direita | `LaudoState.biradsDireita` (BiRadsCategory\|undefined) | `BIRADS_CATEGORIAS` |
| BI-RADS Mama Esquerda | `LaudoState.biradsEsquerda` (BiRadsCategory\|undefined) | `BIRADS_CATEGORIAS` |
| BI-RADS Bilateral | `LaudoState.biradsFinal` (BiRadsCategory\|undefined) | `BIRADS_CATEGORIAS` |
| Observações | `LaudoState.observacoes` (string\|undefined) | — |

---

*Documento gerado a partir da análise direta dos componentes de formulário em `src/components/`, dos dados em `src/data/biradsData.ts` e do gerador de laudo em `src/utils/laudoGenerator.ts`.*
