---
status: completed
title: "Implementar persistência e API de respostas no backend"
type: backend
complexity: high
dependencies:
  - task_01
---

# Task 02: Implementar persistência e API de respostas no backend

## Overview
Esta task implementa a base funcional do backend responsável por salvar respostas finalizadas e servir o histórico de sessões. Ela materializa o modelo `answer_records` e expõe os endpoints mínimos descritos no TechSpec, destravando a integração do frontend nas tasks seguintes.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST criar a persistência da tabela única `answer_records` no SQL Server conforme o TechSpec "Data Models".
- 2. MUST expor os endpoints `POST /answers`, `GET /sessions` e `GET /sessions/:sessionId/answers` conforme o TechSpec "API Endpoints".
- 3. MUST validar o payload recebido e retornar erros explícitos para dados inválidos ou falhas de persistência.
- 4. SHOULD manter os registros de resposta como eventos finais imutáveis, sem autosave ou rascunhos.
</requirements>

## Subtasks
- [x] 2.1 Criar o schema inicial de persistência para `answer_records`.
- [x] 2.2 Implementar a conexão do backend com o SQL Server e a camada de acesso a dados.
- [x] 2.3 Expor o endpoint de salvamento de respostas finalizadas com validação de payload.
- [x] 2.4 Expor os endpoints de listagem de sessões e respostas por sessão.
- [x] 2.5 Garantir tratamento explícito de erros e contratos coerentes com o TechSpec.

## Implementation Details
Seguir o TechSpec "Core Interfaces", "Data Models" e "API Endpoints". Esta task deve limitar-se ao backend e ao banco, sem assumir navegação de frontend ou lógica de timer da UI.

### Relevant Files
- `backend/src/main.ts` — configuração de bootstrap do NestJS e CORS local.
- `backend/src/app.module.ts` — composição dos módulos do backend.
- `backend/src/answers/answers.controller.ts` — controller provável para os endpoints HTTP.
- `backend/src/answers/answers.service.ts` — serviço de validação, persistência e agrupamento por sessão.
- `backend/src/answers/dto/` — contratos de entrada e saída do backend.
- `backend/src/database/` — conexão com SQL Server e acesso a dados.
- `backend/sql/` ou `backend/migrations/` — criação do schema `answer_records`.

### Dependent Files
- `frontend/src/services/api.ts` — dependerá dos contratos dos endpoints criados aqui.
- `frontend/src/pages/PracticeSession.tsx` — dependerá do endpoint `POST /answers`.
- `frontend/src/pages/History.tsx` — dependerá de `GET /sessions` e `GET /sessions/:sessionId/answers`.
- `README.md` — deverá refletir o fluxo de backend e banco disponível.

### Related ADRs
- [ADR-002: Organizar o MVP como monorepo com React no frontend e NestJS no backend](adrs/adr-002.md) — justifica a separação do backend como aplicação própria.
- [ADR-003: Persistir respostas do MVP em uma única tabela no SQL Server](adrs/adr-003.md) — define o modelo de persistência e a escolha do banco.

## Deliverables
- Schema inicial da tabela `answer_records`.
- Conexão funcional do backend com SQL Server local.
- Endpoints mínimos de respostas e histórico implementados.
- Validação de payload e tratamento explícito de erros de persistência.
- Unit tests com cobertura >=80% para validação e serviço do backend **(REQUIRED)**
- Integration tests cobrindo persistência e leitura dos endpoints principais **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que payload sem `sessionId` retorna erro descritivo.
  - [x] Validar que `elapsedSeconds` inválido é rejeitado pelo backend.
  - [x] Validar que o agrupamento de sessões retorna totais corretos por `sessionId`.
- Integration tests:
  - [x] `POST /answers` com payload válido persiste um registro e retorna `201 Created`.
  - [x] `POST /answers` com payload inválido retorna `400 Bad Request`.
  - [x] `GET /sessions` retorna sessões agrupadas com total de respostas salvo.
  - [x] `GET /sessions/:sessionId/answers` retorna respostas ordenadas por `questionOrder`.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O backend persiste respostas finalizadas no SQL Server sem depender de trabalho implícito de frontend.
- O frontend pode consumir contratos estáveis de salvamento e histórico a partir desta task.
