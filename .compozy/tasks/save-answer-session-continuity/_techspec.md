# TechSpec — Criação de Sessão Antes da Prática e Salvamento Confiável de Respostas

## Executive Summary

Esta revisão muda o ciclo de vida da sessão de **IDs gerados no cliente** para **sessões criadas e persistidas no backend**. O frontend passará a chamar um novo endpoint de criação de sessão durante o setup, receberá um `sessionId` persistido e só entrará na prática depois que essa chamada for concluída com sucesso. A partir daí, `POST /answers` validará se a sessão existe e está ativa antes de inserir a resposta.

O trade-off principal é intencional: o setup passa a depender do backend antes da prática começar, mas a falha sai do momento mais crítico de “confirmar e salvar” e vai para o ponto mais seguro da UX. Isso elimina a lacuna estrutural em que a UI já está praticando enquanto o servidor ainda não tem nenhuma sessão persistida, e dá ao backend uma fonte de verdade real para validar a existência da sessão sem expandir o MVP para recuperação de rascunho ou continuidade entre dispositivos.

## System Architecture

### Component Overview

- **`useSessionSetup` (`frontend/src/hooks/useSessionSetup.ts`)**
  - Deixa de gerar `sessionId` localmente.
  - Continua validando `rawQuestionBlock` e `targetSeconds`.
  - Passa a chamar um novo método de API para criar a sessão no backend antes de ir para a prática.
  - Mantém o usuário no setup e exibe erro com retry se a criação da sessão falhar.

- **`SessionSetup` (`frontend/src/pages/SessionSetup.tsx`)**
  - Continua coletando `rawQuestionBlock` e `targetSeconds`.
  - Ganha estado de loading e erro para a chamada de criação de sessão.
  - Não navega para a prática até receber uma sessão persistida.

- **`PreparedSession` (`frontend/src/types/session.ts`)**
  - Continua sendo o contrato canônico da sessão ativa no frontend.
  - Passa a receber `sessionId` da resposta do backend, em vez de geração local.
  - Mantém `parsedQuestions`, `targetSeconds`, `currentIndex`, `currentAnswer` e `timerState`.

- **`api.ts` (`frontend/src/services/api.ts`)**
  - Adiciona um novo método `createSession` para o setup.
  - Mantém `createAnswer` como borda de salvamento de respostas.
  - Continua validando que o payload de resposta tem `sessionId` não vazio.
  - Passa a repassar erros explícitos quando o backend informar que a sessão não existe ou não está ativa.

- **`usePracticeSession` (`frontend/src/hooks/usePracticeSession.ts`)**
  - Continua montando `CreateAnswerPayload`.
  - Passa a assumir que `sessionId` veio de uma sessão já persistida no backend.
  - Continua preservando draft e retry quando o save falhar.
  - Deixa de carregar qualquer responsabilidade de criação de sessão.

- **Novo módulo de sessões no backend (`backend/src/sessions/*`)**
  - Cria e persiste registros de sessão antes do início da prática.
  - Expõe `POST /sessions`.
  - Valida o payload do setup e devolve um contrato persistido de sessão.

- **Módulo de answers existente (`backend/src/answers/*`)**
  - Continua dono da persistência de respostas e dos endpoints de histórico.
  - Passa a validar a existência/atividade da sessão antes do insert.
  - Mantém `GET /sessions` derivado de `answer_records` nesta fase.

### Data Flow

1. O usuário informa perguntas e tempo-alvo no setup.
2. `useSessionSetup` valida os dados localmente.
3. O frontend chama `POST /sessions`.
4. O backend persiste uma linha de sessão e devolve um `sessionId` persistido.
5. O frontend monta `PreparedSession` com essa resposta e entra na prática.
6. `usePracticeSession` monta o payload de resposta com o `sessionId` persistido.
7. `POST /answers` valida que a sessão existe e está ativa, depois insere a resposta.
8. `GET /sessions` continua sendo derivado de `answer_records`, então apenas sessões com respostas salvas aparecem no histórico nesta fase.

## Implementation Design

### Core Interfaces

