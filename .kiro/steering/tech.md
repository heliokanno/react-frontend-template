---
inclusion: always
---

# Stack e Padrões Técnicos

Esta steering define a stack concreta do template. Como é um **template reutilizável**, a stack aqui definida é herdada por todos os projetos derivados — mudá-la exige justificativa técnica explícita.

As demais steerings referenciam "a biblioteca/ferramenta definida pelo projeto"; este arquivo é essa definição. Onde uma escolha for opcional ou substituível, isso está indicado.

---

## Runtime e linguagem

- **TypeScript** em modo estrito (`strict: true`) como baseline. Sem `any` injustificado (ver `frontend-engineering.md`).
- **React 19+** com function components e Hooks. Sem class components em código novo.
- **Node.js LTS** (mínimo a versão LTS ativa) para o toolchain e ambiente de build.
- Usar recursos modernos da linguagem quando aumentarem clareza e segurança: discriminated unions, `satisfies`, generics quando necessários, tipos utilitários.

---

## Build e dev server

- **Vite** como bundler e dev server.
- Configuração de build reprodutível; sem passos manuais fora do `package.json`.
- Path aliases configurados (ex.: `@/`) para evitar imports relativos profundos.
- Variáveis de ambiente via mecanismo do Vite (`import.meta.env`), tipadas.

---

## Gerenciador de pacotes

- **pnpm** como gerenciador padrão (workspaces, disco eficiente, instalação determinística).
- Lockfile sempre versionado.
- Dependências com versões pinadas/consistentes; não misturar gerenciadores.
- Antes de adicionar dependência, seguir o checklist de `frontend-engineering.md` → Dependencies.

---

## Roteamento

- **React Router** ou **TanStack Router** como router. Preferir router com suporte a type-safe routes e lazy loading.
- Roteamento centralizado na camada `app` (ver `frontend-architecture.md` → Routing).
- Rotas públicas e protegidas, com guards de autenticação/autorização.
- Cada feature de negócio registra suas rotas via mecanismo de composição, sem editar o núcleo (ver `product.md` → Extensibilidade).

---

## Server State

- **TanStack Query (React Query) v5+** para todo dado proveniente de API.
- Server state nunca é copiado para uma store global por conveniência (ver `frontend-architecture.md` → Server State).
- Padrões consistentes de cache, invalidation, retry, stale time e optimistic updates.
- Query keys padronizadas por feature.

---

## Client State

- Estado de UI permanece **local** por padrão (`useState`, `useReducer`).
- Estado navegável na **URL** (search params).
- Estado global apenas quando houver necessidade real de compartilhamento (sessão, tema, preferências).
- Quando um store global for necessário, usar **Zustand** como padrão. Evitar Redux salvo justificativa.
- Não usar Context como substituto universal de state management.

---

## Formulários e validação

- **React Hook Form** para gerenciamento de formulários.
- **Zod** como fonte única de schema e validação, com tipos derivados do schema.
- Validação de UI melhora UX mas nunca substitui validação do backend (ver `frontend-architecture.md` → Validation).

---

## Styling e Design System

- **Tailwind CSS v4+** como base de estilo utilitário, dirigido por tokens do Design System (ver `design-system.md`).
- Tokens de design como fonte única de verdade (cores, espaçamento, tipografia, radius, sombras, motion). Sem valores arbitrários quando existir token.
- Componentes primitivos acessíveis via **Radix UI** (ou equivalente headless), estilizados pelo Design System. Padrão recomendado: **shadcn/ui** como ponto de partida dos primitivos, adaptado aos tokens do projeto.
- Suporte a tema (light/dark) via tokens semânticos; componentes não conhecem o tema atual.

---

## Ícones

- Uma única biblioteca de ícones consistente (padrão: **lucide-react**).
- Não misturar bibliotecas de ícones sem justificativa (ver `design-system.md` → Icons).

---

## Data Grid e Tabelas

- **TanStack Table** para tabelas e data grid reutilizáveis do núcleo.
- O Data Grid é parte do núcleo reutilizável; features de negócio o compõem, não o reescrevem.

---

## Comunicação com API

