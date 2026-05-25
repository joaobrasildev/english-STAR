---
status: completed
title: "Estabilizar os controles do setup com prévia limitada"
type: frontend
complexity: medium
dependencies: []
---

# Task 01: Estabilizar os controles do setup com prévia limitada

## Overview

Esta task ajusta a tela inicial para manter o campo de segundos e as ações principais visualmente estáveis quando a prévia de perguntas crescer. O escopo fica restrito ao layout do setup e à cobertura de regressão necessária, preservando o fluxo atual de parsing, validação e início da sessão.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
1. MUST manter a área de controles do setup estável mesmo quando a lista de perguntas processadas for longa.
2. MUST limitar a área de prévia com rolagem própria, sem esconder o conteúdo completo por padrão.
3. MUST preservar o comportamento responsivo atual, mantendo empilhamento em telas estreitas com prévia ainda delimitada.
4. MUST evitar alterações funcionais em `useSessionSetup`, parsing de perguntas, navegação para histórico e início da sessão.
5. SHOULD concentrar as mudanças em `SessionSetup.tsx` e `App.css`, reaproveitando `QuestionPreview` como está sempre que possível.
</requirements>

## Subtasks
- [x] 1.1 Reorganizar a composição visual do setup para separar com clareza a área de controles da área de prévia sem alterar o contrato de props.
- [x] 1.2 Adicionar contenção visual e rolagem própria para a prévia, preservando legibilidade de perguntas multiline.
- [x] 1.3 Ajustar o comportamento responsivo do setup para manter a estabilidade visual também em telas estreitas.
- [x] 1.4 Atualizar a suíte de `SessionSetup` para cobrir a nova estrutura e garantir ausência de regressões no fluxo atual.
- [x] 1.5 Validar que o início de sessão, mensagens de erro e exibição da prévia continuam funcionando após a mudança.

## Implementation Details

Consulte o TechSpec nas seções **Component Overview**, **Impact Analysis**, **Testing Approach** e **Development Sequencing** para os limites desta entrega. A implementação deve permanecer no frontend existente e evitar abstrações novas, priorizando ajustes localizados na página de setup e nos estilos específicos dessa tela.

### Relevant Files
- `frontend/src/pages/SessionSetup.tsx` — composição principal da tela inicial e ponto natural para separar visualmente controles e prévia.
- `frontend/src/App.css` — contém `.setup-grid`, `.editor-panel`, `.setup-actions`, `.preview-panel` e os breakpoints do setup.
- `frontend/src/pages/SessionSetup.test.tsx` — suíte principal de regressão para fluxo de setup, multiline e validação de estrutura.
- `frontend/src/components/QuestionPreview.tsx` — componente de prévia reaproveitado pela tela; só deve mudar se o layout exigir marcação mínima adicional.

### Dependent Files
- `frontend/src/hooks/useSessionSetup.ts` — permanece sem mudança funcional, mas depende da preservação do contrato usado por `SessionSetup`.
- `frontend/src/App.tsx` — integra a tela de setup ao fluxo principal e deve continuar funcionando sem ajustes comportamentais.
- `frontend/src/App.review.test.tsx` — não é alvo primário, mas pode acusar regressões caso classes compartilhadas sejam tocadas indevidamente.

### Related ADRs
- [ADR-001: Manter os controles da configuração estáveis quando a prévia de perguntas crescer](adrs/adr-001.md) — Define a direção de produto desta entrega.
- [ADR-002: Limitar a altura da prévia no setup com rolagem própria e mudanças isoladas ao layout](adrs/adr-002.md) — Define a abordagem técnica mínima e o isolamento da mudança.

## Deliverables
- Layout do setup com área de controles estável e visualmente separada da prévia.
- Área de prévia com altura limitada e rolagem própria, preservando perguntas multiline.
- Ajustes responsivos do setup sem regressão do fluxo atual.
- Atualização de `SessionSetup.test.tsx` com cobertura da nova estrutura e do fluxo existente.
- Unit tests com 80%+ coverage **(REQUIRED)**
- Integration tests para o fluxo de setup **(REQUIRED)**

## Tests
- Unit tests:
  - [x] `SessionSetup` mantém a ordem da prévia ao receber perguntas numeradas após a nova contenção visual.
  - [x] `SessionSetup` preserva `textContent` multiline dentro da prévia delimitada.
  - [x] `SessionSetup` continua bloqueando o início da sessão quando não há pergunta numerada válida.
  - [x] `SessionSetup` renderiza a estrutura esperada da área de controles e da área delimitada de prévia.
- Integration tests:
  - [x] O fluxo de iniciar sessão com perguntas válidas e tempo customizado continua navegando para a prática sem regressão.
  - [x] O layout em setup continua exibindo botão de histórico, botão de início e campo de segundos junto da área de controles após a mudança.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O campo de segundos e os botões do setup permanecem visualmente estáveis com listas longas de perguntas.
- A prévia completa continua disponível antes do início da sessão em uma área delimitada com rolagem própria.
- O comportamento responsivo e o fluxo de início da sessão permanecem inalterados do ponto de vista funcional.
