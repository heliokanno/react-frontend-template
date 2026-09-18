# Plano de Implementação — 007 reusable-forms

- [ ] 1. Instalar e estruturar a infraestrutura de formulários
  - Adicionar React Hook Form e Zod (+ resolver).
  - Criar `src/shared/ui/form/` com `Form` e `index.ts`.
  - _Requisitos: 1_

- [ ] 2. Integrar RHF + Zod
  - `Form` com `useForm` e resolver Zod; tipos derivados do schema (`z.infer`).
  - _Requisitos: 1_

- [ ] 3. Implementar campos reutilizáveis
  - `FormField` conectando controle de 003 a label, descrição e erro (`aria-describedby`, `aria-invalid`).
  - Variantes: text, textarea, select, checkbox, radio, switch.
  - _Requisitos: 2_

- [ ] 4. Validação e feedback de campo
  - Exibir erros associados ao campo; required identificado; sem placeholder como label.
  - _Requisitos: 2, 3_

- [ ] 5. Estados de submissão
  - Loading (bloqueia duplo submit), success e error.
  - Preservar dados digitados após falha.
  - _Requisitos: 4_

- [ ] 6. Integrar erros da API
  - Mapear erros de campo do `ProblemDetail`/`AppError` (004) para os campos; erro geral em Alert/Toast.
  - _Requisitos: 5_

- [ ] 7. Testes
  - Validação (submissão bloqueada quando inválido), submissão com dados válidos, estados e erros de campo da API.
  - Queries por role/label.
  - _Requisitos: 6_

- [ ] 8. Verificação final
  - Formulário de exemplo com validação, estados e erros de API.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passam.
  - _Requisitos: 1, 2, 3, 4, 5, 6_
