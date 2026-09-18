# Plano de Implementação — 009 authorization-and-permissions

- [ ] 1. Modelar permissões
  - Criar `permission.ts` com modelo tipado (recurso:ação).
  - _Requisitos: 1_

- [ ] 2. Provider de permissões
  - `PermissionProvider` obtendo permissões da sessão (008).
  - _Requisitos: 1_

- [ ] 3. API de verificação
  - `useHasPermission` e componente `<Can>` com fallback.
  - _Requisitos: 1, 2_

- [ ] 4. Ocultar/desabilitar ações
  - Aplicar gating a ações; desabilitar com motivo acessível quando fizer sentido.
  - _Requisitos: 2_

- [ ] 5. Filtrar navegação
  - Filtrar itens de menu por permissão (base para 010).
  - _Requisitos: 3_

- [ ] 6. Guard de rota por permissão
  - `ProtectedByPermission` + `ForbiddenPage` (403).
  - Convergir 403 da API (004) para a mesma experiência.
  - _Requisitos: 4_

- [ ] 7. Registro extensível
  - `permissionRegistry` para features registrarem permissões sem editar o núcleo.
  - _Requisitos: 5_

- [ ] 8. Testes
  - Gating de ações e navegação; guard negando acesso; coerência com 403.
  - Queries por role/label.
  - _Requisitos: 7_

- [ ] 9. Verificação final
  - Ações/menu adaptam por permissão; rota nega acesso com ForbiddenPage.
  - Reforçado que autorização real é do backend.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
