---
status: completed
title: "Preservar parsing multiline das perguntas"
type: frontend
complexity: medium
dependencies: []
---

# Task 01: Preservar parsing multiline das perguntas

## Overview

Esta task estabelece a nova representação canônica das perguntas da sessão: strings multiline preservadas desde o setup. Ela é a base da feature porque destrava tanto a nova exibição da pergunta na tela de resposta quanto a persistência fiel de `questionText` nas respostas salvas.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
1. MUST atualizar `parseQuestions` para preservar quebras de linha relevantes dentro de cada pergunta numerada.
2. MUST manter `parsedQuestions` como a fonte canônica usada por setup e prática sem adicionar um segundo formato paralelo.
3. MUST continuar rejeitando blocos sem perguntas numeradas válidas.
4. SHOULD remover apenas ruído final desnecessário, sem achatar conteúdo interno relevante.
</requirements>

## Subtasks
- [x] 1.1 Atualizar o contrato semântico do parser para retornar perguntas multiline preservadas.
- [x] 1.2 Garantir que o fluxo de setup continue criando sessões válidas com `parsedQuestions` preservadas.
- [x] 1.3 Ajustar a prévia das perguntas para refletir a formatação multiline antes do início da sessão.
- [x] 1.4 Atualizar os testes de parser e setup para o novo contrato.

## Implementation Details

Concentre a mudança em `parseQuestions` e no fluxo de setup que consome `parsedQuestions`. Veja o TechSpec nas seções **System Architecture**, **Data Models** e **Testing Approach** para o contrato esperado do parser e os cenários mínimos de validação.

### Relevant Files
- `frontend/src/utils/parseQuestions.ts` — ponto principal da mudança de contrato do parser.
- `frontend/src/utils/parseQuestions.test.ts` — suíte unitária que precisa refletir o novo comportamento multiline.
- `frontend/src/hooks/useSessionSetup.ts` — cria `PreparedSession` a partir de `parsedQuestions`.
- `frontend/src/pages/SessionSetup.tsx` — compõe a tela de setup e a prévia das perguntas.
- `frontend/src/components/QuestionPreview.tsx` — exibe as perguntas parseadas antes da sessão.
- `frontend/src/pages/SessionSetup.test.tsx` — cobre a ordem da prévia e o início de sessão.

### Dependent Files
- `frontend/src/types/session.ts` — tipagem consumida pelo setup e pela prática.
- `frontend/src/App.tsx` — transição do setup para a prática depende de `PreparedSession`.
- `frontend/src/hooks/usePracticeSession.ts` — consumirá o novo `questionText` canônico vindo de `parsedQuestions`.
- `frontend/src/pages/PracticeSession.tsx` — exibirá a pergunta preservada na próxima fase.

### Related ADRs
- [ADR-001: Priorizar um layout da tela de resposta orientado pela pergunta](adrs/adr-001.md) — A pergunta precisa permanecer legível e fiel ao texto original.
- [ADR-002: Preservar a formatação da pergunta desde o parse até a persistência](adrs/adr-002.md) — Define o parser como origem da representação canônica multiline.

## Deliverables
- Parser atualizado para preservar quebras de linha relevantes nas perguntas numeradas.
- Fluxo de setup aceitando e exibindo corretamente perguntas multiline.
- Prévia de perguntas refletindo o novo contrato canônico.
- Unit tests com cobertura >=80% **(REQUIRED)**
- Integration tests para parser + setup flow **(REQUIRED)**

## Tests
- Unit tests:
  - [x] `parseQuestions` preserva linhas de continuação dentro da mesma pergunta numerada.
  - [x] `parseQuestions` continua separando corretamente perguntas distintas por numeração.
  - [x] `parseQuestions` ignora ruído externo sem transformar o conteúdo interno em linha única.
  - [x] `parseQuestions` retorna lista vazia quando não há perguntas numeradas válidas.
- Integration tests:
  - [x] A prévia do setup exibe uma pergunta multiline mantendo a ordem original.
  - [x] Iniciar sessão com perguntas multiline leva à tela de prática sem erro.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `parsedQuestions` passa a preservar `\n` relevantes sem quebrar a validação do setup.
- O usuário consegue revisar perguntas multiline no setup antes de iniciar a sessão.