```go
type StartSessionCommand struct {
    RawQuestionBlock string
    ParsedQuestions  []string
    TargetSeconds    int
}

type SessionRecord struct {
    SessionID        string
    RawQuestionBlock string
    ParsedQuestions  []string
    TargetSeconds    int
    Status           string
}
```

Contratos equivalentes no frontend:

- `CreateSessionPayload`
  - `rawQuestionBlock: string`
  - `parsedQuestions: string[]`
  - `targetSeconds: number`

- `CreateSessionResponse`
  - `sessionId: string`
  - `rawQuestionBlock: string`
  - `parsedQuestions: string[]`
  - `targetSeconds: number`
  - `status?: 'active'`

Convenções de erro:

- erros de validação do setup continuam explícitos e locais em `useSessionSetup`;
- falhas de criação de sessão aparecem no setup com retry;
- falhas de save continuam preservando a pergunta atual e o draft;
- `sessionId` inexistente ou inativo em `POST /answers` gera erro explícito para o cliente.

### Data Models

- **`practice_sessions`** (nova)
  - `id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID()`
  - `raw_question_block NVARCHAR(MAX) NOT NULL`
  - `parsed_questions NVARCHAR(MAX) NOT NULL` (JSON string)
  - `target_seconds INT NOT NULL`
  - `status NVARCHAR(32) NOT NULL DEFAULT 'active'`
  - `created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()`
  - `updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()`

- **`answer_records`** (existente)
  - Mantém o schema atual.
  - `session_id` passa a ser uma referência lógica para `practice_sessions.id`.
  - Não exige redesign do contrato de answer nesta fase.

- **Estado do frontend**
  - `PreparedSession` mantém o shape atual.
  - `currentIndex` e `currentAnswer` continuam apenas no frontend.
  - Não haverá persistência de draft neste escopo.

### API Endpoints

| Method | Path | Mudança |
|---|---|---|
| POST | `/sessions` | Novo endpoint para criar uma sessão persistida antes da prática |
| POST | `/answers` | Endpoint existente, agora validando existência/atividade da sessão antes do insert |
| GET | `/sessions` | Sem mudança de contrato; continua derivado de `answer_records` |
| GET | `/sessions/:sessionId/answers` | Sem mudança de contrato |

**Request de `POST /sessions`**
```json
{
  "rawQuestionBlock": "1. Tell me about yourself\n2. Describe a challenge you solved",
  "parsedQuestions": ["Tell me about yourself", "Describe a challenge you solved"],
  "targetSeconds": 120
}
```

**Response de `POST /sessions`**
```json
{
  "sessionId": "uuid",
  "rawQuestionBlock": "...",
  "parsedQuestions": ["..."],
  "targetSeconds": 120,
  "status": "active"
}
```

**Comportamento de `POST /answers`**
- `201` para resposta válida associada a sessão ativa.
- `400` para payload inválido.
- `404` ou erro explícito de contrato para sessão inexistente ou inativa.
- Não pode mais considerar “string não vazia” como validação suficiente de sessão.

## Integration Points

Não há nova integração externa. O único limite continua sendo a comunicação HTTP entre frontend e backend dentro do próprio sistema.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `frontend/src/hooks/useSessionSetup.ts` | modified | Substitui geração local de sessão por criação no backend; risco médio por mudar o handoff do setup | Adicionar criação assíncrona de sessão, loading, erro com retry e hidratação de `PreparedSession` a partir da resposta do servidor |
| `frontend/src/pages/SessionSetup.tsx` | modified | O setup passa a depender de request em andamento e falha remota; risco baixo a médio | Desabilitar múltiplos starts durante a request e exibir erro de criação de sessão com clareza |
| `frontend/src/services/api.ts` | modified | Adiciona `createSession` e muda a semântica de erro do save; risco médio | Criar cliente de sessão e tratar erro explícito de sessão inexistente |
| `frontend/src/types/session.ts` | modified semantic source | O shape pode permanecer, mas a origem do `sessionId` muda | Manter o tipo e atualizar sua semântica e testes |
| `frontend/src/hooks/usePracticeSession.ts` | modified | O save agora depende de sessão persistida no backend; risco médio | Remover pressupostos ligados à geração local e preservar retry/draft |
| `frontend/src/App.tsx` | modified | O handoff setup -> prática passa a depender de resposta assíncrona do backend; risco baixo | Ligar o novo start assíncrono sem quebrar resumo e histórico |
| `backend/src/sessions/*` | new | Novo módulo de sessão e persistência; risco médio | Adicionar controller, service, repository, DTOs, types e schema |
| `backend/src/answers/answers.service.ts` | modified | Passa a validar existência/atividade da sessão antes do insert; risco médio | Injetar lookup/validação de sessão e retornar erro explícito |
| `backend/src/answers/answers.repository.ts` | modified | Continua persistindo answers, agora assumindo sessão válida | Manter o caminho de insert e adicionar só a coordenação mínima necessária |
| `backend/src/answers/answer-records.schema.ts` | modified | Pode precisar de alinhamento com `practice_sessions`; risco médio | Adicionar ajustes de schema/índice sem quebrar dados existentes |
| testes do backend de `answers` | modified | Hoje cobrem só validação de string não vazia; risco baixo | Estender cobertura para sessão inexistente/inativa |
| testes do frontend | modified | O setup e a entrada na prática mudam no ponto inicial; risco baixo | Cobrir criação de sessão com sucesso/falha e fluxo completo até o save |

