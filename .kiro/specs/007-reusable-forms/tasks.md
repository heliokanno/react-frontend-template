# Plano de Implementação — 007 reusable-forms

- [x] 1. Instalar e estruturar a infraestrutura de formulários
  - Adicionar React Hook Form e Zod (+ resolver).
  - Criar `src/shared/ui/form/` com `Form` e `index.ts`.
  - _Requisitos: 1_

- [x] 2. Integrar RHF + Zod
  - `Form` com `useForm` e resolver Zod; tipos derivados do schema (`z.infer`).
  - _Requisitos: 1_

- [x] 3. Implementar campos reutilizáveis
  - `FormField` conectando controle de 003 a label, descrição e erro (`aria-describedby`, `aria-invalid`).
  - Variantes: text, textarea, select, checkbox, radio, switch.
  - _Requisitos: 2_

- [x] 4. Validação e feedback de campo
  - Exibir erros associados ao campo; required identificado; sem placeholder como label.
  - _Requisitos: 2, 3_

- [x] 5. Estados de submissão
  - Loading (bloqueia duplo submit), success e error.
  - Preservar dados digitados após falha.
  - _Requisitos: 4_

- [x] 6. Integrar erros da API
  - Mapear erros de campo do `ProblemDetail`/`AppError` (004) para os campos; erro geral em Alert/Toast.
  - _Requisitos: 5_

- [x] 7. Testes
  - Validação (submissão bloqueada quando inválido), submissão com dados válidos, estados e erros de campo da API.
  - Queries por role/label.
  - _Requisitos: 6_

- [x] 8. Verificação final
  - Formulário de exemplo com validação, estados e erros de API.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6_

## Notas de execução

- **Stack instalada**: `react-hook-form` 7.88.0, `zod` 4.6.5, `@hookform/resolvers` 5.9.1
  (compatíveis com React 19; resolver aceita zod v4 e RHF ^7.55).
- **Estrutura** em `src/shared/ui/form/`: `Form` (FormProvider + submit), `FormField`
  (associa label/descrição/erro via `aria-describedby`/`aria-invalid`), campos
  `TextField`/`TextareaField`/`SelectField`/`CheckboxField`, `useFormSubmit` (estados de
  submissão) e `applyApiErrors` (mapeia erros de campo da API para RHF `setError`).
- **Zod como fonte única**: os tipos derivam de `z.infer<typeof schema>`.
- **Estados de submissão**: `useFormSubmit` bloqueia duplo submit, preserva dados após falha
  e normaliza o erro (idempotente com `toAppError`), mapeando validação → campos e demais →
  mensagem geral.
- **Campos controlados (Radix)**: Checkbox/Select via RHF `Controller`.
- **Tipos de teste (jsdom vs Radix Select)**: o Radix Select depende de `ResizeObserver` e de
  interação de ponteiro que o jsdom não conduz de forma confiável (trava o `userEvent`).
  Seguindo `testing.md`: a infraestrutura de formulários é testada em jsdom com um form sem
  Select (validação, submissão, estados, erro de campo e erro geral da API); o fluxo completo
  com Select é coberto por E2E (navegador real). Adicionado polyfill de `ResizeObserver` ao setup.
- **Exemplo**: `FormExamplePage` (rota `/examples/form`) — o "backend" simulado lança
  `HttpError` 422 com `ProblemDetail` (como um adapter real), validando o mapeamento de erro
  de campo ponta a ponta.

Validações executadas com sucesso: `typecheck`, `lint`, `test` (59), `build`, `test:e2e` (9/9).
