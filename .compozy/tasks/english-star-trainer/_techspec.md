# TechSpec — English STAR Speed Trainer

## Executive Summary

O MVP será implementado como um monorepo com duas aplicações separadas no mesmo repositório: um frontend em React para a experiência de treino e um backend em NestJS para persistência, orquestração da sessão e exposição da API. A persistência usará SQL Server local em Docker, com uma única tabela para armazenar cada resposta finalizada, agrupável por sessão.

A principal troca técnica desta abordagem é aceitar um modelo de dados e uma arquitetura operacional simples, porém menos flexíveis, para acelerar a entrega do MVP. Em vez de normalizar sessão e resposta em múltiplas entidades ou introduzir abstrações extras, o desenho privilegia baixo custo de implementação, clareza do fluxo principal e evolução posterior quando o histórico exigir mais sofisticação.

## System Architecture

### Component Overview

**Frontend React**
- Responsável pela UI de criação da sessão, parser da lista numerada de perguntas, tela de resposta STAR, timer visual com overtime e tela de histórico.
- Consome a API do backend para criar sessões lógicas, salvar respostas finalizadas e consultar histórico.

**Backend NestJS**
- Responsável por expor endpoints HTTP mínimos para salvar respostas, listar histórico por sessão e listar sessões anteriores.
- Centraliza regras de persistência, agrupamento por sessão e validação do payload vindo do frontend.

**SQL Server local em Docker**
- Responsável por persistir os registros finais de resposta.
- Guarda dados suficientes para reconstruir o resumo de uma sessão e a tela simples de histórico.

**Fluxo de dados**
1. O usuário cola a lista numerada de perguntas no frontend.
2. O frontend subdivide as perguntas, monta a sessão em memória e inicia a prática.
3. Ao confirmar o fim de cada questão, o frontend envia um registro consolidado para o backend.
4. O backend persiste o item na tabela única.
5. O frontend consulta o backend para exibir resumo final e histórico.

## Implementation Design

### Core Interfaces

Contrato de domínio principal para persistência da resposta finalizada:

```go
type AnswerRecord struct {
    ID              string
    SessionID       string
    QuestionOrder   int
    QuestionText    string
    FullAnswer      string
    TargetSeconds   int
    ElapsedSeconds  int
    CreatedAt       time.Time
}
```

Contrato funcional esperado entre frontend e backend:
- O frontend só envia respostas após confirmação explícita de término.
- O backend trata cada envio como um registro imutável da resposta finalizada.
- Erros de validação retornam mensagem clara para campos obrigatórios ausentes ou tempos inválidos.
- Erros de persistência retornam falha explícita para que a UI informe que a resposta não foi salva.

### Data Models

**Tabela única: `answer_records`**
- `id` (uniqueidentifier ou varchar) — identificador do registro
- `session_id` (varchar) — identificador lógico da sessão
- `question_order` (int) — posição da pergunta na sessão
- `question_text` (nvarchar(max)) — texto original da pergunta
- `full_answer` (nvarchar(max)) — resposta consolidada a partir dos campos S, T, A e R
- `target_seconds` (int) — tempo configurado para a sessão
- `elapsed_seconds` (int) — tempo total real até a confirmação de término
- `created_at` (datetime2) — momento do salvamento
- `updated_at` (datetime2) — igual ao `created_at` no MVP, mantido para evolução simples

**Modelo de sessão no frontend**
- `rawQuestionBlock: string`
- `parsedQuestions: string[]`
- `targetSeconds: number`
- `currentIndex: number`
- `currentAnswer: { s: string; t: string; a: string; r: string }`
- `timerState: 'idle' | 'countdown' | 'overtime' | 'completed'`

**Regras do parser de perguntas**
- O usuário cola um bloco único com perguntas enumeradas.
- O parser separa perguntas por marcadores numéricos como `1.`, `2)` ou equivalentes acordados.
- Linhas subsequentes sem novo marcador continuam anexadas à pergunta anterior.
- Se o parser não identificar ao menos uma pergunta válida, a sessão não pode iniciar.

### API Endpoints

**POST `/answers`**
- Descrição: salva uma resposta finalizada.
- Request:
  - `sessionId`
  - `questionOrder`
  - `questionText`
  - `fullAnswer`
  - `targetSeconds`
  - `elapsedSeconds`
- Response:
  - `201 Created` com o registro salvo
  - `400 Bad Request` para payload inválido
  - `500 Internal Server Error` para falha de persistência

**GET `/sessions`**
- Descrição: lista sessões já registradas para a tela de histórico.
- Response:
  - `200 OK` com sessões agrupadas por `sessionId`, data e total de respostas

**GET `/sessions/:sessionId/answers`**
- Descrição: retorna as respostas salvas de uma sessão específica.
- Response:
  - `200 OK` com lista ordenada por `questionOrder`
  - `404 Not Found` se a sessão não existir

## Integration Points

**SQL Server local em Docker**
- Propósito: persistência principal do MVP.
- Autenticação/autorização: credenciais locais configuradas por ambiente de desenvolvimento.
- Tratamento de erro: o backend retorna erro explícito sem retry automático no MVP, para evitar mascarar falhas locais de infraestrutura.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `frontend` | new | Nova aplicação React com fluxo principal completo; risco médio por concentrar parser, timer e UX | Criar estrutura base, telas e estado local |
| `backend` | new | Nova API NestJS para persistência e histórico; risco médio por depender do schema e conexão SQL Server | Criar módulos HTTP, serviço e camada de acesso a dados |
| `database` | new | Novo banco SQL Server local com tabela única; risco baixo | Definir schema inicial e script de bootstrap |
| `docker` | new | Novo ambiente local para subir SQL Server; risco baixo | Adicionar configuração Docker mínima |
| `task artifacts` | modified | Novos ADRs e TechSpec; risco baixo | Manter documentação alinhada ao MVP |

