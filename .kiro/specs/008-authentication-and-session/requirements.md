# Requisitos — 008 authentication-and-session

## Introdução

Esta spec fornece **autenticação e controle de sessão** isolados da UI, expostos por abstrações (`useAuth`, `useCurrentUser`, `login`, `logout`). A tela de login é construída sobre os componentes (003) e a infraestrutura de formulários (007); o token integra-se aos interceptors do HttpClient (004); e os guards estruturados na spec 005 passam a consumir a sessão real.

Referências: `frontend-architecture.md` (Authentication), `frontend-engineering.md` (Authentication, Security), `tech.md` (JWT/OAuth2), `hexagonal-architecture.md`, `testing.md`.

## Requisitos

### Requisito 1 — Autenticação isolada da UI

**User Story:** Como desenvolvedor, quero autenticação atrás de abstrações, para não espalhar detalhes de token pelos componentes.

#### Acceptance Criteria

1. QUANDO a UI precisa de sessão ENTÃO ela DEVE consumir abstrações (`useAuth`, `useCurrentUser`, `login`, `logout`).
2. QUANDO um componente é escrito ENTÃO ele NÃO DEVE manipular token, headers ou refresh diretamente.
3. QUANDO autenticação é implementada ENTÃO ela DEVE seguir ports/adapters (caso de uso + gateway), montada no composition root.

### Requisito 2 — Login e logout

**User Story:** Como usuário, quero entrar e sair da aplicação, para acessar áreas protegidas com segurança.

#### Acceptance Criteria

1. QUANDO o usuário submete credenciais válidas ENTÃO o sistema DEVE autenticar e estabelecer a sessão.
2. QUANDO as credenciais são inválidas ENTÃO o sistema DEVE exibir mensagem de erro adequada, sem detalhes técnicos.
3. QUANDO o usuário faz logout ENTÃO o sistema DEVE encerrar a sessão e limpar o estado autenticado.
4. QUANDO a tela de login é construída ENTÃO ela DEVE usar os componentes (003) e a infraestrutura de formulários (007), com estados loading/error/success.

### Requisito 3 — Token e integração com o HttpClient

**User Story:** Como desenvolvedor, quero o token anexado automaticamente às requisições, para não repetir esse detalhe.

#### Acceptance Criteria

1. QUANDO uma requisição autenticada ocorre ENTÃO o interceptor do HttpClient (004) DEVE anexar o token.
2. QUANDO a estratégia de token é definida ENTÃO ela DEVE ser compatível com o backend (JWT / OAuth2 Resource Server).
3. QUANDO um secret é considerado ENTÃO o sistema NÃO DEVE armazená-lo no frontend.

### Requisito 4 — Refresh de sessão

**User Story:** Como usuário, quero permanecer logado sem reautenticar a cada expiração curta.

#### Acceptance Criteria

1. QUANDO uma resposta 401 indica token expirado ENTÃO o sistema DEVE tentar refresh e repetir a requisição.
2. QUANDO múltiplas requisições disparam refresh ENTÃO o sistema DEVE evitar refresh concorrentes redundantes.
3. QUANDO o refresh falha ENTÃO o sistema DEVE encerrar a sessão e redirecionar ao login.

### Requisito 5 — Persistência e recuperação de sessão

**User Story:** Como usuário, quero continuar logado após atualizar a página.

#### Acceptance Criteria

1. QUANDO a página é recarregada ENTÃO o sistema DEVE recuperar a sessão existente antes de decidir a rota.
2. QUANDO a sessão é persistida ENTÃO o mecanismo DEVE considerar o risco de segurança (preferir cookie httpOnly quando o backend suportar).

### Requisito 6 — Guards de rota (preenche 005)

**User Story:** Como usuário, quero ser redirecionado ao login ao acessar área protegida sem sessão.

#### Acceptance Criteria

1. QUANDO uma rota protegida é acessada sem sessão ENTÃO o sistema DEVE redirecionar ao login preservando o destino.
2. QUANDO o login é concluído ENTÃO o sistema DEVE retornar ao destino originalmente solicitado.
3. QUANDO a sessão está sendo recuperada ENTÃO o guard DEVE exibir estado de carregamento em vez de redirecionar prematuramente.

### Requisito 7 — Testes

**User Story:** Como mantenedor, quero autenticação testada, por ser fluxo crítico do núcleo.

#### Acceptance Criteria

1. QUANDO casos de uso são testados ENTÃO eles DEVEM usar fake do gateway de auth.
2. QUANDO o login é testado por integração ENTÃO a rede DEVE ser mockada via MSW (sucesso e erro).
3. QUANDO o guard é testado ENTÃO o redirecionamento e a restauração de destino DEVEM ser verificados.

## Não objetivos

- Não implementar autorização por permissões (spec 009).
- Não implementar o layout administrativo (spec 010).
- Não tratar a UI como mecanismo de segurança; autorização real é do backend.
