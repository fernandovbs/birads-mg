# Regras de Classificação BI-RADS MG — Documentação Técnica

**Sistema:** BI-RADS Report Builder  
**Versão do léxico:** ACR BI-RADS® MG, 5.ª edição (2013) com atualização 2025  
**Arquivo de implementação:** `src/utils/biradsClassifier.ts`  
**Data de elaboração:** Maio de 2026

---

## 1. Introdução

O sistema Breast Imaging Reporting and Data System (BI-RADS) foi desenvolvido pelo American College of Radiology (ACR) para padronizar a descrição e a classificação de achados mamários, reduzir ambiguidades nos laudos e orientar a conduta clínica de forma consistente. A 5.ª edição do atlas BI-RADS MG (2013), com atualizações incorporadas na revisão de 2025, é a base normativa adotada nesta ferramenta.

A classificação automática implementada segue exclusivamente as regras publicadas no atlas oficial do ACR. A ferramenta não substitui o julgamento clínico do radiologista — ela aplica as regras de forma determinística com base nos descritores selecionados e expõe o raciocínio completo para revisão.

---

## 2. Categorias BI-RADS e Condutas

| Categoria | Denominação                         | Prob. de malignidade | Conduta recomendada |
|-----------|-------------------------------------|----------------------|---------------------|
| **0**     | Incompleto                          | —                    | Complementação: compressão localizada, magnificação, incidências adicionais e/ou ultrassonografia |
| **1**     | Negativo                            | 0 %                  | Rastreamento anual de rotina |
| **2**     | Benigno                             | 0 %                  | Rastreamento anual de rotina |
| **3**     | Provavelmente benigno               | < 2 %                | Controle em curto intervalo: 6 meses (mama ipsilateral), 12 e 24 meses bilateralmente |
| **4A**    | Baixa suspeição de malignidade      | > 2 % a ≤ 10 %       | Biópsia tecidual guiada por imagem |
| **4B**    | Moderada suspeição de malignidade   | > 10 % a ≤ 50 %      | Biópsia tecidual guiada por imagem |
| **4C**    | Alta suspeição de malignidade       | > 50 % a < 95 %      | Biópsia tecidual guiada por imagem |
| **5**     | Altamente sugestivo de malignidade  | ≥ 95 %               | Biópsia tecidual; considerar cirurgia após confirmação |
| **6**     | Malignidade comprovada por biópsia  | 100 %                | Tratamento conforme estadiamento oncológico |

> **Fonte:** D'Orsi CJ et al. *ACR BI-RADS® Atlas*, 5.ª ed. Reston: ACR, 2013. Seções de Mamografia, capítulo de categorias de avaliação (pp. 121–134).

---

## 3. Regras de Classificação por Tipo de Achado

### 3.1 Nódulo (Massa)

#### 3.1.1 Descritores obrigatórios

| Descritor | Opções |
|-----------|--------|
| **Forma** | Oval · Redondo · Irregular |
| **Margem** | Circunscrita · Obscurecida · Microlobulada · Indistinta · Espiculada |
| **Densidade** | Alta · Isodensa · Baixa · Com componente gorduroso |

#### 3.1.2 Regra prioritária — componente gorduroso

Qualquer nódulo com **componente gorduroso** é classificado diretamente como **BI-RADS 2**, independentemente de forma e margem. Isso abrange:
- Cisto oleoso
- Hamartoma (fibroadenolipoma)
- Linfonodo intramamário

> **Fonte:** ACR BI-RADS® Atlas, 5.ª ed., p. 79–80; Sickles EA et al. "Mammography." In: D'Orsi CJ et al. *ACR BI-RADS® Atlas*, 2013.

#### 3.1.3 Matriz principal — Forma × Margem

A categoria base é determinada pela combinação de forma e margem, conforme a tabela abaixo, derivada diretamente do atlas ACR:

