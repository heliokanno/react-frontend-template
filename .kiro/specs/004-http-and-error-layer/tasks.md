# Plano de Implementação — 004 http-and-error-layer

- [ ] 1. Definir interface e config do HttpClient
  - Criar `HttpClient` (get/post/put/patch/delete) tipado.
  - Criar `httpConfig` (base URL de env, timeout, versionamento `/api/v1`).
  - _Requisitos: 1_

- [ ] 2. Implementar FetchHttpClient
  - Implementar sobre `fetch` com parsing JSON, timeout via `AbortController` e headers base.
  - Deixar ganchos de interceptors (request/response) para auth futura.
  - _Requisitos: 1, 6_

- [ ] 3. Definir contrato de erro
  - Criar tipo `ProblemDetail` (RFC 7807) incluindo campos de validação.
  - Criar `AppError` como discriminated union por categoria, preservando erros de campo.
  - _Requisitos: 2_

- [ ] 4. Implementar tradução de erro
  - `toAppError`: `ProblemDetail`/exceção → `AppError`.
  - `errorMessages`: `AppError` → mensagem de usuário, sem detalhes técnicos.
  - _Requisitos: 2, 3_

- [ ] 5. Definir contrato de porta de saída de exemplo
  - Criar uma porta `Repository` de exemplo no núcleo + adapter HTTP na infraestrutura com mapper `toDomain`/`toDto`.
  - Garantir que DTO não vaze para o domínio.
  - _Requisitos: 4_

- [ ] 6. Configurar TanStack Query v5
  - Criar `queryClient` com defaults (staleTime, retry com backoff, refetch consciente).
  - Criar helpers de `queryKeys` por feature.
  - _Requisitos: 5_

- [ ] 7. Padrão de estados assíncronos
  - Padronizar exposição idle/loading/success/error/empty para a UI consumir.
  - _Requisitos: 5_

- [ ] 8. Testes com MSW e fakes
  - Handlers MSW de sucesso e erro (`ProblemDetail`).
  - Testar adapter real, mapeamento e `toAppError`.
  - Testar caso de uso de exemplo com fake in-memory da porta.
  - _Requisitos: 7_

- [ ] 9. Verificação final
  - Requisição de exemplo retorna domínio mapeado; erro vira mensagem adequada.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 7_
