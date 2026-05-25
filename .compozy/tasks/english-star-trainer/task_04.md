---
status: completed
title: "Implementar a experiência de resposta STAR com timer e overtime"
type: frontend
complexity: high
dependencies:
  - task_03
---

# Task 04: Implementar a experiência de resposta STAR com timer e overtime

## Overview
Esta task cria a tela principal de prática com uma pergunta por vez, campos S/T/A/R, resposta consolidada e timer regressivo que entra em overtime. Ela entrega o núcleo da experiência de treino definida no PRD, sem ainda salvar respostas no backend.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST exibir uma única pergunta por vez e os quatro campos STAR separados.
- 2. MUST consolidar automaticamente os campos S, T, A e R em uma resposta completa tratada como quatro parágrafos.
- 3. MUST iniciar o timer sob ação explícita do usuário, contar regressivamente até zero e continuar em overtime após o alerta.
- 4. MUST aplicar alerta visual e som curto quando o tempo-alvo chegar a zero, sem interromper a escrita.
</requirements>

## Subtasks
- [x] 4.1 Criar a tela de prática com pergunta atual, campos STAR e área de resposta consolidada.
- [x] 4.2 Implementar o estado do timer com transições entre `idle`, `countdown`, `overtime` e `completed`.
- [x] 4.3 Implementar o alerta visual e sonoro ao zerar o tempo-alvo.
- [x] 4.4 Garantir que a resposta consolidada reflita automaticamente o conteúdo dos campos STAR enquanto o usuário escreve.

## Implementation Details
Seguir o TechSpec "Core Interfaces", "Modelo de sessão no frontend" e "Known Risks". Esta task deve permanecer no frontend e não deve assumir persistência remota; o foco aqui é a experiência local de resposta.

### Relevant Files
- `frontend/src/pages/PracticeSession.tsx` — tela principal de prática pergunta a pergunta.
- `frontend/src/components/StarAnswerForm.tsx` — componente provável dos campos S/T/A/R.
- `frontend/src/components/CountdownTimer.tsx` — componente provável do timer regressivo e overtime.
- `frontend/src/components/OvertimeAlert.tsx` — componente provável do alerta visual/sonoro.
- `frontend/src/utils/composeAnswer.ts` — utilitário de consolidação da resposta completa.
- `frontend/src/hooks/usePracticeSession.ts` — estado local do fluxo de resposta e timer.

### Dependent Files
- `frontend/src/pages/SessionSetup.tsx` — fornecerá o estado inicial da sessão consumido aqui.
- `frontend/src/pages/SessionSummary.tsx` — dependerá do tempo e da ordem de respostas produzidos aqui.
- `frontend/src/services/api.ts` — será integrado na task 05 com base nos dados produzidos aqui.

### Related ADRs
- [ADR-001: Focar o MVP em um treinador pessoal de velocidade com STAR](adrs/adr-001.md) — define o foco em treino de velocidade com fluxo linear.

## Deliverables
- Tela de prática com pergunta única, campos STAR e resposta consolidada.
- Timer regressivo com suporte a overtime e alerta visual/sonoro ao zerar.
- Estado local completo da resposta em andamento sem persistência antes da confirmação.
- Regras de transição de estado do timer alinhadas ao TechSpec.
- Unit tests com cobertura >=80% para timer, consolidação da resposta e transições de estado **(REQUIRED)**
- Integration tests cobrindo a experiência de prática em uma pergunta **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que a resposta consolidada reúne S, T, A e R na ordem correta como parágrafos distintos.
  - [x] Validar que o timer muda de `idle` para `countdown` apenas após iniciar a questão.
  - [x] Validar que o timer entra em `overtime` ao chegar a zero sem zerar o tempo acumulado.
- Integration tests:
  - [x] Iniciar uma questão exibe a pergunta atual, dispara o timer e mantém a edição dos campos STAR disponível.
  - [x] Ao chegar a zero, o alerta visual aparece e o som curto é disparado uma vez sem interromper a resposta.
  - [x] Alterar qualquer campo STAR atualiza imediatamente a resposta consolidada exibida ao usuário.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O usuário consegue praticar uma pergunta com estrutura STAR e acompanhar countdown mais overtime sem depender do backend.
- A task 05 pode conectar salvamento e progressão usando os dados e estados produzidos aqui.
