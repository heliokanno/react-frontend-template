# Requisitos — 006 data-grid-and-tables

## Introdução

Esta spec entrega o **Data Grid reutilizável** do núcleo, sobre TanStack Table. Ele resolve, uma única vez, listagem tabular com ordenação, filtros, paginação, seleção e ações, com estados completos e estado navegável na URL. Features de negócio o **compõem** (fornecem colunas e dados), sem reescrevê-lo.

Referências: `ux-design.md` (Tables), `design-system.md` (Tables), `frontend-architecture.md` (URL State, Reusability), `tech.md` (TanStack Table), `testing.md`.

## Requisitos

### Requisito 1 — Grid composável sobre TanStack Table

**User Story:** Como desenvolvedor de feature, quero um grid composável, para listar dados sem reimplementar tabela.

#### Acceptance Criteria

1. QUANDO um grid é criado ENTÃO ele DEVE ser construído sobre TanStack Table.
2. QUANDO uma feature usa o grid ENTÃO ela DEVE fornecer colunas e dados, sem conhecer os internals do grid.
3. QUANDO o grid é projetado ENTÃO ele DEVE favorecer composição, não uma abstração universal cheia de flags.

### Requisito 2 — Ordenação, filtros, paginação

**User Story:** Como usuário, quero ordenar, filtrar e paginar, para encontrar dados rapidamente.

#### Acceptance Criteria

1. QUANDO uma coluna é ordenável ENTÃO o usuário DEVE poder ordená-la, com indicador acessível (`aria-sort`).
2. QUANDO filtros existem ENTÃO o usuário DEVE poder filtrar por texto e/ou por coluna.
3. QUANDO há muitos dados ENTÃO o grid DEVE paginar, suportando paginação server-side.

### Requisito 3 — Seleção e ações de linha

**User Story:** Como usuário, quero selecionar linhas e executar ações, para operar sobre registros.

#### Acceptance Criteria

1. QUANDO linhas são selecionáveis ENTÃO a seleção DEVE ser acessível e refletir estado (inclusive selecionar todos).
2. QUANDO uma linha tem ações ENTÃO elas DEVEM ser acessíveis e ter nome acessível.
3. QUANDO há seleção múltipla ENTÃO o grid PODE oferecer ação em lote.

### Requisito 4 — Estado navegável na URL

**User Story:** Como usuário, quero que busca, página, ordenação e filtros sobrevivam a refresh e sejam compartilháveis.

#### Acceptance Criteria

1. QUANDO o usuário busca, ordena, filtra ou pagina ENTÃO o estado DEVE ser refletido na URL (`search`, `page`, `sort`, `filters`).
2. QUANDO a página é recarregada ENTÃO o grid DEVE restaurar o estado a partir da URL.
3. QUANDO server state é usado ENTÃO ele NÃO DEVE ser duplicado em store global; a URL controla os parâmetros da query.

### Requisito 5 — Estados de dados

**User Story:** Como usuário, quero estados claros de carregamento, vazio e erro no grid.

#### Acceptance Criteria

1. QUANDO os dados carregam ENTÃO o grid DEVE exibir loading (skeleton de linhas), não uma tela vazia.
2. QUANDO não há dados ENTÃO o grid DEVE exibir um EmptyState com mensagem e ação quando houver.
3. QUANDO ocorre erro ENTÃO o grid DEVE exibir estado de erro com opção de recuperação.

### Requisito 6 — Responsividade

**User Story:** Como usuário mobile, quero visualizar a tabela de forma utilizável em telas pequenas.

#### Acceptance Criteria

1. QUANDO a tela é pequena ENTÃO o grid DEVE aplicar estratégia responsiva (scroll horizontal controlado, redução de colunas ou detalhes expansíveis).
2. QUANDO a tela reduz ENTÃO o grid NÃO DEVE simplesmente converter tudo em cards automaticamente.
3. QUANDO responsivo ENTÃO as ações principais DEVEM permanecer acessíveis.

### Requisito 7 — Acessibilidade e testes

**User Story:** Como mantenedor, quero o grid acessível e testado, por ser peça crítica do núcleo.

#### Acceptance Criteria

1. QUANDO o grid é renderizado ENTÃO ele DEVE ter semântica de tabela e ser operável por teclado.
2. QUANDO o grid é entregue ENTÃO ele DEVE ter testes de ordenação, filtro, paginação, seleção e estados.
3. QUANDO testes consultam o DOM ENTÃO eles DEVEM usar role/label, não classes CSS.

## Não objetivos

- Não implementar features de negócio que usam o grid (spec 012 traz o exemplo).
- Não implementar formulários (spec 007).
- Não adicionar virtualização sem evidência de necessidade.
