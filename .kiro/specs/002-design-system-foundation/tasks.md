# Plano de Implementação — 002 design-system-foundation

- [ ] 1. Instalar e configurar Tailwind CSS v4
  - Adicionar Tailwind v4 e o plugin do Vite.
  - Configurar entrada CSS global e ordenação de classes (`prettier-plugin-tailwindcss`).
  - _Requisitos: 3_

- [ ] 2. Definir primitive tokens
  - Criar `src/shared/design-system/tokens/primitives.css` com escalas cruas (cores, spacing, radius, shadow, etc.).
  - _Requisitos: 1, 2_

- [ ] 3. Definir semantic tokens
  - Criar `semantic.css` mapeando intenção → primitivo (`color.text.*`, `color.surface.*`, `color.action.*`, `color.feedback.*`, `color.border.*`, foco).
  - Definir `typography.css` e `spacing.css`.
  - Agregar em `tokens/index.css` e importar no CSS global.
  - _Requisitos: 1, 2_

- [ ] 4. Integrar tokens ao Tailwind v4
  - Mapear as escalas do Tailwind (`@theme`) para as CSS variables dos tokens.
  - Garantir que utilitários reflitam tokens e evitem valores arbitrários.
  - _Requisitos: 2, 3_

- [ ] 5. Implementar tema light/dark
  - Criar `ThemeProvider` e `useTheme` (light/dark/system).
  - Aplicar valores de token por tema via seletor no `<html>`.
  - Padrão `prefers-color-scheme`; persistir escolha em `localStorage`.
  - Adicionar script inline anti-FOUC no `index.html`.
  - _Requisitos: 4_

- [ ] 6. Configurar base de primitivos headless
  - Adicionar Radix/shadcn (util `cn`, config), ajustado aos tokens.
  - Validar com 1–2 primitivos de exemplo consumindo tokens semânticos e foco visível.
  - _Requisitos: 5_

- [ ] 7. Configurar biblioteca de ícones
  - Adicionar `lucide-react`.
  - Documentar convenção: decorativo `aria-hidden`, ação com nome acessível.
  - _Requisitos: 6_

- [ ] 8. Criar página de referência dos tokens
  - Implementar `TokensReferencePage` exibindo cores semânticas, tipografia, espaçamento, radius e sombras.
  - Incluir toggle de tema.
  - _Requisitos: 7_

- [ ] 9. Verificação de contraste e acessibilidade
  - Verificar contraste WCAG AA dos tokens em light e dark.
  - Confirmar foco visível nos primitivos de exemplo.
  - _Requisitos: 4, 5_

- [ ] 10. Verificação final
  - `pnpm lint`, `pnpm typecheck`, `pnpm build` passam.
  - Toggle de tema persiste após refresh, sem flash perceptível.
  - _Requisitos: 3, 4, 7_
