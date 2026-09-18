# Requisitos — 003 core-ui-components

## Introdução

Esta spec entrega o **catálogo de componentes primitivos reutilizáveis** do núcleo, construídos sobre a fundação visual da spec 002. São os blocos com que todas as features e o shell serão montados: controles de formulário, feedback, overlays e estados. Cada componente deve ser acessível, ter estados completos e priorizar composição.

Referências: `design-system.md`, `frontend-engineering.md`, `ux-design.md`, `testing.md`.

## Requisitos

### Requisito 1 — Controles de formulário

**User Story:** Como desenvolvedor, quero controles de formulário acessíveis, para montar formulários consistentes.

#### Acceptance Criteria

1. QUANDO um formulário é montado ENTÃO o sistema DEVE prover Input, Textarea, Select, Checkbox, Radio e Switch.
2. QUANDO um controle é renderizado ENTÃO ele DEVE ter label associado programaticamente.
3. QUANDO um controle está inválido ENTÃO ele DEVE expor `aria-invalid` e associar a mensagem de erro via `aria-describedby`.
4. QUANDO um controle está desabilitado ou read-only ENTÃO o estado DEVE ser comunicado de forma acessível.
5. QUANDO um placeholder é usado ENTÃO ele NÃO DEVE substituir o label.

### Requisito 2 — Button com hierarquia e estados

**User Story:** Como usuário, quero botões com hierarquia clara, para entender a ação principal de cada contexto.

#### Acceptance Criteria

1. QUANDO um botão é usado ENTÃO o sistema DEVE prover variantes primary, secondary, tertiary, destructive, ghost e icon.
2. QUANDO um contexto tem ação principal ENTÃO DEVE haver apenas um botão primário competindo pela atenção.
3. QUANDO um botão está em loading ENTÃO ele DEVE impedir submissões duplicadas.
4. QUANDO um botão representa ação destrutiva ENTÃO ele DEVE ser visualmente identificável.
5. QUANDO um botão recebe foco ENTÃO o foco DEVE ser visível.

### Requisito 3 — Componentes de feedback

**User Story:** Como usuário, quero feedback claro das minhas ações, para saber o que aconteceu.

#### Acceptance Criteria

1. QUANDO uma mensagem contextual é necessária ENTÃO o sistema DEVE prover Alert (inline) e Toast.
2. QUANDO um Toast é exibido ENTÃO ele DEVE ser anunciado por leitores de tela (`aria-live`/`role` adequado) e pausar ao hover/foco.
3. QUANDO uma informação precisa permanecer disponível ENTÃO ela NÃO DEVE usar Toast.
4. QUANDO estado é comunicado ENTÃO o sistema NÃO DEVE depender apenas de cor.
5. QUANDO um Badge ou Tooltip é usado ENTÃO ele DEVE seguir os tokens e ser acessível.

### Requisito 4 — Overlays acessíveis

**User Story:** Como usuário de teclado/leitor de tela, quero dialogs e menus acessíveis, para operar sem mouse.

#### Acceptance Criteria

1. QUANDO um Dialog/Drawer abre ENTÃO o foco DEVE ir para o conteúdo e retornar ao gatilho ao fechar.
2. QUANDO um overlay está aberto ENTÃO `Escape` DEVE fechá-lo quando o comportamento permitir.
3. QUANDO um Dropdown é usado ENTÃO ele DEVE ser navegável por teclado.
4. QUANDO um Dialog é usado ENTÃO ele NÃO DEVE substituir páginas complexas.

### Requisito 5 — Estados de dados (loading/empty/error)

**User Story:** Como usuário, quero estados visuais claros de carregamento, vazio e erro, para entender a situação da tela.

#### Acceptance Criteria

1. QUANDO dados carregam ENTÃO o sistema DEVE prover Skeleton e Spinner.
2. QUANDO não há dados ENTÃO o sistema DEVE prover EmptyState com título, descrição e ação opcional.
3. QUANDO ocorre erro de dados ENTÃO o sistema DEVE prover um padrão de estado de erro com possibilidade de recuperação (retry).

### Requisito 6 — API por composição

**User Story:** Como desenvolvedor, quero componentes compostos em vez de altamente configuráveis, para manter APIs simples.

#### Acceptance Criteria

1. QUANDO um componente complexo é criado ENTÃO ele DEVE favorecer composição de subcomponentes em vez de muitas props booleanas.
2. QUANDO uma prop é adicionada ENTÃO ela DEVE ter consumidor real (sem configurabilidade especulativa).
3. QUANDO um componente é estilizado ENTÃO ele DEVE consumir tokens semânticos.

### Requisito 7 — Cobertura de testes de comportamento

**User Story:** Como mantenedor, quero testes de comportamento nos componentes do núcleo, para prevenir regressões que afetam todos os projetos derivados.

#### Acceptance Criteria

1. QUANDO um componente é entregue ENTÃO ele DEVE ter testes cobrindo renderização, interação e estados relevantes.
2. QUANDO os testes consultam o DOM ENTÃO eles DEVEM usar role/label/texto acessível, não classes CSS.
3. QUANDO um componente interativo é testado ENTÃO a navegação por teclado relevante DEVE ser verificada.

## Não objetivos

- Não montar formulários completos com validação de schema (spec 007).
- Não implementar o Data Grid (spec 006).
- Não implementar layout/shell (spec 010).
