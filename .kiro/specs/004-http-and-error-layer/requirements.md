# Requisitos — 004 http-and-error-layer

## Introdução

Esta spec centraliza a **comunicação com a API** e o **tratamento de erros** do template. Estabelece um HttpClient único, o contrato de erro padronizado (RFC 7807 / `ProblemDetail`), a tradução de erros técnicos para mensagens de usuário na borda, e a configuração do TanStack Query v5 para server state. A UI nunca fala HTTP diretamente: consome casos de uso/portas.

Referências: `hexagonal-architecture.md` (ports/adapters, direção de dependências), `frontend-architecture.md` (API Architecture, Error Handling), `tech.md` (TanStack Query, contrato de erro, versionamento), `testing.md` (MSW).

## Requisitos

### Requisito 1 — HttpClient centralizado

**User Story:** Como desenvolvedor, quero um cliente HTTP central, para não espalhar detalhes de rede pela aplicação.

#### Acceptance Criteria

1. QUANDO uma requisição é feita ENTÃO ela DEVE passar por um HttpClient central que gerencia base URL, headers, timeout, parsing e interceptors.
2. QUANDO um componente precisa de dados ENTÃO ele NÃO DEVE conhecer URLs, headers, status codes ou serialização.
3. QUANDO a API é versionada ENTÃO o cliente DEVE respeitar o prefixo de versão (`/api/v1/...`).
4. QUANDO regra de negócio existir ENTÃO ela NÃO DEVE residir no HttpClient.

### Requisito 2 — Contrato de erro padronizado (ProblemDetail)

**User Story:** Como desenvolvedor, quero erros da API num contrato padronizado, para tratá-los de forma consistente.

#### Acceptance Criteria

1. QUANDO a API retorna erro ENTÃO o sistema DEVE interpretar o contrato RFC 7807 / `ProblemDetail`.
2. QUANDO um erro é interpretado ENTÃO o sistema DEVE mapeá-lo para um tipo de erro de aplicação estruturado (não string solta).
3. QUANDO um erro possui erros de campo ENTÃO o contrato DEVE preservá-los para uso em formulários (consumido em 007).

### Requisito 3 — Tradução de erro para o usuário

**User Story:** Como usuário, quero mensagens de erro compreensíveis, sem detalhes técnicos.

#### Acceptance Criteria

1. QUANDO um erro técnico ocorre ENTÃO o sistema DEVE traduzi-lo em mensagem adequada ao usuário na borda de apresentação.
2. QUANDO um erro é apresentado ENTÃO o sistema NÃO DEVE expor stack trace, status HTTP cru ou dados sensíveis.
3. QUANDO erros ocorrem ENTÃO o sistema DEVE separar nível de infraestrutura, aplicação e apresentação.

### Requisito 4 — Ports e adapters para acesso a dados

**User Story:** Como arquiteto, quero acesso a dados por portas, para preservar a regra de dependência e a testabilidade.

#### Acceptance Criteria

1. QUANDO acesso a dados é necessário ENTÃO ele DEVE ser expresso por uma porta de saída (interface) no núcleo.
2. QUANDO a porta é implementada ENTÃO o adapter concreto DEVE residir na infraestrutura e usar o HttpClient.
3. QUANDO um DTO cruza a fronteira ENTÃO ele DEVE ser mapeado para o modelo de domínio na borda, sem vazar para o núcleo.
4. QUANDO não houver benefício real ENTÃO o sistema NÃO DEVE criar mapeamentos artificiais entre DTO e domínio equivalentes.

### Requisito 5 — TanStack Query para server state

**User Story:** Como desenvolvedor, quero server state gerenciado pelo TanStack Query, com padrões consistentes.

#### Acceptance Criteria

1. QUANDO dados vêm da API ENTÃO eles DEVEM ser tratados como server state via TanStack Query v5.
2. QUANDO queries são criadas ENTÃO elas DEVEM seguir padrões consistentes de cache, invalidation, retry e stale time.
3. QUANDO query keys são definidas ENTÃO elas DEVEM ser padronizadas por feature.
4. QUANDO server state existe ENTÃO ele NÃO DEVE ser copiado para uma store global por conveniência.
5. QUANDO uma operação assíncrona ocorre ENTÃO ela DEVE expor estados idle/loading/success/error.

### Requisito 6 — Cancelamento e concorrência

**User Story:** Como usuário, quero que respostas antigas não sobrescrevam as recentes, para evitar dados inconsistentes.

#### Acceptance Criteria

1. QUANDO requisições concorrentes ocorrem ENTÃO o sistema DEVE evitar que uma resposta antiga sobrescreva uma mais recente.
2. QUANDO uma requisição precisa ser cancelada ENTÃO o sistema DEVE suportar cancelamento (`AbortController`) quando aplicável.

### Requisito 7 — Testabilidade da camada

**User Story:** Como mantenedor, quero testar a camada de dados com a rede mockada na fronteira, para exercitar o adapter real.

#### Acceptance Criteria

1. QUANDO a camada é testada ENTÃO a rede DEVE ser mockada na fronteira via MSW, não a camada de aplicação.
2. QUANDO handlers de teste são criados ENTÃO eles DEVEM cobrir sucesso e erro (incluindo `ProblemDetail`).
3. QUANDO casos de uso são testados ENTÃO eles DEVEM poder usar fakes in-memory das portas.

## Não objetivos

- Não implementar autenticação/refresh de token (spec 008), embora o HttpClient deixe pontos de extensão para isso.
- Não montar formulários que consomem erros de campo (spec 007).
- Não implementar features de negócio.
