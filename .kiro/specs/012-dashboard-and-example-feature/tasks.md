# Plano de Implementação — 012 dashboard-and-example-feature

- [ ] 1. Dashboard base
  - `DashboardPage` orientado a decisões; estados loading/empty/error.
  - Registrar como `FeatureModule` (rota + nav) via 011.
  - _Requisitos: 1_

- [ ] 2. Domínio da feature Products
  - `Product` (entidade/tipos) e erros de domínio; sem React/HTTP.
  - _Requisitos: 2_

- [ ] 3. Casos de uso e portas
  - Ports in: List/Create/Update/DeleteProduct; port out: `ProductRepository`.
  - Implementar os serviços.
  - _Requisitos: 2_

- [ ] 4. Adapters
  - `HttpProductRepository` (mappers DTO↔domínio) e `InMemoryProductRepository` (testes).
  - _Requisitos: 2_

- [ ] 5. Listagem com Data Grid
  - `ProductsPage` usando o Data Grid (006): ordenação, filtros, paginação, URL state, estados.
  - Hooks `useProducts` etc. sob TanStack Query (004).
  - _Requisitos: 3_

- [ ] 6. Formulário create/update
  - `ProductFormDialog` com Form/Zod (007); estados de submissão; erros de campo da API.
  - Exclusão com confirmação (ação destrutiva).
  - _Requisitos: 4_

- [ ] 7. Sessão e permissões
  - Rotas protegidas (008); ações/itens gated por permissão (009).
  - Registrar rotas/nav/permissões via `FeatureModule` (011).
  - _Requisitos: 5_

- [ ] 8. Garantir isolamento
  - Feature não modifica/duplica o núcleo; núcleo não depende da feature; desabilitar remove tudo.
  - _Requisitos: 6_

- [ ] 9. Testes
  - Unit (casos de uso com fake, mappers, domínio).
  - Component/Integration com MSW (listagem e formulário, estados).
  - _Requisitos: 7_

- [ ] 10. E2E do fluxo crítico
  - Playwright: login → navegar até Products → criar → ver na listagem; acesso negado por permissão.
  - _Requisitos: 7_

- [ ] 11. Verificação final
  - Dashboard e CRUD funcionam compondo o núcleo; feature isolada e descartável.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
