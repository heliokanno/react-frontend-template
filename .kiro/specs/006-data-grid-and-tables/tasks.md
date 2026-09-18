# Plano de Implementação — 006 data-grid-and-tables

- [ ] 1. Instalar TanStack Table e estruturar o grid
  - Adicionar TanStack Table.
  - Criar `src/shared/ui/data-grid/` com `DataGrid`, `useDataGrid` e `index.ts`.
  - _Requisitos: 1_

- [ ] 2. Renderizar tabela base
  - Renderizar colunas/linhas/células com primitivos de 003 e tokens de 002.
  - Definição de colunas tipada fornecida pela feature.
  - _Requisitos: 1, 7_

- [ ] 3. Implementar ordenação
  - `DataGridColumnHeader` com sort e `aria-sort`.
  - _Requisitos: 2, 7_

- [ ] 4. Implementar filtros e toolbar
  - `DataGridToolbar` com busca e filtros por coluna.
  - _Requisitos: 2_

- [ ] 5. Implementar paginação
  - `DataGridPagination` com suporte server-side (padrão) e client-side.
  - _Requisitos: 2_

- [ ] 6. Implementar seleção e ações de linha
  - Seleção acessível (incl. selecionar todos) e `DataGridRowActions`.
  - Ação em lote opcional.
  - _Requisitos: 3_

- [ ] 7. Sincronizar estado com a URL
  - `useDataGridUrlState` para search/page/sort/filters; restaurar no load.
  - Integrar parâmetros com TanStack Query (004).
  - _Requisitos: 4_

- [ ] 8. Tratar estados de dados
  - Loading (skeleton de linhas), EmptyState e estado de erro com retry.
  - _Requisitos: 5_

- [ ] 9. Responsividade
  - Estratégia por breakpoint (scroll controlado, redução de colunas, detalhes expansíveis).
  - _Requisitos: 6_

- [ ] 10. Testes
  - Ordenar, filtrar, paginar, selecionar, ação de linha, estados e sincronização de URL.
  - Integração com MSW quando exercitar dados reais.
  - _Requisitos: 7_

- [ ] 11. Verificação final
  - Grid de exemplo funciona ponta a ponta; URL reflete/restaura estado.
  - Teclado e estados validados.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
