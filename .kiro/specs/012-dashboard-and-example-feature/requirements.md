# Requisitos — 012 dashboard-and-example-feature

## Introdução

Esta spec **valida o template ponta a ponta** com um dashboard base e uma feature de negócio de exemplo (Products) que compõe os blocos do núcleo: Data Grid (006), Forms (007), rotas (005), sessão (008), permissões (009) e o mecanismo de extensibilidade (011). A feature de exemplo é isolada e descartável, servindo de referência para projetos derivados — sem acoplar o núcleo.

Referências: `product.md` (Núcleo × Negócio), `ux-design.md` (Dashboards), `frontend-architecture.md`, `hexagonal-architecture.md`, `testing.md` (E2E).

## Requisitos

### Requisito 1 — Dashboard base orientado a decisões

**User Story:** Como usuário, quero um dashboard que me ajude a decidir e agir, não apenas cards soltos.

#### Acceptance Criteria

1. QUANDO o dashboard é projetado ENTÃO ele DEVE priorizar as informações e ações que o usuário precisa, não ser uma coleção genérica de cards.
2. QUANDO o dashboard carrega ENTÃO ele DEVE tratar loading, empty e error.
3. QUANDO o dashboard é exibido ENTÃO ele NÃO DEVE aplicar estética genérica de "dashboard de IA" (ver AI Aesthetic Prevention).

### Requisito 2 — Feature de exemplo com arquitetura hexagonal

**User Story:** Como desenvolvedor, quero uma feature de referência com camadas bem definidas, para replicar o padrão.

#### Acceptance Criteria

1. QUANDO a feature de exemplo é criada ENTÃO ela DEVE ter domain, application (ports in/out + services), infrastructure (adapters) e ui.
2. QUANDO o domínio é escrito ENTÃO ele NÃO DEVE importar React, HTTP ou detalhes de infraestrutura.
3. QUANDO dados são acessados ENTÃO isso DEVE passar por portas com adapter HTTP e mapeamento DTO↔domínio na borda.

### Requisito 3 — Listagem compondo o Data Grid

**User Story:** Como usuário, quero listar registros da feature com filtros e paginação.

#### Acceptance Criteria

1. QUANDO a listagem é exibida ENTÃO ela DEVE usar o Data Grid (006) com ordenação, filtros e paginação.
2. QUANDO o usuário filtra/pagina/ordena ENTÃO o estado DEVE refletir na URL.
3. QUANDO os dados carregam ENTÃO os estados loading/empty/error DEVEM ser tratados.

### Requisito 4 — Formulário compondo a infraestrutura de forms

**User Story:** Como usuário, quero criar e editar registros com validação e feedback.

#### Acceptance Criteria

1. QUANDO um registro é criado/editado ENTÃO o formulário DEVE usar a infraestrutura de forms (007) com schema Zod.
2. QUANDO a submissão ocorre ENTÃO os estados loading/success/error DEVEM ser tratados.
3. QUANDO a API retorna erros de campo ENTÃO eles DEVEM ser mapeados aos campos correspondentes.
4. QUANDO uma exclusão é solicitada ENTÃO a ação destrutiva DEVE ter confirmação adequada.

### Requisito 5 — Integração com sessão e permissões

**User Story:** Como produto, quero que a feature respeite sessão e permissões, para demonstrar o padrão de segurança de UX.

#### Acceptance Criteria

1. QUANDO a feature tem rotas ENTÃO elas DEVEM ser protegidas por sessão (008).
2. QUANDO ações/itens exigem permissão ENTÃO eles DEVEM ser gated conforme 009.
3. QUANDO a feature é registrada ENTÃO isso DEVE ocorrer via o mecanismo de extensibilidade (011), sem editar o núcleo.

### Requisito 6 — Isolamento núcleo × negócio

**User Story:** Como mantenedor, quero a feature isolada e descartável, para preservar o núcleo reutilizável.

#### Acceptance Criteria

1. QUANDO a feature é implementada ENTÃO ela NÃO DEVE modificar nem duplicar o núcleo.
2. QUANDO a feature é desabilitada ENTÃO ela DEVE poder ser removida sem afetar o núcleo.
3. QUANDO o núcleo é analisado ENTÃO ele NÃO DEVE depender da feature de exemplo.

### Requisito 7 — Testes e fluxo crítico E2E

**User Story:** Como mantenedor, quero o fluxo crítico coberto por E2E, para garantir a integração ponta a ponta.

#### Acceptance Criteria

1. QUANDO casos de uso da feature são testados ENTÃO eles DEVEM usar fake in-memory da porta.
2. QUANDO a listagem e o formulário são testados ENTÃO a rede DEVE ser mockada via MSW, cobrindo estados.
3. QUANDO o fluxo crítico é validado ENTÃO um teste E2E (Playwright) DEVE cobrir login → navegar → criar registro → vê-lo na listagem.
4. QUANDO permissão é negada ENTÃO o comportamento DEVE ser verificado.

## Não objetivos

- Não transformar a feature de exemplo em produto de negócio real; ela é referência enxuta.
- Não adicionar domínio de negócio ao núcleo reutilizável.
