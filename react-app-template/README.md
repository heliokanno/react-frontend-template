# React Frontend Template (monorepo)

Fundação frontend React corporativa, empacotada como **biblioteca distribuível**. Este
repositório é um monorepo pnpm:

```text
packages/core      → @hmk/react-admin-kit (biblioteca publicável)
apps/playground    → app de demonstração que consome a lib (não publicável)
```

O núcleo reutilizável (componentes, design system, auth, autorização de UI, camada HTTP)
vive em `packages/core`. O playground consome a lib pela sua **API pública**
(`@hmk/react-admin-kit/*`), validando o contrato como um consumidor real.

Para consumir a biblioteca em outro projeto, veja `packages/core/README.md`.

Os artefatos do Kiro (specs, steerings, skills) ficam em `../.kiro/`.

## Stack

- **React 19** + **TypeScript** (modo estrito)
- **Vite 7** (bundler e dev server)
- **pnpm** (gerenciador de pacotes, versão fixada em `packageManager`)
- **ESLint** + **Prettier** (com `eslint-plugin-jsx-a11y`)
- **Vitest** + **React Testing Library** + **MSW** (testes unit/componente/integração)
- **Playwright** (testes end-to-end)
- **Husky** + **lint-staged** (checagens em pre-commit)

> As decisões de stack seguem `../.kiro/steering/tech.md`. Versões pinadas priorizam
> compatibilidade estável entre as ferramentas do ecossistema.

## Estrutura de pastas

Organização por feature com camadas hexagonais (ver `../.kiro/steering/hexagonal-architecture.md`):

```text
packages/core/src/
├── entries/          # barrels públicos por subpath (ui, auth, http, ...)
├── features/         # features do núcleo (ex.: auth)
├── shared/           # ui, design-system, authorization, async
├── infrastructure/   # HttpClient, errors, query
└── styles/           # tokens.css, preset.css, styles.css (artefatos de estilo)

apps/playground/src/
├── app/              # bootstrap, providers, routing, composition root
├── config/           # env (import.meta.env) — fica no consumidor
└── demo/             # páginas/exemplos que consomem a lib
```

A regra de dependência aponta para dentro: `UI → Application → Domain`; a infraestrutura
implementa as portas do núcleo. Nenhuma feature de negócio pertence ao núcleo reutilizável.

## Requisitos

- **Node.js**: versão LTS ativa (recomendado 22.12+; o Vite 7 avisa em versões anteriores).
- **pnpm**: gerenciado via Corepack (`corepack enable`), versão fixada no `package.json`.

## Comandos

```bash
pnpm install        # instala dependências (todo o workspace)
pnpm dev            # dev server do playground (executar manualmente no terminal)
pnpm build          # build da lib (packages/core) + playground
pnpm build:lib      # build apenas da biblioteca
pnpm lint           # ESLint (monorepo)
pnpm format         # Prettier (escrita)
pnpm typecheck      # checagem de tipos (todos os pacotes)
pnpm test           # testes (todos os pacotes, single run)
pnpm test:e2e       # testes end-to-end (Playwright, no playground)
```

Comandos por pacote via `--filter`, por exemplo:

```bash
pnpm --filter @hmk/react-admin-kit build
pnpm --filter @hmk/react-admin-kit-playground dev
```

Antes do primeiro E2E, instale o navegador do Playwright:

