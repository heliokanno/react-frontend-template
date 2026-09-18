# Design — 004 http-and-error-layer

## Visão geral

Camada de comunicação com a API e tratamento de erros, respeitando a regra de dependência (UI → Ports → Application → Domain). Entrega: HttpClient central, contrato `ProblemDetail`, mapeamento para erros de aplicação tipados, tradução para mensagens de usuário na borda, portas de saída no núcleo com adapters HTTP na infraestrutura, e a configuração do TanStack Query v5.

Referências: `hexagonal-architecture.md` (autoridade de fronteiras), `frontend-architecture.md` (API Architecture, Error Handling), `tech.md`, `testing.md`.

## Fluxo de dados

```text
UI (hook) → Caso de uso (porta in) → Porta out (Repository) → Adapter HTTP → HttpClient → API
                                                                   │
                                                          toDto / toDomain (mapper na borda)
```

A UI consome casos de uso; nunca fala HTTP direto. O DTO é mapeado para domínio no adapter.

## Estrutura

```text
src/infrastructure/
├── http/
│   ├── HttpClient.ts          # interface do cliente
│   ├── FetchHttpClient.ts     # implementação sobre fetch
│   ├── httpConfig.ts          # base URL, timeout, versionamento
│   └── interceptors.ts        # hooks de request/response (auth em 008)
├── errors/
│   ├── ProblemDetail.ts       # tipo do contrato RFC 7807
│   ├── AppError.ts            # erro de aplicação estruturado
│   ├── toAppError.ts          # ProblemDetail/exception → AppError
│   └── errorMessages.ts       # tradução AppError → mensagem de usuário
└── query/
    ├── queryClient.ts         # QueryClient configurado
    └── queryKeys.ts           # helpers de query keys por feature
```

Portas de saída (interfaces) vivem no núcleo de cada feature (`features/<x>/application/ports/out/`); seus adapters concretos ficam na infraestrutura da feature. A infraestrutura compartilhada aqui fornece o HttpClient e o tratamento de erro base.

## Decisões técnicas

### HttpClient
- Interface `HttpClient` (`get/post/put/patch/delete`) com genéricos tipados.
- Implementação padrão sobre **fetch** nativo; axios só se interceptors justificarem (ver `tech.md`).
- Responsabilidades: base URL, headers, timeout (via `AbortController`), parsing JSON, versionamento `/api/v1`. Sem regra de negócio.
- Pontos de extensão (interceptors) para injeção de token/refresh na spec 008 — aqui ficam preparados, não preenchidos.

### Contrato de erro
- `ProblemDetail` conforme RFC 7807 (`type`, `title`, `status`, `detail`, `instance`, mais campos de validação quando houver).
- `AppError` como discriminated union por categoria (ex.: `network`, `timeout`, `unauthorized`, `forbidden`, `notFound`, `validation`, `server`, `unknown`), preservando erros de campo para formulários.
- `toAppError` traduz `ProblemDetail`/exceções em `AppError`.
- `errorMessages` traduz `AppError` em mensagem de usuário na borda de apresentação. Nunca expõe stack/status cru.

```text
Infrastructure Error → AppError (Application) → mensagem (Presentation)
```

### Ports e mapeamento
- Acesso a dados via porta de saída (`Repository`) definida no núcleo; adapter HTTP implementa a porta e faz `toDomain`/`toDto` na borda.
- DTO nunca vaza para o domínio. Sem mapeamento artificial quando DTO ≡ domínio (ver `frontend-architecture.md` → DTOs).

### TanStack Query v5
- `queryClient` com defaults consistentes (staleTime, retry com backoff, refetch on window focus configurado conscientemente).
- `queryKeys` padronizadas por feature (factory helpers) para invalidation previsível.
- Server state não é duplicado em store global.
- Mutations com invalidation/optimistic update quando apropriado.

### Concorrência e cancelamento
- `AbortController` no HttpClient; o TanStack Query cancela queries obsoletas, evitando que resposta antiga sobrescreva recente.

## Testes

- **MSW** mocka a fronteira de rede (handlers de sucesso e erro, incluindo `ProblemDetail`), exercitando o adapter real.
- Casos de uso testados com **fakes in-memory** das portas.
- Mapeamento DTO ↔ domínio e `toAppError` cobertos por testes unitários.

## Riscos e mitigações

- **Acoplamento a formato de erro do backend**: isolar no `toAppError`; um único ponto muda se o contrato evoluir.
- **Config de Query inadequada**: documentar defaults e permitir override por query; evitar retry agressivo em erros 4xx.
- **Interceptors de auth**: manter apenas os ganchos aqui; a lógica de token entra na 008 sem reescrever o cliente.

## Verificação

- Requisição de exemplo passa pelo HttpClient e retorna domínio mapeado.
- Erro `ProblemDetail` vira `AppError` e mensagem de usuário adequada (sem detalhes técnicos).
- Testes com MSW (sucesso e erro) e testes de mapeamento passam.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
