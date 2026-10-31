# Design — 013 distributable-library

## Objetivo

Empacotar o núcleo reutilizável do template como uma biblioteca React consumível em qualquer projeto, sem reescrever componentes e preservando a separação núcleo × negócio (ver `product.md`) e a regra de dependência (ver `hexagonal-architecture.md`).

## Estado atual (ponto de partida)

- Projeto é uma **aplicação** Vite: `index.html`, `src/main.tsx`, `src/app/{router,pages,layouts,error,providers,di}`.
- Núcleo reutilizável já isolado atrás de barrels:
  - `src/shared/ui/index.ts` — Button, Input, Form, DataGrid, Dialog, Toast, etc.
  - `src/shared/design-system/*` — tokens CSS (`tokens/index.css`) + `ThemeProvider`.
  - `src/shared/authorization/index.ts` — `Can`, `useHasPermission`, `PermissionProvider`, registry.
  - `src/shared/async/asyncState.ts`.
  - `src/features/auth/index.ts` — ports/services/providers/hooks/LoginPage.
  - `src/infrastructure/{http,errors,query}` — `HttpClient`/`FetchHttpClient`, `AppError`/`toAppError`, `queryClient`/`queryKeys`.
- Acoplamentos que bloqueiam a lib:
  - `shared/config/env.ts` lê `import.meta.env.VITE_*`; `infrastructure/http/httpConfig.ts` depende de `env`.
  - Alias `@/` usado amplamente nos imports internos (uniforme, resolvível no build).
  - `main.tsx`/`index.css` são de aplicação (montam raiz, importam Tailwind).

## Decisões

### D1 — Monorepo pnpm (packages/core + apps/playground)

Adotar workspace pnpm (o `pnpm-workspace.yaml` já existe). A fronteira lib × app passa a ser física:

```text
react-app-template/            (raiz do workspace)
├── packages/
│   └── core/                  (pacote publicável)
│       ├── src/
│       │   ├── shared/        (ui, design-system, authorization, async)
│       │   ├── features/auth/
│       │   ├── infrastructure/ (http, errors, query)
│       │   ├── styles/         (tokens.css agregador, entrada de CSS)
│       │   └── entries/        (barrels por subpath: ui, auth, http, ...)
│       ├── tailwind-preset.ts  (preset v4 + @custom-variant dark)
│       ├── vite.lib.config.ts
│       ├── tsconfig.*.json
│       └── package.json        (name, exports, peers, files)
└── apps/
    └── playground/            (app de demonstração — não publicável)
        ├── index.html
        ├── src/main.tsx
        ├── src/app/{router,pages,layouts,error,providers,di}
        ├── src/env.ts          (adaptador de import.meta.env do consumidor)
        └── package.json        (depende de @<scope>/core via workspace:*)
```

Racional: deixa explícito o que é publicável, permite ao playground consumir a lib como consumidor real (valida o contrato de `exports`) e alinha-se às steerings de núcleo × negócio.

### D2 — Entry points por subpath

O pacote expõe múltiplos entry points em vez de um bundle monolítico:

| Subpath | Origem | Conteúdo |
|---|---|---|
| `.` | agregador | re-exporta o estável de todos os subpaths |
| `./ui` | `shared/ui` | componentes primitivos + DataGrid + Form |
| `./design-system` | `shared/design-system/theme` | `ThemeProvider`, `useTheme`, `ThemeToggle`, tipos |
| `./authorization` | `shared/authorization` | `Can`, `useHasPermission`, `PermissionProvider`, registry |
| `./auth` | `features/auth` | ports, services, `AuthProvider`, hooks, `LoginPage` |
| `./http` | `infrastructure/{http,errors}` | `HttpClient`, `FetchHttpClient`, `AppError`, `toAppError` |
| `./query` | `infrastructure/query` | `queryClient`, `queryKeys` |
| `./styles.css` | CSS compilado | fallback sem Tailwind |
| `./tokens.css` | tokens | variáveis CSS do Design System |

O raiz `.` **não** reexporta router/pages/layouts/reference (que vão para o playground).

### D3 — Configuração injetável (remover `import.meta.env` do core)

O core não lê env do bundler. `httpConfig` passa a ser **produzido por uma factory** que recebe a configuração do consumidor:

```ts
// packages/core/src/infrastructure/http/httpConfig.ts (novo contrato)
export type HttpConfigInput = {
  readonly apiOrigin: string;        // fornecido pelo consumidor
  readonly timeoutMs?: number;
  readonly apiVersionPrefix?: string; // default '/api/v1'
};

export function createHttpConfig(input: HttpConfigInput): HttpConfig { /* ... */ }
```

O leitor de `import.meta.env` (`env.ts`) sai do core e passa a viver no `apps/playground` (que monta a config a partir de `VITE_API_BASE_URL` e chama `createHttpConfig`). Assim o requisito 2 é satisfeito: nenhuma referência a `VITE_*` no artefato publicado.

### D4 — Build com Vite `build.lib` + múltiplos entries

