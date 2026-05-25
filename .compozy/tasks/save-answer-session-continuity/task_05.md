---
status: completed
title: "Estabilizar histórico e contratos finais do lifecycle da sessão"
type: bugfix
complexity: medium
dependencies:
  - task_02
  - task_03
  - task_04
---

# Task 05: Estabilizar histórico e contratos finais do lifecycle da sessão

## Overview
Esta task consolida os contratos finais do novo lifecycle de sessão, garantindo que histórico, review e contratos de API continuem estáveis após a mudança para sessão persistida no backend. Ela fecha as superfícies de regressão restantes sem migrar a origem de `GET /sessions`, que continua derivada de `answer_records`.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST manter `GET /sessions` e `GET /sessions/:sessionId/answers` sem regressão de contrato após a introdução de sessões persistidas.
- 2. MUST garantir que review, summary e history consumam `sessionId` persistido de forma consistente.
- 3. SHOULD deixar explícito por testes que sessões criadas sem answers ainda não aparecem no histórico nesta fase.
- 4. MUST alinhar mocks, contratos de API e fluxos de review/history ao novo lifecycle de sessão.
- 5. MUST provar por testes integrados e e2e que o fluxo create-session -> save-answer -> history permanece coerente.
</requirements>

## Subtasks
- [x] 5.1 Revisar contratos de history/review para compatibilidade com o `sessionId` persistido no backend.
- [x] 5.2 Ajustar clientes, mocks e testes de API para o novo lifecycle create-session -> answers.
- [x] 5.3 Confirmar que `GET /sessions` continua derivado de `answer_records` sem listar sessões vazias nesta fase.
- [x] 5.4 Atualizar cobertura integrada e e2e para o fluxo completo até histórico e review.

## Implementation Details
Seguir o TechSpec "API Endpoints", "Impact Analysis", "Integration Tests" e "Key Decisions". Esta task deve estabilizar as bordas finais do fluxo sem expandir escopo para migrar o histórico à tabela de sessões.

### Relevant Files
- `frontend/src/App.review.test.tsx` — cobre o fluxo de review e resumo após conclusão da sessão.
- `frontend/src/services/api.ts` — centraliza os contratos `POST /sessions`, `POST /answers`, `GET /sessions` e `GET /sessions/:sessionId/answers`.
- `frontend/src/services/api.test.ts` — valida os contratos do cliente e erros associados.
- `frontend/src/pages/History.tsx` — superfície de histórico que continua consumindo sessões derivadas de answers.
- `backend/src/answers/answers.service.ts` — mantém a derivação de `GET /sessions` a partir de `answer_records`.
- `backend/test/answers.e2e-spec.ts` — melhor ponto para o fluxo create-session -> answers -> history.

### Dependent Files
- `frontend/src/pages/SessionSummary.tsx` — deve continuar exibindo `sessionId` persistido corretamente.
- `frontend/src/components/SessionHistoryList.tsx` — consome a lista de sessões do histórico.
- `frontend/src/components/SessionAnswersList.tsx` — depende do contrato estável de answers carregadas por sessão.
- `backend/src/answers/answers.controller.ts` — expõe os endpoints de histórico cuja semântica deve permanecer estável.

### Related ADRs
- [ADR-006: Usar tabela de sessões para criação e validação, mantendo histórico derivado de answers](adrs/adr-006.md) — define explicitamente que o histórico continua vindo de `answer_records`.
- [ADR-005: Persistir a sessão no backend antes de iniciar a prática](adrs/adr-005.md) — exige compatibilidade do restante do fluxo com sessões persistidas.
- [ADR-001: Priorizar continuidade invisível da sessão ao salvar respostas](adrs/adr-001.md) — pede que a mudança preserve a sensação de fluxo estável até review e history.

## Deliverables
- Contratos finais de API, review e history alinhados ao novo lifecycle de sessão.
- Fluxo create-session -> save-answer -> summary/history estabilizado sem regressão de contrato.
- Cobertura e2e e integrada provando que sessões vazias não entram no histórico nesta fase.
- Unit tests cobrindo contratos do cliente e semântica de histórico/review **(REQUIRED)**
- Integration/e2e tests cobrindo o lifecycle completo até history/review **(REQUIRED)**
- Test coverage >=80% para as superfícies finais do lifecycle **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que o cliente de API mantém contratos corretos para `POST /sessions`, `POST /answers` e `GET /sessions`.
  - [x] Validar que review/summary exibem o `sessionId` persistido sem fallback silencioso.
  - [x] Validar que o histórico continua refletindo apenas sessões com answers salvas.
- Integration tests:
  - [x] Fluxo completo create-session -> save-answer -> summary continua funcional no frontend.
  - [x] `GET /sessions` não lista sessões criadas sem answers nesta fase.
  - [x] Abrir uma sessão no histórico continua carregando answers ordenadas após a mudança de lifecycle.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Summary, review e history permanecem estáveis com o `sessionId` persistido do backend.
- O histórico continua sem regressão, mantendo a semântica atual baseada em `answer_records`.
