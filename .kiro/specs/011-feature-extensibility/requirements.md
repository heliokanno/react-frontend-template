# Requisitos — 011 feature-extensibility

## Introdução

Esta spec entrega o **mecanismo de extensibilidade** que permite a um projeto derivado adicionar features de negócio **sem editar o núcleo**: registro de rotas, itens de navegação e permissões por feature, API pública por feature e feature boundaries. É a materialização da regra de produto (`product.md`): o núcleo resolve o comum uma vez; projetos apenas compõem.

Referências: `product.md` (Extensibilidade, Núcleo × Negócio), `frontend-architecture.md` (Feature Boundaries, Feature Communication), `hexagonal-architecture.md` (direção de dependências).

## Requisitos

### Requisito 1 — Registro de rotas por feature

**User Story:** Como desenvolvedor de feature, quero registrar as rotas da minha feature, sem editar o roteamento do núcleo.

#### Acceptance Criteria

1. QUANDO uma feature define rotas ENTÃO ela DEVE registrá-las via mecanismo de composição.
2. QUANDO o router monta ENTÃO ele DEVE incluir as rotas registradas sem que o núcleo conheça cada feature concreta.
3. QUANDO uma feature é removida ENTÃO retirar seu registro NÃO DEVE exigir mudança no núcleo.

### Requisito 2 — Registro de navegação por feature

**User Story:** Como desenvolvedor de feature, quero registrar itens de menu, para que a feature apareça na navegação.

#### Acceptance Criteria

1. QUANDO uma feature registra itens de navegação ENTÃO eles DEVEM aparecer na sidebar (010) conforme a ordem/estrutura definida.
2. QUANDO um item exige permissão ENTÃO o registro DEVE integrar-se à filtragem por permissão (009).

### Requisito 3 — Registro de permissões por feature

**User Story:** Como desenvolvedor de feature, quero registrar as permissões da minha feature, sem editar o núcleo.

#### Acceptance Criteria

1. QUANDO uma feature define permissões ENTÃO ela DEVE registrá-las via o registry de 009.
2. QUANDO o núcleo verifica permissões ENTÃO ele NÃO DEVE conhecer permissões específicas de features.

### Requisito 4 — API pública por feature e boundaries

**User Story:** Como arquiteto, quero features com API pública clara, para reduzir acoplamento.

#### Acceptance Criteria

1. QUANDO uma feature expõe algo ENTÃO ela DEVE fazê-lo por uma API pública (`index.ts`), mantendo internals privados.
2. QUANDO uma feature usa outra ENTÃO ela DEVE consumir a API pública, não os internals.
3. QUANDO dependências são analisadas ENTÃO NÃO DEVE haver dependência do núcleo para uma feature concreta, nem dependências circulares.

### Requisito 5 — Configurabilidade

**User Story:** Como projeto derivado, quero habilitar/desabilitar features por configuração, para compor o produto sem fork.

#### Acceptance Criteria

1. QUANDO features são habilitadas ENTÃO isso DEVE ser configuração, não fork do núcleo.
2. QUANDO uma feature é desabilitada ENTÃO suas rotas, navegação e permissões NÃO DEVEM ser montadas.

### Requisito 6 — Documentação do mecanismo

**User Story:** Como novo desenvolvedor, quero documentação de como adicionar uma feature, para começar rápido.

#### Acceptance Criteria

1. QUANDO o mecanismo é entregue ENTÃO ele DEVE ser documentado com um passo a passo de como registrar uma feature.
2. QUANDO a documentação existe ENTÃO ela DEVE incluir um exemplo mínimo de feature registrada.

### Requisito 7 — Testes

**User Story:** Como mantenedor, quero o mecanismo de extensibilidade testado, por ser central ao propósito do template.

#### Acceptance Criteria

1. QUANDO uma feature de teste é registrada ENTÃO seus itens de rota e navegação DEVEM aparecer sem editar o núcleo.
2. QUANDO a feature de teste é desabilitada ENTÃO seus itens NÃO DEVEM ser montados.

## Não objetivos

- Não implementar uma feature de negócio real completa (spec 012 traz o exemplo de referência).
- Não alterar a autoridade de autorização (permanece no backend).