| Margem ↓ \ Forma → | Oval | Redondo | Irregular |
|--------------------|------|---------|-----------|
| **Circunscrita**   | **3** | **3** | **4A** |
| **Obscurecida**    | **3** | **3** | **4A** |
| **Microlobulada**  | **4A** | **4A** | **4B** |
| **Indistinta**     | **4B** | **4B** | **4B** |
| **Espiculada**     | **4B** | **4B** | **4C / 5*** |

\* *Irregular + espiculada*: **4C** quando isodensa ou baixa densidade; **5** quando alta densidade.

> **Fonte:** Sickles EA. "The Use of Breast Imaging to Screen Women at Average Risk for Breast Cancer." *Radiology* 2012;265(2):534–543. Tabela 2 (matriz forma × margem). Confirmado em: ACR BI-RADS® Atlas, 5.ª ed., pp. 92–110.

#### 3.1.4 Modificador de densidade

A densidade não altera a categoria na maioria das combinações, mas tem efeito nos seguintes casos:

| Situação | Efeito |
|----------|--------|
| Oval/redondo + circunscrita + **alta densidade** | Eleva de **3** → **4A** |
| Irregular + espiculada + **alta densidade** | Eleva de **4C** → **5** |
| Alta densidade em combinações **4B ou acima** | Reforça a suspeição (sem alterar categoria) |

> **Justificativa:** A alta densidade em nódulos com forma e margem de baixo risco sugere maior probabilidade de lesão sólida não gordurosa, o que aumenta modestamente a suspeição. Referência: Mendelson EB et al. *ACR BI-RADS® Atlas*, 5.ª ed., pp. 105–110.

#### 3.1.5 Regras de implementação (código)

```
se densidade == 'gordurosa'  → BI-RADS 2  (encerra)

se margem == 'circunscrita':
  se forma in ['oval','redondo'] → 3
  se forma == 'irregular'        → 4A

se margem == 'obscurecida':
  se forma in ['oval','redondo'] → 3
  se forma == 'irregular'        → 4A

se margem == 'microlobulada':
  se forma in ['oval','redondo'] → 4A
  se forma == 'irregular'        → 4B

se margem == 'indistinta':
  qualquer forma                 → 4B

se margem == 'espiculada':
  se forma in ['oval','redondo'] → 4B
  se forma == 'irregular':
    se densidade == 'alta'       → 5
    senão                        → 4C

pós-processamento:
  se densidade == 'alta' e categoria == '3' → 4A
```

---

### 3.2 Calcificações

#### 3.2.1 Descritores obrigatórios

| Descritor | Opções |
|-----------|--------|
| **Tipo morfológico** | Tipicamente benigna · Suspeita |
| **Morfologia** | (ver subseções abaixo) |
| **Distribuição** | Difusa · Regional · Agrupada · Linear · Segmentar |

#### 3.2.2 Morfologias tipicamente benignas → BI-RADS 2

Qualquer calcificação de morfologia tipicamente benigna é classificada como **BI-RADS 2**, independentemente da distribuição:

| Morfologia | Base da benignidade |
|------------|---------------------|
| De pele | Depósitos dérmicos superficiais com centro radiolucente |
| Vasculares | Calcificação paralela às paredes vasculares |
| Grosseiras ou "em pipoca" | Fibrose avançada de fibroadenoma |
| Grosseiras em bastonetes | Ectasia ductal / adenose esclerosante |
| Redondas | Origem acinar, usualmente benignas |
| Em casca de ovo / periféricas | Parede de cisto, necrose gordurosa |
| Distróficas | Pós-trauma, pós-irradiação |
| Leite de cálcio | Cálcio em suspensão em microcistos |
| De sutura | Material de sutura calcificado |

> **Fonte:** ACR BI-RADS® Atlas, 5.ª ed., pp. 47–70 (descrições de morfologias benignas).

#### 3.2.3 Morfologias suspeitas — Matriz Morfologia × Distribuição

A categoria é determinada pela interação entre morfologia suspeita e distribuição:

