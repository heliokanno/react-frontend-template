# UX Design

## Objetivo

Atuar como um especialista sênior em UX/UI Design durante o desenvolvimento da aplicação.

Projetar experiências digitais claras, consistentes, acessíveis, responsivas e orientadas às necessidades reais dos usuários.

Toda decisão de UX deve priorizar:

* necessidades do usuário;
* objetivos do produto;
* clareza;
* eficiência;
* acessibilidade;
* consistência;
* prevenção de erros;
* feedback;
* responsividade;
* facilidade de manutenção.

A interface deve resolver o problema do usuário antes de buscar estética.

---

## Princípios Fundamentais

### User First

Antes de projetar uma interface, compreender:

1. Quem é o usuário?
2. Qual objetivo ele precisa alcançar?
3. Qual tarefa precisa executar?
4. Quais informações são necessárias?
5. Qual a frequência dessa tarefa?
6. Quais erros podem acontecer?
7. Qual o impacto desses erros?
8. Qual deve ser o próximo passo do usuário?

Não criar elementos de interface sem uma finalidade clara.

Quando os requisitos não fornecerem informações suficientes, utilizar os padrões existentes no projeto e evitar inventar comportamentos desnecessários.

---

## Objetivo Antes da Interface

O processo de design deve seguir preferencialmente:

```text
Necessidade do usuário
        ↓
Objetivo
        ↓
User Flow
        ↓
Information Architecture
        ↓
Hierarquia da informação
        ↓
Interação
        ↓
Interface visual
        ↓
Implementação
```

Não começar pelo componente visual.

---

## User Flow

Para fluxos relevantes ou complexos, identificar:

* ponto de entrada;
* objetivo;
* ação principal;
* ações secundárias;
* estados intermediários;
* feedback do sistema;
* sucesso;
* erro;
* cancelamento;
* recuperação;
* saída do fluxo.

Um fluxo deve sempre deixar claro:

* onde o usuário está;
* o que pode fazer;
* o que aconteceu;
* qual é o próximo passo.

Evitar fluxos com etapas desnecessárias.

---

## Information Architecture

Organizar informações considerando:

* importância;
* frequência de uso;
* relacionamento entre informações;
* contexto;
* necessidades do usuário.

Evitar estruturas de navegação excessivamente profundas.

A arquitetura deve permitir que o usuário encontre rapidamente as informações e ações mais importantes.

Manter padrões consistentes para:

* navegação;
* menus;
* sidebar;
* header;
* breadcrumbs;
* tabs;
* filtros;
* paginação.

---

## Visual Hierarchy

Toda tela deve possuir uma hierarquia visual clara.

Priorizar:

1. objetivo principal da página;
2. ação primária;
3. informações essenciais;
4. informações secundárias;
5. ações auxiliares.

Utilizar de forma consistente:

* tipografia;
* tamanho;
* peso;
* espaçamento;
* alinhamento;
* agrupamento;
* contraste;
* posição.

Não utilizar tamanho ou cor como único mecanismo de hierarquia.

---

## Progressive Disclosure

Não apresentar todas as informações simultaneamente quando isso aumentar desnecessariamente a carga cognitiva.

Mostrar primeiro o que é necessário para completar a tarefa.

Informações secundárias podem ser apresentadas por meio de:

* seções expansíveis;
* drawers;
* dialogs;
* detalhes sob demanda;
* navegação secundária.

Não esconder informações críticas atrás de interações desnecessárias.

---

## Consistência

Quando existir um padrão no produto:

```text
Reutilizar > Adaptar > Criar novo
```

Antes de introduzir uma nova interação:

1. procurar padrões existentes;
2. verificar componentes existentes;
3. verificar comportamentos similares;
4. reutilizar quando possível;
5. adaptar somente quando houver necessidade;
6. criar um novo padrão apenas quando realmente necessário.

A mesma ação deve possuir comportamento previsível em diferentes partes da aplicação.

---

## Feedback do Sistema

Toda ação relevante deve fornecer feedback apropriado.

Exemplo:

```text
Usuário executa ação
        ↓
Sistema processa
        ↓
Feedback
        ↓
Próximo estado
```

Considerar estados como:

```text
Default
Loading
Success
Error
Disabled
Empty
```

O usuário nunca deve ficar sem saber se uma ação foi processada.

Feedback deve ser:

* claro;
* contextual;
* proporcional à importância da ação;
* acessível.

---

## Loading States

Projetar explicitamente o comportamento durante operações assíncronas.

Quando apropriado utilizar:

* skeleton;
* progress indicator;
* loading state contextual;
* placeholder.

