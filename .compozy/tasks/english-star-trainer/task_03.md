---
status: pending
title: "Criar a tela de preparação da sessão com parser de perguntas"
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 03: Criar a tela de preparação da sessão com parser de perguntas

## Overview
Esta task implementa a entrada da sessão de treino, onde o usuário cola um bloco único de perguntas enumeradas e define o tempo-alvo. Ela prepara a sessão em memória e garante que apenas listas válidas avancem para a prática, reduzindo fricção no início do fluxo.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST oferecer um campo único para colar perguntas enumeradas e um campo para definir o tempo-alvo da sessão.
- 2. MUST separar as perguntas automaticamente por enumeração numérica conforme o TechSpec "Regras do parser de perguntas".
- 3. MUST bloquear o início da sessão quando nenhuma pergunta válida for identificada.
- 4. SHOULD exibir pré-visualização coerente da ordem final das perguntas antes de iniciar a prática.
</requirements>

## Subtasks
- [ ] 3.1 Criar a tela de preparação da sessão com entrada do bloco de perguntas e definição de tempo.
- [ ] 3.2 Implementar o parser de perguntas enumeradas com suporte às regras mínimas definidas no TechSpec.
- [ ] 3.3 Exibir a pré-visualização da lista de perguntas gerada pelo parser.
- [ ] 3.4 Persistir em memória local o estado da sessão inicial para destravar a tela de prática.

## Implementation Details
Seguir o TechSpec "Data Models", "Regras do parser de perguntas" e "Development Sequencing". Esta task não deve implementar timer, campos STAR nem integração de salvamento com backend.

### Relevant Files
- `frontend/src/pages/SessionSetup.tsx` — tela provável de preparação da sessão.
- `frontend/src/components/QuestionParser.tsx` — componente provável de entrada e validação do bloco enumerado.
- `frontend/src/components/QuestionPreview.tsx` — pré-visualização das perguntas parseadas.
- `frontend/src/hooks/useSessionSetup.ts` — estado local da preparação da sessão.
- `frontend/src/utils/parseQuestions.ts` — utilitário de parsing do bloco de perguntas.
- `.compozy/tasks/english-star-trainer/_techspec.md` — referência para regras de parsing e estado da sessão.

### Dependent Files
- `frontend/src/pages/PracticeSession.tsx` — dependerá da sessão parseada e do `currentIndex` inicial.
- `frontend/src/components/CountdownTimer.tsx` — dependerá do `targetSeconds` definido aqui.
- `frontend/src/store/` ou `frontend/src/hooks/` — dependerão do formato do estado de sessão definido nesta task.

### Related ADRs
- [ADR-001: Focar o MVP em um treinador pessoal de velocidade com STAR](adrs/adr-001.md) — reforça o foco em fluxo simples e sessão manual.
- [ADR-002: Organizar o MVP como monorepo com React no frontend e NestJS no backend](adrs/adr-002.md) — situa esta task no frontend React.

## Deliverables
- Tela de preparação da sessão com campo único de perguntas e tempo-alvo.
- Parser de perguntas enumeradas com pré-visualização antes do início.
- Estado em memória da sessão inicial pronto para ser consumido pela tela de prática.
- Regras de validação para impedir sessões sem perguntas válidas.
- Unit tests com cobertura >=80% para parser e validações da tela **(REQUIRED)**
- Integration tests cobrindo o fluxo de preparação da sessão **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] Validar que o parser separa corretamente perguntas com formato `1.` e `2.`.
  - [ ] Validar que linhas sem nova enumeração são anexadas à pergunta anterior.
  - [ ] Validar que um bloco sem perguntas válidas impede a criação da sessão.
- Integration tests:
  - [ ] Colar uma lista numerada válida gera pré-visualização com a mesma ordem das perguntas.
  - [ ] Informar tempo-alvo e iniciar a sessão cria estado inicial com `currentIndex` igual a zero.
  - [ ] Tentar iniciar a sessão com bloco inválido exibe erro e não avança para a prática.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O usuário consegue criar uma sessão válida a partir de um bloco enumerado sem cadastrar perguntas uma a uma.
- A task 04 pode consumir um estado inicial de sessão sem redefinir parser ou validações básicas.
