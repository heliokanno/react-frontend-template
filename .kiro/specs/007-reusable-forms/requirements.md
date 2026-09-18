# Requisitos — 007 reusable-forms

## Introdução

Esta spec entrega a **infraestrutura de formulários reutilizável** do núcleo: React Hook Form + Zod como fonte única de schema e tipos, campos reutilizáveis acessíveis, validação, estados de submissão e integração com o contrato de erro da API (spec 004). Features de negócio compõem formulários a partir desses blocos, sem reimplementar validação e acessibilidade.

Referências: `frontend-engineering.md` (Forms Engineering, a11y), `ux-design.md` (Form UX), `design-system.md` (Forms), `tech.md` (RHF + Zod), `testing.md`.

## Requisitos

### Requisito 1 — RHF + Zod como fonte única

**User Story:** Como desenvolvedor, quero schema e tipos derivados de uma única fonte, para evitar divergência entre validação e tipos.

#### Acceptance Criteria

1. QUANDO um formulário é criado ENTÃO ele DEVE usar React Hook Form para gerenciamento de estado.
2. QUANDO a validação é definida ENTÃO ela DEVE usar Zod como fonte única de schema.
3. QUANDO tipos do formulário são necessários ENTÃO eles DEVEM ser derivados do schema Zod (não duplicados manualmente).

### Requisito 2 — Campos reutilizáveis acessíveis

**User Story:** Como desenvolvedor, quero campos prontos e acessíveis, para montar formulários consistentes.

#### Acceptance Criteria

1. QUANDO um campo é usado ENTÃO ele DEVE integrar o controle de 003 com label, descrição e mensagem de erro associadas.
2. QUANDO um campo está inválido ENTÃO a mensagem de erro DEVE estar associada ao campo (`aria-describedby`, `aria-invalid`).
3. QUANDO um campo é obrigatório ENTÃO isso DEVE ser comunicado de forma acessível.
4. QUANDO um campo é renderizado ENTÃO o placeholder NÃO DEVE substituir o label.

### Requisito 3 — Validação de UI

**User Story:** Como usuário, quero validação clara ao preencher, para corrigir erros facilmente.

#### Acceptance Criteria

1. QUANDO o usuário submete inválido ENTÃO o sistema DEVE exibir os erros de validação próximos aos campos.
2. QUANDO a validação de UI é aplicada ENTÃO ela DEVE melhorar a UX, mas NÃO DEVE substituir a validação do backend.
3. QUANDO há erros ENTÃO o foco/anúncio DEVE ajudar o usuário a localizá-los.

### Requisito 4 — Estados de submissão

**User Story:** Como usuário, quero feedback de submissão, para saber se minha ação teve efeito.

#### Acceptance Criteria

1. QUANDO uma submissão ocorre ENTÃO o formulário DEVE tratar loading, success e error.
2. QUANDO a submissão está em andamento ENTÃO o sistema DEVE impedir submissões duplicadas.
3. QUANDO a submissão falha ENTÃO os dados digitados DEVEM ser preservados.

### Requisito 5 — Integração com erros da API

**User Story:** Como usuário, quero que erros de validação do servidor apareçam nos campos certos.

#### Acceptance Criteria

1. QUANDO a API retorna erros de campo (via `ProblemDetail`/`AppError` de 004) ENTÃO o formulário DEVE mapeá-los aos campos correspondentes.
2. QUANDO um erro geral ocorre ENTÃO ele DEVE ser exibido de forma agregada (Alert/Toast), sem detalhes técnicos.

### Requisito 6 — Testes

**User Story:** Como mantenedor, quero formulários testados, por serem parte crítica do núcleo.

#### Acceptance Criteria

1. QUANDO um formulário é entregue ENTÃO ele DEVE ter testes de validação, submissão e estados.
2. QUANDO erros de campo da API são tratados ENTÃO isso DEVE ser coberto por teste.
3. QUANDO testes consultam o DOM ENTÃO eles DEVEM usar role/label.

## Não objetivos

- Não implementar formulários de negócio específicos (spec 012 traz o exemplo).
- Não implementar autenticação, embora o login (008) consuma esta infraestrutura.
