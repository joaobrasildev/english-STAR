# PRD — Melhorias na Tela de Resposta

## Overview

Esta melhoria aprimora a tela de resposta do English STAR Speed Trainer para que o usuário consiga reler a pergunta com mais facilidade enquanto escreve sua resposta. O layout atual cria distância visual demais entre o prompt e a área principal de escrita, além de perder quebras de linha relevantes em perguntas com múltiplas linhas. A melhoria é voltada ao usuário individual que pratica principalmente em desktop ou notebook e precisa de uma experiência mais legível, fluida e confortável durante o treino.

## Goals

- Tornar a pergunta mais fácil de consultar ao longo de toda a resposta.
- Preservar a legibilidade original de perguntas com múltiplas linhas.
- Reduzir a necessidade de rolagem e de deslocamento visual durante a escrita.
- Melhorar conforto e foco durante a prática cronometrada sem alterar o fluxo geral da sessão.
- Entregar uma melhoria de usabilidade objetiva, coerente com o MVP atual.

## User Stories

- Como usuário praticando respostas de entrevista, quero conseguir reler a pergunta facilmente enquanto escrevo, para não perder contexto.
- Como usuário que cola perguntas com múltiplas linhas enviadas pela professora, quero que as quebras de linha continuem visíveis na tela de resposta, para que o texto preserve sua estrutura original.
- Como usuário que pratica em desktop ou notebook, quero que os campos STAR fiquem logo abaixo da pergunta, para que meu fluxo de escrita seja mais natural.
- Como usuário treinando com tempo, quero que o timer e a resposta final combinada continuem disponíveis sem competir com a área principal de escrita, para que eu consiga manter foco na resposta.
- Como usuário já acostumado ao fluxo atual da aplicação, quero que essa melhoria torne a tela mais confortável sem me obrigar a reaprender a prática inteira.

## Core Features

### 1. Layout orientado pela pergunta

A tela de resposta deve priorizar a pergunta como principal ponto de referência visual. O prompt permanece no topo da área principal de escrita, e os campos STAR aparecem diretamente abaixo dele, ocupando a mesma faixa horizontal principal.

### 2. Preservação da formatação da pergunta

A tela de resposta deve preservar as quebras de linha inseridas pelo usuário quando elas forem importantes para leitura. Linhas vazias desnecessárias ao final podem ser removidas, mas a estrutura relevante de parágrafos e separações deve permanecer visível.

### 3. Reposicionamento dos painéis secundários

O timer e a resposta final combinada continuam fazendo parte da experiência, mas passam a ocupar uma área de menor prioridade abaixo do fluxo principal de leitura e escrita. Eles devem apoiar a prática sem disputar atenção com a pergunta e com os campos STAR.

### 4. Leitura otimizada para desktop

A primeira versão dessa melhoria deve priorizar a experiência em desktop e notebook, onde a prática acontece com mais frequência. A tela deve parecer mais estável, menos fragmentada e mais fácil de escanear durante perguntas longas ou estruturadas.

## User Experience

O usuário inicia a sessão normalmente e entra na tela de resposta sem precisar aprender um novo fluxo. A pergunta aparece em um bloco claramente legível, mantendo a estrutura visual originalmente inserida, inclusive com quebras de linha relevantes. Logo abaixo dessa pergunta, o usuário encontra os campos STAR na principal área de trabalho, mantendo prompt e escrita visualmente conectados.

Abaixo dessa área principal, o usuário ainda encontra o timer e a resposta final combinada. Esses elementos continuam úteis, mas deixam de competir com a tarefa principal de ler a pergunta e responder. A experiência como um todo deve parecer mais calma, mais focada e mais adequada a uma prática deliberada.

Prioridades de UX:

- manter a pergunta fácil de consultar a qualquer momento;
- preservar a legibilidade de prompts colados pelo usuário;
- reduzir fragmentação visual;
- manter a mudança familiar para quem já usa o fluxo atual;
- reforçar o foco em leitura e escrita ativa.

## High-Level Technical Constraints

