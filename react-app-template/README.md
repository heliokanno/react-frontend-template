# React App Template

Fundação técnica do template frontend React corporativo. Este diretório contém a aplicação; os artefatos do Kiro (specs, steerings, skills) ficam em `../.kiro/`.

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
src/
├── app/              # bootstrap, providers, routing (evolui nas specs 005+)
├── features/         # features de negócio (vazio no template)
├── shared/           # código realmente compartilhado (config, ui, utils)
└── infrastructure/   # HttpClient, storage, telemetry (evolui na spec 004)
```

A regra de dependência aponta para dentro: `UI → Application → Domain`; a infraestrutura
implementa as portas do núcleo. Nenhuma feature de negócio pertence ao núcleo reutilizável.

## Requisitos

- **Node.js**: versão LTS ativa (recomendado 22.12+; o Vite 7 avisa em versões anteriores).
- **pnpm**: gerenciado via Corepack (`corepack enable`), versão fixada no `package.json`.

## Comandos

```bash
pnpm install        # instala dependências
pnpm dev            # dev server (executar manualmente no terminal)
pnpm build          # build de produção
pnpm preview        # preview do build
pnpm lint           # ESLint
pnpm format         # Prettier (escrita)
pnpm typecheck      # checagem de tipos
pnpm test           # testes (single run)
pnpm test:watch     # testes em watch
pnpm test:e2e       # testes end-to-end (Playwright)
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

## Qualidade

- O `pre-commit` (Husky + lint-staged) roda ESLint e Prettier apenas nos arquivos em stage.
- O CI deve falhar em violações de lint, tipos ou testes.
