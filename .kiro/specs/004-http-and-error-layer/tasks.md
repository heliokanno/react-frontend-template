# Plano de Implementação — 004 http-and-error-layer

- [x] 1. Definir interface e config do HttpClient
  - Criar `HttpClient` (get/post/put/patch/delete) tipado.
  - Criar `httpConfig` (base URL de env, timeout, versionamento `/api/v1`).
  - _Requisitos: 1_

- [x] 2. Implementar FetchHttpClient
  - Implementar sobre `fetch` com parsing JSON, timeout via `AbortController` e headers base.
  - Deixar ganchos de interceptors (request/response) para auth futura.
  - _Requisitos: 1, 6_

- [x] 3. Definir contrato de erro
  - Criar tipo `ProblemDetail` (RFC 7807) incluindo campos de validação.
  - Criar `AppError` como discriminated union por categoria, preservando erros de campo.
  - _Requisitos: 2_

- [x] 4. Implementar tradução de erro
  - `toAppError`: `ProblemDetail`/exceção → `AppError`.
  - `errorMessages`: `AppError` → mensagem de usuário, sem detalhes técnicos.
  - _Requisitos: 2, 3_

- [x] 5. Definir contrato de porta de saída de exemplo
  - Criar uma porta `Repository` de exemplo no núcleo + adapter HTTP na infraestrutura com mapper `toDomain`/`toDto`.
  - Garantir que DTO não vaze para o domínio.
  - _Requisitos: 4_

- [x] 6. Configurar TanStack Query v5
  - Criar `queryClient` com defaults (staleTime, retry com backoff, refetch consciente).
  - Criar helpers de `queryKeys` por feature.
  - _Requisitos: 5_

- [x] 7. Padrão de estados assíncronos
  - Padronizar exposição idle/loading/success/error/empty para a UI consumir.
  - _Requisitos: 5_

- [x] 8. Testes com MSW e fakes
  - Handlers MSW de sucesso e erro (`ProblemDetail`).
  - Testar adapter real, mapeamento e `toAppError`.
  - Testar caso de uso de exemplo com fake in-memory da porta.
  - _Requisitos: 7_

- [x] 9. Verificação final
  - Requisição de exemplo retorna domínio mapeado; erro vira mensagem adequada.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 7_

## Notas de execução

- **Stack instalada**: `@tanstack/react-query` 5.103.1 (compatível com React 19).
- **Estrutura**: `src/infrastructure/http` (HttpClient, FetchHttpClient, httpConfig),
  `src/infrastructure/errors` (ProblemDetail, AppError, toAppError, errorMessages),
  `src/infrastructure/query` (queryClient, queryKeys), `src/shared/async` (asyncState).
- **Exemplo de ports & adapters**: `http/example` (`ServiceInfoGateway` porta,
  `HttpServiceInfoGateway` adapter com mapper DTO→modelo, `InMemoryServiceInfoGateway` fake).
  É referência do padrão, não domínio de negócio (que chega na spec 012).
- **Interceptors**: o FetchHttpClient aceita request/response interceptors; ficam prontos
  para a injeção de token/refresh na spec 008, sem reescrever o cliente.
- **Estados assíncronos**: `toAsyncState` deriva idle/loading/empty/success/error de um
  resultado de `useQuery`, com erros já normalizados para `AppError`.
- **Ajuste de qualidade**: o script `typecheck` passou a usar `tsc -b --noEmit` — o
  `tsc --noEmit` no tsconfig-solução não checava os projetos referenciados a fundo (erros de
  `exactOptionalPropertyTypes` escapavam do typecheck e só apareciam no build). Agora
  typecheck e build detectam os mesmos erros.

Validações executadas com sucesso: `typecheck`, `lint`, `test` (42), `build`, `test:e2e` (5/5).
