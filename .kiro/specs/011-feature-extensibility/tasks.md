# Plano de Implementação — 011 feature-extensibility

- [ ] 1. Definir o contrato de feature
  - Criar `FeatureModule` (id, enabled, routes, navItems, permissions) em `src/shared/feature/`.
  - _Requisitos: 1, 2, 3_

- [ ] 2. Implementar o registry
  - `featureRegistry` recebendo a lista de módulos habilitados (config da app, não do núcleo).
  - _Requisitos: 1, 5_

- [ ] 3. Injetar rotas no router
  - `buildFeatureRoutes` integrando ao router (005) no composition root.
  - _Requisitos: 1_

- [ ] 4. Injetar navegação na sidebar
  - `buildFeatureNav` integrando os itens à sidebar (010), com permissão por item.
  - _Requisitos: 2_

- [ ] 5. Registrar permissões da feature
  - Integrar `permissions` ao registry de 009.
  - _Requisitos: 3_

- [ ] 6. Configurabilidade
  - Habilitar/desabilitar features por configuração; feature desabilitada não monta nada.
  - _Requisitos: 5_

- [ ] 7. Garantir boundaries
  - API pública por feature (`index.ts`); núcleo não importa features concretas; sem ciclos.
  - _Requisitos: 4_

- [ ] 8. Documentar o mecanismo
  - Guia "como adicionar uma feature" + exemplo mínimo.
  - _Requisitos: 6_

- [ ] 9. Testes
  - Feature de teste aparece em rotas/nav sem editar o núcleo; desabilitada não monta.
  - Verificar direção de dependência.
  - _Requisitos: 7_

- [ ] 10. Verificação final
  - Composição funciona sem tocar no núcleo; docs presentes.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
