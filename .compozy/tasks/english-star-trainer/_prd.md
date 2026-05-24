# PRD — English STAR Speed Trainer

## Overview

O produto e uma aplicacao pessoal de treino para ajudar o usuario a responder perguntas comportamentais em ingles com mais rapidez usando o metodo STAR. Ele foi pensado para uso individual, com sessoes montadas manualmente a partir das perguntas enviadas pela professora antes de cada treino. O valor principal do produto e criar um ciclo objetivo de pratica com pressao de tempo, continuidade da resposta mesmo em overtime e historico claro de desempenho por pergunta.

## Goals

- Reduzir o tempo medio de resposta do usuario ao longo de varias sessoes.
- Tornar a pratica de respostas STAR mais consistente e repetivel.
- Permitir que o usuario monte rapidamente uma sessao com perguntas recebidas da professora.
- Registrar cada resposta com seu tempo total para revisao posterior.
- Entregar um MVP enxuto, orientado a treino individual e repeticao deliberada.

## User Stories

- Como usuario individual em preparacao para entrevistas, quero cadastrar uma lista de perguntas antes da sessao para praticar exatamente o material recebido da professora.
- Como usuario individual, quero responder uma pergunta por vez com apoio da estrutura STAR para organizar meu raciocinio em ingles.
- Como usuario individual, quero definir um tempo-alvo regressivo para cada resposta para treinar velocidade.
- Como usuario individual, quero ser avisado quando o tempo-alvo acabar sem ser interrompido, para saber quanto tempo excedi antes de finalizar.
- Como usuario individual, quero finalizar uma resposta e seguir para a proxima pergunta com poucos cliques, para manter o ritmo do treino.
- Como usuario individual, quero revisar no fim da sessao quanto tempo levei em cada resposta, para acompanhar minha evolucao.

## Core Features

### 1. Montagem manual da sessao

O usuario deve poder cadastrar a lista de perguntas que vai responder antes de iniciar o treino. Essa lista representa o conjunto de perguntas enviadas pela professora para aquela sessao.

### 2. Fluxo linear de pratica

A experiencia deve mostrar uma pergunta por vez, em ordem, ate o fim da lista. Ao concluir uma pergunta, a proxima deve ser exibida sem exigir reconfiguracao da sessao.

### 3. Resposta guiada por STAR

Cada resposta deve ser escrita em quatro campos separados: S, T, A e R. A tela tambem deve exibir um campo maior consolidado que agrupa automaticamente o conteudo dos quatro campos, tratando cada um deles como um paragrafo da resposta completa.

### 4. Timer configuravel com overtime

Antes da sessao, o usuario deve definir o tempo regressivo de resposta. Ao iniciar uma pergunta, o timer deve contar regressivamente ate zero. Quando o tempo-alvo acabar, o produto deve alertar o usuario e continuar contando o tempo excedido para registrar a duracao total real da resposta.

### 5. Finalizacao controlada da resposta

A pergunta deve ter um botao para iniciar a resposta e uma acao de finalizacao com confirmacao, evitando encerramentos acidentais. Depois de confirmar o fim da resposta, o usuario deve ter uma acao clara para seguir para a proxima pergunta.

### 6. Resumo e historico da sessao

Ao final, o usuario deve ver uma lista com o tempo gasto em cada resposta. O produto tambem deve preservar os registros de pergunta, resposta completa e tempo total para consulta futura.

## User Experience

O fluxo principal comeca com a criacao da sessao: o usuario insere a lista de perguntas e define o tempo-alvo da pratica. Em seguida, ele entra em um modo de foco com uma pergunta por vez, inicia o cronometro manualmente e responde usando os campos STAR. Enquanto escreve, acompanha tanto a estrutura da resposta quanto o texto consolidado. Quando o tempo previsto acaba, recebe um alerta claro, mas continua respondendo ate concluir. Ao confirmar que terminou, avanca para a proxima pergunta. No encerramento da sessao, revisa uma lista simples com os tempos gastos por pergunta.

Principios de UX:

- foco em baixa friccao e continuidade entre perguntas;
- alerta de overtime claro, mas nao punitivo;
- estrutura STAR sempre visivel para orientar a construcao da resposta;
- resumo final simples, legivel e orientado a progresso.