- `vite.lib.config.ts` com `build.lib.entry` mapeando cada subpath para seu barrel.
- Formato **ESM**; `rollupOptions.output.preserveModules: true` para tree-shaking fino.
- `rollupOptions.external`: `react`, `react-dom`, `react/jsx-runtime`, `@tanstack/react-query`, `@tanstack/react-table`, `react-router`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@radix-ui/*`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.
  - Nota: `@radix-ui/*`, `lucide-react`, `clsx`, `tailwind-merge`, `cva` ficam como **dependencies** (instaladas automaticamente), mas ainda externalizadas do bundle para não duplicar.
- Alias `@/` resolvido no build (mesma config `resolve.alias` do app) → não é preciso migrar imports para relativos (reduz diff e risco).
- Tipos `.d.ts`: `vite-plugin-dts` gerando declarações por entry (ou `tsc --emitDeclarationOnly` como alternativa). `tsconfig` da lib com `declaration: true`, `emitDeclarationOnly` no passo de tipos, sem `noEmit`.

### D5 — Estilos: preset Tailwind v4 (principal) + CSS compilado (fallback)

Os componentes dependem de utilitários Tailwind mapeados dos tokens via `@theme inline` e `@custom-variant dark`. Duas vias de consumo:

- **Principal (B):** distribuir `tailwind-preset` + `./tokens.css`. O consumidor (Tailwind v4) importa o preset e inclui o pacote no `content` para escanear as classes dos componentes em `node_modules`. Melhor tree-shaking; exige Tailwind v4.
- **Fallback (A):** `./styles.css` pré-compilado (tokens + utilitários usados), import único para quem não usa Tailwind. Maior, mas zero-config.

O `@custom-variant dark (&:where(.dark, .dark *))` acompanha o preset e o CSS compilado, preservando o `ThemeProvider` (classe `.dark` na raiz). CSS marcado em `sideEffects`.

### D6 — package.json de publicação

- Remover `private`; definir `name` com scope, `version`, `license`, `repository`.
- `type: module`; `main`/`module` apontando para o entry ESM raiz; `types` para o `.d.ts` raiz.
- `exports` com mapa `import`/`types` por subpath (D2), incluindo os `.css`.
- `sideEffects`: `["**/*.css"]`.
- `files`: `["dist", "tailwind-preset.*"]`.
- `peerDependencies`: `react`, `react-dom`, `@tanstack/react-query`, `react-router`, `react-hook-form`, `zod`; `peerDependenciesMeta` marcando como opcionais as que só são exigidas por subpaths específicos (ex.: `react-router`, `@tanstack/react-query`).
- `dependencies`: `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/*`, `lucide-react`, `@hookform/resolvers`, `@tanstack/react-table`.
- Scripts: `build` (lib + dts), `prepublishOnly` (build), `pack:check`.

### D7 — Verificação de consumo

- `pnpm pack` no core gera tarball; instalar em projeto consumidor mínimo (ou usar o próprio `apps/playground` apontando para o tarball numa verificação pontual) e renderizar `Button` + `Form` com estilos.
- Checagem de que o `dist` não contém React/peers (grep no artefato por `react/jsx-runtime` como código embutido, ou inspeção dos `external`).
- `lint`, `typecheck`, `test`, `build` verdes no monorepo; E2E do playground mantém o fluxo de consumo real.

## Direção de dependências (preservada)

```text
apps/playground (consumidor)
      ↓ importa API pública
packages/core
  ui → (cn, radix)             infrastructure/http ← config injetada pelo app
  auth → ports/services/adapters (HttpClient)      authorization → UI only
  domain/application não importam React/HTTP/UI
```

Nenhuma dependência do core aponta para o app. A config de runtime entra pela borda (composition root do consumidor).

## Riscos e mitigação

- **Tailwind v4 no consumidor:** documentar requisito; oferecer CSS compilado como fallback para quem não usa Tailwind.
- **Alias `@/` no artefato:** garantir resolução no build (teste: inspecionar `dist` por `@/` residual — requisito 4.4).
- **Peers duplicadas (React):** mover React/ecossistema para `peerDependencies`; teste de consumo detecta duplicação.
- **Diff grande pela mudança para monorepo:** mover arquivos com atualização de imports; manter o alias para minimizar reescrita; validar com build/test a cada etapa.
- **`import.meta.env` residual:** remover de `env.ts`/`httpConfig.ts` no core; mover leitura para o playground (requisito 2.3).

## Alinhamento com steerings

- `product.md`: núcleo publicável vs app descartável fica físico (packages vs apps); config por consumidor, não fork.
- `frontend-architecture.md`: API pública por subpath; sem vazar internals; sem dependências circulares.
- `hexagonal-architecture.md`: config injetada no composition root do consumidor; core independente de detalhes.
- `tech.md`: Vite, pnpm workspaces, Tailwind v4, peers pinadas.
- `frontend-engineering.md`: peers em vez de dependencies para React; bundle sem libs externas; nenhum secret/env embutido.