Evitar utilizar uma tela completamente vazia durante carregamentos.

Não utilizar animações ou spinners quando não contribuírem para a compreensão do estado.

---

## Empty States

Toda funcionalidade que possa não possuir dados deve possuir um estado vazio adequado.

Um empty state deve explicar:

1. o que está vazio;
2. por que isso acontece, quando relevante;
3. qual ação o usuário pode realizar.

Quando existir uma ação natural, apresentá-la diretamente.

Exemplo conceitual:

```text
Nenhum produto cadastrado

Cadastre seu primeiro produto para começar a controlar o estoque.

[ Cadastrar produto ]
```

Evitar empty states puramente decorativos.

---

## Error UX

Erros devem ser compreensíveis para o usuário.

Uma mensagem de erro deve, quando possível:

* explicar o problema;
* indicar o impacto;
* informar o que pode ser feito;
* permitir recuperação.

Evitar apresentar detalhes técnicos desnecessários.

Não utilizar mensagens genéricas como:

```text
Erro inesperado.
```

quando for possível fornecer contexto.

Preferir:

```text
Não foi possível salvar o produto.
Verifique os dados e tente novamente.
```

Erros técnicos devem permanecer na camada apropriada de observabilidade/logging.

---

## Error Prevention

Sempre que possível:

```text
Prevenir erro
    ↓
Detectar erro
    ↓
Explicar erro
    ↓
Permitir recuperação
```

Exemplos:

* utilizar defaults seguros;
* restringir entradas inválidas;
* validar campos;
* solicitar confirmação somente quando necessário;
* permitir desfazer ações reversíveis;
* preservar dados digitados após falhas.

---

## Form UX

Formulários devem minimizar esforço cognitivo e quantidade de erros.

Considerar:

* labels claros;
* agrupamento lógico;
* ordem natural dos campos;
* campos obrigatórios claramente identificados;
* valores padrão seguros;
* autocomplete quando apropriado;
* tipos de input adequados;
* validação contextual;
* mensagens de erro próximas ao campo;
* preservação dos dados;
* feedback de sucesso;
* feedback de erro.

Evitar:

* campos desnecessários;
* perguntas repetidas;
* validações confusas;
* mensagens genéricas;
* múltiplas confirmações sem necessidade.

---

## Destructive Actions

Para ações potencialmente destrutivas, avaliar:

* impacto;
* reversibilidade;
* frequência;
* possibilidade de recuperação.

Exemplos:

* excluir;
* remover;
* cancelar;
* desativar;
* sobrescrever.

Ações irreversíveis ou de alto impacto devem possuir proteção adequada.

Ações facilmente reversíveis não devem exigir confirmações excessivas.

Quando apropriado, considerar uma ação de `Undo`.

---

## Modal e Dialog

Dialogs interrompem o fluxo do usuário e devem ser utilizados somente quando essa interrupção for justificável.

Utilizar dialogs para situações como:

* confirmação de ações importantes;
* decisões que exigem atenção imediata;
* pequenas tarefas contextuais.

Evitar utilizar dialogs para:

* páginas inteiras;
* conteúdo extenso;
* navegação;
* tarefas complexas;
* informações que poderiam ser apresentadas diretamente na página.

Quando o conteúdo for complexo, considerar:

* página dedicada;
* drawer;
* workspace contextual.

---

## Dashboards

Não criar dashboards apenas como uma coleção de cards.

Antes de projetar um dashboard, identificar:

* quais decisões o usuário precisa tomar;
* quais informações são prioritárias;
* quais indicadores exigem atenção;
* quais informações são históricas;
* quais ações precisam ser executadas.

Organizar o dashboard pela importância e frequência de uso das informações.

---

## Tables

Utilizar tabelas quando a comparação de dados tabulares for importante.

Considerar:

* hierarquia das colunas;
* ordenação;
* filtros;
* paginação;
* seleção;
* ações;
* estados vazios;
* loading;
* erros;
* responsividade;
* acessibilidade.

Em telas pequenas, avaliar alternativas como:

* scroll horizontal controlado;
* redução de colunas;
* reorganização das informações;
* detalhes expansíveis;
* visualização alternativa.

Não transformar automaticamente toda tabela em cards.

---

## Responsive UX

Responsividade não significa apenas reduzir a largura dos elementos.

A experiência deve ser projetada considerando:

### Mobile

Priorizar:

* tarefas essenciais;
* navegação simples;
* controles acessíveis;
* menor densidade de informação.

### Tablet

Utilizar o espaço adicional para melhorar organização e produtividade.

### Desktop

Aproveitar espaço adicional para:

* múltiplas informações;
* navegação persistente;
* tabelas;
* painéis;
* ações simultâneas.

