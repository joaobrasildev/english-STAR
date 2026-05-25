---
status: pending
title: "Ajustar resumo e histórico para perguntas preservadas"
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 04: Ajustar resumo e histórico para perguntas preservadas

## Overview

Esta task garante que as superfícies de review da aplicação continuem legíveis quando `questionText` vier salvo com múltiplas linhas. O escopo é limitado a summary/history e seus componentes compartilhados, sem expandir a feature para um redesign completo dessas telas.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
1. MUST exibir `questionText` multiline preservado corretamente nas superfícies de resumo e histórico.
2. MUST manter ordenação, timing e navegação atuais sem regressão.
3. SHOULD concentrar a mudança em componentes e estilos compartilhados de review, evitando duplicação.
4. SHOULD manter esta entrega restrita a legibilidade do texto salvo, sem redesenhar a navegação de summary/history.
</requirements>

## Subtasks
- [ ] 4.1 Ajustar a renderização compartilhada de perguntas salvas para suportar múltiplas linhas.
- [ ] 4.2 Revisar estilos de summary/history para garantir wrapping e preservação de whitespace relevantes.
- [ ] 4.3 Atualizar os testes de review para cenários com `questionText` multiline.
- [ ] 4.4 Confirmar que ordenação e formatação de tempo continuam inalteradas.

## Implementation Details

A implementação deve reutilizar `SessionAnswersList` e os utilitários de `sessionReview` como ponto único de exibição de respostas revisadas. Veja o TechSpec nas seções **Impact Analysis**, **Testing Approach** e **Known Risks** para os limites desta fase e os cenários de regressão esperados.

### Relevant Files
- `frontend/src/components/SessionAnswersList.tsx` — caminho compartilhado de renderização de perguntas revisadas.
- `frontend/src/pages/SessionSummary.tsx` — exibe respostas salvas ao fim da sessão.
- `frontend/src/pages/History.tsx` — exibe respostas salvas ao abrir sessões anteriores.
- `frontend/src/utils/sessionReview.ts` — centraliza ordenação e formatação compartilhadas.
- `frontend/src/utils/sessionReview.test.ts` — suíte unitária dos helpers de review.
- `frontend/src/App.review.test.tsx` — cobre summary/history de ponta a ponta.
- `frontend/src/App.css` — contém estilos de `.session-review-question` e áreas relacionadas.

### Dependent Files
- `frontend/src/services/api.ts` — fornece o tipo `AnswerRecord` consumido nas superfícies de review.
- `frontend/src/components/SessionHistoryList.tsx` — pode precisar manter coerência visual, embora não exiba `questionText`.
- `frontend/src/App.tsx` — integra resumo e histórico no fluxo da aplicação.
- `frontend/src/pages/PracticeSession.tsx` — origem das respostas que passam a chegar com texto preservado.

### Related ADRs
- [ADR-001: Priorizar um layout da tela de resposta orientado pela pergunta](adrs/adr-001.md) — Reforça a preservação da legibilidade da pergunta.
- [ADR-002: Preservar a formatação da pergunta desde o parse até a persistência](adrs/adr-002.md) — Exige fidelidade do texto salvo também nas superfícies de review.

## Deliverables
- Exibição multiline correta de `questionText` em summary/history.
- Ajustes pontuais de CSS para wrapping e preservação visual do texto salvo.
- Testes de review atualizados para respostas com múltiplas linhas.
- Unit tests com cobertura >=80% **(REQUIRED)**
- Integration tests para summary/history review **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] Helpers de `sessionReview` continuam ordenando respostas por `questionOrder`.
  - [ ] Helpers de `sessionReview` continuam ordenando sessões por `completedAt`.
  - [ ] A formatação de timing permanece inalterada após a introdução de `questionText` multiline.
- Integration tests:
  - [ ] O resumo final da sessão exibe uma pergunta salva com múltiplas linhas sem achatamento.
  - [ ] O histórico carrega uma sessão salva e exibe perguntas multiline em ordem correta.
  - [ ] A navegação de review continua funcionando sem regressão de labels e tempos.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Summary e History exibem `questionText` multiline com legibilidade preservada.
- A ordenação e os indicadores de tempo de review continuam funcionando como antes.
