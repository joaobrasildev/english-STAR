# PRD — Continuidade da Sessão ao Salvar Respostas

## Overview

Esta iniciativa melhora a confiabilidade do salvamento de respostas no English STAR para que o usuário consiga concluir uma sessão ativa de prática sem encontrar falhas de salvamento relacionadas à sessão. Ela é voltada a pessoas que estão escrevendo respostas durante a prática, especialmente aquelas que passam mais tempo em cada pergunta e ficam mais expostas a erros disruptivos no momento de salvar. O valor é direto: proteger a confiança do usuário, evitar interrupções na prática e fazer o salvamento parecer confiável sem obrigar a pessoa a entender mecânicas internas de sessão.

## Goals

- Reduzir falhas de salvamento com `sessionId is required.` para perto de zero em sessões ativas de prática.
- Aumentar a confiança de que a resposta será salva com sucesso quando o usuário concluir uma pergunta.
- Proteger sessões de escrita mais longas para usuários que levam mais tempo compondo uma resposta.
- Preservar o fluxo atual de prática para que a confiabilidade melhore sem adicionar fricção extra.
- Entregar um MVP enxuto que resolva a falha atual antes de expandir para cenários mais amplos de recuperação.

## User Stories

- Como usuário em uma sessão ativa de prática, quero que minha resposta seja salva com sucesso ao concluir uma pergunta para que eu possa continuar focado na prática em vez de me preocupar com o estado da sessão.
- Como usuário que escreve uma resposta STAR mais longa, quero que o app permaneça confiável durante toda a sessão para que eu não perca confiança depois de investir mais tempo em uma única pergunta.
- Como usuário que encontra uma falha rara de salvamento, quero ver uma mensagem clara e uma ação imediata para tentar novamente, para que eu consiga me recuperar rápido sem precisar adivinhar o que aconteceu.
- Como usuário já acostumado ao fluxo atual de prática, quero que a confiabilidade melhore sem precisar aprender um novo processo.

## Core Features

### 1. Continuidade invisível da sessão durante a prática ativa

O produto deve manter a sessão ativa válida e utilizável durante todo o fluxo de salvamento da resposta, para que o usuário não precise pensar em identificadores de sessão nem em saúde da sessão. Esta é a principal capacidade e a promessa central do MVP.

### 2. Salvamento confiável ao concluir cada pergunta

Concluir uma pergunta deve resultar, de forma consistente, em um salvamento bem-sucedido dentro da sessão ativa. O produto deve priorizar uma transição confiável entre finalizar e salvar, porque é nesse momento que a confiança hoje se rompe.

### 3. Mensagem clara de recuperação para falhas raras

Se um salvamento ainda falhar, o usuário deve ver uma explicação clara e uma próxima ação imediata para tentar novamente. A experiência deve reduzir confusão e manter o usuário orientado sem expor detalhes internos desnecessários.

### 4. Preservação do fluxo familiar de prática

A melhoria precisa se encaixar no percurso atual de setup, prática, resumo e histórico sem introduzir um fluxo mais complexo. A confiabilidade deve parecer um ganho de estabilidade, não um novo modo de uso.

## User Experience

O usuário inicia uma sessão de prática normalmente e entra no fluxo de escrita da resposta sem configuração adicional nem decisões extras. Durante a escrita, a experiência deve parecer estável e sem interrupções, principalmente para quem leva mais tempo para concluir uma pergunta. Quando o usuário finaliza e salva uma resposta, o resultado deve parecer imediato e confiável, e não frágil.

No caminho normal, o usuário nunca precisa pensar em continuidade de sessão. No caminho raro de falha, o produto deve responder com uma mensagem clara e uma ação óbvia de nova tentativa para que a pessoa continue com confiança. A experiência como um todo deve reforçar uma prática calma e focada, e não obrigar o usuário a resolver um problema técnico.

Prioridades de UX:

- manter o salvamento confiável e com pouca fricção;
- proteger sessões de prática com respostas mais longas contra quebras de confiabilidade;
- minimizar a exposição do usuário a conceitos de sessão;
- tornar a recuperação compreensível quando ocorrer uma falha rara;
- preservar a familiaridade do fluxo atual.

## High-Level Technical Constraints

