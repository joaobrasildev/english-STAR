---
status: completed
title: "Propagar e persistir `questionText` preservado"
type: frontend
complexity: high
dependencies:
  - task_01
---

# Task 03: Propagar e persistir `questionText` preservado

## Overview

Esta task garante que a pergunta multiline preservada em `parsedQuestions` seja enviada e persistida sem normalização indevida no fluxo de salvamento. Ela fecha o contrato ponta a ponta entre estado da prática, payloads do frontend e leitura posterior do backend, mantendo o schema atual.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
1. MUST manter `questionText` como string multiline preservada ao montar `CreateAnswerPayload`.
2. MUST validar que o contrato frontend/backend continua aceitando e devolvendo `questionText` com `\n` sem mudança estrutural de API.
3. MUST atualizar testes que hoje assumem perguntas achatadas em uma única linha.
4. SHOULD evitar alterações de schema ou novos campos quando o contrato atual já comporta o texto preservado.
</requirements>

## Subtasks
- [x] 3.1 Confirmar que `usePracticeSession` envia o valor preservado de `parsedQuestions` como `questionText`.
- [x] 3.2 Validar a camada de API do frontend para garantir envio e leitura do payload multiline sem transformação paralela.
- [x] 3.3 Ajustar as expectativas de testes de frontend e backend para `questionText` preservado.
- [x] 3.4 Confirmar que o backend persiste e retorna o texto preservado sem exigir alteração de schema.

## Implementation Details

O foco é o contrato de salvamento, não um redesign de API. Veja o TechSpec nas seções **Core Interfaces**, **API Endpoints**, **Impact Analysis** e **Testing Approach** para os limites dessa propagação e os testes mínimos exigidos.

### Relevant Files
- `frontend/src/hooks/usePracticeSession.ts` — monta `CreateAnswerPayload` com `questionText`.
- `frontend/src/services/api.ts` — define `CreateAnswerPayload` e `AnswerRecord`.
- `frontend/src/types/session.ts` — tipagem da sessão preparada consumida pelo hook.
- `frontend/src/hooks/usePracticeSession.test.tsx` — cobre o payload enviado ao salvar.
- `frontend/src/pages/PracticeSession.test.tsx` — valida o fluxo de confirmação e save com `questionText`.
- `frontend/src/services/api.test.ts` — valida o contrato do POST `/answers`.
- `backend/src/answers/dto/create-answer.dto.ts` — contrato de entrada do backend.
- `backend/src/answers/answers.service.ts` — valida a entrada e delega a persistência.
- `backend/src/answers/answers.repository.ts` — persiste `questionText` no banco.
- `backend/test/answers.e2e-spec.ts` — garante que POST e GET preservem o texto salvo.

### Dependent Files
- `frontend/src/pages/PracticeSession.tsx` — exibe a pergunta e dispara o save flow que depende desse contrato.
- `frontend/src/components/SessionAnswersList.tsx` — consome `questionText` salvo em resumo/histórico.
- `frontend/src/App.review.test.tsx` — cobre o fluxo de review de sessões salvas.
- `backend/src/answers/answers.types.ts` — tipagem de resposta retornada pelo backend.
- `backend/src/answers/answers.service.spec.ts` — pode precisar refletir o novo valor multiline.
- `backend/src/answers/answers.repository.spec.ts` — valida persistência/consulta do campo `questionText`.

### Related ADRs
- [ADR-002: Preservar a formatação da pergunta desde o parse até a persistência](adrs/adr-002.md) — Define o contrato canônico da pergunta entre parse, UI e save.
- [ADR-003: Reestruturar a PracticeSession em fluxo vertical primário e seção secundária](adrs/adr-003.md) — Delimita que a mudança de persistência não depende de uma nova arquitetura de tela.

## Deliverables
- Propagação validada de `questionText` preservado do hook até o endpoint `/answers`.
- Expectativas de testes frontend/backend atualizadas para perguntas multiline.
- Confirmação explícita de que o backend persiste e retorna `questionText` multiline sem alterar schema.
- Unit tests com cobertura >=80% **(REQUIRED)**
- Integration tests para save/readback de `questionText` **(REQUIRED)**

## Tests
- Unit tests:
  - [x] `usePracticeSession` envia `questionText` multiline preservado ao confirmar o save.
  - [x] `createAnswer` envia o payload esperado sem normalizar `questionText`.
  - [x] Specs de service/repository aceitam `questionText` multiline sem erro.
- Integration tests:
  - [x] O fluxo de salvamento da `PracticeSession` chama `createAnswer` com o texto multiline preservado.
  - [x] `POST /answers` persiste `questionText` multiline e `GET /sessions/:sessionId/answers` devolve o mesmo texto.
  - [x] O fluxo de review continua carregando respostas salvas com `questionText` multiline.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `questionText` deixa de ser achatado no save flow e passa a permanecer fiel ao parser.
- O backend continua compatível com o contrato atual e retorna o texto salvo sem regressão.
