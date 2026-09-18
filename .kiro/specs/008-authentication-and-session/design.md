# Design — 008 authentication-and-session

## Visão geral

Autenticação e sessão isoladas da UI, expostas por abstrações (`useAuth`, `useCurrentUser`, `login`, `logout`). A sessão é injetada nos guards estruturados na spec 005, a tela de login é montada com os componentes (003) e a infraestrutura de formulários (007), e o token é anexado às requisições via os interceptors do HttpClient (004). A UI nunca manipula detalhes de token diretamente.

Referências: `frontend-architecture.md` (Authentication), `frontend-engineering.md` (Authentication, Security), `tech.md` (JWT/OAuth2), `hexagonal-architecture.md` (ports/adapters), `testing.md`.

## Estrutura

```text
src/features/auth/
├── domain/
│   └── Session.ts            # tipos de sessão/usuário atual
├── application/
│   ├── ports/
│   │   ├── in/               # Login, Logout, RefreshSession (casos de uso)
│   │   └── out/AuthGateway.ts # porta de saída
│   └── services/             # implementações dos casos de uso
├── infrastructure/
│   ├── HttpAuthGateway.ts    # adapter HTTP (login/logout/refresh)
│   └── tokenStorage.ts       # persistência do token/sessão
├── ui/
│   ├── LoginPage.tsx         # form de login (003 + 007)
│   ├── AuthProvider.tsx      # provê estado de sessão
│   ├── useAuth.ts            # login/logout/estado
│   └── useCurrentUser.ts
└── index.ts                  # API pública da feature
```

## Decisões técnicas

### Abstrações de sessão
- `useAuth()` expõe `login`, `logout`, estado de autenticação e carregamento.
- `useCurrentUser()` expõe o usuário atual.
- A UI consome apenas essas abstrações; não conhece token, headers ou refresh (ver `frontend-engineering.md` → Authentication).

### Casos de uso e porta
- `Login`, `Logout`, `RefreshSession` como portas de entrada; `AuthGateway` como porta de saída, implementada por `HttpAuthGateway` (adapter usando HttpClient de 004).
- Montagem no composition root (005).

### Token e persistência
- Estratégia compatível com backend (JWT / OAuth2 Resource Server — ver `tech.md`).
- `tokenStorage` isola a persistência. Preferir mecanismo adequado ao risco (ex.: cookie httpOnly quando o backend suportar; caso contrário, storage com mitigação e ciente do trade-off de XSS). Documentar a escolha.
- **Nenhum secret embutido no frontend**; autorização real é do backend.

### Interceptors (preenche 004)
- Interceptor de request anexa o token; interceptor de response detecta 401 e dispara refresh (com fila para evitar múltiplos refresh concorrentes); em falha de refresh, encerra a sessão e redireciona ao login.

### Guards (preenche 005)
- `ProtectedRoute` passa a consultar `useAuth`: não autenticado → redireciona ao login preservando o destino; carregando → estado de loading.
- Recuperação de sessão no bootstrap (ex.: refresh silencioso) antes de decidir a rota.

### Tela de login
- `LoginPage` usa `Form`/campos de 007 e componentes de 003, com estados loading/error/success, erros de campo mapeados (007) e mensagens de usuário (004). Acessível e responsiva.

## Segurança

- Assumir que o código frontend é público; não guardar secrets.
- Não expor token em logs/observabilidade.
- UI de autorização não é mecanismo de segurança (reforçado em 009).

## Testes

- Casos de uso (Login/Logout/Refresh) com fake do `AuthGateway`.
- Integração de login via MSW (sucesso, credenciais inválidas, erro de servidor).
- Guard: rota protegida redireciona não autenticado e restaura destino após login.
- Refresh em 401 e logout ao falhar refresh.
- Persistência/recuperação de sessão após refresh da página.

## Riscos e mitigações

- **Armazenamento de token**: preferir cookie httpOnly quando possível; documentar trade-offs se usar storage.
- **Refresh concorrente**: fila/single-flight no interceptor.
- **Loops de redirecionamento**: estado de "carregando sessão" explícito antes de decidir guard.

## Verificação

- Login autentica e redireciona ao destino; logout encerra sessão.
- Rota protegida bloqueia não autenticado; sessão sobrevive a refresh.
- 401 dispara refresh; falha de refresh volta ao login.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
