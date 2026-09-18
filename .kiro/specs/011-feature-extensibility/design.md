# Design — 011 feature-extensibility

## Visão geral

Mecanismo de composição que permite adicionar features de negócio sem editar o núcleo: um contrato de "feature module" que registra rotas, itens de navegação e permissões; um registry central montado no composition root; configurabilidade para habilitar/desabilitar features; e API pública por feature com boundaries. Concretiza a regra de produto (`product.md`).

Referências: `product.md` (Extensibilidade), `frontend-architecture.md` (Feature Boundaries), `hexagonal-architecture.md` (direção de dependências).

## Contrato de feature

```text
src/shared/feature/
├── FeatureModule.ts       # contrato que uma feature implementa
├── featureRegistry.ts     # coleta os módulos habilitados
├── buildFeatureRoutes.ts  # deriva rotas para o router (005)
├── buildFeatureNav.ts     # deriva itens de navegação (010)
└── index.ts
```

```ts
// FeatureModule (contrato — nomes ilustrativos)
export interface FeatureModule {
  id: string;
  enabled?: boolean;                 // ou controlado por config
  routes: FeatureRoute[];            // consumido pelo router (005)
  navItems?: FeatureNavItem[];       // consumido pela sidebar (010)
  permissions?: PermissionDefinition[]; // registrado no registry (009)
}
```

## Decisões técnicas

### Registro e montagem
- Cada feature exporta um `FeatureModule` pela sua API pública (`features/<x>/index.ts`).
- `featureRegistry` recebe a lista de módulos habilitados (definida por configuração da app, não pelo núcleo).
- No composition root (005), `buildFeatureRoutes` injeta as rotas no router e `buildFeatureNav` injeta os itens na sidebar (010); permissões são registradas no registry de 009.
- **Direção de dependência**: o núcleo define os contratos; as features os implementam. O núcleo nunca importa uma feature concreta (ver `hexagonal-architecture.md`). A app (borda) conhece a lista de features habilitadas.

### Navegação e permissões
- `navItems` podem declarar a permissão necessária; a sidebar (010) já filtra por permissão (009). Assim, registrar navegação e permissão fica coeso.

### Configurabilidade
- Habilitar/desabilitar features é configuração (env/config), não fork (ver `product.md` → Configurabilidade). Feature desabilitada não monta rotas, nav nem permissões.

### API pública e boundaries
- Cada feature expõe só o necessário por `index.ts`; internals permanecem privados. Uma feature consome outra apenas pela API pública. Sem dependências circulares (ver `frontend-architecture.md`).

## Documentação

- Guia "como adicionar uma feature": criar `features/<x>/`, implementar o `FeatureModule`, expor via `index.ts`, adicionar à lista de features habilitadas da app. Incluir exemplo mínimo.

## Testes

- Registrar uma feature de teste e verificar que suas rotas e itens de navegação aparecem sem editar o núcleo.
- Desabilitar a feature e verificar que nada é montado.
- Verificar que o núcleo não importa a feature concreta (dependência aponta para dentro).

## Riscos e mitigações

- **Núcleo conhecer features**: contratos no núcleo, lista de features na borda (app). Revisar imports.
- **Registro implícito frágil**: registro explícito via lista de módulos, não efeitos colaterais de import.
- **Acoplamento entre features**: só API pública; sem acesso a internals.

## Verificação

- Feature de exemplo registrada aparece em rotas e sidebar sem tocar no núcleo.
- Desabilitar a feature remove tudo dela da montagem.
- Documentação com passo a passo e exemplo mínimo presente.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