## Testing Approach

### Unit Tests

No MVP, não haverá testes automatizados como requisito de entrega inicial. Ainda assim, o código deve ser organizado para permitir adição posterior de testes unitários nos seguintes pontos:
- parser da lista numerada de perguntas;
- consolidação dos campos S, T, A e R em resposta única;
- regras de transição do timer entre `idle`, `countdown`, `overtime` e `completed`;
- validação do payload de salvamento no backend.

### Integration Tests

Também não haverá suíte automatizada de integração no MVP. A validação inicial deve ocorrer por checklist manual cobrindo:
- criação da sessão a partir de bloco enumerado;
- início do timer e transição visual/sonora para overtime;
- salvamento de resposta apenas após confirmação;
- avanço para a próxima pergunta;
- exibição do resumo final;
- consulta do histórico em sessão posterior.

Dependências de ambiente:
- frontend rodando localmente;
- backend NestJS acessível;
- SQL Server ativo via Docker com schema aplicado.

## Development Sequencing

### Build Order

1. Configurar a base do repositório com `frontend`, `backend` e SQL Server local em Docker — no dependencies.
2. Implementar o schema `answer_records` e a conexão do backend com o banco — depends on step 1.
3. Criar no backend os endpoints de salvar resposta e consultar histórico — depends on step 2.
4. Implementar no frontend a criação de sessão com campo único e parser de perguntas enumeradas — depends on step 1.
5. Implementar a tela de resposta com campos STAR, consolidação automática e timer com overtime — depends on steps 3 and 4.
6. Implementar confirmação de término, envio para API e avanço para próxima pergunta — depends on steps 3 and 5.
7. Implementar resumo final e tela simples de histórico — depends on steps 3 and 6.
8. Executar validação manual ponta a ponta e ajustar falhas do fluxo crítico — depends on steps 2, 3, 6 and 7.

### Technical Dependencies

- Ambiente Docker funcional para subir o SQL Server local.
- Definição de variáveis de ambiente compartilhadas entre backend e banco.
- Convenção simples de geração de `sessionId` no frontend ou backend.
- Política mínima de CORS entre frontend e backend no ambiente local.

## Monitoring and Observability

No MVP, a observabilidade deve ser mínima e pragmática:
- **Métricas**: quantidade de respostas salvas, tempo médio por resposta por sessão, falhas de salvamento.
- **Logs**: criação de sessão lógica, tentativa de salvamento, sucesso de persistência, falha de conexão com banco, erro de validação.
- **Campos estruturados**: `sessionId`, `questionOrder`, `elapsedSeconds`, `targetSeconds`, `route`, `timestamp`.
- **Alertas**: não haverá alertas automatizados no MVP local; falhas devem ser visíveis via logs do backend e mensagens de erro na UI.

## Technical Considerations

### Key Decisions

- **Decisão**: usar React no frontend e NestJS no backend dentro do mesmo repositório.  
  **Rationale**: atende à preferência explícita de stack, com separação clara de responsabilidades.  
  **Trade-offs**: aumenta a coordenação local entre apps em troca de flexibilidade estrutural.  
  **Alternativas rejeitadas**: monólito full-stack único e repositórios separados.

- **Decisão**: persistir o MVP em uma única tabela no SQL Server.  
  **Rationale**: é a forma mais simples de atender ao histórico, resumo final e requisito de banco relacional local.  
  **Trade-offs**: menor normalização e flexibilidade para análises futuras.  
  **Alternativas rejeitadas**: tabelas separadas para sessão/resposta e persistência local sem banco.

- **Decisão**: salvar a resposta somente após confirmação explícita do usuário.  
  **Rationale**: respeita o fluxo aprovado e evita persistir rascunhos incompletos.  
  **Trade-offs**: há risco de perda do texto em caso de fechamento inesperado antes da confirmação.  
  **Alternativas rejeitadas**: autosave contínuo e autosave combinado com ação manual.

- **Decisão**: usar um campo único para ingestão de perguntas enumeradas e subdivisão automática.  
  **Rationale**: reduz atrito na criação da sessão, alinhado ao modo como a professora envia o material.  
  **Trade-offs**: o parser precisa lidar com formatações imperfeitas.  
  **Alternativas rejeitadas**: cadastro linha a linha e suporte simultâneo a múltiplos modos de entrada.

### Known Risks

- **Parser frágil para enumerações inconsistentes**  
  Mitigação: aceitar os formatos numéricos mais comuns e mostrar pré-visualização antes de iniciar a sessão.

- **Perda de conteúdo antes da confirmação de término**  
  Mitigação: manter o estado da resposta em memória local por pergunta até o envio e avisar claramente que o salvamento acontece ao finalizar.

- **Dependência do SQL Server local para fluxo completo**  
  Mitigação: fornecer configuração Docker mínima e mensagens de erro explícitas quando o banco não estiver disponível.

- **Modelo de tabela única limitar evolução futura do histórico**  
  Mitigação: incluir `session_id`, ordem e timestamps desde o início para manter alguma margem de expansão sem complexidade adicional.

## Architecture Decision Records

- [ADR-001: Focar o MVP em um treinador pessoal de velocidade com STAR](adrs/adr-001.md) — Define o foco funcional do MVP em prática individual com lista manual de perguntas.
- [ADR-002: Organizar o MVP como monorepo com React no frontend e NestJS no backend](adrs/adr-002.md) — Define a separação entre interface web e API no mesmo repositório.
- [ADR-003: Persistir respostas do MVP em uma única tabela no SQL Server](adrs/adr-003.md) — Define o modelo de persistência mínimo para salvar respostas e montar histórico.