- A experiência da aplicação deve continuar em inglês.
- O MVP deve se encaixar no fluxo atual de prática, sem introduzir uma nova jornada principal.
- O produto deve atender usuários que passam mais tempo em uma única resposta sem aumentar fricção visível.
- Qualquer tratamento de falha deve indicar um próximo passo claro sem trazer mecânicas internas de sessão para o centro da experiência.

## Non-Goals (Out of Scope)

- Restaurar a sessão ativa após recarregar a página nesta fase.
- Restaurar texto já digitado depois de uma interrupção.
- Expandir promessas de continuidade entre dispositivos ou depois de longos intervalos fora do app.
- Redesenhar a experiência geral de prática, resumo ou histórico além do necessário para esta melhoria de confiabilidade.
- Introduzir um sistema mais amplo de recuperação de progresso como parte do MVP.

## Phased Rollout Plan

### MVP (Phase 1)

- Proteger a sessão ativa para que o salvamento funcione com confiabilidade durante a prática em andamento.
- Eliminar a falha atual por ausência de sessão como um resultado comum visível ao usuário.
- Oferecer uma experiência clara de falha com foco em nova tentativa quando um erro raro ainda acontecer.

**Critério para seguir para a Phase 2:** falhas de salvamento em sessão ativa causadas por ausência de identidade da sessão tornam-se raras o suficiente para deixar de ser um problema recorrente de suporte ou de confiança.

### Phase 2

- Melhorar mensagens de continuidade e sensação de segurança no salvamento se evidências de produto mostrarem que o usuário ainda sente incerteza.
- Refinar o tratamento de casos de interrupção adjacentes ao fluxo da sessão ativa.

**Critério para seguir para a Phase 3:** usuários relatam mais confiança no salvamento das respostas e reclamações relacionadas a interrupções continuam caindo.

### Phase 3

- Explorar capacidades mais amplas de proteção de progresso, como recuperação após interrupção e promessas mais duráveis de continuidade, se os dados de uso justificarem esse investimento.

**Critério de longo prazo:** usuários confiam que o produto protege progresso relevante em uma faixa maior de interrupções sem sacrificar simplicidade.

## Success Metrics

- Ocorrência quase nula de `sessionId is required.` durante o salvamento ativo de respostas.
- Menor taxa de tentativas de salvamento com falha por sessão ativa de prática.
- Menor abandono depois de uma tentativa de salvar.
- Maior confiança qualitativa de que as respostas serão salvas com confiabilidade.
- Menos reclamações recorrentes sobre interrupções relacionadas à sessão no fluxo de resposta.

## Risks and Mitigations

- **Risco:** usuários podem assumir que o produto agora protege todo o progresso em qualquer cenário de interrupção.  
  **Mitigação:** manter a promessa do MVP explícita e limitada à sessão ativa.
- **Risco:** uma mensagem de falha mais clara ainda pode parecer alarmante se soar técnica demais.  
  **Mitigação:** usar linguagem simples, orientada à ação e centrada no que o usuário pode fazer em seguida.
- **Risco:** resolver a falha imediata de salvamento pode revelar demanda por recuperação mais ampla mais cedo do que o esperado.  
  **Mitigação:** tratar recuperação mais ampla de progresso como decisão de fase posterior, guiada por evidência após o lançamento.
- **Risco:** a confiabilidade melhora, mas o usuário não percebe a mudança porque o sucesso é invisível.  
  **Mitigação:** medir a redução das falhas e monitorar feedback ligado à confiança após o lançamento.

## Architecture Decision Records

- [ADR-001: Priorizar continuidade invisível da sessão ao salvar respostas](adrs/adr-001.md) — Foca o MVP em fazer o salvamento funcionar sem expor mecânicas de sessão.
- [ADR-002: Limitar o MVP à proteção apenas da sessão ativa](adrs/adr-002.md) — Mantém a primeira entrega enxuta e exclui recuperação após reload e restauração de rascunho.

## Open Questions

- O produto deve mostrar um sinal leve de tranquilização após um salvamento bem-sucedido, ou essa melhoria de confiabilidade deve permanecer totalmente invisível no fluxo normal?
- Qual tom de mensagem combina melhor com uma solicitação rara de nova tentativa: tranquilização calma, instrução direta ou ambos?
- A partir de qual nível residual de falhas uma recuperação mais ampla de interrupções deve virar prioridade de roadmap?
