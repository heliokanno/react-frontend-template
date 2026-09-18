# Roadmap de Specs — Template Frontend React Corporativo

Este roadmap define a **cronologia de construção** do template. Cada spec é numerada e depende das anteriores, de modo que o núcleo reutilizável seja construído de baixo para cima: primeiro a fundação técnica, depois a linguagem visual, depois a infraestrutura, depois os componentes de composição, depois a sessão e a autorização, e por fim o shell administrativo, a extensibilidade e a feature de referência.

O objetivo do produto (ver `.kiro/steering/product.md`) é uma **fundação frontend reutilizável** — um Admin Template corporativo — não uma aplicação de negócio específica. Toda spec deve preservar a separação **núcleo × features de negócio**.

---

## Princípios do roadmap

- **Incremental**: cada spec entrega valor verificável e prepara terreno para a próxima.
- **Dependências explícitas**: uma spec só começa quando suas dependências estão concluídas.
- **Núcleo primeiro**: o que serve a qualquer projeto derivado vem antes de qualquer domínio de negócio.
- **Arquitetura preservada**: a regra de dependência (UI → Ports → Application → Domain) é respeitada em toda spec (ver `hexagonal-architecture.md`).
- **Qualidade de produção**: cada entrega considera estados (loading/empty/error/success), acessibilidade, responsividade e testes (ver `frontend-engineering.md` e `testing.md`).
- **Componentes antes de fluxos**: telas como login consomem componentes reutilizáveis; por isso a autenticação vem depois dos componentes de composição.

---

## Convenção

- Cada spec vive em `.kiro/specs/<NNN>-<nome>/` com três arquivos:
  - `requirements.md` — requisitos em EARS (o que o sistema deve fazer);
  - `design.md` — decisões técnicas e de arquitetura (como);
  - `tasks.md` — plano de implementação incremental (passos).
- Numeração cronológica de três dígitos (`001`, `002`, …) reflete a ordem de execução.
- Idioma: código em inglês, documentação em português (ver `clean-code.md`).

---

## Visão geral da cronologia

```text
Fundação técnica
   001 project-setup
        ↓
Linguagem visual
   002 design-system-foundation
   003 core-ui-components
        ↓
Infraestrutura de dados
   004 http-and-error-layer
        ↓
Aplicação base
   005 routing-and-app-shell
        ↓
Componentes de composição
   006 data-grid-and-tables
   007 reusable-forms
        ↓
Sessão e autorização
   008 authentication-and-session
   009 authorization-and-permissions
        ↓
Shell administrativo
   010 admin-layout
        ↓
Extensibilidade e referência
   011 feature-extensibility
   012 dashboard-and-example-feature
```

---

## Specs

### 001 — project-setup

**Objetivo**: estabelecer a fundação técnica reprodutível do template.