- Cliente HTTP centralizado sobre `fetch` nativo (padrão) ou **axios** quando os interceptors justificarem.
- A UI nunca chama HTTP diretamente; consome casos de uso/portas (ver `hexagonal-architecture.md`).
- Contrato de erro padronizado alinhado ao backend (RFC 7807 / `ProblemDetail`), traduzido para mensagens de usuário na borda.
- APIs REST sob versionamento (`/api/v1/...`), coerente com os backends da plataforma.
- Quando houver OpenAPI disponível, preferir geração de tipos a partir do contrato em vez de tipos manuais duplicados.

---

## Autenticação e sessão

- Autenticação isolada da UI, exposta por abstrações (`useAuth`, `useCurrentUser`, `login`, `logout`).
- Estratégia de token compatível com os backends (JWT / OAuth2 Resource Server).
- Nunca armazenar secrets no frontend; autorização real é sempre do backend (ver `frontend-engineering.md` → Security).

---

## Idioma

- **Código-fonte em inglês**: nomes de arquivos, diretórios, variáveis, funções, tipos, componentes, hooks, constantes, chaves e identificadores técnicos.
- **Documentação e artefatos escritos em português (BR)**: comentários, README, steerings, ADRs, docs de design/requisitos/specs, descrições de PR e changelog.
- Texto voltado ao usuário segue o idioma do produto / i18n (ver `tech.md` → Internacionalização).
- Detalhes e exceções em `clean-code.md` → Idioma do Código / Idioma da Documentação e Artefatos.

## Qualidade de código

- **ESLint** e **Prettier** configurados; o CI deve falhar em violações.
- Regras de tipagem e acessibilidade no lint (ex.: `eslint-plugin-jsx-a11y`).
- Formatação não é preferência pessoal; segue a ferramenta (ver `clean-code.md` → Formatação).
- **Husky + lint-staged** para checagens em pre-commit (opcional, mas recomendado no template).

---

## Testes

- **Vitest** como test runner.
- **React Testing Library** para testes de componente, priorizando comportamento observável.
- **Playwright** para testes end-to-end de fluxos críticos.
- **MSW (Mock Service Worker)** para mockar a camada de rede em testes de integração/componente.
- Detalhes de estratégia em `frontend-engineering.md` → Testing (e futura steering `testing.md`, se criada).

---

## Internacionalização (quando aplicável)

- Componentes não assumem texto de tamanho fixo (ver `design-system.md` → Internationalization Readiness).
- Quando i18n for necessário, adotar biblioteca dedicada (padrão sugerido: **i18next / react-i18next**) com chaves estruturadas e formatação de datas/números/moeda por locale.

---

## Observabilidade (quando configurada)

- Instrumentação de erros e performance separada da lógica de negócio.
- Nunca registrar secrets, tokens ou dados pessoais desnecessários (ver `frontend-engineering.md` → Observability).
- Correlação de trace com o backend quando disponível.

---

## Configuração

- Configuração externalizada e tipada; nada de secrets versionados.
- O que varia por projeto é configuração, não fork do núcleo (ver `product.md` → Configurabilidade).
- Path aliases, variáveis de ambiente e feature flags documentados.

---

## Comandos úteis

Ajustar aos scripts reais do `package.json`. Referência esperada:

- Instalar dependências: `pnpm install`
- Dev server (executar manualmente no terminal): `pnpm dev`
- Build de produção: `pnpm build`
- Preview do build: `pnpm preview`
- Lint: `pnpm lint`
- Format: `pnpm format`
- Type check: `pnpm typecheck`
- Testes (single run): `pnpm test`
- Testes E2E: `pnpm test:e2e`

> Não iniciar dev server ou watchers em modo bloqueante dentro de automações; executá-los manualmente no terminal.

---

## Regras de evolução da stack

- Mudança de ferramenta central (bundler, router, server state, styling) afeta todos os projetos derivados; exige justificativa e atualização desta steering.
- Preferir soluções da plataforma/nativas a novas dependências (ver `frontend-engineering.md` → Browser APIs e Dependencies).
- Não adicionar bibliotecas pesadas para problemas triviais.

Referência universal do workspace: `apps/steerings/instructions.md`.
