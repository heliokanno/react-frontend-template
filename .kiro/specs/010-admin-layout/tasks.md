# Plano de Implementação — 010 admin-layout

- [ ] 1. Criar AppShell
  - `src/shared/layout/AppShell.tsx` compondo header + sidebar + área de conteúdo (layout fluido).
  - Renderizar `AppShell` dentro do `RootLayout` (005).
  - _Requisitos: 1_

- [ ] 2. Implementar Sidebar
  - `Sidebar` + `NavItem` com estado ativo por rota; teclado e foco visível.
  - Drawer em mobile acionado pelo header.
  - _Requisitos: 2, 7_

- [ ] 3. Filtrar navegação por permissão
  - Aplicar `<Can>`/`useHasPermission` (009) aos itens.
  - _Requisitos: 2_

- [ ] 4. Implementar Header
  - Gatilho de navegação (mobile), slot do menu do usuário e notificações; toggle de tema opcional.
  - _Requisitos: 3_

- [ ] 5. Implementar UserMenu
  - Dropdown (003) exibindo `useCurrentUser` e executando `logout` (008).
  - _Requisitos: 5_

- [ ] 6. Implementar Breadcrumb
  - Derivar da rota (títulos de 005); semântica de navegação acessível.
  - _Requisitos: 4_

- [ ] 7. Implementar Notifications
  - Indicador acessível + painel; empty state; dados injetáveis/placeholder (sem acoplar domínio).
  - _Requisitos: 6_

- [ ] 8. Responsividade e acessibilidade
  - Validar mobile/tablet/desktop; foco no drawer/menus; overflow e conteúdo longo.
  - _Requisitos: 7_

- [ ] 9. Testes
  - Sidebar (ativo, drawer, permissão, teclado), UserMenu (logout), Breadcrumb, Notifications.
  - Queries por role/label.
  - _Requisitos: 2, 4, 5, 6, 7_

- [ ] 10. Verificação final
  - Shell responsivo, menu do usuário e navegação por permissão funcionam.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