```bash
pnpm exec playwright install chromium
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste os valores. Variáveis do frontend usam o
prefixo `VITE_` e são acessadas de forma tipada em `src/shared/config/env.ts`
(nunca via `import.meta.env` espalhado pelo código). Arquivos `.env` reais não são versionados.

## Design System

A linguagem visual é dirigida por **design tokens** (fonte única de verdade), com
**Tailwind CSS v4** consumindo esses tokens. Ver `.kiro/steering/design-system.md`.

```text
src/shared/design-system/
├── tokens/       # primitive → semantic (CSS variables)
├── theme/        # ThemeProvider, useTheme, ThemeToggle
└── reference/    # TokensReferencePage (documentação viva)
```

- **Tokens**: primitivos (valores brutos) em `tokens/primitives.css`; semânticos (por
  intenção de uso) em `tokens/semantic.css`. Componentes consomem apenas os semânticos.
- **Tema light/dark**: o `ThemeProvider` aplica a classe `.dark` no elemento raiz; os
  tokens semânticos mudam de valor por tema. Componentes **não** conhecem o tema — usam
  tokens. A preferência é persistida em `localStorage` e um script anti-FOUC no
  `index.html` aplica o tema antes da renderização.
- **Tailwind v4**: configurado via `@theme` em `src/index.css`, mapeando os utilitários
  para os tokens (ex.: `bg-surface-default`, `text-text-primary`). Breakpoints são valores
  literais (media queries não aceitam `var()`).
- **Ícones**: `lucide-react`. Ícones decorativos usam `aria-hidden`; ícones de ação têm
  nome acessível.
- **Página de referência**: a `TokensReferencePage` exibe cores, tipografia, espaçamento,
  radius e sombras, com toggle de tema — útil para validar a linguagem visual.

## Componentes (catálogo do núcleo)

Os primitivos reutilizáveis ficam em `src/shared/ui/`, com API pública em
`src/shared/ui/index.ts`. São construídos sobre os tokens do Design System e primitivos
headless do Radix, priorizando composição sobre configuração.

```text
src/shared/ui/
├── button/ input/ textarea/ label/ select/ checkbox/ radio-group/ switch/
├── alert/ badge/ toast/ tooltip/
├── dialog/ drawer/ dropdown/
├── skeleton/ spinner/ empty-state/ error-state/
└── index.ts
```

- **Composição**: componentes complexos expõem subcomponentes (ex.: `Dialog` →
  `DialogTrigger`/`DialogContent`/`DialogHeader`/...), evitando props booleanas em excesso.
- **Acessibilidade**: overlays (Dialog/Drawer/Dropdown/Tooltip) via Radix (foco, teclado,
  `Escape`); feedback comunicado por ícone + texto, não só cor; foco visível por token.
- **Providers**: `TooltipProvider` e `ToastProvider` são montados em `main.tsx`; use
  `useToast()` para disparar toasts.

## Camada de dados (HTTP e erros)

A comunicação com a API é centralizada; a UI nunca fala HTTP direto — consome casos de uso
que usam portas, implementadas por adapters na infraestrutura (ver
`.kiro/steering/hexagonal-architecture.md`).

```text
src/infrastructure/
├── http/     # HttpClient (interface), FetchHttpClient, httpConfig, exemplo de ports/adapter
├── errors/   # ProblemDetail (RFC 7807), AppError, toAppError, errorMessages
└── query/    # QueryClient (TanStack Query) e helpers de query keys
src/shared/async/  # AsyncState + toAsyncState (idle/loading/empty/success/error)
```

- **HttpClient**: `FetchHttpClient` sobre `fetch`, com base URL (`/api/v1`), timeout via
  `AbortController`, parsing JSON e interceptors (prontos para token/refresh na spec 008).
- **Erros**: respostas de erro seguem `ProblemDetail`; `toAppError` traduz para `AppError`
  (discriminated union por categoria) na borda; `getErrorMessage` converte em mensagem de
  usuário, sem vazar detalhes técnicos.
- **Server state**: `@tanstack/react-query` v5 com defaults consistentes (staleTime, retry
  seletivo por tipo de erro). Query keys padronizadas por feature via `createQueryKeys`.
- **Estados**: `toAsyncState` deriva os estados que a UI trata a partir de um `useQuery`.

## Roteamento e camada `app`

O roteamento é centralizado na camada `app`, com `react-router`. A UI é montada sobre
providers globais compostos e um composition root de injeção de dependências.

```text
src/app/
├── App.tsx              # boundary raiz + providers + RouterProvider
├── providers/           # AppProviders (Container→Query→Theme→Tooltip→Toast), QueryProvider
├── router/              # router.tsx, routes.ts (constantes tipadas), Protected/PublicRoute, session (stub)
├── layouts/             # RootLayout (área autenticada), AuthLayout (público)
├── error/               # AppErrorBoundary, RouteErrorBoundary, NotFoundPage
├── di/                  # container (composition root), ContainerProvider, useContainer
└── pages/               # páginas de exemplo (login placeholder, dashboard)
```

- **Rotas tipadas**: usar as constantes de `ROUTES` (evita strings mágicas).
- **Guards**: rotas protegidas passam por `ProtectedRoute`, que consome `useSession` (stub
  até a spec 008 — que injeta a autenticação real sem reescrever o roteamento).
- **Lazy loading**: páginas carregadas com `lazy` + `Suspense` (code splitting no build).
- **Error boundaries**: falhas de rota são contidas por `RouteErrorBoundary`; o
  `AppErrorBoundary` é a rede de segurança final. Rotas inexistentes exibem a página 404.
- **DI**: `createContainer` monta HttpClient e adapters; a UI recebe portas via
  `useContainer`, nunca implementações concretas.

## Data Grid

O grid reutilizável do núcleo fica em `src/shared/ui/data-grid/`, sobre `@tanstack/react-table`.
É composável: a feature fornece as colunas e os dados; o grid trata ordenação, seleção,
estados e responsividade.

- **Composição**: `DataGrid` + `DataGridColumnHeader` (sort/`aria-sort`), `DataGridToolbar`
  (busca + filtros), `DataGridPagination`, `DataGridRowActions`.
- **URL state**: `useDataGridUrlState` reflete busca, página e ordenação na URL (refresh,
  deep link e compartilhável). Por padrão o grid opera em modo server-side (`manual*`),
  cabendo à feature ligar os parâmetros à query.
- **Estados**: loading (skeleton de linhas), empty (EmptyState) e error (ErrorState com retry).
- **Exemplo**: rota `/examples/data-grid` (`DataGridExamplePage`) demonstra o uso ponta a ponta.

## Formulários

A infraestrutura de formulários fica em `src/shared/ui/form/`, sobre React Hook Form + Zod
(fonte única de schema e tipos). Os campos compõem os controles de `shared/ui`.

- **Form**: wrapper com `FormProvider` e submit; a validação vem do resolver Zod.
- **Campos**: `TextField`, `TextareaField`, `SelectField`, `CheckboxField` — associam
  label, descrição e erro de forma acessível (`aria-describedby`/`aria-invalid`).
- **Submissão**: `useFormSubmit` gerencia loading/success/error, bloqueia duplo submit e
  preserva os dados após falha.
- **Erros da API**: `applyApiErrors` mapeia erros de campo (`ProblemDetail`/`AppError`) para
  os campos; erros gerais viram mensagem para Alert/Toast.
- **Exemplo**: rota `/examples/form` (`FormExamplePage`).

## Autenticação e sessão

A autenticação é uma feature isolada em `src/features/auth/` (arquitetura hexagonal), com a
UI consumindo apenas abstrações — nunca detalhes de token.

- **Uso**: `useAuth()` (status, `user`, `login`, `logout`) e `useCurrentUser()`.
- **Camadas**: `domain` (Session), `application` (portas Login/Logout/RefreshSession +
  serviços), `infrastructure` (HttpAuthGateway + mapper, tokenStorage, fake in-memory,
  interceptor de token), `ui` (AuthProvider, hooks, LoginPage).
- **Token**: injetado nas requisições por um interceptor do HttpClient (o `AccessTokenHolder`
  é atualizado pela sessão). Componentes não manipulam token.
- **Sessão**: recuperada no bootstrap via refresh silencioso; persistida por `tokenStorage`
  (localStorage por padrão — veja o trade-off documentado no próprio arquivo; prefira cookie
  httpOnly quando o backend suportar).
- **Guards (005)**: `ProtectedRoute` usa `useAuth`, redireciona ao login preservando o destino
  e o restaura após autenticar. A tela de login usa a infraestrutura de formulários (007).

> Autorização real é sempre do backend; a UI não é mecanismo de segurança.

## Autorização (permissões)

A autorização de UI fica em `src/shared/authorization/`. Adapta a experiência conforme as
permissões do usuário (vindas da sessão). **É UX, não segurança — a autorização real é
sempre do backend.**

- **Modelo**: permissões tipadas no formato `recurso:ação` (ex.: `products:create`).
- **Gating declarativo**: `<Can permission="...">...</Can>` (com `fallback` opcional).
- **Programático**: `useHasPermission('recurso:ação')`.
- **Guard de rota**: `ProtectedByPermission` exibe a `ForbiddenPage` (403) quando falta a
  permissão; um 403 da API converge para a mesma experiência.
- **Extensível**: `createPermissionRegistry` permite que features declarem suas permissões
  sem editar o núcleo (conectado ao mecanismo de composição na spec 011).
- As permissões vêm do `CurrentUser` da sessão; a camada `app` (`PermissionBridge`) injeta-as
  no `PermissionProvider`, mantendo `shared/authorization` livre de acoplamento a features.

## Qualidade

- O `pre-commit` (Husky + lint-staged) roda ESLint e Prettier apenas nos arquivos em stage.
- O CI deve falhar em violações de lint, tipos ou testes.
