# Design — 002 design-system-foundation

## Visão geral

Fundação visual do template: define tokens (primitive → semantic), configura Tailwind v4 a partir deles, implementa tema light/dark sem que componentes conheçam o tema, e adota primitivos headless (Radix via shadcn/ui) estilizados por tokens. Entrega uma página de referência para validação visual.

Referências: `design-system.md` (autoridade), `tech.md` (Tailwind v4, Radix/shadcn, lucide-react), `ux-design.md` (AI Aesthetic Prevention).

## Arquitetura de tokens

```text
Primitive tokens        Semantic tokens               Componentes
(valores brutos)   →    (intenção de uso)        →    (consomem semânticos)

blue-500                color.action.primary          Button
gray-50                 color.surface.default         Card / Page
gray-200                color.border.default          Input
red-600                 color.feedback.error          Alert
```

Implementação com **CSS custom properties** como camada de tokens, e Tailwind v4 mapeando utilitários para essas variáveis. Isso permite trocar o valor do token por tema sem recompilar componentes.

```text
src/shared/design-system/
├── tokens/
│   ├── primitives.css      # --blue-500, --gray-200, escalas cruas
│   ├── semantic.css        # --color-action-primary: var(--blue-500) por tema
│   ├── typography.css      # escala tipográfica
│   ├── spacing.css         # escala de espaçamento
│   └── index.css           # importa tudo
├── theme/
│   ├── ThemeProvider.tsx   # contexto de tema (light/dark/system)
│   └── useTheme.ts         # hook de leitura/alteração do tema
└── reference/
    └── TokensReferencePage.tsx  # página de validação visual
```

## Decisões técnicas

### Tokens
- **Camada única de verdade** em CSS variables. Primitivos definem valores brutos; semânticos referenciam primitivos.
- Categorias: color, typography, spacing, sizing, radius, border, shadow, elevation, motion, breakpoint, z-index (ver `design-system.md`).
- Nomes semânticos por intenção: `color.text.primary`, `color.surface.elevated`, `color.action.primary.hover`, `color.feedback.error`, etc.

### Tailwind v4
- Configuração via `@theme`/CSS-first do Tailwind v4, apontando as escalas para as CSS variables dos tokens.
- Utilitários passam a refletir tokens; valores arbitrários evitados quando houver token.
- `prettier-plugin-tailwindcss` para ordenação de classes (opcional, recomendado).

### Tema light/dark
- **ThemeProvider** aplica um atributo/classe no `<html>` (ex.: `data-theme="dark"` ou `.dark`).
- Os tokens semânticos recebem valores diferentes por tema via seletor de tema no CSS.
- Padrão inicial: `prefers-color-scheme`. Escolha do usuário persistida em `localStorage`.
- Componentes **não** leem o tema; apenas consomem tokens semânticos. `useTheme` existe só para o controle (toggle) na UI.
- `color-scheme` CSS ajustado para inputs nativos.

### Primitivos headless
- **Radix UI** como base de acessibilidade; **shadcn/ui** como ponto de partida, adaptado aos tokens.
- Neste estágio, adiciona-se apenas a infraestrutura (util `cn`, config do shadcn, um ou dois primitivos de exemplo para validar tokens). O catálogo completo é a spec 003.

### Ícones
- **lucide-react** como biblioteca única. Convenção: ícones decorativos com `aria-hidden`, ícones de ação com nome acessível.

### Página de referência
- Rota/página `TokensReferencePage` exibindo paleta semântica, tipografia, espaçamentos, radius e sombras, com toggle de tema. Serve como validação visual e documentação viva.

## Acessibilidade

- Contraste verificado nos tokens semânticos em ambos os temas (WCAG AA como baseline).
- Não usar cor como único indicador (reforçado em componentes na 003).
- Foco visível garantido via token de foco (`--color-focus-ring`) usado pelos primitivos.

## Prevenção de estética genérica

Seguindo `ux-design.md` → AI Aesthetic Prevention: evitar por padrão gradientes, glassmorphism, excesso de sombras e rounded, roxo/azul automático. Sombras reservadas para elevação real (dropdown, dialog, popover); cards sem sombra por padrão.

## Riscos e mitigações

- **Tailwind v4 é CSS-first** e difere da v3; documentar o modelo de tema no README para evitar configuração divergente.
- **FOUC de tema**: aplicar o tema o mais cedo possível (script inline no `index.html` lendo `localStorage`/`prefers-color-scheme`) para evitar flash.
- **Divergência token vs Tailwind**: manter os utilitários derivados dos tokens, nunca valores paralelos.

## Verificação

- Página de referência renderiza todos os grupos de token.
- Toggle de tema altera os valores sem recarregar e persiste após refresh.
- Sem flash perceptível de tema no carregamento.
- `pnpm lint`, `pnpm typecheck` e `pnpm build` passam.
