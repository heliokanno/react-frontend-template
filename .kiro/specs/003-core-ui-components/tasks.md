# Plano de Implementação — 003 core-ui-components

- [ ] 1. Configurar base do catálogo
  - Criar `src/shared/ui/` com convenção de colocation e `index.ts` público.
  - Configurar CVA e util `cn` (herdados de 002).
  - _Requisitos: 6_

- [ ] 2. Implementar Button
  - Variantes (primary, secondary, tertiary, destructive, ghost, icon) e tamanhos.
  - Estado loading que bloqueia clique; foco visível; ação destrutiva identificável.
  - Testes de comportamento (loading bloqueia submissão, teclado).
  - _Requisitos: 2, 7_

- [ ] 3. Implementar controles de formulário
  - Input, Textarea, Select, Checkbox, Radio, Switch.
  - Label associado, `aria-invalid`/`aria-describedby`, disabled/read-only acessíveis.
  - Testes por role/label.
  - _Requisitos: 1, 7_

- [ ] 4. Implementar feedback: Alert e Badge
  - Alert inline com variantes semânticas (success/warning/error/info) sem depender só de cor.
  - Badge seguindo tokens.
  - Testes de renderização/estado.
  - _Requisitos: 3, 7_

- [ ] 5. Implementar Toast
  - `ToastProvider` + `useToast`, fila, auto-dismiss, `aria-live`, pausa em hover/foco.
  - Testes de disparo e acessibilidade.
  - _Requisitos: 3, 7_

- [ ] 6. Implementar Tooltip
  - Sobre Radix, acessível por teclado/foco.
  - Testes.
  - _Requisitos: 3, 7_

- [ ] 7. Implementar overlays: Dialog e Drawer
  - Sobre Radix; foco inicial e retorno de foco; `Escape` fecha; composição (Trigger/Content/Header/Footer).
  - Testes de foco e teclado.
  - _Requisitos: 4, 6, 7_

- [ ] 8. Implementar Dropdown
  - Menu navegável por teclado, itens acessíveis.
  - Testes.
  - _Requisitos: 4, 7_

- [ ] 9. Implementar estados de dados
  - Skeleton, Spinner, EmptyState (título/descrição/ação) e padrão de estado de erro com retry.
  - Testes.
  - _Requisitos: 5, 7_

- [ ] 10. Estender página de referência
  - Exibir todos os componentes e seus estados na página de referência (herdada de 002).
  - _Requisitos: 3, 5_

- [ ] 11. Verificação final
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - Navegação por teclado e foco validados nos interativos e overlays.
  - _Requisitos: 1, 2, 3, 4, 5, 7_
