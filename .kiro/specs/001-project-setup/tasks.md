# Plano de Implementação — 001 project-setup

- [ ] 1. Inicializar projeto Vite + React + TypeScript
  - Criar projeto com Vite (template React + TS) usando pnpm.
  - Fixar `packageManager` (pnpm) e `engines` (Node LTS) no `package.json`.
  - Versionar `pnpm-lock.yaml`.
  - _Requisitos: 1, 2_

- [ ] 2. Configurar TypeScript estrito e path aliases
  - Habilitar `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`.
  - Configurar `paths` com `@/* → src/*` no `tsconfig.json`.
  - Espelhar o alias em `vite.config.ts` (`resolve.alias`).
  - _Requisitos: 1, 4_

- [ ] 3. Configurar variáveis de ambiente tipadas
  - Tipar `ImportMetaEnv` em `src/vite-env.d.ts`.
  - Criar `src/shared/config/env.ts` com validação explícita das variáveis obrigatórias.
  - Criar `.env.example` e adicionar `.env*` ao `.gitignore`.
  - _Requisitos: 4_

- [ ] 4. Configurar ESLint + Prettier
  - Criar `eslint.config.js` (flat) com `@typescript-eslint`, `react`, `react-hooks`, `jsx-a11y`, `import` e `eslint-config-prettier`.
  - Criar `.prettierrc` e `.prettierignore`.
  - Garantir que `lint` falha com exit code ≠ 0 em violação.
  - _Requisitos: 3_

- [ ] 5. Criar estrutura de pastas base
  - Criar `src/app/`, `src/features/`, `src/shared/`, `src/infrastructure/` com `.gitkeep` onde necessário.
  - Documentar no README a intenção de cada camada e as regras de dependência.
  - _Requisitos: 5_

- [ ] 6. Configurar toolchain de testes (Vitest + RTL + MSW)
  - Configurar Vitest (`jsdom`, `globals`, setup file) em `vite.config.ts` ou `vitest.config.ts`.
  - Criar `tests/setup.ts` importando `@testing-library/jest-dom`.
  - Instalar RTL, `user-event` e MSW (sem handlers ainda).
  - Criar `tests/smoke.test.ts` que valida o runner.
  - _Requisitos: 6_

- [ ] 7. Configurar Playwright
  - Adicionar `playwright.config.ts` e a pasta `e2e/` com um teste trivial de exemplo.
  - Documentar `pnpm exec playwright install` no README.
  - _Requisitos: 6_

- [ ] 8. Definir scripts do package.json
  - Adicionar `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `test:watch`, `test:e2e`.
  - Garantir `test` em modo single-run.
  - _Requisitos: 7_

- [ ] 9. Configurar pre-commit (Husky + lint-staged)
  - Instalar e inicializar Husky.
  - Configurar lint-staged para rodar `eslint --fix` e `prettier --write` só nos arquivos em stage.
  - _Requisitos: 8_

- [ ] 10. Verificação final da fundação
  - Rodar `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test` e garantir sucesso.
  - Rodar `pnpm test:e2e` após instalar browsers.
  - Registrar no README os comandos úteis.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7_
