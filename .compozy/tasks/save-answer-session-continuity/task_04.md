---
status: completed
title: "Alinhar prática, save e resumo ao sessionId do backend"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_03
---

# Task 04: Alinhar prática, save e resumo ao sessionId do backend

## Overview
Esta task adapta o fluxo de prática para operar inteiramente com o `sessionId` emitido pelo backend, preservando a experiência atual de save, retry e progresso da resposta. Ela garante que prática, save e resumo continuem coerentes depois da mudança de lifecycle introduzida no setup e no backend.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST usar o `sessionId` emitido pelo backend em todo o pipeline de prática e save.
- 2. MUST preservar `currentQuestion`, `currentAnswer` e retry quando o save falhar.
- 3. MUST manter a transição prática -> resumo compatível com a nova origem de `sessionId`.
- 4. SHOULD manter a validação local de payload do frontend estreita e consistente com o backend.
- 5. MUST provar por testes que o fluxo bem-sucedido continua avançando entre perguntas e concluindo a sessão corretamente.
</requirements>

## Subtasks
- [x] 4.1 Ajustar `usePracticeSession` para operar com `sessionId` persistido no backend e manter o save coerente.
- [x] 4.2 Garantir que `PracticeSession` preserve draft, retry e feedback claro em falhas de save.
- [x] 4.3 Revisar `App.tsx` e o handoff para resumo para manter a propagação correta do `sessionId`.
- [x] 4.4 Atualizar os testes do fluxo de prática para cobrir sucesso, falha e conclusão com sessão persistida.

## Implementation Details
Seguir o TechSpec "Data Flow", "Impact Analysis", "Testing Approach" e "Known Risks". Esta task deve ajustar o comportamento da prática ao novo lifecycle sem reinventar o fluxo de escrita, timer, preview e resumo.

### Relevant Files
- `frontend/src/hooks/usePracticeSession.ts` — monta o payload de save e controla a transição entre perguntas.
- `frontend/src/pages/PracticeSession.tsx` — superfície visível de feedback, retry e conclusão da sessão.
- `frontend/src/services/api.ts` — borda de save que passa a interagir com validação de sessão persistida no backend.
- `frontend/src/App.tsx` — transição prática -> resumo e propagação final do `sessionId`.
- `frontend/src/pages/PracticeSession.test.tsx` — cobertura integrada do caminho feliz, erro e retry.
- `frontend/src/hooks/usePracticeSession.test.tsx` — cobertura unitária do estado interno de save e preservação de draft.

### Dependent Files
- `frontend/src/pages/SessionSummary.tsx` — precisa continuar recebendo `sessionId` válido.
- `frontend/src/utils/practiceSessionState.ts` — continua controlando draft, erro de save e conclusão de sessão.
- `frontend/src/services/api.test.ts` — deve permanecer coerente com o contrato do save após a mudança.
- `backend/src/answers/answers.service.ts` — fornece a validação autoritativa consumida por este fluxo.

### Related ADRs
- [ADR-005: Persistir a sessão no backend antes de iniciar a prática](adrs/adr-005.md) — define a nova origem do identificador usado na prática.
- [ADR-006: Usar tabela de sessões para criação e validação, mantendo histórico derivado de answers](adrs/adr-006.md) — condiciona o save à existência de sessão persistida.
- [ADR-001: Priorizar continuidade invisível da sessão ao salvar respostas](adrs/adr-001.md) — exige que falhas preservem contexto e orientem retry.

## Deliverables
- Fluxo de prática usando o `sessionId` persistido do backend em todo o caminho de save.
- Transição prática -> resumo preservada com a nova origem de `sessionId`.
- Tratamento de erro local preservando draft, pergunta atual e retry.
- Unit tests cobrindo `usePracticeSession` com sessão emitida pelo backend **(REQUIRED)**
- Integration tests cobrindo save, avanço entre perguntas e conclusão da sessão **(REQUIRED)**
- Test coverage >=80% para o fluxo de prática atualizado **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que `confirmFinishQuestion` envia `sessionId` vindo do backend no payload de save.
  - [x] Validar que falha de save preserva `currentQuestion`, `currentAnswer` e estado de retry.
  - [x] Validar que o fluxo da última pergunta conclui a sessão sem regenerar `sessionId`.
- Integration tests:
  - [x] Sessão criada pelo backend salva uma resposta válida e avança para a próxima pergunta.
  - [x] Falha de save mantém o draft na tela e oferece retry imediato.
  - [x] Ao finalizar a última pergunta, o resumo recebe o `sessionId` persistido e mantém o fluxo atual.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O fluxo de prática e save opera exclusivamente com o `sessionId` emitido pelo backend.
- O usuário continua conseguindo salvar, tentar novamente e concluir a sessão sem regressão visível.
