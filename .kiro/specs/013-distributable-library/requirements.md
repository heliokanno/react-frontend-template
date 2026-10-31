# Requisitos — 013 distributable-library

## Introdução

Esta spec transforma o template, hoje uma **aplicação** Vite (com `index.html`, `main.tsx`, roteador e páginas de exemplo), em uma **biblioteca React distribuível** que possa ser instalada e importada em qualquer projeto React. O núcleo reutilizável já está isolado atrás de barrels públicos (`shared/ui`, `shared/design-system`, `shared/authorization`, `shared/async`, `features/auth`, `infrastructure/{http,errors,query}`); o trabalho desta spec é **empacotar** esse núcleo, separar fisicamente o que é lib do que é app de demonstração e remover os acoplamentos que impedem o consumo fora do Vite do próprio projeto.

A estratégia adotada (ver `design.md`) é: monorepo pnpm (`packages/core` + `apps/playground`), pacote com **múltiplos entry points** (subpath exports), **ESM** com tipos `.d.ts`, peers externas (React e libs de ecossistema), e distribuição de estilo via **preset Tailwind v4 + tokens CSS** com **CSS pré-compilado** como fallback.

Referências: `product.md` (núcleo × negócio, configurabilidade, extensibilidade), `frontend-architecture.md` (feature boundaries, API pública), `hexagonal-architecture.md` (regra de dependência), `tech.md` (Vite, pnpm, Tailwind v4, peers), `frontend-engineering.md` (dependencies, bundle, security).

## Requisitos

### Requisito 1 — Separação entre núcleo da lib e app de exemplo

**User Story:** Como mantenedor, quero o núcleo reutilizável separado do app de demonstração, para publicar apenas o que serve a qualquer projeto.

#### Acceptance Criteria

1. QUANDO o repositório é organizado ENTÃO o núcleo publicável (`shared`, `features/auth`, `infrastructure`) DEVE residir em um pacote dedicado (`packages/core`) e o app de demonstração (`app/`, `main.tsx`, `index.html`, páginas/layouts/router de exemplo, `design-system/reference/*`) DEVE residir em um projeto separado (`apps/playground`).
2. QUANDO um módulo do pacote core é exportado ENTÃO ele NÃO DEVE importar, direta ou transitivamente, código do app (`app/*`, `main`, router, pages).
3. QUANDO o app de demonstração consome o núcleo ENTÃO ele DEVE consumi-lo pela API pública do pacote (não por caminhos internos), validando o contrato como um consumidor real.

### Requisito 2 — Configuração injetável em vez de env do bundler

**User Story:** Como consumidor da lib, quero fornecer a configuração (base URL, timeout) da minha aplicação, para não depender das variáveis `VITE_*` do projeto da lib.

#### Acceptance Criteria

1. QUANDO o pacote core precisa de configuração de runtime ENTÃO ela DEVE ser **injetada pelo consumidor** (via factory/parâmetro/props), NÃO lida de `import.meta.env` dentro do core.
2. QUANDO o `HttpClient`/`httpConfig` é criado ENTÃO a base URL e o timeout DEVEM vir de configuração explícita fornecida pelo consumidor.
3. QUANDO o core é empacotado ENTÃO ele NÃO DEVE conter referências a `import.meta.env.VITE_*`; o acesso a env permanece responsabilidade do app consumidor (o `apps/playground` mantém o adaptador de env).

### Requisito 3 — Múltiplos entry points (subpath exports)

**User Story:** Como consumidor, quero importar apenas a área que uso, para melhor tree-shaking e clareza.

#### Acceptance Criteria

1. QUANDO o `package.json` define `exports` ENTÃO ele DEVE expor os subpaths: `.` (raiz agregadora), `./ui`, `./design-system`, `./authorization`, `./auth`, `./http`, `./query`, além dos artefatos de estilo `./styles.css` e `./tokens.css`.
2. QUANDO um subpath é importado ENTÃO ele DEVE resolver tanto o código ESM quanto os tipos `.d.ts` correspondentes.
3. QUANDO o raiz (`.`) é importado ENTÃO ele DEVE re-exportar apenas o que é estável, sem vazar páginas/rotas/reference de exemplo.

### Requisito 4 — Build de biblioteca em ESM com tipos

**User Story:** Como consumidor, quero um pacote ESM com tipos completos, para integrar em qualquer toolchain moderna com IntelliSense.

#### Acceptance Criteria

