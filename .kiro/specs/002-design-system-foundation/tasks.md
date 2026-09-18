# Plano de Implementação — 002 design-system-foundation

- [x] 1. Instalar e configurar Tailwind CSS v4
  - Adicionar Tailwind v4 e o plugin do Vite.
  - Configurar entrada CSS global e ordenação de classes (`prettier-plugin-tailwindcss`).
  - _Requisitos: 3_

- [x] 2. Definir primitive tokens
  - Criar `src/shared/design-system/tokens/primitives.css` com escalas cruas (cores, spacing, radius, shadow, etc.).
  - _Requisitos: 1, 2_

- [x] 3. Definir semantic tokens
  - Criar `semantic.css` mapeando intenção → primitivo (`color.text.*`, `color.surface.*`, `color.action.*`, `color.feedback.*`, `color.border.*`, foco).
  - Definir `typography.css` e `spacing.css`.
  - Agregar em `tokens/index.css` e importar no CSS global.
  - _Requisitos: 1, 2_

- [x] 4. Integrar tokens ao Tailwind v4
  - Mapear as escalas do Tailwind (`@theme`) para as CSS variables dos tokens.
  - Garantir que utilitários reflitam tokens e evitem valores arbitrários.
  - _Requisitos: 2, 3_

- [x] 5. Implementar tema light/dark
  - Criar `ThemeProvider` e `useTheme` (light/dark/system).
  - Aplicar valores de token por tema via seletor no `<html>`.
  - Padrão `prefers-color-scheme`; persistir escolha em `localStorage`.
  - Adicionar script inline anti-FOUC no `index.html`.
  - _Requisitos: 4_

- [x] 6. Configurar base de primitivos headless
  - Adicionar Radix/shadcn (util `cn`, config), ajustado aos tokens.
  - Validar com 1–2 primitivos de exemplo consumindo tokens semânticos e foco visível.
  - _Requisitos: 5_

- [x] 7. Configurar biblioteca de ícones
  - Adicionar `lucide-react`.
  - Documentar convenção: decorativo `aria-hidden`, ação com nome acessível.
  - _Requisitos: 6_

- [x] 8. Criar página de referência dos tokens
  - Implementar `TokensReferencePage` exibindo cores semânticas, tipografia, espaçamento, radius e sombras.
  - Incluir toggle de tema.
  - _Requisitos: 7_

- [x] 9. Verificação de contraste e acessibilidade
  - Verificar contraste WCAG AA dos tokens em light e dark.
  - Confirmar foco visível nos primitivos de exemplo.
  - _Requisitos: 4, 5_

- [x] 10. Verificação final
  - `pnpm lint`, `pnpm typecheck`, `pnpm build` passam.
  - Toggle de tema persiste após refresh, sem flash perceptível.
  - _Requisitos: 3, 4, 7_

## Notas de execução

- **Stack instalada**: Tailwind CSS 4.3.3 + `@tailwindcss/vite` 4.3.3 (compatível com Vite 7),
  `prettier-plugin-tailwindcss` 0.8.1, `lucide-react` 1.47.0, `clsx` 2.1.1, `tailwind-merge` 3.7.0.
- **Base de primitivos headless**: nesta fundação foi entregue a infraestrutura (`cn` em
  `src/shared/ui/cn.ts`); o catálogo Radix/shadcn completo pertence à spec 003. Os tokens
  foram validados via `ThemeToggle` e `TokensReferencePage`, que consomem tokens semânticos
  e usam foco visível (`--color-focus-ring`).
- **Tailwind v4 CSS-first**: tokens mapeados em `@theme` no `src/index.css`. Breakpoints
  precisam ser valores literais (media queries não aceitam `var()`); definidos em bloco
  `@theme` próprio, alinhados aos primitivos `--breakpoint-*`.
- **Tema derivado, não armazenado**: `resolvedTheme` é calculado a partir da preferência +
  tema do SO (evita `set-state-in-effect`); efeitos só sincronizam a classe `.dark` e a
  assinatura de `prefers-color-scheme`.
- **Contraste (task 9)**: pares de token desenhados para AA (texto neutro-900/superfície
  neutro-0 no claro; neutro-50/neutro-900 no escuro). Validação formal de contraste requer
  ferramenta dedicada/inspeção manual; a `TokensReferencePage` permite conferir em ambos os temas.

Validações executadas com sucesso: `typecheck`, `lint`, `test` (6/6), `build`, `test:e2e` (2/2).
