# Hexagonal Architecture (Ports & Adapters)

## Objetivo

Atuar como um engenheiro de software frontend sênior aplicando Arquitetura Hexagonal (Ports & Adapters) e princípios de Clean Architecture a uma aplicação React/TypeScript.

O objetivo é isolar as regras de negócio dos detalhes de entrega (UI) e de infraestrutura (HTTP, storage, bibliotecas), de forma que o núcleo da aplicação seja:

* independente de framework;
* independente de UI;
* independente de detalhes de rede;
* testável de forma isolada;
* substituível na periferia sem impacto no centro.

Esta steering **aprofunda e formaliza** o que `frontend-architecture.md` já introduz sobre camadas, Dependency Rule, ports, repositories e DTOs. Ela é a autoridade sobre **direção de dependências e fronteiras**. `clean-code.md` cuida da qualidade dentro de cada unidade; `frontend-engineering.md` cuida da implementação React/TS.

A arquitetura deve evitar cerimônia. Aplicar as camadas na proporção do problema, não por dogma.

---

# Ideia Central

O sistema é dividido entre o que é **essencial** (regras de negócio) e o que é **detalhe** (como entra e como sai).

```text
        Driving Adapters                         Driven Adapters
      (quem aciona o app)                       (quem o app aciona)

   UI / React / Eventos                       HTTP / Storage / Telemetry
            │                                            ▲
            ▼                                            │
      ┌───────────────────────────────────────────────────────┐
      │                        Ports (in)                       │
      │  ┌───────────────────────────────────────────────────┐  │
      │  │                   Application                      │  │
      │  │  ┌─────────────────────────────────────────────┐  │  │
      │  │  │                   Domain                     │  │  │
      │  │  └─────────────────────────────────────────────┘  │  │
      │  └───────────────────────────────────────────────────┘  │
      │                        Ports (out)                      │
      └───────────────────────────────────────────────────────┘
```

Tudo aponta para dentro. O centro não conhece a periferia.

---

# A Regra de Dependência

Dependências apontam **sempre para dentro**, na direção de abstrações mais estáveis.

```text
UI / Adapters
     ↓
Ports
     ↓
Application
     ↓
Domain
```

Consequências obrigatórias:

* Domain não importa React, DOM, `fetch`, axios, storage, bibliotecas de UI ou qualquer detalhe.
* Application não importa React nem detalhes de infraestrutura; depende apenas de Domain e de Ports (interfaces).
* Infrastructure/Adapters conhecem detalhes externos e **implementam** as portas.
* A UI depende de portas (casos de uso), não de implementações concretas.

Nunca inverter essa direção. Se o Domain precisa "chamar" a infraestrutura, ele o faz através de uma **porta de saída** (interface) definida no próprio núcleo.

---

# Camadas

## Domain

Representa conceitos e regras que não dependem de nada externo.

Pode conter:

* entidades;
* value objects;
* agregados quando fizer sentido;
* regras e invariantes de negócio;
* erros de domínio;
* tipos de domínio.

Não pode depender de:

```text
React
DOM / browser APIs
HTTP / fetch / axios
storage
bibliotecas de UI
detalhes de serialização
```

Exemplo:

```ts
// domain/product/Product.ts
export type ProductId = string & { readonly brand: unique symbol };

export interface Product {
  readonly id: ProductId;
  readonly name: string;
  readonly price: Money;
  readonly active: boolean;
}

export function deactivate(product: Product): Product {
  if (!product.active) {
    throw new ProductAlreadyInactiveError(product.id);
  }
  return { ...product, active: false };
}
```

---

## Application (Casos de Uso)

Orquestra as regras de negócio para atender a uma intenção do usuário.

Responsabilidades:

* coordenar o domínio;
* invocar portas de saída;
* definir e implementar portas de entrada (casos de uso);
* preparar dados para a borda quando necessário.

Não conhece:

* React;
* detalhes de HTTP;
* componentes visuais.

Exemplo:

```ts
// application/product/ports/in/CreateProduct.ts  (driving port)
export interface CreateProduct {
  execute(input: CreateProductInput): Promise<Product>;
}

// application/product/CreateProductService.ts
export class CreateProductService implements CreateProduct {
  constructor(private readonly products: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = buildProduct(input); // domínio
    return this.products.create(product); // porta de saída
  }
}
```

---

## Ports

Portas são **interfaces** que expressam contratos, definidas pelo núcleo.

```text
Driving Ports (in)
  → o que o mundo externo pode pedir ao aplicativo
  → casos de uso: CreateProduct, ListProducts, MoveStock

Driven Ports (out)
  → o que o aplicativo precisa do mundo externo
  → repositórios, gateways, relógio, id generator, telemetry
```

