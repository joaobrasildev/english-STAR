# TechSpec: Estabilidade do layout dos controles na tela inicial

## Executive Summary

Esta entrega implementa a melhoria inteiramente no frontend existente, preservando `useSessionSetup` como origem única do estado e restringindo a mudança estrutural a `SessionSetup.tsx` e `App.css`. A abordagem escolhida mantém o layout atual em duas colunas no desktop e em uma coluna no mobile, mas transforma a área de prévia em um painel com altura máxima e rolagem própria para impedir que o crescimento da lista de perguntas altere a estabilidade visual dos controles.

O principal trade-off é aceitar uma solução centrada em CSS e markup, em vez de introduzir novos componentes, comportamento sticky ou lógica adicional de estado. Isso reduz risco e custo de manutenção, mas exige seleção cuidadosa de classes e cobertura de testes de estrutura para garantir que a solução permaneça isolada da shell compartilhada e continue legível com perguntas longas.

## System Architecture

### Component Overview

- **`useSessionSetup`**  
  Continua responsável por estado, parsing derivado, validação e criação do `PreparedSession`. Não sofre mudança funcional nesta entrega.

- **`SessionSetup`**  
  Continua sendo a composição principal da tela. Receberá a responsabilidade de separar com mais clareza a área de configuração da área de prévia por meio de wrappers semânticos adicionais, se necessários, mas sem alterar seu contrato de props.

- **`QuestionPreview`**  
  Permanece como componente apresentacional da lista processada. A especificação assume reaproveitamento do componente sem mudança de lógica, salvo ajuste mínimo de marcação se o layout exigir um contêiner específico para o conteúdo rolável.

- **`App.css`**  
  Continua como a superfície principal de layout. A mudança ficará concentrada em classes específicas do setup, com novos seletores voltados à limitação da altura do preview, organização vertical do painel esquerdo e preservação do comportamento responsivo já existente.

### Data Flow

1. O usuário digita perguntas em `QuestionParser`.
2. `useSessionSetup` recalcula `parsedQuestions` via `parseQuestions`.
3. `SessionSetup` repassa `parsedQuestions` para `QuestionPreview`.
4. A nova contenção visual atua somente na renderização do preview; não altera o fluxo de dados nem a criação da sessão.

### External System Interactions

- Nenhuma.
- Não há integração externa, chamada de API, persistência ou mudança de contrato nesta entrega.

## Implementation Design

### Core Interfaces

A interface técnica central permanece a do componente de página e de suas props já existentes. A solução atua sobre composição e layout, não sobre novas abstrações.

```ts
type SessionSetupProps = {
  rawQuestionBlock: string
  targetSecondsInput: string
  parsedQuestions: string[]
  errorMessage: string
  onQuestionBlockChange: (value: string) => void
  onTargetSecondsChange: (value: string) => void
  onOpenHistory: () => void
  onStartSession: () => void
}
```

```ts
type QuestionPreviewProps = {
  questions: string[]
}
```

#### Error Handling Conventions

- A validação existente de perguntas inválidas e de `targetSeconds` inválido permanece inalterada.
- Nenhum novo estado de erro será introduzido para esta entrega.
- Se a lista estiver vazia, o empty state atual do preview deve continuar funcionando dentro da nova área delimitada.

### Data Models

Nenhum novo modelo de dados será criado.

Modelos existentes envolvidos:
- `PreparedSession` continua sendo o resultado da ação de iniciar sessão.
- `parsedQuestions: string[]` continua sendo a entrada de renderização do preview.
- Não haverá mudança em tipos de API, entidades persistidas ou estruturas de armazenamento.

### API Endpoints

Nenhum endpoint é afetado.

| Método | Caminho | Impacto |
|---|---|---|
| — | — | Não aplicável; esta entrega é puramente de layout frontend |

## Integration Points

Não aplicável. Esta mudança não integra com serviços externos nem com novos limites de sistema.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `frontend/src/pages/SessionSetup.tsx` | modified | Ajuste de composição para separar com mais clareza controles e prévia; risco baixo | Reorganizar wrappers sem mudar props nem comportamento |
| `frontend/src/App.css` | modified | Introdução de classes específicas do setup para limitar a altura do preview e estabilizar a área de controles; risco médio | Adicionar estilos isolados e revisar breakpoint existente |
| `frontend/src/components/QuestionPreview.tsx` | unchanged or modified-minor | Reaproveitamento do componente atual; risco baixo | Manter contrato e só ajustar markup se estritamente necessário |
| `frontend/src/hooks/useSessionSetup.ts` | unchanged | Estado e validação permanecem iguais; risco baixo | Nenhuma ação funcional |
| `frontend/src/pages/SessionSetup.test.tsx` | modified | Cobertura precisa refletir a nova estrutura e as classes esperadas do layout | Atualizar testes para validar contenção visual e ausência de regressão funcional |
| `frontend/src/App.review.test.tsx` | unchanged | Fluxo global não deve mudar; risco baixo | Sem mudança, salvo necessidade descoberta durante implementação |

