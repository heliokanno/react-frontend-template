# Plano de Implementação — 009 authorization-and-permissions

- [x] 1. Modelar permissões
  - Criar `permission.ts` com modelo tipado (recurso:ação).
  - _Requisitos: 1_

- [x] 2. Provider de permissões
  - `PermissionProvider` obtendo permissões da sessão (008).
  - _Requisitos: 1_

- [x] 3. API de verificação
  - `useHasPermission` e componente `<Can>` com fallback.
  - _Requisitos: 1, 2_

- [x] 4. Ocultar/desabilitar ações
  - Aplicar gating a ações; desabilitar com motivo acessível quando fizer sentido.
  - _Requisitos: 2_

- [x] 5. Filtrar navegação
  - Filtrar itens de menu por permissão (base para 010).
  - _Requisitos: 3_

- [x] 6. Guard de rota por permissão
  - `ProtectedByPermission` + `ForbiddenPage` (403).
  - Convergir 403 da API (004) para a mesma experiência.
  - _Requisitos: 4_

- [x] 7. Registro extensível
  - `permissionRegistry` para features registrarem permissões sem editar o núcleo.
  - _Requisitos: 5_

- [x] 8. Testes
  - Gating de ações e navegação; guard negando acesso; coerência com 403.
  - Queries por role/label.
  - _Requisitos: 7_

- [x] 9. Verificação final
  - Ações/menu adaptam por permissão; rota nega acesso com ForbiddenPage.
  - Reforçado que autorização real é do backend.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_

## Notas de execução

- **Módulo** em `src/shared/authorization/`: `permission` (modelo tipado `recurso:ação` +
  helpers `hasPermission`/`hasAll`/`hasAny`), `PermissionProvider` + `useHasPermission`,
  `Can` (gating declarativo com fallback), `permissionRegistry` (registro extensível por
  feature, base para a spec 011). API pública em `index.ts`.
- **Origem das permissões**: adicionadas ao `CurrentUser` do domínio de auth (008); o
  backend as fornece via DTO (`permissions`). `shared/authorization` **não** depende da
  feature auth — a ponte é feita na camada `app` (`PermissionBridge` lê `useCurrentUser` e
  injeta no `PermissionProvider`), preservando a direção de dependências.
- **Gating de ação**: exemplo com `<Can permission="reports:export">` no Dashboard (ação
  oculta para quem não tem a permissão).
- **Filtragem de navegação**: a API (`useHasPermission`/`Can`) é a base; a sidebar de 010
  aplicará o filtro aos itens de menu.
- **Guard de rota**: `ProtectedByPermission` + `ForbiddenPage` (403); usado na rota
  `/dashboard` exigindo `dashboard:view`. Um 403 vindo da API (004) converge para a mesma
  experiência de acesso negado.
- **Segurança**: reforçado em toda a documentação que isto é **UX**, não segurança — a
  autorização real é sempre do backend.

Validações executadas com sucesso: `typecheck`, `lint`, `test` (78), `build`, `test:e2e` (10/10).
