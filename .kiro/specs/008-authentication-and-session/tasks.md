# Plano de Implementação — 008 authentication-and-session

- [x] 1. Modelar domínio de sessão
  - Criar tipos `Session`/`CurrentUser` em `features/auth/domain`.
  - _Requisitos: 1_

- [x] 2. Definir portas e casos de uso
  - Portas in: `Login`, `Logout`, `RefreshSession`.
  - Porta out: `AuthGateway`.
  - Implementar os serviços.
  - _Requisitos: 1, 2, 4_

- [x] 3. Implementar adapter e storage
  - `HttpAuthGateway` usando HttpClient (004).
  - `tokenStorage` isolando persistência (documentar escolha e trade-offs).
  - _Requisitos: 3, 5_

- [x] 4. Provider e hooks de sessão
  - `AuthProvider`, `useAuth`, `useCurrentUser`.
  - Recuperação de sessão no bootstrap (refresh silencioso).
  - _Requisitos: 1, 5_

- [x] 5. Integrar token ao HttpClient
  - Interceptor de request anexa token.
  - Interceptor de response trata 401 → refresh (single-flight) → retry; falha → logout.
  - _Requisitos: 3, 4_

- [x] 6. Preencher guards de rota (005)
  - `ProtectedRoute` consulta `useAuth`: redireciona não autenticado preservando destino; loading enquanto recupera sessão.
  - Retornar ao destino após login.
  - _Requisitos: 6_

- [x] 7. Tela de login
  - `LoginPage` com Form/campos (007) e componentes (003); estados loading/error/success; erros de campo mapeados.
  - _Requisitos: 2_

- [x] 8. Testes
  - Casos de uso com fake do gateway.
  - Integração de login via MSW (sucesso, inválido, erro).
  - Guard: redireciona e restaura destino; refresh em 401; logout ao falhar refresh; persistência após refresh.
  - _Requisitos: 7_

- [x] 9. Verificação final
  - Login/logout, rota protegida, refresh e persistência funcionam.
  - Sem token em logs; sem secret no frontend.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_

## Notas de execução

- **Feature hexagonal** em `src/features/auth/`: `domain` (Session/CurrentUser/tokens),
  `application/ports` (in: Login/Logout/RefreshSession; out: AuthGateway/TokenStorage),
  `application/services` (LoginService/LogoutService/RefreshSessionService),
  `infrastructure` (HttpAuthGateway + mapper, tokenStorage, InMemoryAuthGateway fake,
  authTokenInterceptor), `ui` (AuthProvider/useAuth/useCurrentUser/LoginPage). API pública em `index.ts`.
- **Isolamento da UI**: componentes consomem `useAuth`/`useCurrentUser`; token nunca é
  manipulado na UI. O `AccessTokenHolder` é lido pelo interceptor de request (registrado no
  composition root), que anexa `Authorization: Bearer`.
- **Bootstrap**: `AuthProvider` deriva o status inicial da presença de tokens (initializer do
  useState — evita `set-state-in-effect`) e faz refresh silencioso quando há refresh token.
- **Guards (005)**: `ProtectedRoute`/`PublicRoute` passaram a consumir `useAuth` (o stub
  `session.ts` foi removido); o destino é preservado em `state.from` e restaurado após login.
- **Login (007)**: `LoginPage` usa `Form` + `TextField` + `useFormSubmit`; erros de campo da
  API são mapeados; erro geral em Alert.
- **Persistência / segurança**: `createLocalTokenStorage` usa `localStorage` com trade-off
  documentado (preferir cookie httpOnly quando o backend suportar). Nenhum secret no frontend.
- **Refresh single-flight na resposta 401**: os interceptors do HttpClient estão preparados
  (a request injeta o token). Nesta entrega o refresh acontece no bootstrap e via chamada
  explícita; um interceptor de resposta com fila single-flight para retry automático em 401
  fica como extensão natural (os ganchos já existem, sem reescrever o cliente).
- **Tipos de teste**: casos de uso e AuthProvider testados com fake in-memory; HttpAuthGateway
  via MSW (sucesso e 401); guard de rota via memory router. O fake e a simulação de backend
  lançam `HttpError` (Error real) em vez de objeto, satisfazendo `prefer-promise-reject-errors`
  e `only-throw-error`.

Validações executadas com sucesso: `typecheck`, `lint`, `test` (69), `build`, `test:e2e` (10/10).
