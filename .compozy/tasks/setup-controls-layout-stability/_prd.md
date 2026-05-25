# PRD: Estabilidade do layout dos controles na tela inicial

## Visão geral

Esta melhoria ajusta a tela inicial de configuração da sessão para que usuários consigam revisar listas longas de perguntas sem fazer o campo de tempo e as ações principais parecerem instáveis, esticadas ou difíceis de usar.

Ela atende principalmente alunos e professores que preparam sessões STAR com conjuntos médios ou longos de perguntas. O valor está em manter a configuração previsível, reduzir atrito visual antes do início da prática e preservar a confiança de que é possível revisar todas as perguntas e iniciar a sessão sem distrações causadas pelo layout.

## Objetivos

- Manter o campo de tempo alvo e as ações principais visualmente estáveis quando a prévia das perguntas crescer.
- Preservar o acesso à lista completa de perguntas processadas antes do início da sessão.
- Tornar a tela inicial mais fácil de escanear ao separar claramente controles de configuração e conteúdo de prévia.
- Reduzir atrito para usuários que preparam sessões com muitas perguntas ou perguntas longas.
- Definir um MVP mensurável por estabilidade visual e facilidade de uso durante a preparação da sessão.

## Histórias de usuário

### Persona principal: aluno preparando uma sessão de prática

- Como aluno, quero colar uma lista longa de perguntas e ainda encontrar uma área de configuração estável para iniciar a prática com confiança.
- Como aluno, quero revisar todas as perguntas processadas antes de começar para ter certeza de que o conteúdo da sessão está correto.
- Como aluno, quero que a ação de iniciar continue fácil de localizar e usar para que listas longas não atrapalhem meu fluxo.

### Persona secundária: professor ou orientador preparando material

- Como professor, quero validar uma lista grande de perguntas sem que a tela fique mais difícil de controlar para preparar sessões com eficiência.
- Como professor, quero uma separação clara entre controles de configuração e área de revisão para que a tela permaneça compreensível em uso recorrente.

### Casos de borda

- Como usuário lidando com listas especialmente longas, quero que a prévia continue utilizável sem alterar a estabilidade percebida dos controles.
- Como usuário revisando perguntas com múltiplas linhas, quero que a prévia permaneça legível dentro da área delimitada.

## Funcionalidades centrais

### Controles de configuração estáveis

A experiência de configuração deve manter o campo de tempo e as ações principais em uma área visualmente estável, que não cresça de forma distrativa nem reduza a usabilidade quando a prévia aumentar.

### Prévia completa das perguntas em área delimitada

A tela inicial deve exibir a lista completa de perguntas processadas antes do início da sessão dentro de uma área claramente delimitada. Conteúdo longo deve continuar revisável sem forçar os controles a crescer junto.

### Separação clara de papéis

A tela deve deixar evidente a distinção entre configuração e revisão. Usuários precisam entender de imediato onde ajustam a sessão e onde conferem o conteúdo processado.

### Revisão completa antes do início

A melhoria deve preservar o valor atual do produto de permitir revisão completa das perguntas antes do início. O MVP não deve substituir a prévia integral por contagem simples ou conteúdo escondido por padrão.

## Experiência do usuário

O usuário acessa a tela inicial, cola ou edita perguntas numeradas, define o tempo alvo e revisa o resultado processado antes de iniciar uma sessão.

A experiência melhorada mantém os controles previsíveis enquanto a área de prévia absorve o conteúdo longo. O usuário deve conseguir escanear rapidamente a área de configuração, validar toda a lista processada e iniciar a sessão sem precisar procurar a ação principal nem se reorientar quando o volume de conteúdo aumentar.

Expectativas de acessibilidade e uso:

- Ações principais continuam fáceis de localizar e ativar.
- Prévias longas continuam legíveis e claramente contidas.
- A separação entre controles e prévia fica visualmente evidente.
- A experiência permanece compreensível para uso recorrente com listas curtas e longas.

