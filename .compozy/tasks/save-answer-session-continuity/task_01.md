---
status: completed
title: "Criar persistência e API de sessões no backend"
type: backend
complexity: high
dependencies: []
---

# Task 01: Criar persistência e API de sessões no backend

## Overview
Esta task introduz o conceito persistido de sessão no backend para que a prática só comece depois que o servidor conhecer e registrar a sessão ativa. Ela cria a base estrutural para eliminar a lacuna atual entre o setup no frontend e o primeiro salvamento em `POST /answers`.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST criar uma persistência dedicada de sessões no backend, separada de `answer_records`.
- 2. MUST expor `POST /sessions` para criar sessão persistida antes da prática e devolver `sessionId` emitido pelo servidor.
- 3. MUST persistir `rawQuestionBlock`, `parsedQuestions`, `targetSeconds` e metadados mínimos de lifecycle da sessão.
- 4. SHOULD reaproveitar o padrão atual de bootstrap lazy de schema e o pool SQL já existente no backend.
- 5. MUST provar por testes que sessões válidas são criadas e payloads inválidos são rejeitados explicitamente.
</requirements>

## Subtasks
- [x] 1.1 Adicionar o modelo persistido e o schema de `practice_sessions` com os campos definidos no TechSpec.
- [x] 1.2 Criar os contratos, DTOs, types e serviços necessários para representar a criação de sessão no backend.
- [x] 1.3 Expor o endpoint `POST /sessions` no módulo apropriado e conectá-lo ao `AppModule`.
- [x] 1.4 Garantir que a resposta do create-session devolva os dados necessários para hidratar `PreparedSession` no frontend.
- [x] 1.5 Atualizar a cobertura unitária e e2e do backend para o novo lifecycle de criação de sessão.

## Implementation Details
Seguir o TechSpec "System Architecture", "Data Models", "API Endpoints" e "Development Sequencing". Esta task deve introduzir a nova entidade de sessão com o menor acoplamento possível, sem alterar ainda o comportamento funcional de `POST /answers` além do necessário para compartilhar infraestrutura.

### Relevant Files
- `backend/src/app.module.ts` — precisa importar o novo módulo de sessões para expor o endpoint.
- `backend/src/answers/answers.module.ts` — referência do padrão atual de providers, pool SQL e wiring de módulo.
- `backend/src/answers/answers.repository.ts` — referência do padrão de acesso a banco e bootstrap lazy de schema.
- `backend/src/answers/answer-records.schema.ts` — base para o novo schema de `practice_sessions`.
- `backend/src/answers/answers.types.ts` — referência dos contratos públicos usados pelo backend atual.
- `backend/src/config/env.ts` — garante reaproveitamento da configuração de banco existente.

### Dependent Files
- `backend/src/answers/answers.service.ts` — consumirá a nova fonte de verdade de sessão na task seguinte.
- `frontend/src/services/api.ts` — precisará do novo contrato `POST /sessions`.
- `frontend/src/hooks/useSessionSetup.ts` — dependerá da resposta do endpoint para iniciar a prática.
- `backend/test/answers.e2e-spec.ts` — deve permanecer compatível com o novo lifecycle.

### Related ADRs
- [ADR-005: Persistir a sessão no backend antes de iniciar a prática](adrs/adr-005.md) — estabelece a criação antecipada da sessão como abordagem principal.
- [ADR-006: Usar tabela de sessões para criação e validação, mantendo histórico derivado de answers](adrs/adr-006.md) — define o papel da nova tabela de sessões nesta fase.
- [ADR-002: Limitar o MVP à proteção apenas da sessão ativa](adrs/adr-002.md) — restringe o escopo para não introduzir recuperação ampla de progresso.

## Deliverables
- Tabela `practice_sessions` criada e integrada ao bootstrap do backend.
- Novo módulo/serviço/repository/controller para criação de sessão persistida.
- Endpoint `POST /sessions` devolvendo `sessionId` emitido pelo backend e os campos esperados pelo frontend.
- Unit tests do backend cobrindo criação de sessão e rejeição de payload inválido **(REQUIRED)**
- Integration/e2e tests cobrindo `POST /sessions` com sucesso e falha **(REQUIRED)**
- Test coverage >=80% para o novo caminho de criação de sessão **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que o serviço cria uma sessão ativa persistida com `rawQuestionBlock`, `parsedQuestions` e `targetSeconds` válidos.
  - [x] Validar que payload com `parsedQuestions` vazio ou `targetSeconds` inválido é rejeitado com erro explícito.
  - [x] Validar que o repository materializa o schema de `practice_sessions` e retorna um registro persistido.
- Integration tests:
  - [x] `POST /sessions` com payload válido retorna `201` e um `sessionId` persistido.
  - [x] `POST /sessions` com payload inválido retorna erro de contrato sem criar sessão.
  - [x] O módulo de sessões fica acessível via `AppModule` sem quebrar os endpoints existentes.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O backend passa a criar e persistir sessões antes do início da prática.
- O frontend pode depender de um `sessionId` emitido pelo servidor em vez de geração local.