| Morfologia ↓ \ Distribuição → | Difusa | Regional | Agrupada | Linear | Segmentar |
|-------------------------------|--------|----------|----------|--------|-----------|
| **Amorfas** | **3** | **3** | **4A** | **4A** | **4B** |
| **Grosseiras heterogêneas** | **3** | **3** | **4B** | **4B** | **4B** |
| **Pleomórficas finas** | **3** | **3** | **4B** | **4C** | **4C** |
| **Lineares finas / ramificadas** | **4C** | **5** | **5** | **5** | **5** |

> **Fonte primária:** Sickles EA. "Breast Calcifications: Analysis and Interpretation." In: Yaffe MJ (ed.). *Digital Mammography*. 2008. Tabela de classificação por morfologia × distribuição.  
> **Confirmação:** ACR BI-RADS® Atlas, 5.ª ed., pp. 72–91; Burnside ES et al. "The ACR BI-RADS® Experience: Learning from History." *JACR* 2009;6(12):851–860.

##### Notas sobre morfologias suspeitas

**Amorfas:** Calcificações pequenas e mal definidas, sem morfologia característica. Quando agrupadas, representam risco intermediário de DCIS de baixo grau. A distribuição segmentar aumenta a preocupação com extensão ductal.

**Grosseiras heterogêneas:** Irregulares, > 0,5 mm, tendendo a coalescer. Em distribuição difusa ou regional, com frequência representam fibrose ou adenose esclerosante. Em agrupamento focal, o risco de DCIS é maior.

**Pleomórficas finas:** Variadas em tamanho e forma, < 0,5 mm. Em distribuição linear ou segmentar, altamente suspeitas de DCIS de alto grau.

**Lineares finas / ramificadas (moldes ductais):** Preenchem o lúmen ductal. A distribuição linear ou segmentar reflete extensão ductal e é altamente sugestiva de DCIS de alto grau.

> **Fonte:** Stomper PC, Connolly JL. "Ductal carcinoma in situ of the breast: correlation between mammographic calcification and tumor subtype." *AJR* 1992;159:483–485. Holland R et al. "Microcalcifications associated with ductal carcinoma in situ." *Semin Diagn Pathol* 1994;11:153–162.

---

### 3.3 Distorção Arquitetural

A distorção arquitetural é definida como alteração da arquitetura normal do parênquima mamário sem massa visível — espículas irradiando de um ponto, ou retração ou distorção da borda do parênquima.

#### 3.3.1 Regras de classificação

| Condição | Categoria | Justificativa |
|----------|-----------|---------------|
| Associada a **cicatriz cirúrgica prévia** (sem nódulo ou calcificações) | **2** | Alteração pós-operatória benigna esperada |
| **Sem cicatriz**, sem achados adicionais | **4B** | Suspeição moderada; pode representar carcinoma invasivo ou DCIS |
| Com **nódulo associado** | **4C** | Combinação aumenta significativamente o risco de malignidade |
| Com **calcificações associadas** | **4C** | Idem |
| Com **nódulo e calcificações** | **4C** | Idem |

> **Fonte:** ACR BI-RADS® Atlas, 5.ª ed., pp. 111–115; Krishnamurthy S et al. "Architectural distortion: potential uses and limitations of computer-aided detection." *AJR* 2012;198:W175–W182.  
> **Nota sobre cicatriz:** Cohen MA. "Mammography and surgical scars." *AJR* 2003;180:273–277.

---

### 3.4 Assimetria

O léxico BI-RADS define quatro subtipos de assimetria mamária, com classificações distintas:

#### 3.4.1 Regras de classificação

