# Plano de Implementação — 001 project-setup

- [x] 1. Inicializar projeto Vite + React + TypeScript
  - Criar projeto com Vite (template React + TS) usando pnpm.
  - Fixar `packageManager` (pnpm) e `engines` (Node LTS) no `package.json`.
  - Versionar `pnpm-lock.yaml`.
  - _Requisitos: 1, 2_

- [x] 2. Configurar TypeScript estrito e path aliases
  - Habilitar `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`.
  - Configurar `paths` com `@/* → src/*` no `tsconfig.json`.
  - Espelhar o alias em `vite.config.ts` (`resolve.alias`).
  - _Requisitos: 1, 4_

- [x] 3. Configurar variáveis de ambiente tipadas
  - Tipar `ImportMetaEnv` em `src/vite-env.d.ts`.
  - Criar `src/shared/config/env.ts` com validação explícita das variáveis obrigatórias.
  - Criar `.env.example` e adicionar `.env*` ao `.gitignore`.
  - _Requisitos: 4_

- [x] 4. Configurar ESLint + Prettier
  - Criar `eslint.config.js` (flat) com `@typescript-eslint`, `react`, `react-hooks`, `jsx-a11y`, `import` e `eslint-config-prettier`.
  - Criar `.prettierrc` e `.prettierignore`.
  - Garantir que `lint` falha com exit code ≠ 0 em violação.
  - _Requisitos: 3_

- [x] 5. Criar estrutura de pastas base
  - Criar `src/app/`, `src/features/`, `src/shared/`, `src/infrastructure/` com `.gitkeep` onde necessário.
  - Documentar no README a intenção de cada camada e as regras de dependência.
  - _Requisitos: 5_

- [x] 6. Configurar toolchain de testes (Vitest + RTL + MSW)
  - Configurar Vitest (`jsdom`, `globals`, setup file) em `vite.config.ts` ou `vitest.config.ts`.
  - Criar `tests/setup.ts` importando `@testing-library/jest-dom`.
  - Instalar RTL, `user-event` e MSW (sem handlers ainda).
  - Criar `tests/smoke.test.ts` que valida o runner.
  - _Requisitos: 6_

- [x] 7. Configurar Playwright
  - Adicionar `playwright.config.ts` e a pasta `e2e/` com um teste trivial de exemplo.
  - Documentar `pnpm exec playwright install` no README.
  - _Requisitos: 6_

- [x] 8. Definir scripts do package.json
  - Adicionar `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `test:watch`, `test:e2e`.
  - Garantir `test` em modo single-run.
  - _Requisitos: 7_

- [x] 9. Configurar pre-commit (Husky + lint-staged)
  - Instalar e inicializar Husky.
  - Configurar lint-staged para rodar `eslint --fix` e `prettier --write` só nos arquivos em stage.
  - _Requisitos: 8_

- [x] 10. Verificação final da fundação
  - Rodar `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test` e garantir sucesso.
  - Rodar `pnpm test:e2e` após instalar browsers.
  - Registrar no README os comandos úteis.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_

## Notas de execução

Ajustes de versão em relação ao previsto no design, para garantir uma stack estável e
compatível entre as ferramentas (o ecossistema de lint/testes ainda não suporta as versões
mais recentes de TypeScript e ESLint):

- **TypeScript 5.9.3** (em vez de 7.x): typescript-eslint ainda não suporta TS 7.
- **ESLint 9.39.5** (em vez de 10.x): plugins react/jsx-a11y/import ainda não declaram suporte a ESLint 10.
- **Vite 7.3.6** + **@vitejs/plugin-react 5.2.0**: par estável; plugin-react 6 exige Vite 8.
- **Vitest 3.2.7** (em vez de 5.x): a 5.x depende de binding nativo do Rolldown que não instala no ambiente.
- **jsdom 26.1.0** (em vez de 30.x): a 30.x tem incompatibilidade ESM/CJS transitiva.
- **prettier 3.6.2**: a supply-chain policy do pnpm 12 bloqueia versões recém-publicadas.

Configurações específicas do ambiente:

- pnpm 12 lê settings de `pnpm-workspace.yaml` (`allowBuilds` para `esbuild` e `msw`), não mais de `package.json#pnpm`.
- Como o projeto vive em `react-app-template/` e o `.git` está na raiz, o Husky configura
  `core.hooksPath=react-app-template/.husky` via script `prepare`.
- Aviso não bloqueante: Vite 7 recomenda Node 22.12+ (ambiente em 22.1.0).

Validações executadas com sucesso: `typecheck`, `lint`, `test` (2/2), `build`, `test:e2e` (1/1).
