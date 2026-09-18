# Design — 009 authorization-and-permissions

## Visão geral

Adapta a UI conforme as permissões do usuário obtidas na sessão (008): API de verificação (`useHasPermission`, `<Can>`), ocultar/desabilitar ações, filtrar navegação, guards de rota por permissão e pontos de extensão para features registrarem permissões. Reforça que autorização real é do backend; a UI trata isso como UX.

Referências: `frontend-architecture.md` (Authorization), `frontend-engineering.md` (Security), `product.md` (Extensibilidade), `testing.md`.

## Estrutura

```text
src/shared/authorization/
├── permission.ts          # modelo tipado de permissão
├── PermissionProvider.tsx  # provê permissões da sessão
├── useHasPermission.ts     # verificação programática
├── Can.tsx                 # componente declarativo de gating
├── ProtectedByPermission.tsx # guard de rota por permissão
├── permissionRegistry.ts   # registro extensível por feature
└── index.ts

src/app/error/
└── ForbiddenPage.tsx       # página de acesso negado (403)
```

## Decisões técnicas

### Modelo e API
- Permissões tipadas (string identifiers agrupadas por recurso/ação, ex.: `products:create`).
- Fonte: sessão/backend via 008. `PermissionProvider` disponibiliza o conjunto do usuário.
- Verificação: `useHasPermission(permission)` (programática) e `<Can permission=...>` (declarativa, com `fallback`).

### Ocultar vs desabilitar
- Ação indisponível: ocultar quando não fizer sentido mostrar; desabilitar quando a presença comunica contexto (com motivo acessível quando útil). Escolha guiada por `ux-design.md`.

### Navegação
- Itens de menu filtrados por permissão. O núcleo não conhece permissões concretas de features; consome o que foi registrado (integra com o menu em 010).

### Guards de rota
- `ProtectedByPermission` verifica a permissão antes de renderizar; sem permissão → `ForbiddenPage`.
- Coerência com o backend: um 403 vindo da API (tratado em 004) leva à mesma experiência de acesso negado.

### Extensibilidade
- `permissionRegistry` permite que uma feature registre suas permissões via ponto de extensão, sem editar o núcleo (base para a spec 011). A dependência aponta para dentro: o núcleo não importa features.

## Segurança

- A UI de autorização é **UX**, não segurança (ver `frontend-engineering.md` → Security e `frontend-architecture.md` → Authorization).
- Autoridade final de autorização é o backend; o frontend nunca é o mecanismo de proteção.

## Testes

- `useHasPermission`/`<Can>` ocultam/desabilitam conforme permissão.
- Navegação filtrada por permissão.
- `ProtectedByPermission` bloqueia e mostra `ForbiddenPage`.
- Coerência com 403 da API.
- Queries por role/label.

## Riscos e mitigações

- **Tratar UI como segurança**: documentar explicitamente que é UX; backend decide.
- **Acoplar núcleo a permissões de features**: usar registry; núcleo agnóstico.
- **Divergência UI vs backend**: 403 da API converge para a mesma experiência de acesso negado.

## Verificação

- Ações e itens de menu aparecem/desaparecem conforme permissões.
- Rota protegida por permissão nega acesso com `ForbiddenPage`.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
