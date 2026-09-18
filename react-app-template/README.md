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

## Qualidade

- O `pre-commit` (Husky + lint-staged) roda ESLint e Prettier apenas nos arquivos em stage.
- O CI deve falhar em violações de lint, tipos ou testes.
