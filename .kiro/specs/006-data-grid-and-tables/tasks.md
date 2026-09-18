# Plano de Implementação — 006 data-grid-and-tables

- [x] 1. Instalar TanStack Table e estruturar o grid
  - Adicionar TanStack Table.
  - Criar `src/shared/ui/data-grid/` com `DataGrid`, `useDataGrid` e `index.ts`.
  - _Requisitos: 1_

- [x] 2. Renderizar tabela base
  - Renderizar colunas/linhas/células com primitivos de 003 e tokens de 002.
  - Definição de colunas tipada fornecida pela feature.
  - _Requisitos: 1, 7_

- [x] 3. Implementar ordenação
  - `DataGridColumnHeader` com sort e `aria-sort`.
  - _Requisitos: 2, 7_

- [x] 4. Implementar filtros e toolbar
  - `DataGridToolbar` com busca e filtros por coluna.
  - _Requisitos: 2_

- [x] 5. Implementar paginação
  - `DataGridPagination` com suporte server-side (padrão) e client-side.
  - _Requisitos: 2_

- [x] 6. Implementar seleção e ações de linha
  - Seleção acessível (incl. selecionar todos) e `DataGridRowActions`.
  - Ação em lote opcional.
  - _Requisitos: 3_

- [x] 7. Sincronizar estado com a URL
  - `useDataGridUrlState` para search/page/sort/filters; restaurar no load.
  - Integrar parâmetros com TanStack Query (004).
  - _Requisitos: 4_

- [x] 8. Tratar estados de dados
  - Loading (skeleton de linhas), EmptyState e estado de erro com retry.
  - _Requisitos: 5_

- [x] 9. Responsividade
  - Estratégia por breakpoint (scroll controlado, redução de colunas, detalhes expansíveis).
  - _Requisitos: 6_

- [x] 10. Testes
  - Ordenar, filtrar, paginar, selecionar, ação de linha, estados e sincronização de URL.
  - Integração com MSW quando exercitar dados reais.
  - _Requisitos: 7_

- [x] 11. Verificação final
  - Grid de exemplo funciona ponta a ponta; URL reflete/restaura estado.
  - Teclado e estados validados.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_

## Notas de execução

- **TanStack Table**: `@tanstack/react-table` **8.21.3**. A v9 (latest) é um major recém-
  lançado com API redesenhada (`useTable`, row models por feature) e pouca documentação; a
  v8 é a linha madura e amplamente documentada (`useReactTable`, `getCoreRowModel`).
- **Composição**: o `DataGrid` recebe `columns`+`data` da feature e não conhece o domínio.
  Subcomponentes: `DataGridColumnHeader` (sort + `aria-sort`), `DataGridToolbar` (busca +
  slot de filtros), `DataGridPagination`, `DataGridRowActions` (sobre o Dropdown). Primitivos
  de tabela com semântica HTML nativa.
- **URL state**: `useDataGridUrlState` reflete search/page/pageSize/sort na URL via
  `useSearchParams` do react-router (refresh/deep-link/compartilhável). Uma nova busca volta à
  página 1.
- **Server-side por padrão**: `manualSorting`/`manualPagination` habilitados; a feature liga a
  URL state à query (TanStack Query). O exemplo demonstra client-side para simplicidade.
- **Estados**: loading (skeleton de linhas), empty (EmptyState) e error (ErrorState com retry).
- **Responsividade**: scroll horizontal controlado no container da tabela.
- **Exemplo**: `DataGridExamplePage` (rota `/examples/data-grid`) valida busca, ordenação,
  paginação e URL state; um CRUD real via API vem na spec 012.
- **Strict types**: ajustes para `exactOptionalPropertyTypes` (spread condicional de
  `onSortingChange`/`onRowSelectionChange` e de `onRetry`).

Validações executadas com sucesso: `typecheck`, `lint`, `test` (54), `build`, `test:e2e` (8/8).
