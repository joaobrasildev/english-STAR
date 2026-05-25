# TechSpec — Melhorias na Tela de Resposta

## Executive Summary

Esta mudança preserva a formatação relevante da pergunta desde o `parseQuestions` até a persistência de `questionText` e reorganiza a `PracticeSession` em um fluxo visual vertical: pergunta no topo, campos STAR logo abaixo e painéis secundários em uma seção inferior. A implementação aproveita a arquitetura existente do frontend, sem criar novas rotas, sem alterar contratos de API e sem introduzir novos modelos de backend.

A principal troca técnica é aceitar uma mudança de contrato no parser para ganhar consistência entre entrada, estado da sessão, renderização e histórico salvo. Isso exige atualizar testes e pontos de exibição que assumiam texto achatado, mas evita múltiplas representações da mesma pergunta e reduz lógica paralela de formatação na interface.

## System Architecture

### Component Overview

- **`parseQuestions` (`frontend/src/utils/parseQuestions.ts`)**
  - Continua sendo a fonte única para transformar o bloco manual de perguntas em `parsedQuestions`.
  - Passa a preservar quebras de linha relevantes dentro de cada pergunta e a limpar apenas ruído final desnecessário.
  - Não muda a saída estrutural do módulo: continua retornando `string[]`.

- **`useSessionSetup` (`frontend/src/hooks/useSessionSetup.ts`)**
  - Continua consumindo `parseQuestions(rawQuestionBlock)` para formar `PreparedSession`.
  - Não ganha estado adicional; apenas recebe strings de pergunta com nova semântica de formatação.
  - Mantém validação de quantidade de perguntas e tempo alvo.

- **`usePracticeSession` (`frontend/src/hooks/usePracticeSession.ts`)**
  - Continua derivando `currentQuestion` de `state.parsedQuestions[state.currentIndex]`.
  - Continua montando `CreateAnswerPayload` com `questionText` vindo da pergunta atual.
  - Não precisa de novo reducer action nem novo shape de estado.

- **`PracticeSession` (`frontend/src/pages/PracticeSession.tsx`)**
  - Passa a ser o ponto central da reorganização visual.
  - Renderiza a pergunta preservando múltiplas linhas.
  - Reorganiza `CountdownTimer`, `OvertimeAlert`, `FinishConfirmation`, banners de erro/conclusão e `answer-preview-panel` em uma seção secundária inferior.

- **Camada de estilo (`frontend/src/App.css`)**
  - Substitui a hierarquia baseada em `.practice-grid` de duas colunas por uma estrutura de fluxo principal + seção secundária empilhada.
  - Mantém compatibilidade com o breakpoint atual, mas com layout desktop-first como prioridade.

- **Persistência e leitura**
  - `createAnswer()` (`frontend/src/services/api.ts`) mantém o mesmo endpoint e o mesmo payload.
  - O backend (`backend/src/answers/dto/create-answer.dto.ts`, `backend/src/answers/answers.service.ts`) continua aceitando `questionText` como `string` sem exigir mudança de schema.
  - `SessionAnswersList` continuará lendo `answer.questionText`; novos registros refletirão as quebras de linha preservadas.

### Data Flow

1. O usuário cola o bloco manual de perguntas em `SessionSetup`.
2. `parseQuestions` transforma o texto em `parsedQuestions`, agora preservando a estrutura relevante de linha.
3. `useSessionSetup` cria `PreparedSession` com essas perguntas preservadas.
4. `usePracticeSession` expõe `currentQuestion` e usa o mesmo texto ao montar `CreateAnswerPayload`.
5. `PracticeSession` exibe a pergunta com preservação de linhas e salva a resposta sem reformatar `questionText`.
6. O histórico e o resumo continuam lendo o texto salvo pelo backend.

## Implementation Design

### Core Interfaces

```ts
export type PreparedSession = {
  sessionId: string
  rawQuestionBlock: string
  parsedQuestions: string[]
  targetSeconds: number
  currentIndex: number
  currentAnswer: CurrentAnswer
  timerState: SessionTimerState
}
```

```ts
export type CreateAnswerPayload = {
  sessionId: string
  questionOrder: number
  questionText: string
  fullAnswer: string
  targetSeconds: number
  elapsedSeconds: number
}
```

**Planned contract changes**

- `parsedQuestions: string[]` permanece igual em tipo, mas cada string passa a poder conter `\n`.
- `questionText` continua sendo `string` em toda a API; o contrato muda apenas semanticamente para aceitar texto multilinha preservado.
- A renderização da pergunta deve usar uma estratégia de CSS compatível com quebras de linha preservadas, sem converter o texto em HTML.

