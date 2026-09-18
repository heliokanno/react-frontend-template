# Requisitos — 002 design-system-foundation

## Introdução

Esta spec estabelece a **linguagem visual** do template como fonte única de verdade: design tokens, Tailwind CSS v4 dirigido por tokens, tema light/dark via tokens semânticos e a base de primitivos headless. Ela não entrega componentes de aplicação (isso é a spec 003), apenas a fundação visual sobre a qual todos os componentes serão construídos.

Referências: `design-system.md` (autoridade visual), `tech.md` (Tailwind v4, Radix/shadcn, lucide-react), `ux-design.md` (prevenção de estética genérica).

## Requisitos

### Requisito 1 — Design tokens como fonte única de verdade

**User Story:** Como time de produto, quero tokens de design centralizados, para que decisões visuais não sejam duplicadas nos componentes.

#### Acceptance Criteria

1. QUANDO uma decisão visual é usada ENTÃO o sistema DEVE expô-la como token (cor, tipografia, espaçamento, sizing, radius, border, shadow, elevation, motion, breakpoint, z-index).
2. QUANDO um componente precisa de um valor visual ENTÃO ele DEVE consumir um token, não um valor arbitrário.
3. SE um valor recorrente não possuir token ENTÃO o sistema DEVE avaliar adicioná-lo ao Design System em vez de duplicá-lo.

### Requisito 2 — Separação primitive → semantic tokens

**User Story:** Como mantenedor, quero tokens primitivos separados dos semânticos, para trocar temas e branding sem tocar nos componentes.

#### Acceptance Criteria

1. QUANDO os tokens são definidos ENTÃO o sistema DEVE separar primitive tokens (ex.: `blue-500`) de semantic tokens (ex.: `color.action.primary`).
2. QUANDO um componente consome cor ENTÃO ele DEVE usar o token semântico, não o primitivo.
3. QUANDO o branding muda ENTÃO alterar o mapeamento semântico → primitivo NÃO DEVE exigir mudança nos componentes.

### Requisito 3 — Tailwind CSS v4 dirigido por tokens

**User Story:** Como desenvolvedor, quero Tailwind configurado a partir dos tokens, para estilizar de forma consistente.

#### Acceptance Criteria

1. QUANDO o Tailwind é configurado ENTÃO ele DEVE derivar suas escalas dos tokens do Design System.
2. QUANDO uma classe utilitária é usada ENTÃO ela DEVE refletir um token, evitando valores arbitrários quando existir token.
3. QUANDO estilos são escritos ENTÃO o sistema NÃO DEVE usar `!important` salvo exceção justificada.

### Requisito 4 — Tema light/dark via tokens semânticos

**User Story:** Como usuário, quero alternar entre tema claro e escuro, com a aplicação respeitando minha preferência.

#### Acceptance Criteria

1. QUANDO o tema muda ENTÃO o sistema DEVE aplicar valores diferentes aos tokens semânticos sem que componentes conheçam o tema atual.
2. QUANDO a aplicação carrega ENTÃO ela DEVE respeitar a preferência do sistema operacional como padrão.
3. QUANDO o usuário escolhe um tema ENTÃO o sistema DEVE persistir a escolha.
4. QUANDO o tema é aplicado ENTÃO o contraste DEVE permanecer adequado (WCAG) em ambos os temas.

### Requisito 5 — Primitivos headless acessíveis

**User Story:** Como desenvolvedor, quero uma base de primitivos headless (Radix/shadcn) estilizada pelos tokens, para construir componentes acessíveis rapidamente.

#### Acceptance Criteria

1. QUANDO um primitivo é adotado ENTÃO ele DEVE ser acessível (foco, teclado, ARIA correto por padrão).
2. QUANDO um primitivo é estilizado ENTÃO ele DEVE usar os tokens do projeto.
3. QUANDO shadcn/ui é usado como ponto de partida ENTÃO os componentes DEVEM ser adaptados aos tokens do template.

### Requisito 6 — Biblioteca de ícones única

**User Story:** Como time, quero uma única biblioteca de ícones, para manter consistência visual.

#### Acceptance Criteria

1. QUANDO um ícone é usado ENTÃO o sistema DEVE usar `lucide-react`.
2. QUANDO ícones são adicionados ENTÃO o sistema NÃO DEVE misturar múltiplas bibliotecas sem justificativa.
3. QUANDO um ícone representa ação ENTÃO ele DEVE ter nome acessível; QUANDO decorativo ENTÃO DEVE ser ocultado de tecnologias assistivas.

### Requisito 7 — Página de referência dos tokens

**User Story:** Como desenvolvedor, quero visualizar os tokens aplicados, para validar a linguagem visual.

#### Acceptance Criteria

1. QUANDO a fundação é concluída ENTÃO o sistema DEVE prover uma página/rota de referência exibindo cores, tipografia, espaçamentos, radius e sombras.
2. QUANDO a página é exibida em dark mode ENTÃO os tokens DEVEM refletir corretamente os valores do tema.

## Não objetivos

- Não entregar componentes de aplicação (Button, Input, etc.) — spec 003.
- Não definir estética de negócio específica de nenhum projeto derivado.
- Não configurar roteamento definitivo (a rota de referência pode ser provisória).