1. QUANDO o pacote é buildado ENTÃO a saída DEVE ser **ESM** com um entry por subpath (preservando módulos para tree-shaking).
2. QUANDO o pacote é buildado ENTÃO DEVEM ser gerados arquivos de declaração `.d.ts` para todos os entry points.
3. QUANDO o bundle é inspecionado ENTÃO ele NÃO DEVE embutir `react`, `react-dom`, `react/jsx-runtime` nem as bibliotecas de ecossistema marcadas como externas/peers.
4. QUANDO o alias `@/` é usado internamente ENTÃO o build DEVE resolvê-lo corretamente na saída (sem deixar caminhos `@/` não resolvidos no artefato).

### Requisito 5 — Estilos, tokens e Tailwind consumíveis

**User Story:** Como consumidor, quero aplicar o visual da lib no meu projeto, para que os componentes renderizem com os tokens e o tema corretos.

#### Acceptance Criteria

1. QUANDO o consumidor usa Tailwind v4 ENTÃO a lib DEVE fornecer um **preset/export de configuração** e os **tokens CSS** (`./tokens.css`), permitindo que o Tailwind do consumidor escaneie os componentes do pacote em `node_modules`.
2. QUANDO o consumidor não usa Tailwind ENTÃO a lib DEVE oferecer um **CSS pré-compilado** (`./styles.css`) como fallback, importável com um único import.
3. QUANDO o tema é alternado ENTÃO o `ThemeProvider` e a variante `.dark` DEVEM continuar funcionando no consumidor (o `@custom-variant dark` acompanha o preset/CSS distribuído).
4. QUANDO os artefatos CSS são publicados ENTÃO eles DEVEM estar marcados como `sideEffects` para não serem removidos pelo tree-shaking do consumidor.

### Requisito 6 — Metadados de publicação e dependências corretas

**User Story:** Como consumidor, quero instalar o pacote sem duplicar React nem receber dependências desnecessárias, para evitar conflitos e bundles inchados.

#### Acceptance Criteria

1. QUANDO o `package.json` do core é definido ENTÃO ele DEVE ter `name`, `version`, `license`, `repository`, `type: module`, e os campos `main`/`module`/`types`/`exports`/`files`/`sideEffects`, sem `private: true`.
2. QUANDO as dependências são classificadas ENTÃO `react` e `react-dom` (e as libs de ecossistema compartilháveis: `@tanstack/react-query`, `react-router`, `react-hook-form`, `zod`) DEVEM ser `peerDependencies`, com `peerDependenciesMeta` para as opcionais.
3. QUANDO uma dependência é de runtime próprio da lib (ex.: `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/*`, `lucide-react`) ENTÃO ela DEVE permanecer em `dependencies`, segundo a decisão documentada no design.
4. QUANDO o pacote é publicado ENTÃO `files` DEVE incluir apenas os artefatos necessários (`dist`, CSS, preset), e scripts `build` e `prepublishOnly` DEVEM garantir o artefato atualizado.

### Requisito 7 — App de exemplo preservado como playground

**User Story:** Como mantenedor, quero manter o app de demonstração vivo, para desenvolver, validar visualmente e rodar E2E consumindo a lib localmente.

#### Acceptance Criteria

1. QUANDO o monorepo é montado ENTÃO o `apps/playground` DEVE depender do `packages/core` via workspace e renderizar os componentes a partir da API pública.
2. QUANDO o desenvolvimento ocorre ENTÃO o playground DEVE funcionar com `dev`, `build` e os testes/E2E existentes, servindo de validação de consumo real.
3. QUANDO o roteador, páginas, layouts e reference de exemplo são necessários ENTÃO eles DEVEM viver no playground, não no pacote publicável.

### Requisito 8 — Verificação de consumo e qualidade

**User Story:** Como mantenedor, quero garantir que o pacote realmente funciona ao ser instalado, para não publicar algo quebrado.

#### Acceptance Criteria

1. QUANDO o pacote é empacotado ENTÃO um teste de consumo (via `pnpm pack` + instalação do tarball, ou projeto consumidor mínimo) DEVE renderizar ao menos um `Button` e um `Form` com os estilos aplicados.
2. QUANDO o artefato é verificado ENTÃO DEVE existir checagem de que o bundle não inclui React nem os peers.
3. QUANDO a spec é concluída ENTÃO `lint`, `typecheck`, `test` e `build` DEVEM passar no monorepo, e o README DEVE documentar instalação, peers exigidas, import de CSS/tokens, requisito de Tailwind v4 e exemplos por subpath.

## Não objetivos

- Não publicar efetivamente no npm/registry (a spec prepara o pacote; a publicação é operação de release separada).
- Não reescrever componentes do núcleo; o foco é empacotamento e remoção de acoplamentos.
- Não adicionar formato CJS como requisito (ESM é o alvo; CJS fica como extensão opcional futura).
- Não transformar a UI em mecanismo de segurança; autorização real continua sendo do backend.
