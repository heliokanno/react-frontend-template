# Plano de Implementação — 008 authentication-and-session

- [ ] 1. Modelar domínio de sessão
  - Criar tipos `Session`/`CurrentUser` em `features/auth/domain`.
  - _Requisitos: 1_

- [ ] 2. Definir portas e casos de uso
  - Portas in: `Login`, `Logout`, `RefreshSession`.
  - Porta out: `AuthGateway`.
  - Implementar os serviços.
  - _Requisitos: 1, 2, 4_

- [ ] 3. Implementar adapter e storage
  - `HttpAuthGateway` usando HttpClient (004).
  - `tokenStorage` isolando persistência (documentar escolha e trade-offs).
  - _Requisitos: 3, 5_

- [ ] 4. Provider e hooks de sessão
  - `AuthProvider`, `useAuth`, `useCurrentUser`.
  - Recuperação de sessão no bootstrap (refresh silencioso).
  - _Requisitos: 1, 5_

- [ ] 5. Integrar token ao HttpClient
  - Interceptor de request anexa token.
  - Interceptor de response trata 401 → refresh (single-flight) → retry; falha → logout.
  - _Requisitos: 3, 4_

- [ ] 6. Preencher guards de rota (005)
  - `ProtectedRoute` consulta `useAuth`: redireciona não autenticado preservando destino; loading enquanto recupera sessão.
  - Retornar ao destino após login.
  - _Requisitos: 6_

- [ ] 7. Tela de login
  - `LoginPage` com Form/campos (007) e componentes (003); estados loading/error/success; erros de campo mapeados.
  - _Requisitos: 2_

- [ ] 8. Testes
  - Casos de uso com fake do gateway.
  - Integração de login via MSW (sucesso, inválido, erro).
  - Guard: redireciona e restaura destino; refresh em 401; logout ao falhar refresh; persistência após refresh.
  - _Requisitos: 7_

- [ ] 9. Verificação final
  - Login/logout, rota protegida, refresh e persistência funcionam.
  - Sem token em logs; sem secret no frontend.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
