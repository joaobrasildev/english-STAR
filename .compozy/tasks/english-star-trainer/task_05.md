---
status: completed
title: "Integrar finalização da resposta com salvamento e progressão"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_04
---

# Task 05: Integrar finalização da resposta com salvamento e progressão

## Overview
Esta task conecta a experiência de prática ao backend, garantindo que a resposta só seja persistida após confirmação explícita e que a próxima pergunta só apareça depois do salvamento bem-sucedido. Ela fecha o loop principal do MVP entre responder, confirmar, salvar e avançar no fluxo linear.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST exigir confirmação explícita do usuário antes de persistir uma resposta.
- 2. MUST enviar ao backend apenas a resposta consolidada final, com `sessionId`, `questionOrder`, `questionText`, `targetSeconds` e `elapsedSeconds`.
- 3. MUST impedir avanço para a próxima pergunta quando o salvamento falhar.
- 4. SHOULD limpar o estado da questão concluída apenas após o backend confirmar persistência bem-sucedida.
</requirements>

## Subtasks
- [x] 5.1 Adicionar a ação de finalizar questão com confirmação explícita.
- [x] 5.2 Integrar a tela de prática ao endpoint `POST /answers`.
- [x] 5.3 Garantir que o avanço para a próxima pergunta dependa de resposta salva com sucesso.
- [x] 5.4 Exibir feedback de erro claro quando o salvamento falhar e preservar o estado atual da resposta.

## Implementation Details
Seguir o TechSpec "API Endpoints", "Contracto funcional esperado entre frontend e backend" e "Known Risks". Esta task conecta frontend e backend, mas não deve assumir construção da tela de histórico final.

### Relevant Files
- `frontend/src/pages/PracticeSession.tsx` — local principal da confirmação de término e progressão.
- `frontend/src/components/FinishConfirmation.tsx` — componente provável para confirmação explícita.
- `frontend/src/services/api.ts` — cliente HTTP do `POST /answers`.
- `frontend/src/hooks/usePracticeSession.ts` — estado e transições da resposta atual.
- `backend/src/answers/answers.controller.ts` — contrato consumido pelo frontend.
- `backend/src/answers/dto/` — formato do payload aceito para persistência.

### Dependent Files
- `frontend/src/pages/SessionSummary.tsx` — dependerá da lista de respostas concluídas construída após cada salvamento.
- `frontend/src/pages/History.tsx` — dependerá de respostas já persistidas por este fluxo.
- `backend/src/answers/answers.service.ts` — deverá permanecer compatível com o payload enviado daqui.

### Related ADRs
- [ADR-001: Focar o MVP em um treinador pessoal de velocidade com STAR](adrs/adr-001.md) — reforça o fluxo simples pergunta a pergunta.
- [ADR-003: Persistir respostas do MVP em uma única tabela no SQL Server](adrs/adr-003.md) — define que a persistência ocorre apenas na resposta finalizada.

## Deliverables
- Fluxo de confirmação de término integrado à tela de prática.
- Integração do frontend com `POST /answers` usando o contrato do backend.
- Progressão para a próxima pergunta condicionada ao sucesso do salvamento.
- Tratamento explícito de erros de persistência mantendo a resposta atual intacta.
- Unit tests com cobertura >=80% para a lógica de confirmação e transição de estado **(REQUIRED)**
- Integration tests cobrindo salvamento bem-sucedido e falha de persistência **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que a confirmação é obrigatória antes de disparar o salvamento.
  - [x] Validar que o payload enviado ao backend contém `fullAnswer`, `questionOrder`, `targetSeconds` e `elapsedSeconds`.
  - [x] Validar que o estado da pergunta atual não é limpo quando o salvamento falha.
- Integration tests:
  - [x] Confirmar o término de uma questão envia `POST /answers` e avança para a próxima pergunta após `201 Created`.
  - [x] Receber erro no `POST /answers` mantém a mesma pergunta na tela e exibe feedback de falha.
  - [x] Concluir a última pergunta salva a resposta final sem tentar avançar para uma pergunta inexistente.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- A aplicação só persiste respostas finalizadas após confirmação explícita.
- O fluxo linear entre perguntas deixa de depender de ação manual extra além do término confirmado e do sucesso do salvamento.
