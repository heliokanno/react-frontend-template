# Design — 007 reusable-forms

## Visão geral

Infraestrutura de formulários reutilizável do núcleo: React Hook Form para estado, Zod como fonte única de schema/tipos, campos reutilizáveis acessíveis (compondo os controles de 003), estados de submissão completos e integração com o contrato de erro da API (004). Features montam formulários compondo esses blocos.

Referências: `frontend-engineering.md` (Forms Engineering), `ux-design.md` (Form UX), `design-system.md` (Forms), `tech.md` (RHF + Zod), `testing.md`.

## Estrutura

```text
src/shared/ui/form/
├── Form.tsx           # wrapper sobre RHF (provider + submit)
├── FormField.tsx      # campo: label + controle + descrição + erro
├── fields/
│   ├── TextField.tsx
│   ├── TextareaField.tsx
│   ├── SelectField.tsx
│   ├── CheckboxField.tsx
│   ├── RadioGroupField.tsx
│   └── SwitchField.tsx
├── useFormSubmit.ts   # estados de submissão + mapeamento de erro da API
├── apiErrors.ts       # AppError → erros de campo / erro geral
└── index.ts
```

## Decisões técnicas

### RHF + Zod
- **React Hook Form** gerencia estado, foco e submissão.
- **Zod** é a fonte única do schema; os tipos vêm de `z.infer<typeof schema>` — sem tipos duplicados.
- Resolver Zod conecta schema ao RHF.

### Campos reutilizáveis
- `FormField` conecta um controle de 003 (Input, Select, etc.) a label, descrição e mensagem de erro, com associação programática (`aria-describedby`, `aria-invalid`).
- Required comunicado de forma acessível; placeholder nunca substitui label.
- Variantes prontas (text, textarea, select, checkbox, radio, switch) reduzem boilerplate mantendo composição.

### Validação e UX
- Validação de UI melhora feedback, mas não substitui o backend (ver `frontend-architecture.md` → Validation).
- Mensagens próximas ao campo; foco/anúncio ajudam a localizar erros.
- Ordem natural de campos e agrupamento lógico (ver `ux-design.md` → Form UX).

### Estados de submissão
- `useFormSubmit` expõe loading/success/error, bloqueia submissão duplicada e preserva dados após falha.

### Integração de erros da API
- `apiErrors` mapeia `AppError`/`ProblemDetail` (004): erros de campo → `setError` do RHF no campo correspondente; erro geral → Alert/Toast, sem detalhes técnicos.

## Acessibilidade

- Label associado, descrição e erro vinculados; estados disabled/read-only comunicados.
- Navegação por teclado e foco previsíveis; erros perceptíveis por leitor de tela.

## Testes

- Validação (submissão bloqueada quando inválido; mensagem correta).
- Submissão com dados válidos chama o handler esperado.
- Estados loading/success/error.
- Erros de campo vindos da API mapeados ao campo certo.
- Queries por role/label.

## Riscos e mitigações

- **Divergência schema/tipos**: sempre derivar tipos do Zod.
- **Campos genéricos demais**: manter composição; não criar um `UniversalForm` cheio de flags (ver `design-system.md`).
- **Erro de API sem mapeamento**: `apiErrors` centraliza a tradução; erro geral sempre tem fallback.

## Verificação

- Formulário de exemplo valida, submete, trata estados e exibe erros de campo da API.
- Acessibilidade dos campos validada (label/descrição/erro associados).
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