## Restrições de alto nível

- A melhoria deve se encaixar no fluxo atual de configuração da sessão, sem criar um novo fluxo em múltiplas etapas.
- O produto deve continuar permitindo revisão completa das perguntas processadas antes do início.
- A experiência aprimorada deve funcionar tanto para listas curtas quanto longas, sem criar modos separados de uso.
- A mudança deve preservar os caminhos atuais para iniciar sessão e abrir histórico.

## Não objetivos

- Redesenhar toda a tela inicial além do problema de estabilidade entre controles e prévia.
- Alterar a forma como perguntas são processadas, ordenadas ou validadas.
- Introduzir fluxos colaborativos de configuração, templates ou rascunhos salvos.
- Reestruturar a tela de prática ou o histórico como parte desta entrega.
- Esconder a prévia completa atrás de expansão sob demanda no MVP.

## Plano de rollout em fases

### MVP (Fase 1)

- Área estável para campo de tempo e ações principais na configuração
- Prévia completa das perguntas em área delimitada de revisão
- Separação visual clara entre controles e conteúdo de prévia

**Critérios de sucesso para avançar à Fase 2**

- Usuários conseguem preparar listas longas sem relatar instabilidade nos controles.
- A ação de iniciar continua fácil de localizar e usar com prévias extensas.
- Todas as perguntas processadas continuam visíveis e revisáveis antes do início.

### Fase 2

- Polimentos adicionais de legibilidade para conjuntos muito grandes ou densos
- Sinais visuais mais fortes de que a área de prévia contém mais conteúdo
- Refinamentos opcionais para facilitar a leitura de listas extensas

**Critérios de sucesso para avançar à Fase 3**

- Usuários que trabalham com listas grandes relatam previsibilidade e boa legibilidade.
- O fluxo de configuração permanece eficiente sem adicionar fricção extra na revisão.

### Fase 3

- Melhorias avançadas de conveniência para usuários frequentes
- Personalização opcional de densidade da prévia ou comportamento de revisão, caso a demanda futura justifique

**Critérios de sucesso de longo prazo**

- A tela inicial permanece eficiente para uma ampla variedade de tamanhos de sessão e perfis de uso.
- O produto consegue suportar futuras melhorias de configuração sem reintroduzir instabilidade visual.

## Métricas de sucesso

- Redução de reclamações sobre controles da configuração esticarem, mudarem ou ficarem mais difíceis de usar com listas longas.
- Conclusão estável do fluxo de configuração para sessões com muitas perguntas.
- Alta confiança percebida de que o usuário consegue revisar todas as perguntas antes de iniciar.
- Nenhuma queda perceptível no início de sessões após a introdução da prévia delimitada.
- Feedback qualitativo positivo sobre clareza e previsibilidade da tela inicial.

## Riscos e mitigações

- **Risco:** usuários podem não perceber de imediato que a área de prévia possui rolagem própria.  
  **Mitigação:** manter a área claramente delimitada e visualmente distinta.

- **Risco:** uma prévia delimitada pode parecer pequena demais para listas densas.  
  **Mitigação:** preservar conteúdo visível suficiente para tornar a revisão prática no MVP.

- **Risco:** a melhoria pode crescer além do problema de estabilidade e virar um redesenho maior da tela inicial.  
  **Mitigação:** manter o MVP focado apenas em estabilidade dos controles e acesso completo à prévia.

- **Risco:** usuários com listas curtas podem perceber mudança visual desnecessária.  
  **Mitigação:** preservar o fluxo atual e manter a melhoria leve para entradas pequenas.

## Architecture Decision Records

- [ADR-001: Manter os controles da configuração estáveis quando a prévia de perguntas crescer](adrs/adr-001.md) — Define uma área estável de controles com prévia completa em espaço delimitado como direção de produto para o MVP.

## Questões em aberto

- Não há questões bloqueantes para o MVP neste momento.