### Data Models

- **Entrada de setup**
  - `rawQuestionBlock: string`
  - Continua sendo o texto bruto colado pelo usuário.

- **Pergunta parseada**
  - `parsedQuestions: string[]`
  - Novo contrato semântico:
    - preserva quebras de linha relevantes;
    - remove linhas vazias finais não necessárias;
    - mantém ordenação por pergunta numerada;
    - continua ignorando blocos sem numeração válida.

- **Sessão preparada**
  - `PreparedSession`
  - Sem novos campos.
  - O impacto é apenas no conteúdo de `parsedQuestions`.

- **Payload de salvamento**
  - `CreateAnswerPayload.questionText`
  - Continua obrigatório.
  - Passa a carregar o texto multilinha preservado.

- **Persistência**
  - `CreateAnswerDto.questionText` no backend continua `string` não vazia.
  - Como o repositório usa `NVarChar(MAX)` para `questionText`, não há necessidade de migração de schema para suportar múltiplas linhas.

### API Endpoints

| Method | Path | Change |
|---|---|---|
| POST | `/answers` | Sem mudança de contrato estrutural; `questionText` passa a carregar texto multilinha preservado |
| GET | `/sessions` | Sem mudança |
| GET | `/sessions/:sessionId/answers` | Sem mudança de contrato estrutural; respostas novas podem retornar `questionText` com `\n` |

**Request/response behavior**

- Nenhum endpoint novo será criado.
- Nenhuma validação nova de backend será adicionada apenas por causa de múltiplas linhas.
- O frontend continua responsável por enviar o valor preservado exatamente como foi produzido pelo parser.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `frontend/src/utils/parseQuestions.ts` | modified | Muda o contrato semântico do parser; risco médio por afetar setup e persistência | Reescrever a lógica de continuação para preservar `\n` relevantes e limpar ruído final |
| `frontend/src/utils/parseQuestions.test.ts` | modified | Testes atuais assumem concatenação em linha única; risco baixo | Atualizar expectativas e adicionar cenários de preservação |
| `frontend/src/hooks/useSessionSetup.ts` | modified | Consome parser com nova semântica; risco baixo | Confirmar que `PreparedSession` continua estável sem novos campos |
| `frontend/src/hooks/usePracticeSession.ts` | modified | Propaga `questionText` preservado para payload; risco baixo | Manter fluxo atual e validar payload salvo |
| `frontend/src/pages/PracticeSession.tsx` | modified | Reestrutura visual principal da feature; risco médio | Reorganizar JSX em fluxo vertical e seção secundária |
| `frontend/src/App.css` | modified | Substitui o layout atual de duas colunas; risco médio | Criar estilos para pergunta multilinha e nova hierarquia visual |
| `frontend/src/pages/PracticeSession.test.tsx` | modified | Testes atuais cobrem o fluxo, mas não a nova hierarquia/linhas preservadas; risco baixo | Adicionar asserts de multilinha e reposicionamento sem quebrar fluxo |
| `frontend/src/services/api.ts` | unchanged semantic contract | Endpoint e tipos permanecem iguais; risco baixo | Nenhuma mudança estrutural; apenas validar payload com multilinha |
| `frontend/src/components/SessionAnswersList.tsx` | optional follow-up | Pode exibir novas quebras se receber texto preservado; risco baixo | Nesta entrega, manter sem redesign; validar que o texto continua legível |
| `backend/src/answers/*` | unchanged | Backend já aceita `questionText` como string; risco baixo | Nenhuma mudança de contrato ou schema |

## Testing Approach

### Unit Tests

- **`parseQuestions.test.ts`**
  - Cobrir pergunta numerada simples sem regressão.
  - Cobrir pergunta com linhas de continuação preservadas.
  - Cobrir remoção de linhas vazias finais desnecessárias.
  - Cobrir bloco inválido sem perguntas numeradas.
  - Cobrir mistura de múltiplas perguntas com continuidade multiline.

- **Opcional no nível utilitário de renderização**
  - Não criar helper novo apenas para whitespace se a regra puder ficar em `parseQuestions` + CSS.
  - Seguir YAGNI: sem novo módulo de formatação se o comportamento couber no parser existente.

### Integration Tests

- **`PracticeSession.test.tsx`**
  - Validar exibição da pergunta com quebra de linha preservada.
  - Validar envio de `questionText` preservado em `createAnswer`.
  - Validar que o fluxo de timer, confirmação e avanço continua intacto.
  - Validar que erro de salvamento mantém a pergunta atual visível no novo layout.