Exemplo de porta de saída:

```ts
// application/product/ports/out/ProductRepository.ts
export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | null>;
  create(product: Product): Promise<Product>;
}
```

A porta pertence ao núcleo. A implementação pertence à infraestrutura.

---

## Adapters

Adapters conectam o núcleo ao mundo real. Existem dois tipos.

### Driving Adapters (entrada)

Acionam a aplicação. No frontend, tipicamente:

* componentes React e páginas;
* hooks que invocam casos de uso;
* handlers de eventos.

O driving adapter traduz interação do usuário em chamadas a portas de entrada.

```ts
// features/products/hooks/useCreateProduct.ts
export function useCreateProduct(createProduct: CreateProduct) {
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct.execute(input),
  });
}
```

A UI não conhece HTTP; conhece o caso de uso.

### Driven Adapters (saída)

Implementam as portas de saída usando detalhes concretos.

```ts
// infrastructure/product/HttpProductRepository.ts
export class HttpProductRepository implements ProductRepository {
  constructor(private readonly http: HttpClient) {}

  async findAll(): Promise<Product[]> {
    const dtos = await this.http.get<ProductDto[]>("/products");
    return dtos.map(toDomain); // mapper DTO → domínio
  }

  async create(product: Product): Promise<Product> {
    const dto = await this.http.post<ProductDto>("/products", toDto(product));
    return toDomain(dto);
  }
}
```

Só o adapter conhece URLs, headers, status codes e formato do DTO.

---

# Estrutura de Pastas

Manter a organização por feature de `frontend-architecture.md`, com as camadas hexagonais dentro de cada feature.

```text
src/
├── app/                      # bootstrap, providers, DI, routing
├── features/
│   └── products/
│       ├── domain/           # entidades, value objects, regras, erros
│       ├── application/
│       │   ├── ports/
│       │   │   ├── in/       # casos de uso (interfaces)
│       │   │   └── out/      # repositórios/gateways (interfaces)
│       │   └── services/     # implementações dos casos de uso
│       ├── infrastructure/   # driven adapters (HttpProductRepository, mappers)
│       ├── ui/               # driving adapters: páginas, componentes, hooks
│       └── index.ts          # API pública da feature
├── shared/                   # domínio/ports/utilitários realmente compartilhados
└── infrastructure/           # HttpClient, storage, telemetry base
```

Não centralizar tudo por tipo técnico. Não vazar internals de uma feature (ver `frontend-architecture.md` → Feature Boundaries).

Aplicar as subcamadas na medida da complexidade da feature: uma feature trivial pode não precisar de todas as pastas.

---

# Injeção de Dependências

O núcleo depende de interfaces; alguém precisa fornecer as implementações concretas. A montagem (composition root) fica na borda, tipicamente em `app/`.

```text
Composition Root (app)
   ├── cria HttpClient
   ├── cria HttpProductRepository(httpClient)     // driven adapter
   ├── cria CreateProductService(repository)      // caso de uso
   └── disponibiliza o caso de uso à UI (Context/Provider/factory)
```

Regras:

* não instanciar adapters concretos dentro do Domain ou Application;
* injetar dependências via construtor/parâmetro/props/Context;
* a UI recebe casos de uso, não implementações de infraestrutura;
* manter um único ponto de montagem por escopo (composition root).

Exemplo simplificado:

```ts
// app/di/products.ts
export function buildProductUseCases(http: HttpClient) {
  const repository = new HttpProductRepository(http);
  return {
    createProduct: new CreateProductService(repository),
    listProducts: new ListProductsService(repository),
  };
}
```

Não transformar DI em framework próprio complexo. Manter simples e explícito.

---

# Mapeamento e DTOs

O formato da API não é o modelo de domínio.

```text
API DTO
   ↓ (mapper no driven adapter)
Domain Model
   ↓ (view model quando necessário)
UI
```

Regras:

* mappers vivem na infraestrutura (borda), nunca no domínio;
* o domínio nunca importa tipos de DTO;
* criar view models quando a UI precisar de uma forma diferente do domínio;
* não criar mapeamentos artificiais quando DTO e domínio forem equivalentes e sem benefício (ver `frontend-architecture.md` → DTOs).

---

# Fluxo Completo (exemplo)

