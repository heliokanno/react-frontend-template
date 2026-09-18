# Plano de Implementação — 005 routing-and-app-shell

- [x] 1. Instalar e configurar o router
  - Adicionar o router escolhido (type-safe, lazy loading).
  - Criar `router.tsx` central e `routes.ts` com constantes tipadas.
  - _Requisitos: 1_

- [x] 2. Compor providers globais
  - Criar `AppProviders` compondo Theme (002), Query (004) e Toast (003) em ordem previsível.
  - Montar em `App.tsx`.
  - _Requisitos: 5_

- [x] 3. Definir layouts base
  - `RootLayout` (área autenticada, shell completo em 010) e `AuthLayout` (páginas públicas).
  - _Requisitos: 2_

- [x] 4. Estruturar rotas públicas e protegidas
  - Criar `PublicRoute` e `ProtectedRoute` consumindo uma abstração de sessão (stub) a ser preenchida em 008.
  - Registrar rotas de exemplo pública e protegida.
  - _Requisitos: 2_

- [x] 5. Implementar lazy loading
  - Carregar páginas com `lazy` + `Suspense`, fallback com Skeleton/Spinner.
  - _Requisitos: 3_

- [x] 6. Implementar Error Boundaries
  - `AppErrorBoundary` raiz e `RouteErrorBoundary` por rota/feature com fallback e recuperação.
  - `NotFoundPage` (404) e página de erro.
  - _Requisitos: 4_

- [x] 7. Implementar composition root
  - `di/container.ts` criando HttpClient, adapters e casos de uso; disponibilizar à UI via provider/factory.
  - Garantir que adapters não sejam instanciados no domínio/aplicação.
  - _Requisitos: 6_

- [x] 8. Acessibilidade de navegação
  - Gerenciar foco na troca de rota; tornar navegação perceptível a leitores de tela.
  - _Requisitos: 7_

- [x] 9. Verificação final
  - Navegação pública/protegida, 404 e página de erro funcionam.
  - Erro em feature é contido pelo boundary da feature.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6_

## Notas de execução

- **Router**: `react-router` 7.18.4 (linha estável; v8 exige React ≥19.2.7 e é o major mais
  novo — preferida a linha madura). Rotas centrais em `app/router/router.tsx`, constantes
  tipadas em `app/router/routes.ts`.
- **Guards**: `ProtectedRoute`/`PublicRoute` consomem `useSession` — um **stub** que retorna
  `unauthenticated`; a spec 008 substitui pela sessão real sem reescrever o roteamento. O
  destino é preservado em `state.from` no redirecionamento ao login.
- **Layouts**: `RootLayout` (área autenticada; shell completo na spec 010, com foco no
  conteúdo ao trocar de rota) e `AuthLayout` (páginas públicas).
- **Lazy loading**: `TokensReferencePage` e `DashboardPage` carregadas com `lazy`+`Suspense`
  (o build gera chunks separados). Fallback com `Spinner`.
- **Error boundaries**: `AppErrorBoundary` (classe, raiz) + `RouteErrorBoundary`
  (`errorElement` por rota, com 404 dedicado) + `NotFoundPage`.
- **Composition root**: `app/di/container.ts` cria HttpClient e adapters e expõe as portas
  via `ContainerProvider`/`useContainer`; a UI recebe portas, não implementações.
- **Providers**: `AppProviders` compõe Container → Query → Theme → Tooltip → Toast.
- **Fluxo validado**: `DashboardPage` consome o gateway de exemplo via container + TanStack
  Query, com estados loading/error/success (`toAsyncState`).
- **Ajuste**: `toAppError` tornou-se idempotente (passa AppError adiante) e `toAsyncState`
  normaliza o erro na leitura, evitando lançar objetos não-Error (regra `only-throw-error`).

Validações executadas com sucesso: `typecheck`, `lint`, `test` (45), `build`, `test:e2e` (7/7).