## Testing Approach

### Unit Tests

- Não há nova unidade lógica independente.
- O foco de validação automatizada ficará na renderização da tela de setup.
- Devem permanecer cobertos:
  - ordem da prévia
  - preservação de multiline
  - criação da sessão válida
  - bloqueio de início quando a entrada é inválida
- Devem ser adicionadas asserções de estrutura para garantir:
  - existência da área delimitada de preview
  - presença das classes de contenção/rolagem esperadas
  - permanência das ações dentro da área de controles

### Integration Tests

- `SessionSetup.test.tsx` continuará como suíte principal desta entrega.
- Não há necessidade planejada de expandir para backend, e2e ou review flow, porque o contrato de dados e a navegação não mudam.
- Se a implementação exigir pequeno ajuste em `QuestionPreview`, os testes devem continuar acessando a lista por papéis sem quebrar a semântica atual.

### Environment and Mock Requirements

- Manter React Testing Library e `userEvent`.
- Não são necessários novos mocks.
- As validações de layout devem se apoiar em classes, landmarks e estrutura renderizada, não em medições reais de viewport.

## Development Sequencing

### Build Order

1. **Ajustar a composição de `SessionSetup.tsx`** - sem dependências.
2. **Adicionar as classes e restrições de layout em `App.css`** - depende do passo 1 para refletir a estrutura final.
3. **Ajustar `QuestionPreview.tsx` apenas se a marcação mínima for necessária para o contêiner rolável** - depende dos passos 1 e 2.
4. **Atualizar `SessionSetup.test.tsx` para validar a nova estrutura sem perder a cobertura funcional existente** - depende dos passos 1, 2 e, se houver, 3.
5. **Executar validação completa do frontend e da suíte do repositório** - depende dos passos 1 a 4.

### Technical Dependencies

- Nenhuma dependência externa nova.
- Nenhuma dependência de infraestrutura.
- Apenas dependência do CSS existente e das convenções atuais de teste do frontend.

## Monitoring and Observability

Não há necessidade de observabilidade adicional para esta entrega.

Itens que permanecem relevantes apenas em nível de produto:
- feedback qualitativo sobre estabilidade percebida da tela
- ausência de regressão no início de sessão

Não serão adicionados logs, métricas ou alertas específicos porque a mudança não altera fluxo assíncrono, integração externa nem persistência.

## Technical Considerations

### Key Decisions

- **Decision:** manter `useSessionSetup` inalterado.  
  **Rationale:** o problema é visual e estrutural, não de estado.  
  **Trade-offs:** evita regressão funcional, mas concentra a solução em CSS e markup.  
  **Alternatives rejected:** mover lógica para novo hook ou introduzir estado de UI específico para o preview.

- **Decision:** limitar a altura do preview com rolagem própria.  
  **Rationale:** resolve diretamente o crescimento do painel sem esconder conteúdo nem alterar o fluxo atual.  
  **Trade-offs:** a experiência passa a depender de um limite de altura bem escolhido.  
  **Alternatives rejected:** preview livre com ações sticky e preview colapsado por padrão.

- **Decision:** manter a solução isolada em `SessionSetup.tsx` e `App.css`.  
  **Rationale:** reduz risco em telas que compartilham shell e evita abstração prematura.  
  **Trade-offs:** a clareza do layout depende de disciplina nos seletores CSS.  
  **Alternatives rejected:** criar novo componente de layout dedicado ao setup.

### Known Risks

- **Risco:** novas classes podem tocar estilos compartilhados de forma acidental.  
  **Mitigação:** usar seletores específicos do setup e evitar editar classes reutilizadas por summary/history.

- **Risco:** a altura máxima do preview pode ficar pequena demais para perguntas multiline longas.  
  **Mitigação:** escolher um limite conservador e manter multiline preservado dentro da área rolável.

- **Risco:** os testes validarem apenas presença de classe e não o efeito visual final.  
  **Mitigação:** combinar cobertura estrutural com a suíte existente de fluxo e manter o escopo de layout o mais simples possível.

## Architecture Decision Records

- [ADR-001: Manter os controles da configuração estáveis quando a prévia de perguntas crescer](adrs/adr-001.md) — Define a direção de produto de manter controles estáveis com prévia completa em área delimitada.
- [ADR-002: Limitar a altura da prévia no setup com rolagem própria e mudanças isoladas ao layout](adrs/adr-002.md) — Define a abordagem técnica mínima: ajustar `SessionSetup.tsx` e `App.css`, mantendo o estado e o contrato atual.
