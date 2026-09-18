# Design — 006 data-grid-and-tables

## Visão geral

Data Grid reutilizável do núcleo sobre TanStack Table, composável (não uma abstração universal), com ordenação, filtros, paginação, seleção e ações de linha. Estados de loading/empty/error tratados, estado navegável (search/page/sort/filters) na URL, e responsividade pensada por breakpoint. É consumido por features de negócio, não reescrito por elas.

Referências: `ux-design.md` (Tables), `design-system.md` (Tables), `frontend-architecture.md` (URL State), `tech.md` (TanStack Table), `testing.md`.

## Composição

```text
src/shared/ui/data-grid/
├── DataGrid.tsx           # orquestra colunas, dados e estados
├── DataGridToolbar.tsx    # busca e filtros
├── DataGridPagination.tsx # paginação
├── DataGridColumnHeader.tsx # ordenação por coluna
├── DataGridRowActions.tsx # ações de linha
├── useDataGrid.ts         # integra TanStack Table + estado
├── useDataGridUrlState.ts # sincroniza estado com a URL
└── index.ts
```

```text
DataGrid
├── DataGridToolbar (search, filters)
├── Table (TanStack Table + primitivos de 003)
│   ├── ColumnHeader (sort)
│   ├── Row (select, actions)
│   └── Cell
└── DataGridPagination
```

Favorece composição: a feature define colunas e passa dados; o grid não vira um `UniversalTable` cheio de flags (ver `frontend-architecture.md` → Reusability).

## Decisões técnicas

### Núcleo de tabela
- **TanStack Table** para modelo de colunas, sorting, filtering, pagination e row selection (headless), com a apresentação usando os primitivos da spec 003 e tokens de 002.
- Definição de colunas tipada; a feature fornece `columns` e `data`.

### Estado navegável na URL
- `search`, `page`, `pageSize`, `sort` e `filters` vivem na URL (`useDataGridUrlState`), permitindo refresh, deep link e compartilhamento (ver `frontend-architecture.md` → URL State).
- Server state (dados) via TanStack Query (004); URL state controla os parâmetros da query.
- Suporte a paginação **server-side** e **client-side**; padrão do núcleo é server-side para escala.

### Ordenação, filtros, seleção, ações
- Ordenação por coluna com indicador acessível.
- Filtros na toolbar (texto e por coluna), refletidos na URL.
- Seleção de linhas (checkbox) com estado acessível e ação em lote opcional.
- Ações de linha via `DataGridRowActions` (dropdown de 003), com nomes acessíveis.

### Estados
- **Loading**: skeleton de linhas (não tela vazia).
- **Empty**: `EmptyState` (003) com mensagem e ação quando houver.
- **Error**: estado de erro com retry, traduzido pela camada de 004.

### Responsividade
- Desktop: tabela completa. Telas menores: scroll horizontal controlado, redução/ocultação de colunas ou detalhes expansíveis (ver `ux-design.md` → Tables). Não converter automaticamente em cards.

## Acessibilidade

- Semântica de tabela (`table`/`row`/`columnheader`/`cell` ou roles ARIA equivalentes).
- Ordenação e seleção operáveis por teclado; `aria-sort` no header.
- Foco visível; ações com nome acessível.

## Testes

- Comportamento: ordenar, filtrar, paginar, selecionar e disparar ação de linha.
- Estados loading/empty/error.
- Sincronização com a URL (parâmetros refletem interação).
- Integração com MSW quando exercitando dados reais via query.
- Queries por role/label.

## Riscos e mitigações

- **Virar abstração universal**: manter composição; feature define colunas, grid não conhece o domínio.
- **URL vs server state duplicados**: URL é a fonte dos parâmetros; query deriva deles.
- **Performance com muitas linhas**: paginação server-side por padrão; virtualização só se houver evidência de necessidade (evitar otimização prematura).

## Verificação

- Grid de exemplo com dados mockados: ordena, filtra, pagina, seleciona e executa ação.
- URL reflete e restaura o estado após refresh.
- Estados loading/empty/error corretos; navegação por teclado funciona.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