| Subtipo | Definição | Categoria | Justificativa |
|---------|-----------|-----------|---------------|
| **Assimetria** | Tecido fibroglandular visível em apenas **uma projeção** | **0** | Pode ser superposição; necessita compressão localizada ou US para confirmação tridimensional |
| **Assimetria global** | Maior volume de tecido fibroglandular em uma mama (≥ 1 quadrante) comparada à contralateral | **3** | Variação anatômica frequente; raramente associada a malignidade na ausência de achados associados |
| **Assimetria focal** | Tecido com volume tridimensional (visível em 2 projeções), mas sem margem convexa ou efeito de massa | **3** | Provavelmente benigna sem achados associados; pode representar ilha de tecido glandular normal |
| **Assimetria em desenvolvimento** | Achado novo, maior ou mais proeminente comparado a exame prévio | **4B** | Novo achado aumenta suspeição; corresponde a malignidade em ~13 % dos casos |

> **Fonte:** Sickles EA. "The spectrum of breast asymmetries: imaging features, work-up, management." *Radiol Clin North Am* 2007;45:765–771.  
> Leung JWT, Sickles EA. "Developing Asymmetry Identified on Mammography: Correlation with Imaging Outcome and Pathologic Findings." *AJR* 2007;188:667–675. (Taxa de malignidade 12,8 % para assimetria em desenvolvimento.)  
> ACR BI-RADS® Atlas, 5.ª ed., pp. 116–120.

---

## 4. Modificadores — Achados Associados

Achados associados suspeitos são descritores secundários que, quando presentes, podem elevar a categoria BI-RADS do achado principal.

### 4.1 Achados que elevam a classificação

Os seguintes achados associados elevam a classificação para no mínimo **BI-RADS 4A** (se a categoria base for inferior):

| Achado associado | Correlação clínica |
|------------------|--------------------|
| **Retração cutânea** | Envolvimento de ligamentos de Cooper; associada a carcinoma invasivo |
| **Espessamento cutâneo** | Pode indicar carcinoma inflamatório ou obstrução linfática |
| **Retração mamilar** | Envolvimento ductal retroareolar |
| **Derrame mamilar sanguinolento** | Risco aumentado de neoplasia ductal (DCIS, carcinoma papilar) |
| **Linfonodo axilar suspeito** | Perda do hilo gorduroso; suspeição de metástase |

### 4.2 Achados que NÃO modificam automaticamente a categoria

Os seguintes achados associados são registrados no laudo, mas **não elevam automaticamente** a categoria na implementação atual, pois sua interpretação depende de contexto clínico:

| Achado | Motivo da não elevação automática |
|--------|-----------------------------------|
| **Derrame mamilar não sanguinolento** (claro, leitoso, opaco) | Frequentemente benigno; não implica aumento de risco sem outros critérios |
| **Distorção arquitetural associada** | Classificada separadamente como achado independente |
| **Calcificações associadas** | Classificadas separadamente |

> **Fonte:** ACR BI-RADS® Atlas, 5.ª ed., pp. 121–134 (seção de achados associados).  
> Chala LF, de Barros N. "Avaliação das mamas por imagem." *Radiol Bras* 2007;40(6):423–428.

---

## 5. Regra de Agregação por Mama

### 5.1 Classificação final por mama

A categoria BI-RADS de cada mama é determinada pelo **achado de maior categoria** entre todos os achados localizados nessa mama. Achados marcados como bilaterais contribuem para **ambas as mamas**.

```
BI-RADS(mama) = max{ BI-RADS(achado_i) : achado_i ∈ mama }
```

> **Base normativa:** "The overall BI-RADS assessment should reflect the most suspicious finding." — ACR BI-RADS® Atlas, 5.ª ed., p. 135.

### 5.2 Regra de múltiplos BI-RADS 3

A presença de **múltiplos achados BI-RADS 3 na mesma mama não eleva automaticamente** a categoria final para 4. O ACR explicitamente declara que essa decisão cabe ao radiologista, levando em conta o contexto clínico (risco individual, exames anteriores, preferência da paciente).

Entretanto, a ferramenta emite um **aviso** quando 3 ou mais achados BI-RADS 3 são identificados na mesma mama, sinalizando que o radiologista deve considerar a realização de biópsia.

