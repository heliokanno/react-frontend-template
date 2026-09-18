# Design — 001 project-setup

## Visão geral

Fundação técnica do template: Vite + React 19 + TypeScript estrito, pnpm, ESLint/Prettier, aliases, env tipada, estrutura de pastas por camada e toolchain de testes (Vitest, RTL, MSW, Playwright). Nenhuma feature de negócio, tokens ou componente visual entra aqui.

Referências: `tech.md` (stack), `frontend-architecture.md` e `hexagonal-architecture.md` (estrutura de pastas), `clean-code.md` (idioma), `testing.md` (ferramentas).

## Arquitetura da estrutura de pastas

```text
react-frontend-template/
├── src/
│   ├── app/                 # bootstrap, providers, routing (preenchido em 005)
│   ├── features/            # features por domínio (vazio no template)
│   ├── shared/              # reutilizável real (components, hooks, utils, types)
│   ├── infrastructure/      # HttpClient, storage, telemetry (preenchido em 004)
│   ├── main.tsx             # entrypoint
│   └── vite-env.d.ts        # tipos de ambiente do Vite
├── tests/
│   ├── setup.ts             # setup do Vitest + RTL + jest-dom
│   └── smoke.test.ts        # teste de fumaça
├── e2e/                     # testes Playwright
├── public/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts (ou config dentro de vite.config)
├── playwright.config.ts
├── eslint.config.js
├── .prettierrc
├── .env.example
└── .gitignore
```

A estrutura segue a arquitetura por feature com camadas hexagonais **dentro** de cada feature. No template, `features/` nasce vazio; cada projeto derivado adiciona as suas.

## Decisões técnicas

### Runtime e linguagem
- **React 19**, function components e Hooks.
- **TypeScript strict**: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess` para segurança extra.
- Node.js LTS ativo.

### Bundler
- **Vite** com plugin React.
- Path alias `@/ → src/` configurado em `vite.config.ts` e espelhado em `tsconfig.json` (`paths`).

### Variáveis de ambiente tipadas
- Tipar `import.meta.env` em `src/vite-env.d.ts` via `interface ImportMetaEnv`.
- Validação de env em um módulo dedicado (ex.: `src/shared/config/env.ts`) que falha explícito se faltar variável obrigatória. Neste estágio o conjunto é mínimo (ex.: `VITE_API_BASE_URL` opcional), evoluído em 004.
- `.env.example` versionado; `.env*` reais no `.gitignore`.

### Gerenciador de pacotes
- **pnpm**, lockfile versionado. `packageManager` fixado no `package.json`. `engines` opcional para Node LTS.

### Qualidade
- **ESLint** flat config (`eslint.config.js`) com: `@typescript-eslint`, `eslint-plugin-react`, `react-hooks`, `jsx-a11y`, `import`. Regra de `no-explicit-any` como aviso/erro conforme `frontend-engineering.md`.
- **Prettier** com `.prettierrc`; ESLint não conflita com Prettier (usar `eslint-config-prettier`).
- CI-friendly: `lint` e `typecheck` retornam código diferente de zero em falha.

### Testes
- **Vitest** com ambiente `jsdom`, `globals: true`, setup em `tests/setup.ts` (importa `@testing-library/jest-dom`).
- **React Testing Library** + `@testing-library/user-event`.
- **MSW** instalado; handlers base criados em specs posteriores (server em `tests/` quando necessário).
- **Playwright** com `playwright.config.ts`; pasta `e2e/`.
- Teste de fumaça em `tests/smoke.test.ts` valida que o runner funciona.

### Pre-commit (recomendado)
- **Husky** + **lint-staged**: em `pre-commit`, rodar `eslint --fix` e `prettier --write` apenas sobre arquivos em stage. Não rodar suíte completa no hook.

## Scripts do package.json

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

> `test` roda em modo single-run (`vitest run`) para não bloquear automações (ver `tech.md`).

## Riscos e mitigações

- **Tailwind v4 e outras libs de UI**: não entram aqui; ficam para 002. Evita acoplar setup visual à fundação.
- **noUncheckedIndexedAccess** pode aumentar verbosidade; é intencional para segurança de tipos. Documentar no README.
- **Playwright em CI**: exige browsers instalados (`playwright install`). Documentar no README e no pipeline.

## Verificação

Após a implementação, os comandos abaixo devem passar:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
pnpm test
```

E `pnpm test:e2e` deve executar (mesmo que com um único teste trivial de exemplo) após `pnpm exec playwright install`.
