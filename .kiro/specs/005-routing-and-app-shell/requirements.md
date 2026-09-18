# Requisitos — 005 routing-and-app-shell

## Introdução

Esta spec monta a **camada `app`**: roteamento centralizado, estrutura de rotas públicas e protegidas, lazy loading, Error Boundaries com fallback por feature, providers globais e o composition root de injeção de dependências. É a espinha que conecta a linguagem visual (002/003) e a camada de dados (004) em uma aplicação navegável. Os guards de autenticação são estruturados aqui e preenchidos com a sessão real na spec 008.

Referências: `frontend-architecture.md` (Routing, App Layer, Error Boundaries), `hexagonal-architecture.md` (composition root), `tech.md`.

## Requisitos

### Requisito 1 — Roteamento centralizado

**User Story:** Como desenvolvedor, quero o roteamento centralizado na camada `app`, para refletir a arquitetura funcional da aplicação.

#### Acceptance Criteria

1. QUANDO rotas são definidas ENTÃO elas DEVEM ser declaradas centralmente na camada `app`.
2. QUANDO uma rota é referenciada ENTÃO o sistema DEVE usar constantes de rota tipadas em vez de strings mágicas.
3. QUANDO o router é escolhido ENTÃO ele DEVE suportar rotas type-safe e lazy loading.

### Requisito 2 — Rotas públicas e protegidas

**User Story:** Como usuário, quero áreas públicas e protegidas, para que conteúdo restrito exija sessão.

#### Acceptance Criteria

1. QUANDO uma rota pública é acessada ENTÃO ela DEVE ser exibida sem exigir sessão.
2. QUANDO uma rota protegida é definida ENTÃO ela DEVE passar por um guard de autenticação.
3. QUANDO a lógica de sessão ainda não existe ENTÃO o guard DEVE consumir uma abstração de sessão a ser preenchida na spec 008, sem reescrever o roteamento.
4. QUANDO uma rota inexistente é acessada ENTÃO o sistema DEVE exibir uma página 404.

### Requisito 3 — Lazy loading

**User Story:** Como usuário, quero carregamento sob demanda, para páginas iniciais mais rápidas.

#### Acceptance Criteria

1. QUANDO uma página ou feature grande é carregada ENTÃO o sistema DEVE aplicar lazy loading.
2. QUANDO um chunk carrega ENTÃO o sistema DEVE exibir um fallback de loading (Skeleton/Spinner).
3. QUANDO um componente é pequeno ENTÃO o sistema NÃO DEVE dividi-lo sem benefício.

### Requisito 4 — Error Boundaries

**User Story:** Como usuário, quero que uma falha isolada não derrube a aplicação inteira.

#### Acceptance Criteria

1. QUANDO ocorre erro de renderização ENTÃO um Error Boundary raiz DEVE evitar que a aplicação inteira quebre.
2. QUANDO uma feature falha ENTÃO o sistema DEVE prover fallback isolado da feature sem destruir as demais.
3. QUANDO um erro é exibido ENTÃO a página DEVE oferecer caminho de recuperação.

### Requisito 5 — Providers globais

**User Story:** Como desenvolvedor, quero providers globais compostos em um único ponto, para configuração previsível.

#### Acceptance Criteria

1. QUANDO a aplicação inicializa ENTÃO os providers globais (tema, Query client, toast) DEVEM ser compostos em ordem previsível.
2. QUANDO um provider é adicionado ENTÃO ele NÃO DEVE conter regra de negócio específica.

### Requisito 6 — Composition root (DI)

**User Story:** Como arquiteto, quero um único ponto de montagem de dependências, para preservar a regra de dependência.

#### Acceptance Criteria

1. QUANDO casos de uso são montados ENTÃO eles DEVEM ser criados em um composition root na camada `app`.
2. QUANDO a UI consome um caso de uso ENTÃO ela DEVE receber a abstração, não a implementação de infraestrutura.
3. QUANDO adapters concretos são criados ENTÃO eles NÃO DEVEM ser instanciados dentro do domínio ou da aplicação.
4. QUANDO a DI é implementada ENTÃO ela DEVE permanecer simples e explícita, sem framework próprio complexo.

### Requisito 7 — Acessibilidade de navegação

**User Story:** Como usuário de leitor de tela, quero que a troca de rota seja perceptível, para me orientar.

#### Acceptance Criteria

1. QUANDO a rota muda ENTÃO o foco DEVE ser gerenciado adequadamente (ex.: mover para o conteúdo principal).
2. QUANDO a navegação ocorre ENTÃO ela DEVE ser perceptível por tecnologias assistivas.

## Não objetivos

- Não implementar autenticação/sessão real (spec 008) — apenas a estrutura de guard.
- Não implementar o layout administrativo completo (spec 010) — apenas layouts base.
- Não implementar autorização por permissões (spec 009).