## High-Level Technical Constraints

- O produto deve preservar de forma persistente os seguintes dados por resposta: pergunta, resposta completa consolidada e tempo total gasto.
- O produto deve manter a experiencia da aplicacao em ingles.
- O produto deve suportar sessoes compostas por listas de perguntas cadastradas manualmente antes do inicio.
- O produto deve garantir que o tempo registrado represente a duracao real da resposta, inclusive quando houver overtime.

## Non-Goals (Out of Scope)

- Feedback automatico sobre qualidade do ingles, gramatica ou pronuncia.
- Avaliacao automatica da qualidade da resposta STAR.
- Simulacao completa de entrevista com entrevistador virtual.
- Geracao automatica de perguntas.
- Colaboracao com outros usuarios ou compartilhamento de sessoes.
- Painel analitico avancado alem do historico de tempos por resposta.

## Phased Rollout Plan

### MVP (Phase 1)

- Cadastro manual de perguntas por sessao.
- Definicao do tempo-alvo antes de iniciar.
- Fluxo linear com uma pergunta por vez.
- Campos S, T, A e R com resposta consolidada automatica.
- Timer regressivo com alerta em zero e contagem de overtime.
- Finalizacao confirmada e avanco para a proxima pergunta.
- Resumo final com tempo por resposta.
- Persistencia do historico de pergunta, resposta completa e tempo total.

**Criterio para seguir para a Phase 2:** o usuario consegue completar sessoes completas, revisar os tempos com confianca e perceber evolucao no tempo medio de resposta.

### Phase 2

- Biblioteca reutilizavel de listas de perguntas por origem ou tema.
- Comparacao simples entre sessoes para mostrar reducao de tempo.
- Filtros basicos de historico por sessao ou pergunta.

**Criterio para seguir para a Phase 3:** o usuario demonstra necessidade recorrente de revisar historico de forma mais organizada e comparar desempenho no tempo.

### Phase 3

- Feedback orientado a qualidade de resposta.
- Recursos de estudo complementar e preparo mais amplo.
- Experiencias de treino mais proximas de uma entrevista real.

**Criterio de longo prazo:** o produto apoiar nao apenas velocidade, mas tambem consistencia e confianca na resposta em ingles.

## Success Metrics

- Reducao do tempo medio de resposta ao longo das sessoes.
- Percentual de respostas concluidas dentro do tempo-alvo.
- Numero de sessoes concluidas integralmente.
- Numero medio de perguntas respondidas por sessao.
- Taxa de reutilizacao do produto em novas sessoes de treino.

## Risks and Mitigations

- **Risco de escopo inflado:** incluir feedback inteligente ou simulacao completa cedo demais pode atrasar o MVP.  
  **Mitigacao:** manter foco estrito em velocidade, estrutura STAR e historico de tempo.
- **Risco de baixo valor percebido:** se o resumo final nao mostrar progresso com clareza, o produto pode parecer simples demais.  
  **Mitigacao:** garantir que a lista final de tempos por resposta seja facil de ler e util para comparacao entre sessoes.
- **Risco de friccao inicial:** se cadastrar as perguntas antes da sessao for cansativo, o uso recorrente pode cair.  
  **Mitigacao:** manter o cadastro da lista rapido e direto, sem etapas extras.
- **Risco de ansiedade com o timer:** um alerta agressivo pode atrapalhar o treino.  
  **Mitigacao:** usar um aviso claro e de apoio, sem interromper a resposta.

## Architecture Decision Records

- [ADR-001: Focar o MVP em um treinador pessoal de velocidade com STAR](adrs/adr-001.md) — Define que a primeira versao deve priorizar treino individual com lista manual de perguntas, fluxo linear e foco em reduzir tempo de resposta.

## Open Questions

- Qual forma de alerta de overtime gera mais valor no MVP: visual, sonoro ou ambos.
- Como o produto deve apresentar a comparacao entre tempo-alvo e tempo real no resumo final.
- Se o historico futuro deve ser consultado apenas por sessao ou tambem por pergunta individual.
