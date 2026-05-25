---
status: completed
title: "Entregar resumo final e tela de histórico"
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_05
---

# Task 06: Entregar resumo final e tela de histórico

## Overview
Esta task conclui o MVP com a exibição do resumo da sessão atual e uma tela simples de histórico para revisar sessões anteriores e suas respostas salvas. Ela transforma os dados persistidos em retorno visível para o usuário, apoiando o objetivo de acompanhar a evolução do tempo de resposta.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST exibir ao final da sessão a lista de perguntas respondidas com o tempo gasto em cada uma.
- 2. MUST implementar uma tela simples de histórico consumindo `GET /sessions` e `GET /sessions/:sessionId/answers`.
- 3. MUST apresentar os dados em ordem coerente de sessão e de perguntas dentro da sessão.
- 4. SHOULD permitir leitura clara da comparação entre tempo-alvo e tempo real quando essa informação estiver disponível no payload persistido.
</requirements>

## Subtasks
- [x] 6.1 Construir a tela de resumo da sessão atual com lista de tempos por resposta.
- [x] 6.2 Construir a tela simples de histórico de sessões passadas.
- [x] 6.3 Integrar a consulta de detalhes de uma sessão específica com suas respostas ordenadas.
- [x] 6.4 Garantir consistência visual e de ordenação entre resumo atual e histórico persistido.

## Implementation Details
Seguir o TechSpec "API Endpoints", "Impact Analysis" e "Success Metrics". Esta task deve consumir a API já pronta e o fluxo de respostas persistidas, sem redefinir schema ou contratos de backend.

### Relevant Files
- `frontend/src/pages/SessionSummary.tsx` — tela provável do resumo final da sessão.
- `frontend/src/pages/History.tsx` — tela provável do histórico de sessões.
- `frontend/src/components/SessionHistoryList.tsx` — componente provável de lista de sessões.
- `frontend/src/components/SessionAnswersList.tsx` — componente provável de detalhes de respostas por sessão.
- `frontend/src/services/api.ts` — cliente HTTP para `GET /sessions` e `GET /sessions/:sessionId/answers`.
- `backend/src/answers/answers.controller.ts` ou `backend/src/sessions/` — contratos consumidos pela UI.

### Dependent Files
- `frontend/src/pages/PracticeSession.tsx` — fornecerá os dados imediatos usados no resumo da sessão atual.
- `backend/src/answers/answers.service.ts` — deverá manter agrupamento e ordenação compatíveis com a UI.
- `README.md` — poderá precisar registrar como visualizar resumo e histórico no fluxo completo.

### Related ADRs
- [ADR-001: Focar o MVP em um treinador pessoal de velocidade com STAR](adrs/adr-001.md) — justifica a necessidade de retorno claro sobre tempo por resposta.
- [ADR-003: Persistir respostas do MVP em uma única tabela no SQL Server](adrs/adr-003.md) — define a fonte de dados para resumo e histórico.

## Deliverables
- Tela de resumo final da sessão com tempo por resposta.
- Tela simples de histórico de sessões passadas com navegação para detalhes da sessão.
- Integração com endpoints de listagem de sessões e respostas por sessão.
- Apresentação ordenada e coerente dos dados persistidos para apoiar evolução do usuário.
- Unit tests com cobertura >=80% para formatação e ordenação dos dados exibidos **(REQUIRED)**
- Integration tests cobrindo resumo final e histórico persistido **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que a lista do resumo final exibe respostas na ordem correta das perguntas.
  - [x] Validar que o histórico agrupa respostas por `sessionId` e calcula totais exibidos corretamente.
  - [x] Validar que a formatação do tempo distingue corretamente tempo-alvo e tempo real quando ambos estiverem disponíveis.
- Integration tests:
  - [x] Finalizar uma sessão exibe o resumo com o tempo de cada resposta salva.
  - [x] A tela de histórico lista sessões anteriores retornadas por `GET /sessions`.
  - [x] Abrir uma sessão do histórico carrega respostas ordenadas via `GET /sessions/:sessionId/answers`.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O usuário consegue revisar a sessão atual imediatamente após concluí-la e consultar sessões anteriores sem depender de dados temporários.
- O MVP entrega o loop completo de prática, persistência e revisão de desempenho descrito no PRD.