```text
Usuário clica "Salvar"
        ↓
UI (driving adapter): useCreateProduct
        ↓
Porta de entrada: CreateProduct.execute(input)
        ↓
Caso de uso: CreateProductService
        ├── monta/valida via Domain
        └── chama porta de saída ProductRepository.create()
                ↓
        Driven adapter: HttpProductRepository
                ├── toDto()
                ├── HttpClient.post()
                └── toDomain()
        ↓
Resultado retorna ao caso de uso → UI atualiza estado/feedback
```

A UI nunca fala HTTP diretamente. O domínio nunca conhece a UI nem o HTTP.

---

# Erros e Fronteiras

* erros de domínio pertencem ao domínio (`ProductAlreadyInactiveError`);
* erros técnicos (rede, parsing) são tratados/traduzidos na infraestrutura;
* a UI traduz erros em mensagens adequadas ao usuário (ver `frontend-architecture.md` e `frontend-engineering.md` → Error Handling);
* dados que cruzam a fronteira de entrada devem ser validados antes de virarem domínio.

```text
Infrastructure Error → Application Error → Presentation Message
```

---

# Testabilidade

O principal benefício da arquitetura é testar o núcleo sem a periferia.

* Domain: testes unitários puros, sem mocks de framework;
* Application: testar casos de uso com implementações fake/in-memory das portas de saída;
* Adapters: testar isoladamente a tradução (DTO ↔ domínio, chamadas HTTP);
* UI: testar comportamento observável, injetando casos de uso fake.

Exemplo de fake para teste de caso de uso:

```ts
class InMemoryProductRepository implements ProductRepository {
  private readonly items: Product[] = [];
  async findAll() { return [...this.items]; }
  async findById(id: ProductId) { return this.items.find((p) => p.id === id) ?? null; }
  async create(product: Product) { this.items.push(product); return product; }
}
```

Se testar o núcleo exige mockar HTTP ou renderizar componentes, a fronteira provavelmente está vazando.

---

# Quando Aplicar (Pragmatismo)

A arquitetura hexagonal tem custo. Aplicá-la na proporção do valor.

Aplicar plenamente quando houver:

* regra de negócio relevante no frontend;
* múltiplas fontes de dados ou integrações;
* necessidade de substituir/testar implementações;
* complexidade que justifique isolamento.

Simplificar quando:

* a feature é essencialmente CRUD fino sobre a API;
* não há regra de negócio real no cliente;
* a indireção não traz benefício de teste ou substituição.

Nesses casos, é aceitável colapsar camadas (ex.: um hook + repositório), desde que a **regra de dependência** seja preservada: UI não fala HTTP direto.

Ver `frontend-architecture.md` → Abstraction Rules. Não criar portas e adapters apenas por seguir o padrão.

---

# Anti-Patterns

Evitar:

* `fetch`/axios direto dentro de componentes;
* regra de negócio dentro de componentes ou hooks de UI;
* domínio importando React, DTO ou detalhes de infraestrutura;
* portas definidas na infraestrutura em vez do núcleo;
* mappers dentro do domínio;
* instanciar adapters concretos no domínio/aplicação;
* portas e adapters criados sem consumidor ou sem benefício;
* dependências circulares entre camadas ou features;
* vazamento de internals de uma feature para outra;
* usar a UI como mecanismo de segurança (autorização real é do backend).

---

# Relação com as Demais Steerings

```text
hexagonal-architecture   → fronteiras e direção de dependências (autoridade)
frontend-architecture    → features, estado, comunicação, roteamento
clean-code               → qualidade dentro de cada unidade de código
frontend-engineering     → implementação React/TS, a11y, performance, testes
design-system / ux-design→ linguagem visual e experiência
```

Em caso de conflito sobre onde uma responsabilidade vive ou para onde uma dependência aponta, esta steering prevalece.

---

# Definition of Done

Uma implementação respeita a arquitetura hexagonal quando:

* [ ] o domínio não importa React, HTTP, storage ou bibliotecas de UI;
* [ ] as regras de negócio estão no domínio/aplicação, não em componentes;
* [ ] casos de uso são expressos por portas de entrada;
* [ ] o acesso a dados/externos passa por portas de saída (interfaces do núcleo);
* [ ] os adapters concretos implementam as portas e ficam na infraestrutura;
* [ ] a UI consome casos de uso, não implementações de infraestrutura;
* [ ] as dependências apontam para dentro (regra de dependência preservada);
* [ ] DTOs são mapeados para domínio na borda, não vazam para o núcleo;
* [ ] a composição de dependências ocorre em um composition root;
* [ ] o núcleo é testável sem mockar framework ou HTTP;
* [ ] não foram criadas portas/adapters sem benefício real;
* [ ] feature boundaries e ausência de dependências circulares foram respeitadas.