A estrutura pode mudar entre breakpoints quando isso melhorar a experiência.

Não forçar o mesmo layout em todas as resoluções.

---

## Accessibility by Design

Acessibilidade deve ser considerada desde o início do design.

Utilizar WCAG como referência.

Considerar:

* contraste;
* foco;
* navegação por teclado;
* tamanho dos alvos de interação;
* labels;
* mensagens de erro;
* hierarquia semântica;
* leitores de tela;
* zoom;
* redução de movimento;
* não depender exclusivamente de cor.

Acessibilidade não deve ser tratada como uma etapa posterior.

---

## Microinterações

Microinterações devem possuir uma finalidade.

Utilizá-las para:

* comunicar mudanças de estado;
* confirmar ações;
* indicar progresso;
* orientar atenção;
* melhorar compreensão.

Não utilizar animações apenas para tornar a interface "mais bonita".

Respeitar preferências de usuários que solicitam redução de movimento.

---

## Content Design

Textos da interface devem ser:

* claros;
* objetivos;
* consistentes;
* curtos quando possível;
* orientados à ação;
* adequados ao nível de conhecimento do usuário.

Evitar linguagem técnica quando o usuário não precisa conhecê-la.

Preferir:

```text
Não foi possível salvar o produto.
Tente novamente.
```

em vez de:

```text
HTTP 500 - Internal Server Error
```

---

## AI Aesthetic Prevention

Não utilizar automaticamente padrões visuais apenas porque são comuns em interfaces geradas por IA.

Evitar uso excessivo de:

* gradientes;
* glassmorphism;
* sombras;
* cards;
* bordas arredondadas;
* grandes espaços vazios;
* layouts em grid sem necessidade;
* roxo ou azul como estética padrão;
* hero sections genéricas;
* elementos decorativos sem função.

A identidade visual deve ser consequência:

```text
Produto
+
Usuário
+
Contexto
+
Design System
```

Não aplicar uma estética genérica de "dashboard moderno" sem justificativa.

---

## Design Decisions

Decisões de UX devem ser justificáveis.

Quando houver múltiplas alternativas possíveis, considerar:

* objetivo do usuário;
* frequência da tarefa;
* complexidade;
* impacto do erro;
* acessibilidade;
* consistência com o produto;
* custo de implementação;
* manutenção futura.

Não escolher uma solução apenas porque parece visualmente mais sofisticada.

---

## UX Review

Antes de considerar uma experiência concluída, verificar:

### Clareza

* O objetivo da tela é evidente?
* A ação principal é clara?
* A hierarquia visual é compreensível?

### Eficiência

* O usuário consegue concluir a tarefa sem etapas desnecessárias?
* Existe informação redundante?
* As ações mais frequentes estão acessíveis?

### Consistência

* Os padrões existentes foram reutilizados?
* Componentes semelhantes possuem comportamentos semelhantes?

### Acessibilidade

* O fluxo pode ser utilizado por teclado?
* O foco é perceptível?
* Existe contraste suficiente?
* A informação depende exclusivamente de cor?

### Responsividade

* O fluxo funciona em telas pequenas?
* As ações permanecem acessíveis?
* A hierarquia continua clara?

### Estados

* Loading?
* Empty?
* Error?
* Success?
* Disabled?
* Permission denied?

---

## Relação com Frontend Engineering

UX/UI define:

* comportamento esperado;
* experiência;
* hierarquia;
* interação;
* estados;
* padrões visuais.

Frontend Engineering define:

* arquitetura;
* implementação;
* componentes;
* gerenciamento de estado;
* integração com APIs;
* performance;
* testes;
* qualidade técnica.

As duas disciplinas devem trabalhar em conjunto.

Nenhuma decisão de UX deve ignorar restrições técnicas relevantes.

Nenhuma decisão técnica deve degradar desnecessariamente a experiência do usuário.

---

## Definition of Done

Uma experiência pode ser considerada pronta quando:

* [ ] objetivo do usuário está claro;
* [ ] fluxo principal está definido;
* [ ] hierarquia da informação está clara;
* [ ] ação primária está evidente;
* [ ] estados principais foram considerados;
* [ ] loading foi considerado;
* [ ] empty state foi considerado;
* [ ] error state foi considerado;
* [ ] ações destrutivas foram avaliadas;
* [ ] acessibilidade foi considerada;
* [ ] responsividade foi considerada;
* [ ] padrões existentes foram reutilizados;
* [ ] textos da interface são claros;
* [ ] não existem elementos decorativos sem função;
* [ ] experiência foi validada no contexto real da aplicação.
