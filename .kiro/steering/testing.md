---
inclusion: fileMatch
fileMatchPattern: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/tests/**', '**/e2e/**']
---

# Estratégia de Testes

Aplica-se ao escrever ou editar testes. O objetivo é proteger o comportamento que importa, não perseguir uma porcentagem de cobertura.

A stack de testes está definida em `tech.md`: **Vitest**, **React Testing Library**, **Playwright** e **MSW**. Esta steering define **como** usar essas ferramentas.

Como o projeto é um **template reutilizável** (ver `product.md`), o núcleo compartilhado — shell, autenticação, Data Grid, formulários, feedback, camada de API — merece cobertura sólida, pois qualquer regressão nele afeta todos os projetos derivados.

---

## Hierarquia

```text
Unit         → base: funções puras, domínio, casos de uso, hooks
Component    → componentes React via Testing Library
Integration  → feature real + rede mockada (MSW)
End-to-End   → fluxos críticos via Playwright
```

- **Unit**: rápidos e sem framework de UI. Cobrem domínio, casos de uso, mappers, value objects e utilitários (ver `hexagonal-architecture.md`). O núcleo hexagonal é testável sem renderizar componentes nem mockar HTTP.
- **Component**: renderizam componentes e testam comportamento observável pelo usuário.
- **Integration**: exercitam uma feature ligando UI + casos de uso + adapters, com a rede mockada por MSW.
- **End-to-End**: validam fluxos críticos reais no navegador.

A quantidade de testes decresce conforme sobe a pirâmide. Não inverter a pirâmide (muitos E2E, poucos unit).

---

## Princípios

- Testar comportamento observável, não detalhes de implementação. Testes acoplados à estrutura interna quebram a cada refactor legítimo.
- Determinístico, isolado e independente de ordem. Sem estado compartilhado entre testes.
- Nomes descritivos que expressam a regra: `deveBloquearSubmissaoQuandoFormularioInvalido`.
- Estrutura consistente Arrange / Act / Assert (Given / When / Then).
- Mocks só quando isolam de fato uma dependência. Se quase tudo é mock, há acoplamento demais ou o teste está preso à implementação.
- Preferir **fakes in-memory** de portas a mocks de HTTP ao testar casos de uso (ver `hexagonal-architecture.md` → Testabilidade).
- Sem `sleep`/esperas fixas. Usar utilitários assíncronos (`findBy*`, `waitFor`) e controle de tempo (fake timers) quando necessário.
- Consultar o DOM como um usuário: por role, label e texto acessível — não por classe CSS, id ou test-id salvo quando não houver alternativa semântica.

---

## O que testar por camada

### Domínio e Casos de Uso (unit)

- regras de negócio e invariantes;
- transições de estado;
- erros de domínio;
- mapeamento DTO ↔ domínio.

### Componentes

- renderização conforme props/estado;
- interação (clique, digitação, teclado);
- estados: loading, empty, error, success, disabled, unauthorized;
- acessibilidade relevante (roles, labels, foco);
- validação de formulário e mensagens associadas ao campo.

### Integração

- fluxo da feature com rede mockada (MSW);
- tratamento de erro da API traduzido para mensagem de usuário;
- invalidation/refetch de server state quando aplicável.

### E2E

Reservar para fluxos críticos, por exemplo:

```text
Login e sessão
Acesso a rota protegida / permissão negada
Fluxo principal de CRUD via Data Grid
Submissão de formulário reutilizável
```

A seleção segue criticidade real, não cobertura por cobertura.

---

## Estados obrigatórios

Toda funcionalidade assíncrona relevante deve ter teste para os estados que possui:

```text
Loading
Success
Empty
Error
Unauthorized (quando aplicável)
```

Não testar apenas o caminho feliz (ver `frontend-engineering.md` → Production Quality First).

---

## Rede: MSW

- Mockar a **fronteira de rede**, não a camada de aplicação, para exercitar o adapter real.
- Handlers de sucesso e de erro (incluindo o contrato `ProblemDetail` / RFC 7807 usado pelos backends).
- Não acoplar testes a URLs espalhadas pela UI; a UI fala com casos de uso, o adapter fala HTTP.

---

## Acessibilidade nos testes

- Preferir queries por role/label expõe problemas de semântica cedo.
- Verificar navegação por teclado e foco em componentes interativos e dialogs.
- Ferramentas automatizadas não detectam tudo; combinar com inspeção semântica (ver `frontend-engineering.md` → Accessibility Testing).

---

## Exemplo (caso de uso, unit com fake de porta)

```ts
import { describe, it, expect } from "vitest";
import { CreateProductService } from "@/features/products/application/services/CreateProductService";
import { InMemoryProductRepository } from "@/features/products/infrastructure/InMemoryProductRepository";

describe("CreateProductService", () => {
  it("cria um produto quando os dados são válidos", async () => {
    const repository = new InMemoryProductRepository();
    const service = new CreateProductService(repository);

    const product = await service.execute({ name: "Freio", price: 1000 });

    expect(product.name).toBe("Freio");
    expect(await repository.findAll()).toHaveLength(1);
  });

  it("rejeita quando o nome é vazio", async () => {
    const repository = new InMemoryProductRepository();
    const service = new CreateProductService(repository);

    await expect(service.execute({ name: "", price: 1000 })).rejects.toThrow();
  });
});
```

---

## Exemplo (componente, Testing Library)

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateProductForm } from "@/features/products/ui/CreateProductForm";

describe("CreateProductForm", () => {
  it("exibe erro de validação quando o nome está vazio", async () => {
    render(<CreateProductForm onSubmit={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument();
  });

  it("submete com os dados preenchidos", async () => {
    const onSubmit = vi.fn();
    render(<CreateProductForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Freio");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Freio" }));
  });
});
```

---

## Exemplo (integração com MSW)

```tsx
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductsPage } from "@/features/products/ui/ProductsPage";

const server = setupServer(
  http.get("/api/v1/products", () =>
    HttpResponse.json([{ id: "1", name: "Freio", price: 1000, active: true }]),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("lista produtos vindos da API", async () => {
  render(<ProductsPage />);
  expect(await screen.findByText("Freio")).toBeInTheDocument();
});
```

---

## O que priorizar

```text
Regras de negócio (domínio/casos de uso)
   → segurança e autorização de UI (ocultar/desabilitar, rotas protegidas)
   → contrato com a API e tratamento de erro
   → componentes do núcleo reutilizável (shell, grid, formulários, feedback)
   → fluxos críticos (E2E)
```

Bugs corrigidos ganham um teste de regressão que reproduz o comportamento anterior antes da correção.

---

## O que evitar

- testar detalhes internos que o usuário não observa;
- assertar sobre classes CSS, estrutura de markup ou nomes de variáveis internas;
- snapshots grandes e frágeis que ninguém revisa;
- mockar tudo a ponto de o teste não exercitar comportamento real;
- E2E para lógica que um teste unit/component cobriria melhor;
- perseguir percentual de cobertura sem valor de comportamento.

---

## Definition of Done (testes)

Uma mudança está adequadamente testada quando:

* [ ] o comportamento relevante está coberto no nível mais barato possível da pirâmide;
* [ ] regras de negócio têm testes unit no domínio/casos de uso;
* [ ] estados loading/empty/error/success foram considerados;
* [ ] a rede é mockada na fronteira (MSW), não na aplicação;
* [ ] os testes consultam o DOM por semântica/acessibilidade;
* [ ] os testes são determinísticos e independentes de ordem;
* [ ] não há esperas fixas nem estado compartilhado entre testes;
* [ ] bugs corrigidos possuem teste de regressão;
* [ ] os testes passam localmente e no CI.
