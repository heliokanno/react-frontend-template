# Design — 003 core-ui-components

## Visão geral

Catálogo de componentes primitivos reutilizáveis do núcleo, construídos sobre a fundação visual da spec 002 (tokens, Tailwind v4, primitivos Radix/shadcn). Cada componente prioriza composição sobre configuração, acessibilidade por padrão e estados completos (default, hover, focus, active, disabled, loading, error, etc.).

Referências: `design-system.md` (Component API, States, Buttons, Forms, Feedback, Dialogs), `frontend-engineering.md` (Component Composition, a11y), `ux-design.md` (estados, feedback), `testing.md` (component testing).

## Catálogo e organização

```text
src/shared/ui/
├── button/            # Button (variantes + estados)
├── input/             # Input, Textarea
├── select/            # Select
├── checkbox/          # Checkbox
├── radio/             # Radio group
├── switch/            # Switch
├── badge/             # Badge
├── alert/             # Alert (inline)
├── toast/             # Toast (provider + hook)
├── tooltip/           # Tooltip
├── dialog/            # Dialog (modal)
├── drawer/            # Drawer
├── dropdown/          # Dropdown menu
├── skeleton/          # Skeleton
├── spinner/           # Spinner
├── empty-state/       # EmptyState
└── index.ts           # API pública do catálogo
```

Cada componente reside em pasta própria com colocation: `Component.tsx`, `Component.test.tsx` e, quando necessário, `Component.types.ts`.

## Decisões técnicas

### Composição sobre configuração
Preferir subcomponentes compostos a props booleanas múltiplas (ver `design-system.md` → Component API). Exemplo: `Dialog` expõe `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Footer` em vez de dezenas de flags.

### Variantes com CVA
Variantes de estilo declaradas com `class-variance-authority` (padrão shadcn), mapeando para tokens semânticos. Exemplo de Button:

```text
variant: primary | secondary | tertiary | destructive | ghost | icon
size:    sm | md | lg
state:   default | hover | focus | active | disabled | loading
```

Apenas um botão primário por contexto; ação destrutiva claramente identificável; durante `loading`, submissões duplicadas são bloqueadas.

### Acessibilidade
- Preferir HTML semântico; ARIA só quando necessário.
- Radix garante teclado/foco/ARIA nos overlays (Dialog, Drawer, Dropdown, Tooltip).
- Foco visível via token de foco. Dialogs gerenciam foco inicial e retorno de foco ao fechar; `Escape` fecha quando aplicável.
- Inputs têm label associado, descrição e erro associados (`aria-describedby`, `aria-invalid`). Placeholder não substitui label.
- Cor nunca é o único indicador de estado (combinar com texto/ícone).

### Estados
Componentes assíncronos/interativos expõem os estados relevantes. Feedback de estado padronizado:
- `Skeleton` e `Spinner` para loading;
- `EmptyState` com título, descrição e ação opcional;
- `Alert` inline e `Toast` para mensagens (toast não é usado para informação que precisa permanecer).

### Toast
`ToastProvider` no topo da app + `useToast()` para disparo. Fila, auto-dismiss configurável, acessível (`role="status"`/`aria-live`), pausável no hover/foco.

## Testes

Cada componente cobre, via RTL (queries por role/label): renderização, interação (clique, teclado), estados relevantes e acessibilidade. Sem asserts sobre classes CSS. Exemplos de foco: Button (loading bloqueia clique), Dialog (foco/Escape), Input (erro associado ao campo).

## Riscos e mitigações

- **Escopo grande**: entregar em ondas (formulário → feedback → overlays → estados) para revisão incremental.
- **Divergência com shadcn**: adaptar aos tokens do template; não copiar estética padrão sem ajuste (ver AI Aesthetic Prevention).
- **Over-engineering de API**: seguir composição; não adicionar props sem consumidor real.

## Verificação

- Todos os componentes com estados completos e testes de comportamento passando.
- Navegação por teclado e foco validados nos interativos e overlays.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
- Componentes visíveis na página de referência (estende a de 002).