**Escopo**
- Vite + React 19 + TypeScript em modo estrito.
- pnpm com lockfile versionado.
- ESLint + Prettier (incluindo `eslint-plugin-jsx-a11y`) com falha no CI.
- Path aliases (`@/`) e variáveis de ambiente tipadas (`import.meta.env`).
- Estrutura de pastas base (`app/`, `features/`, `shared/`, `infrastructure/`).
- Toolchain de testes: Vitest, React Testing Library, Playwright, MSW.
- Scripts padronizados no `package.json` (`dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `test:e2e`).
- Husky + lint-staged (recomendado).

**Dependências**: nenhuma.

**Entregável verificável**: projeto instala, builda, faz type check, lint e roda um teste de fumaça.

**Steerings-chave**: `tech.md`, `frontend-architecture.md`, `hexagonal-architecture.md`.

---

### 002 — design-system-foundation

**Objetivo**: definir a linguagem visual como fonte única de verdade.

**Escopo**
- Design tokens: cor, tipografia, espaçamento, sizing, radius, border, shadow, elevation, motion, breakpoint, z-index.
- Separação primitive tokens → semantic tokens → componentes.
- Tailwind CSS v4 dirigido por tokens.
- Tema light/dark via tokens semânticos (componentes não conhecem o tema).
- Base de primitivos headless (Radix / shadcn) adaptada aos tokens.
- Biblioteca de ícones única (lucide-react).

**Dependências**: 001.

**Entregável verificável**: tokens aplicados, alternância de tema funcional, página de referência dos tokens.

**Steerings-chave**: `design-system.md`, `tech.md`, `ux-design.md`.

---

### 003 — core-ui-components

**Objetivo**: entregar os componentes primitivos reutilizáveis do núcleo.

**Escopo**
- Button (variantes e estados), Input, Select, Checkbox, Radio, Switch, Textarea.
- Feedback: Alert, Toast, Badge, Tooltip.
- Overlays: Dialog, Drawer, Dropdown.
- Estados: Skeleton, Spinner, EmptyState, error/empty/loading padronizados.
- Acessibilidade (teclado, foco, ARIA quando necessário) e estados de componente.

**Dependências**: 002.

**Entregável verificável**: componentes com estados completos, acessíveis, cobertos por testes de comportamento.

**Steerings-chave**: `design-system.md`, `frontend-engineering.md`, `ux-design.md`, `testing.md`.

---

### 004 — http-and-error-layer

**Objetivo**: centralizar a comunicação com a API e o tratamento de erros.

**Escopo**
- HttpClient centralizado (base URL, headers, timeout, interceptors, parsing).
- Contrato de erro padronizado (RFC 7807 / `ProblemDetail`) traduzido para mensagens de usuário na borda.
- Portas de saída (interfaces) no núcleo; adapters concretos na infraestrutura.
- TanStack Query v5: configuração de cache, invalidation, retry, stale time, query keys padronizadas.
- Níveis de erro: Infrastructure → Application → Presentation.

**Dependências**: 001 (e 003 para exibir estados de erro na UI).

**Entregável verificável**: cliente HTTP tipado, erros traduzidos, integração com Query validada por testes com MSW.

**Steerings-chave**: `hexagonal-architecture.md`, `frontend-architecture.md`, `tech.md`, `testing.md`.

---

### 005 — routing-and-app-shell

**Objetivo**: montar a camada `app` com roteamento centralizado e composition root.

**Escopo**
- Router centralizado (React Router ou TanStack Router) com type-safe routes.
- Estrutura de rotas públicas e protegidas, layouts e páginas de erro (os guards efetivos de autenticação são preenchidos em 008).
- Lazy loading de páginas e features grandes.
- Error Boundaries com fallback por feature.
- Composition root para injeção de dependências.
- Providers globais (tema, Query client, etc.).

**Dependências**: 002, 003, 004.

**Entregável verificável**: navegação entre rotas, boundary de erro isolando falhas, providers montados.

**Steerings-chave**: `frontend-architecture.md`, `hexagonal-architecture.md`, `tech.md`.

---

### 006 — data-grid-and-tables

**Objetivo**: entregar o Data Grid reutilizável do núcleo.

**Escopo**
- Tabela sobre TanStack Table.
- Ordenação, filtros, paginação, seleção, ações de linha.
- Estados: loading, empty, error.
- URL state para search/page/sort/filters.
- Responsividade (scroll controlado, redução de colunas, detalhes expansíveis).

**Dependências**: 003, 004, 005.

**Entregável verificável**: grid composável com estados completos, URL sincronizada, testes de comportamento.

**Steerings-chave**: `ux-design.md`, `design-system.md`, `frontend-architecture.md`, `tech.md`, `testing.md`.

---

### 007 — reusable-forms

**Objetivo**: entregar a infraestrutura de formulários reutilizável.

**Escopo**
- React Hook Form + Zod como fonte única de schema e tipos.
- Campos reutilizáveis (text, select, checkbox, etc.) acessíveis.
- Validação de UI, estados de submissão (loading/success/error), preservação de dados.
- Integração com o contrato de erro da API (mapear erros de campo).

**Dependências**: 003, 004.

**Entregável verificável**: formulário reutilizável com validação, estados de submissão e erros de campo, coberto por testes.

**Steerings-chave**: `frontend-engineering.md`, `ux-design.md`, `design-system.md`, `tech.md`, `testing.md`.

---

### 008 — authentication-and-session

**Objetivo**: fornecer autenticação e controle de sessão isolados da UI, compondo os componentes e formulários do núcleo.

**Escopo**
- Abstrações `useAuth`, `useCurrentUser`, `login`, `logout`, refresh de token.
- Estratégia de token compatível com backend (JWT / OAuth2 Resource Server).
- Guards de autenticação efetivos nas rotas protegidas (definidas em 005).
- Persistência de sessão e recuperação em refresh.
- Tela de login construída com os componentes (003) e a infraestrutura de formulários (007).

**Dependências**: 004, 005, 007.

**Entregável verificável**: fluxo de login/logout, rota protegida redirecionando não autenticados, sessão persistida.

**Steerings-chave**: `frontend-architecture.md`, `frontend-engineering.md`, `tech.md`, `testing.md`.

---

### 009 — authorization-and-permissions

**Objetivo**: adaptar a UI conforme permissões, sem tratá-la como mecanismo de segurança.

**Escopo**
- Modelo de permissões consumido do backend.
- Ocultar/desabilitar ações e itens de navegação por permissão.
- Guards de rota por permissão e página de acesso negado.
- Pontos de extensão para features registrarem permissões.
- Reforço explícito: autorização real é do backend.

**Dependências**: 008.

**Entregável verificável**: elementos escondidos/desabilitados por permissão, rota negando acesso, testes de UI de autorização.

**Steerings-chave**: `frontend-architecture.md`, `frontend-engineering.md`, `product.md`.

---

### 010 — admin-layout

**Objetivo**: entregar o layout administrativo responsivo do template.

**Escopo**
- Application Shell responsivo.
- Sidebar, Header, Breadcrumb, menu do usuário, notificações.
- Navegação com estado ativo e comportamento por breakpoint.
- Integração com sessão (menu do usuário) e permissões (itens de menu).

**Dependências**: 005, 008, 009.

**Entregável verificável**: layout responsivo navegável em mobile/tablet/desktop, navegação acessível por teclado.

**Steerings-chave**: `ux-design.md`, `design-system.md`, `frontend-engineering.md`, `product.md`.

---

### 011 — feature-extensibility

**Objetivo**: permitir que projetos adicionem features sem editar o núcleo.

**Escopo**
- Registro de rotas por feature.
- Registro de itens de navegação/menu.
- Pontos de extensão para permissões.
- API pública por feature e feature boundaries.
- Documentação do mecanismo de composição.

**Dependências**: 005, 009, 010.

**Entregável verificável**: feature registrada via composição aparece em rotas e menu sem modificar o núcleo.

**Steerings-chave**: `product.md`, `frontend-architecture.md`, `hexagonal-architecture.md`.

---

### 012 — dashboard-and-example-feature

**Objetivo**: validar o template com um dashboard base e uma feature de negócio de referência.

**Escopo**
- Dashboard base orientado a decisões (não apenas coleção de cards).
- Feature de exemplo (ex.: Produtos) compondo Data Grid + Forms + rotas + permissões.
- Demonstra a separação núcleo × negócio e serve de referência para projetos derivados.
- Feature isolada, descartável, sem acoplar o núcleo.

**Dependências**: 006, 007, 010, 011.

**Entregável verificável**: dashboard e CRUD de exemplo funcionando ponta a ponta, com fluxo crítico coberto por E2E.

**Steerings-chave**: `ux-design.md`, `product.md`, `frontend-architecture.md`, `hexagonal-architecture.md`, `testing.md`.

---

## Matriz de dependências

```text
001 ─> 002 ─> 003 ─┬─> 004 ─┬─> 005 ─┬─> 006 ─────────────┐
                   │        │        │                    │
                   │        │        └─> 007 ─┐            │
                   │        └────────────────┼─> 008 ─> 009 ─> 010 ─┬─> 011 ─┐
                   │                          │                     │        │
                   └──────────────────────────┘                     └────────┼─> 012
                                                                              │
                              006 / 007 ─────────────────────────────────────┘
```

Resumo direto:

- **001** não tem dependências.
- **002** depende de 001.
- **003** depende de 002.
- **004** depende de 001 (usa 003 para estados de erro na UI).
- **005** depende de 002, 003, 004.
- **006** depende de 003, 004, 005.
- **007** depende de 003, 004.
- **008** depende de 004, 005, 007.
- **009** depende de 008.
- **010** depende de 005, 008, 009.
- **011** depende de 005, 009, 010.
- **012** depende de 006, 007, 010, 011.

---

## Status

| #   | Spec                          | Status      | Depende de           |
|-----|-------------------------------|-------------|----------------------|
| 001 | project-setup                 | Planejada   | —                    |
| 002 | design-system-foundation      | Planejada   | 001                  |
| 003 | core-ui-components            | Planejada   | 002                  |
| 004 | http-and-error-layer          | Planejada   | 001, 003             |
| 005 | routing-and-app-shell         | Planejada   | 002, 003, 004        |
| 006 | data-grid-and-tables          | Planejada   | 003, 004, 005        |
| 007 | reusable-forms                | Planejada   | 003, 004             |
| 008 | authentication-and-session    | Planejada   | 004, 005, 007        |
| 009 | authorization-and-permissions | Planejada   | 008                  |
| 010 | admin-layout                  | Planejada   | 005, 008, 009        |
| 011 | feature-extensibility         | Planejada   | 005, 009, 010        |
| 012 | dashboard-and-example-feature | Planejada   | 006, 007, 010, 011   |

Atualizar a coluna **Status** conforme cada spec avança (Planejada → Em progresso → Concluída).
