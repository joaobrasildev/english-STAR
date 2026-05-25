---
status: completed
title: "Validar sessões persistidas no pipeline de answers"
type: backend
complexity: medium
dependencies:
  - task_01
---

# Task 02: Validar sessões persistidas no pipeline de answers

## Overview
Esta task conecta o pipeline de `POST /answers` à nova entidade de sessão persistida para impedir que respostas sejam gravadas contra sessões inexistentes ou inativas. Ela fecha o contrato do backend como fonte autoritativa de existência da sessão sem alterar o histórico derivado de `answer_records`.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST validar no backend que `sessionId` recebido em `POST /answers` existe na persistência de sessões.
- 2. MUST rejeitar explicitamente sessão inexistente ou inativa antes de persistir a answer.
- 3. MUST manter a validação atual de payload de answer, incluindo `sessionId` não vazio e `elapsedSeconds >= 0`.
- 4. SHOULD manter `GET /sessions` e `GET /sessions/:sessionId/answers` sem regressão de contrato nesta fase.
- 5. MUST provar por testes que o repository de answers não persiste registros quando a sessão não for válida.
</requirements>

## Subtasks
- [x] 2.1 Integrar o serviço de answers à nova fonte de verdade de sessões persistidas.
- [x] 2.2 Reforçar o contrato de `POST /answers` para recusar `sessionId` inexistente ou inativo com erro explícito.
- [x] 2.3 Preservar o comportamento atual dos endpoints de histórico e listagem de respostas.
- [x] 2.4 Atualizar testes unitários e e2e do backend para o novo comportamento de validação de sessão.

## Implementation Details
Seguir o TechSpec "API Endpoints", "Impact Analysis", "Testing Approach" e "Key Decisions". Esta task deve concentrar a validação autoritativa de sessão no backend, sem migrar a leitura de histórico para a tabela de sessões.

### Relevant Files
- `backend/src/answers/answers.service.ts` — ponto principal de validação do save e melhor local para impor existência/atividade da sessão.
- `backend/src/answers/answers.controller.ts` — superfície HTTP de `POST /answers`.
- `backend/src/answers/answers.repository.ts` — deve continuar persistindo apenas answers de sessões válidas.
- `backend/src/answers/dto/create-answer.dto.ts` — contrato de payload que continua válido para answers.
- `backend/src/answers/answers.types.ts` — contrato público de `AnswerRecord` e `SessionSummary`.
- `backend/src/sessions/*` — nova dependência para lookup/validação da sessão criada na task 01.

### Dependent Files
- `frontend/src/services/api.ts` — consumirá a nova mensagem/semântica de erro para sessão inexistente.
- `frontend/src/hooks/usePracticeSession.ts` — depende de erro explícito e consistente no caminho de save.
- `backend/src/answers/answers.controller.spec.ts` — precisa cobrir o contrato atualizado do endpoint.
- `backend/test/answers.e2e-spec.ts` — deve provar save válido e rejeição de sessão inexistente.

### Related ADRs
- [ADR-006: Usar tabela de sessões para criação e validação, mantendo histórico derivado de answers](adrs/adr-006.md) — define que answers devem validar sessão sem migrar o histórico.
- [ADR-005: Persistir a sessão no backend antes de iniciar a prática](adrs/adr-005.md) — torna a existência de sessão um pré-requisito do save.
- [ADR-001: Priorizar continuidade invisível da sessão ao salvar respostas](adrs/adr-001.md) — exige que a validação aconteça sem expor complexidade desnecessária ao usuário.

## Deliverables
- `POST /answers` validando existência/atividade da sessão antes do insert.
- Serviço de answers integrado à nova persistência de sessões.
- Contrato de erro explícito para sessão inexistente ou inativa.
- Unit tests do backend cobrindo save válido, `sessionId` vazio e sessão inexistente/inativa **(REQUIRED)**
- Integration/e2e tests cobrindo `POST /answers` com sessão criada e sessão inexistente **(REQUIRED)**
- Test coverage >=80% para o pipeline de validação de answers **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que `createAnswer` aceita payload com `sessionId` de sessão ativa.
  - [x] Validar que `createAnswer` rejeita `sessionId` vazio antes de consultar o repository.
  - [x] Validar que `createAnswer` rejeita sessão inexistente ou inativa com erro explícito.
- Integration tests:
  - [x] `POST /answers` com sessão criada previamente persiste a answer e retorna `201`.
  - [x] `POST /answers` com `sessionId` inexistente retorna erro sem gravar answer.
  - [x] `GET /sessions` continua listando histórico derivado de answers sem regressão de contrato.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Nenhuma answer é persistida para `sessionId` inexistente ou inativo.
- O backend passa a ser a validação autoritativa da existência da sessão no save.