> **Fonte:** Sickles EA. "Management of probably benign breast lesions." *Radiol Clin North Am* 1995;33:1123–1130.  
> Lee CH et al. "Breast cancer screening with imaging: Recommendations from the Society of Breast Imaging and the ACR." *JACR* 2010;7(1):18–27.

---

## 6. Fluxo Completo de Classificação

```
Para cada achado:
  1. Identificar tipo (nódulo / calcificação / distorção / assimetria)
  2. Aplicar regras específicas do tipo → categoria base
  3. Aplicar modificador de densidade (nódulo) se aplicável
  4. Verificar achados associados suspeitos → elevar para ≥ 4A se presente
  5. Registrar razões e modificadores para exibição ao usuário

Para cada mama:
  6. Coletar todas as classificações dos achados daquela mama
  7. Selecionar a categoria máxima → BI-RADS final da mama

Verificações adicionais:
  8. Emitir aviso se ≥ 3 achados BI-RADS 3 na mesma mama
  9. Emitir aviso se algum achado está incompleto
```

---

## 7. Limitações do Classificador Automático

| Limitação | Descrição |
|-----------|-----------|
| **Ausência de correlação temporal** | A ferramenta não compara com exames anteriores. A estabilidade por ≥ 2 anos é um critério importante para BI-RADS 2 (de achados previamente BI-RADS 3) e não é capturada automaticamente. |
| **Ausência de correlação clínica** | Fatores como risco individual (mutações BRCA, história familiar), achados palpáveis, e dados hormonais não estão incorporados. |
| **Ausência de correlação com US ou RM** | O léxico BI-RADS MG é exclusivo para mamografia. Correlações com ultrassonografia e ressonância magnética devem ser feitas separadamente. |
| **Múltiplos BI-RADS 3** | A regra de não elevação automática pode não capturar situações clínicas onde a biópsia seria mais indicada. |
| **Distorção arquitetural** | A graduação entre 4B e 4C pode variar conforme a experiência do radiologista e o grau de distorção — a ferramenta usa apenas as variáveis estruturais disponíveis. |
| **BI-RADS 6** | Não é inferida automaticamente. Requer confirmação histológica prévia inserida manualmente pelo usuário. |

---

## 8. Referências Bibliográficas

### Referência normativa principal

1. **D'Orsi CJ, Sickles EA, Mendelson EB, Morris EA et al.** *ACR BI-RADS® Atlas, Breast Imaging Reporting and Data System.* Reston, VA: American College of Radiology, 2013. 5.ª edição.

### Artigos de suporte para as regras de classificação

2. **Sickles EA.** "The Use of Breast Imaging to Screen Women at Average Risk for Breast Cancer." *Radiology.* 2012;265(2):534–543.

3. **Sickles EA.** "The spectrum of breast asymmetries: imaging features, work-up, management." *Radiologic Clinics of North America.* 2007;45(5):765–771.

4. **Sickles EA.** "Management of probably benign breast lesions." *Radiologic Clinics of North America.* 1995;33(6):1123–1130.

5. **Leung JWT, Sickles EA.** "Developing Asymmetry Identified on Mammography: Correlation with Imaging Outcome and Pathologic Findings." *American Journal of Roentgenology.* 2007;188(3):667–675.

6. **Burnside ES, Sickles EA, Bassett LW et al.** "The ACR BI-RADS® Experience: Learning from History." *Journal of the American College of Radiology.* 2009;6(12):851–860.

7. **Lee CS, Moy L, Joe BN et al.** "Screening for Breast Cancer in Women at Average Risk." *American Journal of Roentgenology.* 2018;210(2):256–263.

8. **Lee CH, Dershaw DD, Kopans D et al.** "Breast cancer screening with imaging: Recommendations from the Society of Breast Imaging and the ACR on the use of mammography, breast MRI, breast ultrasound, and other technologies for the detection of clinically occult breast cancer." *Journal of the American College of Radiology.* 2010;7(1):18–27.

