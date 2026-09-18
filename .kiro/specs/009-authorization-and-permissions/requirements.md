# Requisitos — 009 authorization-and-permissions

## Introdução

Esta spec adapta a **UI conforme permissões** do usuário, sem tratar o frontend como mecanismo de segurança. Ela consome as permissões da sessão (008), oculta/desabilita ações e itens de navegação, protege rotas por permissão e oferece pontos de extensão para features registrarem suas permissões. Autorização real permanece responsabilidade do backend.

Referências: `frontend-architecture.md` (Authorization), `frontend-engineering.md` (Security), `product.md` (Extensibilidade), `testing.md`.

## Requisitos

### Requisito 1 — Modelo de permissões

**User Story:** Como desenvolvedor, quero um modelo de permissões consumido do backend, para adaptar a UI.

#### Acceptance Criteria

1. QUANDO o usuário autentica ENTÃO o sistema DEVE obter suas permissões a partir do backend/sessão.
2. QUANDO permissões são representadas ENTÃO elas DEVEM ter um modelo tipado e consistente.
3. QUANDO uma verificação é feita ENTÃO o sistema DEVE prover uma API clara (ex.: `useHasPermission`, `<Can>`).

### Requisito 2 — Ocultar/desabilitar ações por permissão

**User Story:** Como produto, quero esconder ou desabilitar ações que o usuário não pode executar, para uma UX coerente.

#### Acceptance Criteria

1. QUANDO o usuário não tem permissão para uma ação ENTÃO o sistema DEVE ocultá-la ou desabilitá-la conforme o caso.
2. QUANDO uma ação é desabilitada por permissão ENTÃO o motivo PODE ser comunicado de forma acessível.
3. QUANDO a UI adapta-se por permissão ENTÃO isso NÃO DEVE ser considerado mecanismo de segurança.

### Requisito 3 — Navegação por permissão

**User Story:** Como usuário, quero ver no menu apenas o que posso acessar, para não me confundir com opções indisponíveis.

#### Acceptance Criteria

1. QUANDO itens de navegação são renderizados ENTÃO o sistema DEVE filtrá-los conforme as permissões.
2. QUANDO uma área é indisponível ENTÃO ela NÃO DEVE aparecer como destino navegável para quem não tem permissão.

### Requisito 4 — Guards de rota por permissão

**User Story:** Como usuário, quero ser impedido de acessar rotas sem permissão, com feedback claro.

#### Acceptance Criteria

1. QUANDO uma rota exige permissão ENTÃO um guard DEVE verificar a permissão antes de renderizar.
2. QUANDO a permissão falta ENTÃO o sistema DEVE exibir uma página de acesso negado.
3. QUANDO o backend nega acesso (403) ENTÃO a UI DEVE tratar o erro de forma coerente com o guard.

### Requisito 5 — Pontos de extensão para features

**User Story:** Como desenvolvedor de feature, quero registrar permissões da minha feature, sem editar o núcleo.

#### Acceptance Criteria

1. QUANDO uma feature define permissões ENTÃO ela DEVE registrá-las via ponto de extensão, sem modificar o núcleo.
2. QUANDO o núcleo verifica permissões ENTÃO ele NÃO DEVE conhecer permissões específicas de features concretas.

### Requisito 6 — Autorização real no backend

**User Story:** Como responsável por segurança, quero que a autorização real seja do backend, para não depender da UI.

#### Acceptance Criteria

1. QUANDO a UI oculta/desabilita algo ENTÃO isso DEVE ser tratado como UX, não segurança.
2. QUANDO uma operação sensível é feita ENTÃO o backend DEVE ser a autoridade final de autorização.

### Requisito 7 — Testes

**User Story:** Como mantenedor, quero a autorização de UI testada, por afetar todos os projetos derivados.

#### Acceptance Criteria

1. QUANDO a autorização é entregue ENTÃO DEVE haver testes de ocultar/desabilitar ações e filtrar navegação por permissão.
2. QUANDO um guard de permissão é testado ENTÃO o acesso negado DEVE ser verificado.
3. QUANDO testes consultam o DOM ENTÃO eles DEVEM usar role/label.

## Não objetivos

- Não implementar autenticação (spec 008, dependência).
- Não implementar o layout (spec 010), embora forneça a base para filtrar o menu.
- Não substituir autorização de backend.
