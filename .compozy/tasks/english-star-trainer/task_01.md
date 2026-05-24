---
status: completed
title: "Estruturar o monorepo e o ambiente local"
type: infra
complexity: high
dependencies: []
---

# Task 01: Estruturar o monorepo e o ambiente local

## Overview
Esta task cria a base técnica mínima do projeto para permitir desenvolvimento paralelo de frontend, backend e banco local. Ela é o alicerce de todas as demais tasks, porque define a estrutura do monorepo, os scripts operacionais e o ambiente local com SQL Server em Docker.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- 1. MUST criar a estrutura inicial do monorepo com apps separadas de frontend React e backend NestJS, conforme o TechSpec "System Architecture".
- 2. MUST provisionar um ambiente local com SQL Server em Docker e configuração mínima para uso em desenvolvimento.
- 3. MUST definir variáveis de ambiente, scripts e instruções operacionais suficientes para permitir que as tasks dependentes iniciem sem trabalho implícito adicional.
- 4. SHOULD manter a base enxuta, sem incluir features de produto, parser de perguntas, timer ou histórico nesta task.
</requirements>

## Subtasks
- [x] 1.1 Criar a estrutura base de diretórios para frontend, backend e recursos de banco local.
- [x] 1.2 Definir a configuração operacional mínima do monorepo, incluindo scripts compartilhados e variáveis de ambiente de desenvolvimento.
- [x] 1.3 Provisionar o SQL Server local em Docker com bootstrap inicial do ambiente.
- [x] 1.4 Registrar instruções mínimas de inicialização para que as próximas tasks possam rodar sobre a base criada.

## Implementation Details
Criar apenas a infraestrutura mínima descrita no TechSpec "Development Sequencing" e "Technical Dependencies". Esta task não deve antecipar contratos de API completos nem componentes de UX; ela só prepara o terreno para backend e frontend.

### Relevant Files
- `frontend/` — diretório previsto para a aplicação React definida no TechSpec.
- `backend/` — diretório previsto para a aplicação NestJS definida no TechSpec.
- `docker-compose.yml` — ponto central para subir o SQL Server local em Docker.
- `backend/.env.example` — referência mínima das variáveis de ambiente do backend.
- `README.md` — instruções de bootstrap e execução local.
- `.compozy/tasks/english-star-trainer/_techspec.md` — fonte das decisões estruturais e dependências técnicas.

### Dependent Files
- `backend/src/main.ts` — dependerá das variáveis de ambiente e do ambiente local definidos aqui.
- `backend/src/app.module.ts` — dependerá da estrutura e convenções do backend criadas aqui.
- `frontend/package.json` — dependerá da base do monorepo e scripts definidos aqui.
- `backend/package.json` — dependerá da base do monorepo e scripts definidos aqui.
- `backend/sql/` ou `backend/migrations/` — dependerão do SQL Server local provisionado aqui.

### Related ADRs
- [ADR-002: Organizar o MVP como monorepo com React no frontend e NestJS no backend](adrs/adr-002.md) — define a separação entre as aplicações dentro do mesmo repositório.
- [ADR-003: Persistir respostas do MVP em uma única tabela no SQL Server](adrs/adr-003.md) — exige a disponibilidade do banco local desde a base do projeto.

## Deliverables
- Estrutura inicial do monorepo com diretórios e configuração mínima de frontend e backend.
- Ambiente local com SQL Server em Docker pronto para uso em desenvolvimento.
- Arquivos de configuração de ambiente e scripts operacionais mínimos.
- Documentação de bootstrap local atualizada.
- Unit tests com cobertura >=80% para qualquer utilitário/configuração adicionada **(REQUIRED)**
- Integration tests ou checklist automatizável para validar bootstrap do ambiente local **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validar que utilitários de configuração carregam variáveis obrigatórias de ambiente.
  - [x] Validar que defaults de configuração do ambiente local são resolvidos corretamente quando aplicável.
  - [x] Validar que scripts auxiliares de bootstrap retornam erro descritivo quando variáveis obrigatórias estiverem ausentes.
- Integration tests:
  - [x] Subir o ambiente local e verificar que frontend, backend e SQL Server inicializam com a configuração esperada.
  - [x] Verificar que o backend consegue estabelecer conexão inicial com o SQL Server local provisionado.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- O repositório passa a ter estrutura operacional mínima para frontend, backend e banco local.
- As tasks 02 e 03 podem começar sem precisar redefinir bootstrap, env ou infraestrutura base.