- A experiência da aplicação deve continuar em inglês.
- A melhoria deve se encaixar no fluxo de sessão atual, sem redefinir a navegação principal.
- O produto deve continuar aceitando perguntas manuais com múltiplas linhas.
- A tela de resposta deve continuar oferecendo contexto de tempo e visualização da resposta combinada, ainda que com menor protagonismo visual.

## Non-Goals (Out of Scope)

- Redesenhar o fluxo de preparação da sessão.
- Alterar o comportamento do timer ou criar novos controles de tempo.
- Redesenhar a tela de resumo ou a tela de histórico além do necessário para manter consistência básica.
- Trocar a estrutura STAR por outro modelo de resposta.
- Fazer uma reformulação mobile-first como parte desta entrega.
- Rever a navegação completa entre setup, resposta, resumo e histórico.

## Phased Rollout Plan

### MVP (Phase 1)

- Adotar um layout centrado na pergunta.
- Preservar quebras de linha relevantes na exibição da pergunta.
- Posicionar os campos STAR diretamente abaixo da pergunta.
- Mover o timer e a resposta combinada para uma área secundária abaixo do fluxo principal.

**Critério para seguir para a Phase 2:** o usuário consegue concluir sessões com menos necessidade de rolagem ou de deslocamento visual para reencontrar o prompt, e percebe a pergunta como significativamente mais fácil de reler enquanto responde.

### Phase 2

- Refinar o mesmo layout para telas menores.
- Melhorar a apresentação de perguntas muito longas ou com formatação irregular.
- Ajustar a hierarquia visual entre prompt, campos STAR, timer e resposta combinada com base no uso real.

**Critério para seguir para a Phase 3:** o layout melhorado se mantém consistente em mais tipos de tela e de pergunta sem reduzir clareza nem conforto de uso.

### Phase 3

- Adicionar opções de personalização da hierarquia visual conforme preferência do usuário.
- Melhorar ainda mais a leitura e releitura de prompts extensos em práticas recorrentes.

**Critério de longo prazo:** a tela de resposta se adapta melhor a diferentes estilos de pergunta e preferências de leitura sem perder foco na prática deliberada.

## Success Metrics

- Redução percebida na necessidade de rolar a tela ou perder a referência da pergunta durante a escrita.
- Melhora na legibilidade percebida de perguntas com múltiplas linhas.
- Menor esforço para recuperar o contexto da pergunta no meio da resposta.
- Continuidade das sessões sem aumento de fricção no fluxo atual.
- Feedback qualitativo positivo sobre conforto, clareza e foco durante a prática.

## Risks and Mitigations

- **Risco: a melhoria aumenta a legibilidade, mas deixa a tela visualmente pesada demais na vertical.**  
  **Mitigação:** manter foco no fluxo principal de leitura e escrita, evitando adicionar novas superfícies desnecessárias.
- **Risco: preservar formatação torna algumas perguntas mal coladas visualmente confusas.**  
  **Mitigação:** manter quebras de linha relevantes, mas permitir limpeza de linhas vazias desnecessárias no final.
- **Risco: reposicionar o timer e a resposta combinada reduz sua utilidade percebida em alguns cenários.**  
  **Mitigação:** mantê-los acessíveis e legíveis, apenas com menor protagonismo que o fluxo principal.
- **Risco: a melhoria funciona bem em desktop, mas exige refinamento posterior em telas menores.**  
  **Mitigação:** tratar esta primeira entrega explicitamente como desktop-first e deixar adaptações mais amplas para fases seguintes.

## Architecture Decision Records

- [ADR-001: Priorizar um layout da tela de resposta orientado pela pergunta](adrs/adr-001.md) — Reposiciona a experiência para facilitar releitura do prompt, preservar quebras de linha relevantes e reduzir a prioridade visual do timer e da resposta combinada.

## Open Questions

- Espaçamentos internos muito grandes dentro de uma pergunta devem ser preservados exatamente como foram inseridos, ou normalizados além da limpeza de linhas vazias no final?
- Em uma fase futura, telas menores devem seguir a mesma hierarquia visual ou ter um modo mais compacto de leitura?
- Em versões futuras, a resposta combinada deve permanecer sempre visível ou virar um elemento opcional após a melhoria principal do fluxo?