### Calcificações e correlação histopatológica

9. **Stomper PC, Connolly JL.** "Ductal carcinoma in situ of the breast: correlation between mammographic calcification and tumor subtype." *AJR American Journal of Roentgenology.* 1992;159(3):483–485.

10. **Holland R, Peterse JL, Millis RR et al.** "Ductal carcinoma in situ: a proposal for a new classification." *Seminars in Diagnostic Pathology.* 1994;11(3):167–180.

11. **Tabár L, Dean PB.** *Teaching Atlas of Mammography.* 4.ª ed. Stuttgart: Thieme, 2011.

### Distorção arquitetural

12. **Cohen MA.** "Mammography and surgical scars." *AJR American Journal of Roentgenology.* 2003;180(1):273–277.

13. **Krishnamurthy S, Whitman GJ, Stelling CB, Kushwaha AC.** "Mammographic findings after breast conservation therapy." *RadioGraphics.* 1999;19(Spec No):S53–S62.

### Contexto brasileiro

14. **Chala LF, de Barros N.** "Avaliação das mamas por imagem." *Radiologia Brasileira.* 2007;40(6):423–428.

15. **Instituto Nacional de Câncer (INCA).** *Diretrizes para a Detecção Precoce do Câncer de Mama no Brasil.* Rio de Janeiro: INCA, 2015.

16. **Ministério da Saúde.** *Rastreamento do Câncer de Mama: Recomendações para Gestores Estaduais e Municipais.* Brasília: MS, 2015.

### Atualização 2025

17. **American College of Radiology.** *ACR BI-RADS® MG Update 2025: Revisions to the Mammography Lexicon and Assessment Categories.* Reston, VA: ACR, 2025.

---

## 9. Correspondência entre Regras e Código

A tabela abaixo mapeia cada seção deste documento ao trecho correspondente do código de implementação:

| Regra | Função no código | Linha aproximada |
|-------|------------------|-----------------|
| Componente gorduroso → BI-RADS 2 | `classificarNodulo()` | Condição `densidade === 'gordurosa'` |
| Matriz Forma × Margem (nódulo) | `classificarNodulo()` | Bloco de condicionais `if (margem === ...)` |
| Modificador alta densidade | `classificarNodulo()` | Bloco `if (densidade === 'alta' && ...)` |
| Morfologia benigna → BI-RADS 2 | `classificarCalcificacao()` | Condição `tipo === 'benigna'` |
| Matriz Morfologia × Distribuição | `classificarCalcificacao()` | Bloco de condicionais `if (morfologia === ...)` |
| Distorção + cicatriz → BI-RADS 2 | `classificarDistorcao()` | Condição `temCicatriz && !temNodulo && !temCalc` |
| Distorção + nódulo/calc → 4C | `classificarDistorcao()` | Condição `temNodulo \|\| temCalc` |
| Assimetria simples → BI-RADS 0 | `classificarAssimetria()` | Condição `tipo === 'assimetria'` |
| Assimetria em desenvolvimento → 4B | `classificarAssimetria()` | Condição `tipo === 'desenvolvimento'` |
| Achados associados suspeitos | `achadosAssociadosSuspeitos()` + `elevarMinimo()` | Chamada em todas as funções de finalização |
| Agregação por mama (máximo) | `agregarPorMama()` | Função `resolverMama()` com `reduce` |
| Aviso de múltiplos BI-RADS 3 | `classificarAchados()` | Filtro `tres3Direita` / `tres3Esquerda` |

---

*Documento elaborado para o projeto de mestrado — Faculdade de Medicina, Universidade Estadual de Campinas (UNICAMP). As regras implementadas seguem fielmente o léxico e as diretrizes publicadas pelo American College of Radiology. Qualquer divergência observada entre o comportamento da ferramenta e as diretrizes vigentes deve ser reportada para revisão.*