## Testing Approach

### Unit Tests

- **Frontend**
  - `useSessionSetup` deve:
    - chamar `createSession` só depois de a validação local passar;
    - manter o usuário no setup quando a criação da sessão falhar;
    - preencher `PreparedSession` com a resposta do backend;
    - deixar de gerar UUID localmente.
  - `api.test.ts` deve:
    - cobrir `createSession`;
    - manter o fail-fast de `createAnswer`;
    - propagar erro explícito para sessão inexistente.
  - `usePracticeSession.test.tsx` deve:
    - garantir que o save com sucesso continua avançando o fluxo com `sessionId` vindo do backend;
    - garantir que falhas de save preservam pergunta e draft;
    - garantir que estado inconsistente ainda falha de forma segura.

- **Backend**
  - `SessionsService` deve:
    - validar `rawQuestionBlock`, `parsedQuestions` e `targetSeconds`;
    - persistir uma nova sessão ativa;
    - rejeitar payloads inválidos de setup.
  - `AnswersService` deve:
    - rejeitar `sessionId` vazio;
    - rejeitar sessão inexistente ou inativa explicitamente;
    - manter a validação atual de `elapsedSeconds`.

### Integration Tests

- **Frontend**
  - `SessionSetup.test.tsx` / `App.review.test.tsx`
    - só iniciar a prática depois que `POST /sessions` passar;
    - mostrar erro no setup e impedir entrada na prática se a criação da sessão falhar;
    - continuar até prática e resumo quando criação de sessão e save da resposta passarem.
  - `PracticeSession.test.tsx`
    - preservar retry após falha de save;
    - garantir que o `sessionId` persistido percorre sem mudança do create session até o save da answer.

- **Backend**
  - Adicionar e2e para:
    - `POST /sessions` com sucesso;
    - `POST /answers` com sessão criada válida;
    - `POST /answers` com sessão inexistente;
    - `GET /sessions` sem regressão no comportamento atual.
  - Os testes atuais de histórico devem continuar provando ordenação e listagem corretas.

## Development Sequencing

### Build Order

1. Adicionar o modelo persistido e o schema de `practice_sessions` no backend — sem dependências.
2. Adicionar `backend/src/sessions/*` com DTOs, repository, service, controller e wiring do módulo — depends on step 1.
3. Atualizar `AnswersService` e pontos relacionados para validar existência/atividade da sessão antes de salvar answers — depends on steps 1 and 2.
4. Adicionar contratos e cliente `createSession` no frontend — depends on steps 2 and 3.
5. Refatorar `useSessionSetup`, `SessionSetup` e `App.tsx` para criar sessão no backend antes de entrar na prática — depends on step 4.
6. Ajustar `usePracticeSession` e testes de save para assumir `sessionId` emitido pelo backend e preservar retry — depends on steps 4 and 5.
7. Atualizar testes integrados de frontend e backend para o novo fluxo de start-session e save — depends on steps 3 through 6.
8. Executar lint, build e todas as suítes existentes do repositório — depends on steps 1 through 7.

