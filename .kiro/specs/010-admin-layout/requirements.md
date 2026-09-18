# Requisitos — 010 admin-layout

## Introdução

Esta spec entrega o **layout administrativo responsivo** do template: Application Shell com Sidebar, Header, Breadcrumb, menu do usuário e notificações. O layout integra sessão (menu do usuário, de 008) e permissões (itens de menu, de 009), preenchendo o `RootLayout` estruturado na spec 005. É o esqueleto visual de qualquer projeto derivado.

Referências: `ux-design.md` (Information Architecture, Navigation, Responsive UX), `design-system.md` (Navigation), `frontend-engineering.md`, `product.md`.

## Requisitos

### Requisito 1 — Application Shell responsivo

**User Story:** Como usuário, quero um shell administrativo consistente, para navegar entre áreas com previsibilidade.

#### Acceptance Criteria

1. QUANDO a área autenticada é exibida ENTÃO o sistema DEVE renderizar um shell com header, sidebar e área de conteúdo.
2. QUANDO o shell é montado ENTÃO ele DEVE preencher o `RootLayout` definido na spec 005.
3. QUANDO a viewport muda ENTÃO o shell DEVE adaptar o layout por breakpoint (mobile, tablet, desktop).

### Requisito 2 — Sidebar de navegação

**User Story:** Como usuário, quero uma sidebar de navegação, para acessar as áreas da aplicação.

#### Acceptance Criteria

1. QUANDO a sidebar é exibida ENTÃO ela DEVE indicar claramente a localização atual (estado ativo).
2. QUANDO em telas pequenas ENTÃO a sidebar DEVE colapsar/abrir de forma acessível (drawer).
3. QUANDO itens exigem permissão ENTÃO eles DEVEM ser filtrados conforme a autorização (009).
4. QUANDO a sidebar é operada ENTÃO ela DEVE ser navegável por teclado com foco visível.

### Requisito 3 — Header

**User Story:** Como usuário, quero um header com ações globais, para acessar funções recorrentes.

#### Acceptance Criteria

1. QUANDO o header é exibido ENTÃO ele DEVE conter o gatilho de navegação (mobile), o menu do usuário e as notificações.
2. QUANDO o tema pode ser alternado ENTÃO o header PODE expor o toggle de tema (002).
3. QUANDO o header é exibido em telas pequenas ENTÃO ele DEVE permanecer utilizável.

### Requisito 4 — Breadcrumb

**User Story:** Como usuário, quero breadcrumbs, para entender onde estou na hierarquia.

#### Acceptance Criteria

1. QUANDO uma página é exibida ENTÃO o sistema DEVE mostrar breadcrumbs coerentes com a rota atual.
2. QUANDO o breadcrumb é renderizado ENTÃO ele DEVE ter semântica de navegação acessível.

### Requisito 5 — Menu do usuário

**User Story:** Como usuário, quero um menu com meus dados e logout, para gerenciar minha sessão.

#### Acceptance Criteria

1. QUANDO o menu do usuário é aberto ENTÃO ele DEVE exibir o usuário atual (via `useCurrentUser`, de 008).
2. QUANDO o usuário escolhe sair ENTÃO o sistema DEVE executar logout (008).
3. QUANDO o menu é operado ENTÃO ele DEVE ser acessível por teclado.

### Requisito 6 — Notificações

**User Story:** Como usuário, quero um ponto de notificações, para acompanhar avisos.

#### Acceptance Criteria

1. QUANDO há notificações ENTÃO o sistema DEVE exibir um indicador acessível.
2. QUANDO não há notificações ENTÃO o sistema DEVE exibir um empty state adequado.
3. QUANDO a fonte de notificações não está definida no template ENTÃO o componente DEVE funcionar com dados injetáveis/placeholder, sem acoplar domínio.

### Requisito 7 — Responsividade e acessibilidade

**User Story:** Como usuário mobile e de teclado, quero o layout utilizável em qualquer dispositivo e sem mouse.

#### Acceptance Criteria

1. QUANDO o layout é usado em mobile/tablet/desktop ENTÃO a hierarquia e as ações principais DEVEM permanecer claras e acessíveis.
2. QUANDO a navegação é feita por teclado ENTÃO o foco DEVE ser gerenciado e visível.
3. QUANDO o conteúdo é longo ENTÃO o layout NÃO DEVE quebrar (overflow tratado).

## Não objetivos

- Não implementar features de negócio nem o dashboard final (spec 012).
- Não implementar o mecanismo de registro de navegação por feature (spec 011); aqui o menu consome uma estrutura de itens.