- **`App.review.test.tsx`**
  - Validar que sessões concluídas continuam mostrando perguntas salvas corretamente quando os registros contiverem texto multilinha.
  - Não ampliar escopo para redesign de resumo/histórico; apenas prevenir regressão do fluxo.

- **Backend**
  - Não é necessário criar novos testes de backend se o contrato estrutural não mudar.
  - Ajustes só serão necessários se algum teste existente falhar com `questionText` multilinha.

## Development Sequencing

### Build Order

1. **Atualizar `parseQuestions` e seus testes** — sem dependências.
2. **Validar a propagação do texto preservado em `useSessionSetup` e `usePracticeSession`** — depends on step 1.
3. **Reestruturar `PracticeSession.tsx` para fluxo principal + seção secundária** — depends on steps 1 and 2.
4. **Atualizar `App.css` para suportar pergunta multilinha, nova hierarquia vertical e breakpoint coerente** — depends on step 3.
5. **Expandir `PracticeSession.test.tsx` e `App.review.test.tsx` para cobrir multilinha e persistência** — depends on steps 2, 3 and 4.
6. **Executar a suíte existente de lint, build e testes relevantes** — depends on steps 1 through 5.

### Technical Dependencies

- Nenhuma dependência externa nova.
- O backend existente em `/answers` precisa continuar disponível para validação manual integrada, mas o design não depende de mudanças nele.
- A cobertura de frontend continua dependendo da suíte `npm --prefix frontend run test`.

## Monitoring and Observability

- Não serão adicionadas novas integrações de observabilidade nesta entrega.
- A visibilidade operacional continuará baseada em:
  - erro exibido pelo frontend ao falhar o `createAnswer`;
  - respostas HTTP existentes do backend;
  - testes automatizados cobrindo parser, fluxo de prática e persistência do payload.
- Sinal de regressão esperado:
  - pergunta aparece achatada novamente;
  - `createAnswer` recebe `questionText` diferente do exibido;
  - tela de prática volta a exigir navegação lateral excessiva.

## Technical Considerations

### Key Decisions

- **Decision:** preservar a pergunta já no parser e usar essa string como fonte canônica.
  - **Rationale:** elimina divergência entre o que o usuário cola, o que vê e o que é salvo.
  - **Trade-offs:** muda expectativas dos testes e pode introduzir diferenças visuais em registros novos versus antigos.
  - **Alternatives rejected:** reformatação apenas na UI e normalização antes do save.

- **Decision:** reorganizar a `PracticeSession` em fluxo vertical primário com seção secundária inferior.
  - **Rationale:** entrega o objetivo do PRD com a menor mudança arquitetural possível.
  - **Trade-offs:** reduz o destaque imediato do timer e da prévia.
  - **Alternatives rejected:** manter grid atual com pequenos ajustes ou usar layout híbrido com colunas inferiores.

- **Decision:** manter o contrato de API e o schema atuais.
  - **Rationale:** `questionText` já é `string` ponta a ponta, então a mudança cabe no contrato existente.
  - **Trade-offs:** o histórico antigo pode continuar sem quebras preservadas até que novas respostas sejam criadas.
  - **Alternatives rejected:** introduzir novo campo específico para versão formatada da pergunta.

### Known Risks

- **Risco:** o parser preservar linhas demais e produzir perguntas visualmente irregulares.
  - **Mitigação:** limitar a normalização à limpeza de ruído final e cobrir cenários multiline em testes unitários.

- **Risco:** a nova hierarquia vertical aumentar demais a altura da tela em algumas combinações de conteúdo.
  - **Mitigação:** manter painéis secundários compactos e evitar novas superfícies visuais no MVP.

- **Risco:** resumo e histórico exibirem perguntas multilinha sem tratamento visual ideal.
  - **Mitigação:** manter essa superfície fora do escopo do redesign e validar apenas que o texto continua legível; refino visual futuro fica para fase posterior.

## Architecture Decision Records

- [ADR-001: Priorizar um layout da tela de resposta orientado pela pergunta](adrs/adr-001.md) — Define a direção do produto para privilegiar releitura da pergunta e reduzir a prioridade visual dos painéis secundários.
- [ADR-002: Preservar a formatação da pergunta desde o parse até a persistência](adrs/adr-002.md) — Define uma representação canônica única da pergunta entre entrada, sessão, UI e payload salvo.
- [ADR-003: Reestruturar a PracticeSession em fluxo vertical primário e seção secundária](adrs/adr-003.md) — Limita a implementação a uma recomposição de tela e estilos, sem novas rotas nem novas camadas de estado.