### Technical Dependencies

- Nenhum pacote externo novo é necessário.
- O bootstrap de schema do SQL Server precisa suportar uma nova tabela e os ajustes mínimos relacionados.
- O setup do frontend passa a depender da disponibilidade do backend antes da prática.
- O comportamento atual do histórico deve permanecer intacto nesta fase.

## Monitoring and Observability

- Medir falhas de criação de sessão no setup.
- Medir falhas de save causadas por sessão inexistente ou inativa.
- Medir a quantidade de sessões criadas sem nenhuma resposta salva.
- Registrar eventos de lifecycle de sessão com:
  - `sessionId`
  - `status`
  - `targetSeconds`
  - path da request
- Se houver logging estruturado futuramente, falhas de validação de sessão devem ser distinguidas de falhas genéricas de banco.

## Technical Considerations

### Key Decisions

- **Decision:** criar e persistir sessões no backend antes do início da prática.
  - **Rationale:** remove a lacuna estrutural entre “a prática começou” e “o servidor conhece a sessão”.
  - **Trade-offs:** o setup passa a depender do backend.
  - **Alternatives rejected:** `sessionId` gerado no frontend e criação tardia no primeiro save.

- **Decision:** adicionar uma tabela dedicada de sessões, em vez de placeholders em `answer_records`.
  - **Rationale:** uma entidade real de sessão é mais simples e segura do que linhas sintéticas de resposta.
  - **Trade-offs:** adiciona uma nova superfície de schema.
  - **Alternatives rejected:** placeholders em `answer_records`.

- **Decision:** manter o histórico derivado de `answer_records` nesta fase.
  - **Rationale:** limita escopo enquanto corrige o problema principal de lifecycle.
  - **Trade-offs:** sessões criadas e nunca respondidas não aparecem no histórico ainda.
  - **Alternatives rejected:** migrar `GET /sessions` agora para a tabela de sessões.

- **Decision:** bloquear a entrada na prática se a criação da sessão falhar.
  - **Rationale:** o setup é o ponto menos disruptivo para retry.
  - **Trade-offs:** o usuário não entra em modo degradado/local temporário.
  - **Alternatives rejected:** prática local temporária com criação tardia da sessão.

### Known Risks

- **Risk:** a base pode acumular sessões sem respostas.
  - **Mitigation:** aceitar isso no MVP e medir; não expandir o escopo para cleanup automático agora.

- **Risk:** os testes atuais podem esconder pressupostos sobre UUID local.
  - **Mitigation:** atualizar testes de setup e de review flow para afirmar explicitamente a criação da sessão no backend.

- **Risk:** a validação pode divergir entre frontend e backend.
  - **Mitigation:** manter a validação do frontend estreita e deixar a existência da sessão no backend como fonte autoritativa.

- **Risk:** a mudança de schema pode complicar o bootstrap local atual.
  - **Mitigation:** seguir o mesmo padrão de inicialização lazy já usado pelo módulo de answers.

## Architecture Decision Records

- [ADR-001: Priorizar continuidade invisível da sessão ao salvar respostas](adrs/adr-001.md) — Mantém a promessa de UX focada em save confiável sem expor mecânicas de sessão.
- [ADR-002: Limitar o MVP à proteção apenas da sessão ativa](adrs/adr-002.md) — Preserva o escopo enxuto do MVP e evita expansão para recuperação mais ampla.
- [ADR-003: Usar o frontend como fonte única de verdade para `sessionId`](adrs/adr-003.md) — Documenta a abordagem anterior, agora superada por esta revisão.
- [ADR-004: Falhar antes do POST quando o payload não tiver `sessionId` válido](adrs/adr-004.md) — Registra a blindagem anterior no cliente, que agora fica subordinada à sessão persistida no backend.
- [ADR-005: Persistir a sessão no backend antes de iniciar a prática](adrs/adr-005.md) — Move a criação da sessão para o backend antes da prática começar.
- [ADR-006: Usar tabela de sessões para criação e validação, mantendo histórico derivado de answers](adrs/adr-006.md) — Introduz uma tabela dedicada de sessões sem migrar o histórico nesta fase.
