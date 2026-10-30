# Plano de Implementação — 013 distributable-library

- [x] 1. Montar o monorepo (packages/core + apps/playground)
  - Ajustar `pnpm-workspace.yaml` para `packages/*` e `apps/*`.
  - Criar `packages/core` e `apps/playground`; mover `index.html`, `main.tsx`, `app/*` e `design-system/reference/*` para o playground; manter `shared`, `features/auth`, `infrastructure` no core.
  - _Requisitos: 1, 7_

- [x] 2. Remover acoplamento com `import.meta.env` do core
  - Transformar `httpConfig` em factory `createHttpConfig(input)` recebendo `apiOrigin`/`timeoutMs`/`apiVersionPrefix`.
  - Mover `env.ts` (leitura de `VITE_*`) para o playground e montar a config no composition root do app.
  - Garantir que o core não referencia `import.meta.env`.
  - _Requisitos: 2_

- [x] 3. Definir entry points por subpath
  - Criar barrels em `packages/core/src/entries/`: `index` (raiz), `ui`, `design-system`, `authorization`, `auth`, `http`, `query`.
  - Raiz reexporta apenas o estável; não vazar router/pages/reference.
  - _Requisitos: 3_

- [x] 4. Configurar build de biblioteca (ESM + tipos)
  - `vite.config.ts` com `build.lib` multi-entry, ESM, `preserveModules`, `external` (React + ecossistema), alias `@/` resolvido.
  - Gerar `.d.ts` por entry (`vite-plugin-dts`); ajustar `tsconfig` da lib (`declaration`, sem `noEmit`).
  - _Requisitos: 4_

- [x] 5. Estilos, tokens e preset Tailwind
  - Expor `./tokens.css` (tokens do Design System) e `./tailwind-preset.css` (com `@custom-variant dark`).
  - Gerar `./styles.css` pré-compilado como fallback; marcar CSS em `sideEffects`.
  - Validar `ThemeProvider`/`.dark` no consumidor.
  - _Requisitos: 5_

- [x] 6. package.json de publicação e dependências
  - Remover `private`; definir `name`/`version`/`license`/`repository`/`type`.
  - Preencher `main`/`module`/`types`/`exports` (todos os subpaths + CSS)/`files`/`sideEffects`.
  - Mover React e ecossistema para `peerDependencies` (+ `peerDependenciesMeta`); manter `clsx`/`tailwind-merge`/`cva`/`@radix-ui/*`/`lucide-react` em `dependencies`.
  - Scripts `build` e `prepublishOnly`.
  - _Requisitos: 6_

- [x] 7. Playground consumindo a lib
  - `apps/playground` depende de `@hmk/react-admin-kit` via `workspace:*` e importa só pela API pública.
  - Montar providers/config no app; manter `dev`/`build`/testes/E2E.
  - _Requisitos: 7_

- [x] 8. Verificação de consumo
  - `pnpm pack` do core + instalação do tarball em consumidor mínimo; renderizar `Button` com estilos.
  - Checar que o `dist` não embute React/peers e não tem `@/` residual.
  - _Requisitos: 8_

- [x] 9. Documentação e verificação final
  - README: instalação, peers exigidas, import de CSS/tokens, requisito Tailwind v4, exemplos por subpath.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` verdes no monorepo; E2E do playground ok.
  - _Requisitos: 1, 2, 3, 4, 5, 6, 7, 8_

## Notas de execução

- **Ordem segura:** fazer a mudança de monorepo (1) e a remoção de env (2) primeiro, validando `build`/`test` do playground a cada passo, antes de configurar o build de lib (4). Isso mantém o diff reversível e detecta acoplamentos cedo.
- **Alias `@/`:** manter o alias no build da lib evita migrar ~40 imports internos para relativos; conferir no artefato que nenhum `@/` sobra (requisito 4.4).
- **Externals vs dependencies:** libs de ecossistema compartilháveis (React, Query, Router, RHF, Zod) viram **peers**; libs de implementação da lib (`clsx`, `tailwind-merge`, `cva`, `@radix-ui/*`, `lucide-react`, `@tanstack/react-table`, `@hookform/resolvers`) ficam em `dependencies` mas **externas** ao bundle para não duplicar.
- **Estilos:** preferir o caminho preset Tailwind v4 (melhor tree-shaking); o CSS compilado é fallback para consumidores sem Tailwind. O `@custom-variant dark` precisa acompanhar ambos.
- **Config injetável:** o único leitor de `VITE_*` restante fica no `apps/playground`; o core recebe tudo por `createHttpConfig` no composition root do consumidor.

## Resultado da execução

- **Monorepo**: raiz em `react-app-template/` com `packages/core` (`@hmk/react-admin-kit`, publicável) e `apps/playground` (`@hmk/react-admin-kit-playground`, privado). 149 arquivos movidos preservando histórico (git renames).
- **Config injetável**: `httpConfig` virou `createHttpConfig({ apiOrigin, timeoutMs?, apiVersionPrefix? })`; `env.ts` (leitura de `VITE_*`) vive no playground. Core sem `import.meta.env`.
- **Entries**: `index`, `ui`, `design-system`, `authorization`, `auth`, `http`, `query` em `packages/core/src/entries/`.
- **Build**: Vite `build.lib` ESM multi-entry com `preserveModules`; `isExternal` externaliza todo bare specifier (nenhuma dependência embutida, nem React). Tipos via `vite-plugin-dts` em `dist/entries/*.d.ts`.
- **Estilos**: `dist/tokens.css` (variáveis inlined), `dist/tailwind-preset.css` (tokens + `@theme` + `@custom-variant dark`), `dist/styles.css` (compilado Tailwind, fallback). Gerados por `scripts/build-styles.mjs` (`@tailwindcss/cli`). CSS em `sideEffects`.
- **package.json**: `exports` por subpath (+ CSS), `files: ["dist"]`, React/Query/Router/RHF/Zod como `peerDependencies` (algumas opcionais); `clsx`/`tailwind-merge`/`cva`/`@radix-ui/*`/`lucide-react`/`@tanstack/react-table`/`@hookform/resolvers` em `dependencies`.
- **Playground**: consome `@hmk/react-admin-kit/*`; no dev os subpaths resolvem ao `core/src` via alias (Vite/Vitest) e `paths` (tsconfig), sem exigir build.
- **Verificação**: `pnpm pack` → tarball só com `dist` (7 JS + 7 `.d.ts` + 3 CSS + `package.json`); instalado em consumidor externo via `npm` + peers, SSR de `Button` OK, `createHttpConfig`/`toAppError`/`Can` OK; confirmado nenhum React no bundle.

Validações executadas com sucesso: `lint` (0 erros), `typecheck` (core + playground), `test` (63 core + 15 playground), `build` (lib + playground), `test:e2e` (10/10).

> Pendências deliberadas (fora do escopo): publicação efetiva no registry (operação de release) e formato CJS (ESM é o alvo). Ajustar o scope `@hmk` caso o nome final de publicação seja outro.
