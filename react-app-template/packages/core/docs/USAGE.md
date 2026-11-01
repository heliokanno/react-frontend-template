# Guia de uso — @hmk/react-admin-kit

Guia prático para consumir a biblioteca em um projeto React. Cobre instalação, estilos, cada entry point, autenticação, autorização, formulários, data grid e o fluxo de montagem (composition root).

> A autorização desta lib é de **UX** (ocultar/desabilitar). A autorização real é sempre do backend.

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Estilos e tema](#estilos-e-tema)
4. [Entry points](#entry-points)
5. [Montagem (composition root)](#montagem-composition-root)
6. [Camada HTTP](#camada-http)
7. [Server state com TanStack Query](#server-state-com-tanstack-query)
8. [Autenticação e sessão](#autenticação-e-sessão)
9. [Autorização de UI](#autorização-de-ui)
10. [Componentes](#componentes)
11. [Formulários](#formulários)
12. [Data Grid](#data-grid)
13. [Tratamento de erros](#tratamento-de-erros)
14. [Perguntas frequentes](#perguntas-frequentes)

---

## Pré-requisitos

- **React 18.2+ ou 19** (`react`, `react-dom`).
- **Tailwind CSS v4** se você usar o caminho de estilos recomendado (há um fallback sem Tailwind).
- Peers opcionais conforme o que usar: `@tanstack/react-query`, `react-hook-form`, `zod`, `react-router`.

## Instalação

```bash
pnpm add @hmk/react-admin-kit
pnpm add react react-dom
# conforme o uso:
pnpm add @tanstack/react-query react-hook-form zod react-router
```

| Peer                     | Exigida por             | Obrigatória |
| ------------------------ | ----------------------- | ----------- |
| `react`, `react-dom`     | tudo                    | sim         |
| `@tanstack/react-query`  | `/query`, dados de API  | opcional    |
| `react-hook-form`, `zod` | formulários em `/ui`    | opcional    |
| `react-router`           | guards/rotas no seu app | opcional    |

---

## Estilos e tema

Os componentes usam Tailwind v4 dirigido por tokens. Escolha **uma** das opções.

### Opção A — Preset Tailwind v4 (recomendado)

Melhor tree-shaking: o Tailwind do seu projeto escaneia os componentes da lib e emite só as classes usadas.

```css
/* src/index.css (ou seu CSS global) */
@import '@hmk/react-admin-kit/tokens.css';
@import 'tailwindcss';
@import '@hmk/react-admin-kit/tailwind-preset.css';

/* inclua os componentes da lib no scan do Tailwind */
@source '../node_modules/@hmk/react-admin-kit/dist';
```

### Opção B — CSS pré-compilado (sem Tailwind)

```ts
// no entry da sua app (ex.: main.tsx)
import '@hmk/react-admin-kit/styles.css';
```

### Tema claro/escuro

O tema é controlado pela classe `.dark` na raiz do documento, gerenciada pelo `ThemeProvider`. Os componentes **não conhecem** o tema — consomem tokens semânticos.

```tsx
import { ThemeProvider, ThemeToggle } from '@hmk/react-admin-kit/design-system';

<ThemeProvider>
  <ThemeToggle />
  {/* app */}
</ThemeProvider>;
```

Para evitar flash de tema (FOUC), aplique o tema antes da renderização com um script inline no `index.html`:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme-preference');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = stored === 'dark' || ((stored === null || stored === 'system') && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
    } catch (e) {}
  })();
</script>
```

---

## Entry points

Importe apenas o subpath que usa (melhor tree-shaking que o raiz):

```ts
import { Button, Form, DataGrid /* ... */ } from '@hmk/react-admin-kit/ui';
import { ThemeProvider, useTheme, ThemeToggle } from '@hmk/react-admin-kit/design-system';
import { Can, useHasPermission, PermissionProvider } from '@hmk/react-admin-kit/authorization';
import { AuthProvider, useAuth, useCurrentUser } from '@hmk/react-admin-kit/auth';
import { createHttpConfig, FetchHttpClient, toAppError } from '@hmk/react-admin-kit/http';
import { createQueryClient, createQueryKeys } from '@hmk/react-admin-kit/query';
```

O entry raiz `@hmk/react-admin-kit` reexporta o conjunto estável, útil para protótipos.

---

## Montagem (composition root)

A lib não lê variáveis de ambiente do seu bundler — você injeta a configuração num único ponto de montagem. Exemplo típico:

```tsx
// app/di/container.ts
import {
  createAccessTokenHolder,
  createAuthRequestInterceptor,
  createLocalTokenStorage,
  HttpAuthGateway,
  LoginService,
  LogoutService,
  RefreshSessionService,
} from '@hmk/react-admin-kit/auth';
import { createHttpConfig, FetchHttpClient } from '@hmk/react-admin-kit/http';

export function createContainer() {
  const tokenHolder = createAccessTokenHolder();

  const httpConfig = createHttpConfig({
    apiOrigin: import.meta.env.VITE_API_BASE_URL, // a origem da SUA app
    // timeoutMs e apiVersionPrefix são opcionais (defaults: 15000ms, '/api/v1')
  });

  const httpClient = new FetchHttpClient({
    config: httpConfig,
    requestInterceptors: [createAuthRequestInterceptor(tokenHolder)],
  });

  const authGateway = new HttpAuthGateway(httpClient);

  return {
    httpClient,
    auth: {
      login: new LoginService(authGateway),
      logout: new LogoutService(authGateway),
      refreshSession: new RefreshSessionService(authGateway),
      tokenStorage: createLocalTokenStorage(),
      tokenHolder,
    },
  };
}
```

Providers na raiz da aplicação:

```tsx
import { ThemeProvider } from '@hmk/react-admin-kit/design-system';
import { ToastProvider, TooltipProvider } from '@hmk/react-admin-kit/ui';
import { AuthProvider } from '@hmk/react-admin-kit/auth';
import { PermissionProvider } from '@hmk/react-admin-kit/authorization';

const container = createContainer();

export function AppProviders({ children }) {
  return (
    <AuthProvider {...container.auth}>
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>{children}</ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

## Camada HTTP

`createHttpConfig` monta a base URL e o timeout; `FetchHttpClient` é o cliente sobre `fetch` com interceptors.

```ts
import { createHttpConfig, FetchHttpClient } from '@hmk/react-admin-kit/http';

const config = createHttpConfig({ apiOrigin: 'https://api.exemplo.com' });
// config.baseUrl === 'https://api.exemplo.com/api/v1'

const http = new FetchHttpClient({ config });

const users = await http.get<User[]>('/users', { query: { page: 1 } });
await http.post('/users', { name: 'Ana' });
```

O cliente lança `HttpError` (resposta não-ok) e `TimeoutError`, normalizados por `toAppError` (ver [Tratamento de erros](#tratamento-de-erros)).

### Isolando o acesso a dados (ports/adapters)

Recomenda-se envolver o `HttpClient` atrás de um gateway por recurso, mapeando o DTO da API para o seu modelo:

```ts
import type { HttpClient } from '@hmk/react-admin-kit/http';

export class HttpUserGateway {
  constructor(private readonly http: HttpClient) {}
  async findAll(): Promise<User[]> {
    const dtos = await this.http.get<UserDto[]>('/users');
    return dtos.map(toDomain);
  }
}
```

---

## Server state com TanStack Query

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient, createQueryKeys } from '@hmk/react-admin-kit/query';

const queryClient = createQueryClient(); // cache/retry padronizados

const userKeys = createQueryKeys('users');
// userKeys.all           → ['users']
// userKeys.list({ page }) → ['users', 'list', { page }]
// userKeys.detail(id)    → ['users', 'detail', id]

<QueryClientProvider client={queryClient}>{/* app */}</QueryClientProvider>;
```

`createQueryClient` já define `staleTime`, `gcTime`, política de retry (não repete 401/403/404/422/409) e normaliza erros para `AppError`.

---

## Autenticação e sessão

O `AuthProvider` recebe os casos de uso do composition root e expõe a sessão via hooks. A UI nunca manipula token.

```tsx
import { useAuth, useCurrentUser } from '@hmk/react-admin-kit/auth';

function Header() {
  const { status, logout } = useAuth(); // status: 'loading' | 'authenticated' | 'unauthenticated'
  const user = useCurrentUser(); // CurrentUser | null

  if (status === 'loading') return <span>Carregando…</span>;
  return (
    <div>
      <span>{user?.name}</span>
      <button onClick={() => logout()}>Sair</button>
    </div>
  );
}
```

Login (a lib traz uma `LoginPage` pronta, mas você pode construir a sua):

```tsx
import { useAuth } from '@hmk/react-admin-kit/auth';

const { login } = useAuth();
await login({ email, password }); // lança em caso de credenciais inválidas
```

- A sessão é recuperada no bootstrap (refresh silencioso se houver refresh token).
- O token é anexado às requisições pelo interceptor registrado no composition root.
- Persistência padrão via `localStorage` (`createLocalTokenStorage`); prefira cookie httpOnly quando o backend suportar.

### Guard de rota (com react-router)

```tsx
import { useAuth } from '@hmk/react-admin-kit/auth';
import { Navigate, useLocation } from 'react-router';

function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <Spinner />;
  if (status === 'unauthenticated')
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
```

---

## Autorização de UI

As permissões vêm do backend (em `CurrentUser.permissions`). Disponibilize-as com o `PermissionProvider` e consuma com `Can` / `useHasPermission`.

```tsx
import { PermissionProvider, Can, useHasPermission } from '@hmk/react-admin-kit/authorization';
import { useCurrentUser } from '@hmk/react-admin-kit/auth';

// Ponte sessão → permissões (fica na SUA app, mantendo o núcleo desacoplado):
function PermissionBridge({ children }) {
  const user = useCurrentUser();
  return <PermissionProvider permissions={user?.permissions ?? []}>{children}</PermissionProvider>;
}

// Esconder/exibir por permissão:
<Can permission="products:create" fallback={null}>
  <Button>Novo produto</Button>
</Can>;

// Em lógica:
const canDelete = useHasPermission('products:delete');
<Button disabled={!canDelete}>Excluir</Button>;
```

Lembrete: isto adapta a UI. Nunca trate como mecanismo de segurança.

---

## Componentes

Disponíveis em `@hmk/react-admin-kit/ui`. Alguns exemplos:

```tsx
import {
  Button, Input, Label, Textarea, Checkbox, Switch, RadioGroup,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Alert, Badge, Tooltip, TooltipTrigger, TooltipContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  Drawer, Dropdown, DropdownTrigger, DropdownContent, DropdownItem,
  Skeleton, Spinner, EmptyState, ErrorState,
  useToast,
} from '@hmk/react-admin-kit/ui';

<Button>Salvar</Button>
<Button variant="secondary">Cancelar</Button>

// Overlays via composição:
<Dialog>
  <DialogTrigger asChild><Button>Abrir</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Confirmar</DialogTitle></DialogHeader>
    {/* ... */}
  </DialogContent>
</Dialog>

// Toast (precisa do ToastProvider na raiz):
const { toast } = useToast();
toast({ title: 'Salvo', variant: 'success' });
```

Estados prontos para páginas assíncronas: `Skeleton` (loading), `EmptyState` (vazio), `ErrorState` (erro, com retry).

---

## Formulários

React Hook Form + Zod como fonte única de schema. `useFormSubmit` cuida de loading/success/error, bloqueia submissão dupla, preserva dados após falha e mapeia erros da API para os campos.

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, TextField, Button, Alert, useFormSubmit } from '@hmk/react-admin-kit/ui';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
});
type Values = z.infer<typeof schema>;

function CreateUserForm({ onCreate }: { onCreate: (v: Values) => Promise<void> }) {
  const form = useForm<Values>({ resolver: zodResolver(schema) });
  const { submitHandler, status, generalError, isSubmitting } = useFormSubmit({
    form,
    onSubmit: onCreate,
  });

  return (
    <Form form={form} onSubmit={submitHandler} aria-label="Criar usuário">
      {generalError && <Alert variant="error">{generalError}</Alert>}
      <TextField name="name" label="Nome" />
      <TextField name="email" label="E-mail" type="email" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Salvar'}
      </Button>
      {status === 'success' && <Alert variant="success">Usuário criado.</Alert>}
    </Form>
  );
}
```

Campos disponíveis: `TextField`, `TextareaField`, `CheckboxField`, `SelectField`. Erros de validação do backend (contrato `ProblemDetail`) são mapeados automaticamente ao campo correspondente.

---

## Data Grid

Tabela sobre TanStack Table com ordenação, paginação, estado na URL e estados de loading/empty/error. As colunas usam a API do `@tanstack/react-table` (instale essa peer).

```tsx
import { type ColumnDef } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridToolbar,
  DataGridPagination,
  useDataGridUrlState,
} from '@hmk/react-admin-kit/ui';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Nome" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataGridColumnHeader column={column} title="E-mail" />,
  },
];

function UsersTable({ data, isLoading, error }) {
  const urlState = useDataGridUrlState(); // search/page/sort sincronizados na URL
  return (
    <>
      <DataGridToolbar urlState={urlState} />
      <DataGrid columns={columns} data={data} isLoading={isLoading} error={error} />
      <DataGridPagination urlState={urlState} />
    </>
  );
}
```

---

## Tratamento de erros

Erros técnicos (`HttpError`, `TimeoutError`, falha de rede) são normalizados em `AppError` — uma discriminated union por categoria — para a UI decidir a mensagem.

```ts
import { toAppError, type AppError } from '@hmk/react-admin-kit/http';

try {
  await http.get('/users');
} catch (error) {
  const appError: AppError = toAppError(error);
  switch (appError.kind) {
    case 'unauthorized':
      /* redirecionar ao login */ break;
    case 'notFound':
      /* 404 contextual */ break;
    case 'validation':
      /* appError.fieldErrors */ break;
    default: /* mensagem genérica */
  }
}
```

Categorias: `network`, `timeout`, `unauthorized`, `forbidden`, `notFound`, `validation`, `conflict`, `server`, `unknown`. Nunca exiba `detail`/stack ao usuário — use-o só em observabilidade.

---

## Perguntas frequentes

**Preciso usar Tailwind?** Não. Use `@hmk/react-admin-kit/styles.css` (CSS pré-compilado). Com Tailwind v4, prefira o preset para bundles menores.

**Posso usar só os componentes, sem auth/http?** Sim. Importe apenas `@hmk/react-admin-kit/ui` (e `/design-system` para o tema). Os subpaths são independentes.

**React aparece duplicado no meu bundle?** Não deve: React e as libs de ecossistema são `peerDependencies`, não embutidas no artefato da lib.

**Como aponto a API?** Via `createHttpConfig({ apiOrigin })` no seu composition root. A lib não lê `import.meta.env`.

**ESM apenas?** Sim, a distribuição é ESM com tipos `.d.ts` por entry point.
