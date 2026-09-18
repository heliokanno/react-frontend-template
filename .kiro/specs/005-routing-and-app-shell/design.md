# Design — 005 routing-and-app-shell

## Visão geral

Monta a camada `app`: roteamento centralizado type-safe, estrutura de rotas públicas e protegidas, lazy loading, Error Boundaries com fallback por feature, providers globais e o composition root de injeção de dependências. Os guards de autenticação são estruturados aqui, mas a lógica efetiva de sessão é preenchida na spec 008.

Referências: `frontend-architecture.md` (Routing, App Layer, Error Boundaries, Lazy Loading), `hexagonal-architecture.md` (composition root, DI), `tech.md` (router).

## Estrutura

```text
src/app/
├── App.tsx                 # árvore raiz (providers + router)
├── providers/
│   ├── AppProviders.tsx    # compõe todos os providers
│   ├── ThemeProvider        (de 002)
│   └── QueryProvider.tsx    # QueryClientProvider (de 004)
├── router/
│   ├── router.tsx          # definição central de rotas
│   ├── routes.ts           # constantes de rota tipadas
│   ├── ProtectedRoute.tsx  # guard (estrutura; auth efetiva em 008)
│   └── PublicRoute.tsx
├── layouts/
│   ├── RootLayout.tsx      # layout base (shell administrativo em 010)
│   └── AuthLayout.tsx      # layout de páginas públicas (login em 008)
├── error/
│   ├── AppErrorBoundary.tsx # boundary raiz
│   ├── RouteErrorBoundary.tsx
│   └── NotFoundPage.tsx
└── di/
    └── container.ts        # composition root (fábricas de casos de uso)
```

## Decisões técnicas

### Router
- Router centralizado na camada `app` (React Router ou TanStack Router; preferir type-safe routes e lazy loading — ver `tech.md`).
- Rotas declaradas num único ponto; constantes de rota tipadas em `routes.ts` para evitar strings mágicas.
- Estrutura de rotas **públicas** (auth layout) e **protegidas** (root layout), com página 404 e página de erro.

### Guards
- `ProtectedRoute` e `PublicRoute` definem a estrutura de proteção. Neste estágio, o guard consulta um contrato de sessão ainda mínimo/stub; a spec 008 injeta a sessão real (`useAuth`). O objetivo é que 008 preencha a lógica sem reescrever o roteamento.

### Lazy loading
- Páginas e features grandes carregadas com `lazy` + `Suspense`, com fallback (Skeleton/Spinner de 003). Componentes pequenos não são divididos.

### Error Boundaries
- `AppErrorBoundary` na raiz evita que uma falha derrube tudo.
- `RouteErrorBoundary` por rota/feature dá fallback isolado (falha na feature B não destrói A e C).

### Providers
- `AppProviders` compõe ThemeProvider (002), QueryProvider (004), ToastProvider (003) e demais providers globais em ordem previsível.

### Composition root / DI
- `di/container.ts` é o único ponto de montagem: cria HttpClient, repositórios (adapters) e casos de uso, disponibilizando-os à UI via provider/factory. Sem instanciar adapters concretos dentro de domínio/aplicação (ver `hexagonal-architecture.md` → DI). Mantido simples e explícito, sem framework de DI próprio.

## Acessibilidade e UX

- Foco movido para o conteúdo principal ao trocar de rota (anúncio de navegação para leitores de tela).
- Páginas de erro e 404 com mensagem clara e caminho de recuperação (ver `ux-design.md`).

## Riscos e mitigações

- **Escolha do router**: decisão registrada no design; ambos atendem. Preferir type-safe routes.
- **Acoplar guard à auth cedo demais**: manter contrato de sessão como abstração, preenchido em 008.
- **Suspense sem fallback adequado**: sempre prover fallback de loading dos componentes de 003.

## Verificação

- Navegação entre rotas públicas e protegidas funciona; 404 e página de erro exibidas.
- Um erro lançado numa feature é contido pelo boundary da feature, sem derrubar o resto.
- Providers montados; casos de uso resolvidos via composition root.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
