# Design — 012 dashboard-and-example-feature

## Visão geral

Valida o template ponta a ponta com dois entregáveis de referência: um **dashboard base** orientado a decisões e uma **feature de negócio de exemplo** (Products) que compõe Data Grid (006), Forms (007), rotas (005), sessão (008) e permissões (009), registrando-se via o mecanismo de extensibilidade (011). A feature é isolada e descartável; serve de guia para projetos derivados sem acoplar o núcleo.

Referências: `product.md` (Núcleo × Negócio, referência), `ux-design.md` (Dashboards), `frontend-architecture.md`/`hexagonal-architecture.md` (camadas por feature), `testing.md` (E2E).

## Dashboard

```text
src/features/dashboard/
├── ui/DashboardPage.tsx
└── index.ts   # FeatureModule (rota + nav)
```

- Orientado a decisões: identifica o que o usuário precisa decidir/agir, não uma coleção de cards (ver `ux-design.md` → Dashboards).
- Estados loading/empty/error tratados; dados via TanStack Query (004) com fonte placeholder/mock no template.
- Sem estética genérica (AI Aesthetic Prevention).

## Feature de exemplo: Products (referência)

Estrutura hexagonal completa por feature, como modelo para projetos derivados:

```text
src/features/products/
├── domain/
│   ├── Product.ts             # entidade + tipos
│   └── errors.ts              # erros de domínio
├── application/
│   ├── ports/
│   │   ├── in/                # ListProducts, CreateProduct, UpdateProduct, DeleteProduct
│   │   └── out/ProductRepository.ts
│   └── services/              # implementações dos casos de uso
├── infrastructure/
│   ├── HttpProductRepository.ts # adapter (mappers DTO↔domínio)
│   └── InMemoryProductRepository.ts # fake para testes
├── ui/
│   ├── ProductsPage.tsx       # Data Grid (006) + filtros/URL state
│   ├── ProductFormDialog.tsx  # Form (007) create/update
│   ├── schema.ts              # Zod
│   └── hooks/                 # useProducts, useCreateProduct, ...
└── index.ts                   # API pública + FeatureModule
```

## Decisões técnicas

### Composição do núcleo
- **Listagem**: `ProductsPage` usa o Data Grid (006) com ordenação/filtros/paginação e URL state; dados via casos de uso → porta → adapter HTTP (004) sob TanStack Query.
- **Formulário**: `ProductFormDialog` usa Form/campos (007) com schema Zod; create/update com estados de submissão e mapeamento de erros de campo da API.
- **Rotas/nav/permissões**: registradas via `FeatureModule` (011); ações e itens de menu gated por permissão (009); rotas protegidas por sessão (008).
- **Feedback**: toasts/alerts (003); ações destrutivas (excluir) com confirmação adequada (ver `ux-design.md` → Destructive Actions).

### Isolamento núcleo × negócio
- A feature não modifica nem duplica o núcleo; consome os blocos reutilizáveis. Pode ser removida (desabilitando o módulo) sem afetar o núcleo (ver `product.md`).
- Domínio não importa React/HTTP; adapters na infraestrutura; DTO mapeado na borda.

## Testes

- **Unit**: casos de uso de Products com `InMemoryProductRepository`; mappers DTO↔domínio; regras de domínio.
- **Component/Integration**: `ProductsPage` (listagem com MSW, estados), `ProductFormDialog` (validação, submissão, erros de campo).
- **E2E (Playwright)**: fluxo crítico — login → navegar até Products → criar produto → vê-lo na listagem; e acesso negado por permissão.

## Riscos e mitigações

- **Feature acoplar o núcleo**: revisar imports; núcleo agnóstico; feature registrada por composição.
- **Dashboard virar coleção de cards**: partir de decisões do usuário (ver `ux-design.md`).
- **Escopo do exemplo**: manter Products enxuto (CRUD de referência), sem virar produto real.

## Verificação

- Dashboard e CRUD de Products funcionam ponta a ponta compondo o núcleo.
- Fluxo crítico coberto por E2E; permissões e sessão respeitadas.
- Desabilitar a feature Products a remove sem afetar o núcleo.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build` passam.
