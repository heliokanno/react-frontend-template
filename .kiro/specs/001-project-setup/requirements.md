# Requisitos — 001 project-setup

## Introdução

Esta spec estabelece a **fundação técnica reprodutível** do template frontend. O objetivo é ter um projeto que instala, builda, faz type check, passa no lint e roda testes de forma determinística, com a estrutura de pastas e o toolchain definidos pelas steerings (`tech.md`, `frontend-architecture.md`, `hexagonal-architecture.md`).

Como o produto é um **template reutilizável** (ver `product.md`), a stack aqui definida é herdada por todos os projetos derivados. Esta spec não implementa nenhuma feature de negócio nem componente visual — apenas a base.

## Requisitos

### Requisito 1 — Projeto Vite + React + TypeScript

**User Story:** Como desenvolvedor de um projeto derivado, quero um projeto Vite com React 19 e TypeScript estrito, para começar com uma base moderna e type-safe.

#### Acceptance Criteria

1. QUANDO o projeto é inicializado ENTÃO o sistema DEVE usar Vite como bundler e dev server.
2. QUANDO o TypeScript é configurado ENTÃO o sistema DEVE habilitar `strict: true` no `tsconfig`.
3. QUANDO um componente é escrito ENTÃO o sistema DEVE usar function components e Hooks (sem class components).
4. QUANDO o build de produção é executado ENTÃO o sistema DEVE gerar artefatos sem erros de tipo.

### Requisito 2 — Gerenciador de pacotes pnpm

**User Story:** Como mantenedor, quero pnpm com lockfile versionado, para instalações determinísticas.

#### Acceptance Criteria

1. QUANDO dependências são instaladas ENTÃO o sistema DEVE usar pnpm.
2. QUANDO dependências são adicionadas ENTÃO o sistema DEVE versionar o `pnpm-lock.yaml`.
3. SE outro gerenciador for detectado (npm/yarn lockfile) ENTÃO o sistema NÃO DEVE misturar gerenciadores.

### Requisito 3 — Qualidade de código (ESLint + Prettier)

**User Story:** Como time, quero lint e formatação automáticos, para consistência sem discussão manual de estilo.

#### Acceptance Criteria

1. QUANDO o lint é executado ENTÃO o sistema DEVE aplicar regras de ESLint incluindo `eslint-plugin-jsx-a11y`.
2. QUANDO existir violação de lint ENTÃO o comando DEVE falhar com código de saída diferente de zero.
3. QUANDO o formatador é executado ENTÃO o sistema DEVE aplicar Prettier de forma consistente.
4. QUANDO há regra de tipagem ou acessibilidade violada ENTÃO o lint DEVE reportá-la.

### Requisito 4 — Path aliases e variáveis de ambiente tipadas

**User Story:** Como desenvolvedor, quero aliases de import e env vars tipadas, para evitar imports relativos profundos e acesso inseguro a configuração.

#### Acceptance Criteria

1. QUANDO um módulo é importado ENTÃO o sistema DEVE suportar o alias `@/` apontando para `src/`.
2. QUANDO uma variável de ambiente é acessada ENTÃO o sistema DEVE expô-la via `import.meta.env` tipada.
3. SE uma variável de ambiente obrigatória estiver ausente ENTÃO o sistema DEVE falhar de forma explícita na inicialização/validação.
4. QUANDO secrets forem necessários ENTÃO o sistema NÃO DEVE versioná-los.

### Requisito 5 — Estrutura de pastas base

**User Story:** Como desenvolvedor, quero a estrutura de pastas alinhada à arquitetura, para colocar código na camada correta desde o início.

#### Acceptance Criteria

1. QUANDO o projeto é criado ENTÃO o sistema DEVE conter as pastas `src/app/`, `src/features/`, `src/shared/` e `src/infrastructure/`.
2. QUANDO uma feature é adicionada ENTÃO a estrutura DEVE permitir camadas hexagonais internas (`domain`, `application`, `infrastructure`, `ui`).
3. QUANDO código compartilhado é criado ENTÃO ele DEVE residir em `shared/` apenas quando houver reutilização real.

### Requisito 6 — Toolchain de testes

**User Story:** Como desenvolvedor, quero o toolchain de testes configurado, para escrever testes desde a primeira feature.

#### Acceptance Criteria

1. QUANDO testes unit/component são executados ENTÃO o sistema DEVE usar Vitest.
2. QUANDO um componente é testado ENTÃO o sistema DEVE disponibilizar React Testing Library.
3. QUANDO a rede precisa ser mockada ENTÃO o sistema DEVE disponibilizar MSW.
4. QUANDO testes E2E são executados ENTÃO o sistema DEVE usar Playwright.
5. QUANDO o toolchain é validado ENTÃO um teste de fumaça DEVE passar.

### Requisito 7 — Scripts padronizados

**User Story:** Como desenvolvedor, quero scripts consistentes no `package.json`, para operar o projeto sem passos manuais.

#### Acceptance Criteria

1. QUANDO o `package.json` é definido ENTÃO ele DEVE conter os scripts `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test` e `test:e2e`.
2. QUANDO `pnpm test` é executado ENTÃO ele DEVE rodar em modo single-run (sem watch bloqueante).
3. QUANDO `pnpm build` é executado ENTÃO ele DEVE ser reprodutível sem passos manuais fora do `package.json`.

### Requisito 8 — Pre-commit hooks (recomendado)

**User Story:** Como time, quero checagens no pre-commit, para evitar commits que quebram lint ou tipos.

#### Acceptance Criteria

1. QUANDO um commit é criado ENTÃO o sistema PODE executar Husky + lint-staged nos arquivos em stage.
2. SE lint-staged encontrar violação ENTÃO o commit DEVE ser bloqueado.
3. QUANDO o hook é configurado ENTÃO ele NÃO DEVE impedir commits legítimos por lentidão excessiva (rodar apenas sobre arquivos em stage).

## Não objetivos

- Não implementar componentes visuais (spec 003) nem tokens (spec 002).
- Não configurar HttpClient nem TanStack Query (spec 004).
- Não definir roteamento (spec 005).
