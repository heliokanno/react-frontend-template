# @hmk/react-admin-kit

Fundação frontend React reutilizável: componentes primitivos, design system (tokens + tema), autenticação e sessão, autorização de UI, camada HTTP e integração com TanStack Query.

A biblioteca resolve uma vez os problemas comuns de um admin corporativo; cada projeto apenas **compõe** essas peças. A autorização é de UX (ocultar/desabilitar); a autorização real é sempre do backend.

## Instalação

```bash
pnpm add @hmk/react-admin-kit
```

### Peer dependencies

Instale as peers conforme os subpaths que você usar:

| Peer                     | Exigida por             | Obrigatória |
| ------------------------ | ----------------------- | ----------- |
| `react`, `react-dom`     | tudo                    | sim         |
| `@tanstack/react-query`  | `/query`, dados de API  | opcional    |
| `react-hook-form`, `zod` | `/ui` (formulários)     | opcional    |
| `react-router`           | guards/rotas no seu app | opcional    |

```bash
pnpm add react react-dom
pnpm add @tanstack/react-query react-hook-form zod react-router
```

## Estilos

A lib usa Tailwind CSS v4 dirigido por tokens. Há dois caminhos de consumo.

### Opção A — Preset Tailwind v4 (recomendado)

Melhor tree-shaking: o Tailwind do seu projeto escaneia os componentes da lib e emite só as classes usadas.

```css
/* seu CSS global */
@import '@hmk/react-admin-kit/tokens.css';
@import 'tailwindcss';
@import '@hmk/react-admin-kit/tailwind-preset.css';

/* inclua os componentes da lib no scan do Tailwind */
@source '../node_modules/@hmk/react-admin-kit/dist';
```

### Opção B — CSS pré-compilado (sem Tailwind)

Um único import, zero config:

```ts
import '@hmk/react-admin-kit/styles.css';
```

O tema escuro é ativado pela classe `.dark` na raiz (o `ThemeProvider` cuida disso).

## Entry points

Importe apenas o subpath que usa:

```ts
import { Button, Form, DataGrid } from '@hmk/react-admin-kit/ui';
import { ThemeProvider, useTheme } from '@hmk/react-admin-kit/design-system';
import { Can, useHasPermission, PermissionProvider } from '@hmk/react-admin-kit/authorization';
import { AuthProvider, useAuth, useCurrentUser } from '@hmk/react-admin-kit/auth';
import { createHttpConfig, FetchHttpClient, toAppError } from '@hmk/react-admin-kit/http';
import { createQueryClient, createQueryKeys } from '@hmk/react-admin-kit/query';
```

O entry raiz (`@hmk/react-admin-kit`) reexporta o conjunto estável; prefira os subpaths para tree-shaking.

## Configuração injetável

A lib não lê variáveis de ambiente do seu bundler. Você injeta a configuração no composition root:

```ts
import { createHttpConfig, FetchHttpClient } from '@hmk/react-admin-kit/http';

const httpConfig = createHttpConfig({
  apiOrigin: import.meta.env.VITE_API_BASE_URL, // origem da SUA app
  // timeoutMs, apiVersionPrefix opcionais
});

const httpClient = new FetchHttpClient({ config: httpConfig });
```

## Exemplo mínimo

```tsx
import { ThemeProvider } from '@hmk/react-admin-kit/design-system';
import { Button } from '@hmk/react-admin-kit/ui';
import '@hmk/react-admin-kit/styles.css';

export function App() {
  return (
    <ThemeProvider>
      <Button onClick={() => alert('ok')}>Salvar</Button>
    </ThemeProvider>
  );
}
```

## Notas

- Distribuído como **ESM** com tipos `.d.ts` por entry point.
- React e as libs de ecossistema são **peers** (não embutidas no bundle), evitando cópias duplicadas.
- Requer Tailwind CSS v4 para a Opção A de estilos.
