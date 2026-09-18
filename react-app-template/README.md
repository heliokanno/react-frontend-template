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

## Qualidade

- O `pre-commit` (Husky + lint-staged) roda ESLint e Prettier apenas nos arquivos em stage.
- O CI deve falhar em violações de lint, tipos ou testes.
