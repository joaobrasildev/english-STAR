---
status: pending
title: "Criar a sessão no setup do frontend antes da prática"
type: frontend
complexity: high
dependencies:
  - task_01
---

# Task 03: Criar a sessão no setup do frontend antes da prática

## Overview
Esta task move o início real da sessão para o setup do frontend, fazendo o app chamar `POST /sessions` antes de entrar em prática. Ela altera o handoff entre setup e prática para depender do `sessionId` persistido no backend e desloca falhas estruturais para o momento mais seguro de retry.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST remover a geração local de `sessionId` do fluxo de setup do frontend.
- 2. MUST chamar `POST /sessions` somente depois que a validação local de perguntas e tempo-alvo passar.
- 3. MUST impedir a entrada na prática quando a criação da sessão no backend falhar.
- 4. SHOULD exibir erro claro no setup e manter retry imediato sem perder o conteúdo informado pelo usuário.
- 5. MUST provar por testes que `PreparedSession` passa a ser hidratada a partir da resposta do backend.
</requirements>

## Subtasks
- [ ] 3.1 Refatorar `useSessionSetup` para trocar geração local de sessão por criação assíncrona via API.
- [ ] 3.2 Atualizar `SessionSetup` para refletir loading, erro de criação de sessão e bloqueio de múltiplos starts.
- [ ] 3.3 Ajustar `App.tsx` para só entrar na prática após receber uma sessão persistida do backend.
- [ ] 3.4 Atualizar o cliente de API e os tipos do frontend para o contrato de `POST /sessions`.
- [ ] 3.5 Atualizar testes de setup e handoff para cobrir sucesso e falha do create-session.

## Implementation Details
Seguir o TechSpec "Component Overview", "Data Flow", "Impact Analysis" e "Testing Approach". Esta task deve manter parsing de perguntas e validação local existentes, mudando apenas a origem do `sessionId` e o momento em que a prática se torna disponível.

### Relevant Files
- `frontend/src/hooks/useSessionSetup.ts` — origem atual do `sessionId` e ponto central da mudança para fluxo assíncrono.
- `frontend/src/pages/SessionSetup.tsx` — UI de start, mensagens de erro e loading do setup.
- `frontend/src/services/api.ts` — precisa expor o novo cliente `createSession`.
- `frontend/src/App.tsx` — controla o handoff entre setup e prática.
- `frontend/src/types/session.ts` — contrato de `PreparedSession` que passará a receber `sessionId` do servidor.
- `frontend/src/pages/SessionSetup.test.tsx` — melhor lugar para validar que a prática só começa após sucesso do backend.

### Dependent Files
- `frontend/src/hooks/usePracticeSession.ts` — dependerá da nova origem de `sessionId`.
- `frontend/src/pages/PracticeSession.tsx` — será renderizada apenas quando `PreparedSession` vier do backend.
- `frontend/src/App.review.test.tsx` — deve continuar compatível com a nova origem do `sessionId`.
- `frontend/src/services/api.test.ts` — precisa cobrir o novo contrato de `POST /sessions`.

### Related ADRs
- [ADR-005: Persistir a sessão no backend antes de iniciar a prática](adrs/adr-005.md) — move a criação da sessão para antes da entrada na prática.
- [ADR-001: Priorizar continuidade invisível da sessão ao salvar respostas](adrs/adr-001.md) — exige UX de baixo atrito mesmo quando houver falha rara.
- [ADR-002: Limitar o MVP à proteção apenas da sessão ativa](adrs/adr-002.md) — mantém o escopo sem persistir progresso parcial da resposta.

## Deliverables
- Setup do frontend criando sessão persistida via backend antes da prática.
- `PreparedSession` hidratada a partir de `POST /sessions` em vez de geração local de UUID.
- UI de setup com loading, erro e retry para criação de sessão.
- Unit tests do frontend cobrindo o novo fluxo de `useSessionSetup` e cliente `createSession` **(REQUIRED)**
- Integration tests cobrindo entrada na prática apenas após sucesso do backend **(REQUIRED)**
- Test coverage >=80% para o novo handoff setup -> prática **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] Validar que `useSessionSetup` chama `createSession` apenas após validação local bem-sucedida.
  - [ ] Validar que falha em `createSession` mantém o usuário no setup com mensagem clara.
  - [ ] Validar que `PreparedSession.sessionId` passa a vir da resposta do backend, sem geração local.
- Integration tests:
  - [ ] Clicar em `Start session` com payload válido chama `POST /sessions` e abre a prática ao receber sucesso.
  - [ ] Falha em `POST /sessions` não entra na prática e mantém perguntas/tempo-alvo disponíveis para retry.
  - [ ] O frontend não dispara múltiplas criações de sessão para um único start em loading.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O setup deixa de gerar `sessionId` localmente.
- O usuário só entra na prática depois que o backend cria e devolve uma sessão persistida.
