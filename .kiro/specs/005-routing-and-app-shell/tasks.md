# Plano de Implementação — 005 routing-and-app-shell

- [ ] 1. Instalar e configurar o router
  - Adicionar o router escolhido (type-safe, lazy loading).
  - Criar `router.tsx` central e `routes.ts` com constantes tipadas.
  - _Requisitos: 1_

- [ ] 2. Compor providers globais
  - Criar `AppProviders` compondo Theme (002), Query (004) e Toast (003) em ordem previsível.
  - Montar em `App.tsx`.
  - _Requisitos: 5_

- [ ] 3. Definir layouts base
  - `RootLayout` (área autenticada, shell completo em 010) e `AuthLayout` (páginas públicas).
  - _Requisitos: 2_

- [ ] 4. Estruturar rotas públicas e protegidas
  - Criar `PublicRoute` e `ProtectedRoute` consumindo uma abstração de sessão (stub) a ser preenchida em 008.
  - Registrar rotas de exemplo pública e protegida.
  - _Requisitos: 2_

- [ ] 5. Implementar lazy loading
  - Carregar páginas com `lazy` + `Suspense`, fallback com Skeleton/Spinner.
  - _Requisitos: 3_

- [ ] 6. Implementar Error Boundaries
  - `AppErrorBoundary` raiz e `RouteErrorBoundary` por rota/feature com fallback e recuperação.
  - `NotFoundPage` (404) e página de erro.
  - _Requisitos: 4_

- [ ] 7. Implementar composition root
  - `di/container.ts` criando HttpClient, adapters e casos de uso; disponibilizar à UI via provider/factory.
  - Garantir que adapters não sejam instanciados no domínio/aplicação.
  - _Requisitos: 6_

- [ ] 8. Acessibilidade de navegação
  - Gerenciar foco na troca de rota; tornar navegação perceptível a leitores de tela.
  - _Requisitos: 7_

- [ ] 9. Verificação final
  - Navegação pública/protegida, 404 e página de erro funcionam.
  - Erro em feature é contido pelo boundary da feature.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6_
