# Design — 010 admin-layout

## Visão geral

Application Shell administrativo responsivo que preenche o `RootLayout` da spec 005: Sidebar, Header, Breadcrumb, menu do usuário e notificações. Integra sessão (008) no menu do usuário e permissões (009) na filtragem de navegação. Construído com componentes de 003 e tokens de 002. É o esqueleto visual reutilizável por qualquer projeto derivado.

Referências: `ux-design.md` (Information Architecture, Navigation, Responsive UX, Dashboards), `design-system.md` (Navigation), `product.md` (núcleo), `frontend-engineering.md`.

## Estrutura

```text
src/shared/layout/
├── AppShell.tsx        # compõe header + sidebar + content
├── Sidebar/
│   ├── Sidebar.tsx     # navegação (drawer em mobile)
│   └── NavItem.tsx     # item com estado ativo + gating de permissão
├── Header/
│   ├── Header.tsx
│   ├── UserMenu.tsx    # usa useCurrentUser + logout (008)
│   └── Notifications.tsx # indicador + painel (dados injetáveis)
├── Breadcrumb/
│   └── Breadcrumb.tsx  # derivado da rota
└── index.ts
```

O `RootLayout` (app, 005) passa a renderizar `AppShell` envolvendo o `Outlet` das rotas.

## Decisões técnicas

### Shell e layout
- `AppShell` usa layout fluido (grid/flex, sem posicionamento absoluto para estruturar a página — ver `frontend-engineering.md` → Layout).
- Comportamento por breakpoint: desktop com sidebar persistente; mobile com sidebar em drawer acionada pelo header.

### Sidebar e navegação
- Itens com estado ativo derivado da rota. Navegável por teclado, foco visível.
- Itens filtrados por permissão via `<Can>`/`useHasPermission` (009). O layout consome uma estrutura de itens de navegação; o mecanismo de registro por feature vem em 011.

### Header
- Gatilho de navegação (mobile), `UserMenu` e `Notifications`; opcionalmente o toggle de tema (002).
- `UserMenu` exibe o usuário atual (`useCurrentUser`) e aciona `logout` (008), usando Dropdown de 003.

### Breadcrumb
- Derivado da rota atual (títulos vindos da definição de rotas de 005), com semântica de navegação (`nav`/`aria-label`).

### Notificações
- `Notifications` com indicador acessível e painel; empty state quando vazio. Como o template não define a fonte, os dados são **injetáveis/placeholder**, sem acoplar domínio de negócio ao núcleo (ver `product.md`).

## Acessibilidade e UX

- Hierarquia de informação clara; ação principal evidente por página (ver `ux-design.md`).
- Navegação por teclado em toda a estrutura; foco gerenciado ao abrir/fechar drawer e menus.
- Conteúdo longo e overflow tratados; densidade adequada por dispositivo.
- Sem estética genérica: navegação funcional, sem excesso de cards/sombras (AI Aesthetic Prevention).

## Testes

- Sidebar: estado ativo, colapso/drawer em mobile, filtragem por permissão, teclado.
- UserMenu: exibe usuário e executa logout.
- Breadcrumb: coerência com a rota.
- Notifications: indicador e empty state.
- Responsividade e navegação por teclado.
- Queries por role/label.

## Riscos e mitigações

- **Acoplar navegação a features**: consumir estrutura de itens; registro por feature fica para 011.
- **Notificações acoplando domínio**: manter dados injetáveis/placeholder no núcleo.
- **Layout quebrando com conteúdo real**: testar textos longos e overflow (ver `design-system.md` → Content).

## Verificação

- Shell responsivo navegável em mobile/tablet/desktop.
- Menu do usuário mostra o usuário e faz logout; navegação filtra por permissão.
- Breadcrumb coerente; notificações com indicador e empty state.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
