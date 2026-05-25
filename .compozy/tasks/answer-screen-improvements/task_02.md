---
status: completed
title: "Reorganizar a PracticeSession em layout orientado pela pergunta"
type: frontend
complexity: high
dependencies:
  - task_01
---

# Task 02: Reorganizar a PracticeSession em layout orientado pela pergunta

## Overview

Esta task redesenha a hierarquia visual da `PracticeSession` para que a pergunta e os campos STAR formem o fluxo principal da escrita. O objetivo é entregar a melhoria de usabilidade do PRD sem alterar a lógica de timer, confirmação, salvamento ou conclusão já existente.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
1. MUST posicionar a pergunta no topo da área principal e o `StarAnswerForm` imediatamente abaixo.
2. MUST mover timer, alertas, confirmação, erros, status final e preview para uma seção secundária inferior.
3. MUST preservar a exibição multiline da pergunta sem usar HTML injetado.
4. SHOULD limitar a mudança a composição JSX e estilos existentes, sem criar novas rotas ou nova camada de estado.
</requirements>

## Subtasks
- [x] 2.1 Reorganizar a composição da `PracticeSession` para refletir o fluxo principal pergunta + formulário.
- [x] 2.2 Reposicionar os painéis secundários em uma seção inferior coerente com o novo layout desktop-first.
- [x] 2.3 Ajustar os estilos compartilhados em `App.css` para a nova hierarquia visual e responsividade básica.
- [x] 2.4 Atualizar os testes da tela de prática para cobrir a nova renderização e prevenir regressões de comportamento.

## Implementation Details

A mudança deve reaproveitar `CountdownTimer`, `OvertimeAlert`, `FinishConfirmation` e `StarAnswerForm` sem alterar seu comportamento. Veja o TechSpec nas seções **Component Overview**, **Impact Analysis** e **Testing Approach** para os limites da recomposição visual e os cenários obrigatórios.

### Relevant Files
- `frontend/src/pages/PracticeSession.tsx` — ponto central da recomposição da tela.
- `frontend/src/App.css` — contém o grid atual e os estilos da prática que precisam ser reorganizados.
- `frontend/src/components/StarAnswerForm.tsx` — permanece no fluxo principal abaixo da pergunta.
- `frontend/src/components/CountdownTimer.tsx` — mantém a UI funcional do timer na seção secundária.
- `frontend/src/components/FinishConfirmation.tsx` — continua representando a confirmação de encerramento.
- `frontend/src/components/OvertimeAlert.tsx` — continua exibindo o estado de overtime.
- `frontend/src/pages/PracticeSession.test.tsx` — cobre os cenários de prática que precisam continuar válidos.

### Dependent Files
- `frontend/src/hooks/usePracticeSession.ts` — a tela depende dos estados e callbacks já expostos pelo hook.
- `frontend/src/utils/practiceSessionState.ts` — o fluxo de timer/salvamento não deve ser alterado acidentalmente.
- `frontend/src/hooks/usePracticeSession.test.tsx` — garante que a recomposição visual não mascare regressões de contrato do hook.
- `frontend/src/App.tsx` — integra a `PracticeSession` no fluxo geral da aplicação.

### Related ADRs
- [ADR-001: Priorizar um layout da tela de resposta orientado pela pergunta](adrs/adr-001.md) — Define a hierarquia visual desejada para a tela.
- [ADR-002: Preservar a formatação da pergunta desde o parse até a persistência](adrs/adr-002.md) — Exige que a pergunta seja renderizada preservando múltiplas linhas.
- [ADR-003: Reestruturar a PracticeSession em fluxo vertical primário e seção secundária](adrs/adr-003.md) — Delimita a solução técnica e as alternativas rejeitadas.

## Deliverables
- `PracticeSession` reorganizada em fluxo principal e seção secundária inferior.
- Estilos atualizados em `App.css` para suportar a nova hierarquia e pergunta multiline.
- Cobertura de testes da tela de prática atualizada para layout e comportamento.
- Unit tests com cobertura >=80% **(REQUIRED)**
- Integration tests para PracticeSession flow **(REQUIRED)**

## Tests
- Unit tests:
  - [x] A renderização da pergunta preserva múltiplas linhas sem perder conteúdo.
  - [x] Os componentes condicionais de overtime, erro e conclusão continuam aparecendo com os mesmos estados.
- Integration tests:
  - [x] A tela de prática exibe a pergunta antes do formulário STAR no fluxo principal.
  - [x] O timer continua iniciando, entrando em overtime e mantendo o alerta sonoro uma única vez.
  - [x] O preview continua sendo atualizado conforme os campos STAR mudam.
  - [x] O fluxo de confirmação e salvamento continua avançando corretamente após sucesso.
  - [x] Em falha de salvamento, a pergunta e o rascunho permanecem visíveis.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- A `PracticeSession` passa a refletir a hierarquia pergunta-first sem regressão funcional do timer ou do save flow.
- O layout desktop reduz a fragmentação visual ao mover os painéis auxiliares para uma seção inferior.
