# Plano de Implementação — 003 core-ui-components

- [x] 1. Configurar base do catálogo
  - Criar `src/shared/ui/` com convenção de colocation e `index.ts` público.
  - Configurar CVA e util `cn` (herdados de 002).
  - _Requisitos: 6_

- [x] 2. Implementar Button
  - Variantes (primary, secondary, tertiary, destructive, ghost, icon) e tamanhos.
  - Estado loading que bloqueia clique; foco visível; ação destrutiva identificável.
  - Testes de comportamento (loading bloqueia submissão, teclado).
  - _Requisitos: 2, 7_

- [x] 3. Implementar controles de formulário
  - Input, Textarea, Select, Checkbox, Radio, Switch.
  - Label associado, `aria-invalid`/`aria-describedby`, disabled/read-only acessíveis.
  - Testes por role/label.
  - _Requisitos: 1, 7_

- [x] 4. Implementar feedback: Alert e Badge
  - Alert inline com variantes semânticas (success/warning/error/info) sem depender só de cor.
  - Badge seguindo tokens.
  - Testes de renderização/estado.
  - _Requisitos: 3, 7_

- [x] 5. Implementar Toast
  - `ToastProvider` + `useToast`, fila, auto-dismiss, `aria-live`, pausa em hover/foco.
  - Testes de disparo e acessibilidade.
  - _Requisitos: 3, 7_

- [x] 6. Implementar Tooltip
  - Sobre Radix, acessível por teclado/foco.
  - Testes.
  - _Requisitos: 3, 7_

- [x] 7. Implementar overlays: Dialog e Drawer
  - Sobre Radix; foco inicial e retorno de foco; `Escape` fecha; composição (Trigger/Content/Header/Footer).
  - Testes de foco e teclado.
  - _Requisitos: 4, 6, 7_

- [x] 8. Implementar Dropdown
  - Menu navegável por teclado, itens acessíveis.
  - Testes.
  - _Requisitos: 4, 7_

- [x] 9. Implementar estados de dados
  - Skeleton, Spinner, EmptyState (título/descrição/ação) e padrão de estado de erro com retry.
  - Testes.
  - _Requisitos: 5, 7_

- [x] 10. Estender página de referência
  - Exibir todos os componentes e seus estados na página de referência (herdada de 002).
  - _Requisitos: 3, 5_

- [x] 11. Verificação final
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - Navegação por teclado e foco validados nos interativos e overlays.
  - _Requisitos: 1, 2, 3, 4, 5, 7_

## Notas de execução

- **Stack instalada**: `class-variance-authority` 0.7.1 e primitivos Radix (react-slot,
  react-label, react-dialog, react-dropdown-menu, react-tooltip, react-checkbox,
  react-radio-group, react-switch, react-select) — todos compatíveis com React 19.
- **Catálogo** em `src/shared/ui/` (colocation por componente), com API pública em `index.ts`.
  Componentes consomem tokens semânticos (002) e o util `cn`.
- **Tooltip/Toast**: `TooltipProvider` e `ToastProvider` montados em `main.tsx`.
- **Tipos de teste (jsdom vs Radix menus)**: a abertura do `Dropdown` (Radix DropdownMenu)
  depende de APIs de ponteiro/layout que o jsdom não implementa de forma confiável e trava o
  `userEvent`. Seguindo `testing.md` (testar no nível mais barato confiável e reservar E2E
  para fluxos que exigem navegador real): o teste de componente do Dropdown valida o estado
  fechado/acessível; a abertura + teclado é coberta por E2E (Playwright). Dialog/Drawer abrem
  por clique simples e são testados em jsdom normalmente.
- **Polyfills de teste**: adicionados `hasPointerCapture`/`setPointerCapture`/
  `releasePointerCapture`/`scrollIntoView` no setup, para os primitivos Radix.
- **Acessibilidade**: feedback comunicado por ícone + texto (não só cor); foco visível via
  token; overlays com foco/retorno de foco/Escape do Radix.

Validações executadas com sucesso: `typecheck`, `lint`, `test` (25/25), `build`, `test:e2e` (5/5).
