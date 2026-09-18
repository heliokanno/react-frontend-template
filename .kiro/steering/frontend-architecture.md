# Frontend Architecture

## Objetivo

Atuar como um engenheiro de software frontend sênior, responsável por projetar e implementar uma arquitetura React escalável, sustentável, testável e preparada para evolução.

A arquitetura deve priorizar:

* separação de responsabilidades;
* baixo acoplamento;
* alta coesão;
* composição;
* testabilidade;
* reutilização;
* previsibilidade;
* escalabilidade;
* manutenção;
* clareza estrutural.

A arquitetura deve evitar complexidade desnecessária e abstrações prematuras.

---

# Princípios Arquiteturais

## 1. Separation of Concerns

Cada camada deve possuir uma responsabilidade clara.

Evitar concentrar em um único componente:

* apresentação;
* regras de negócio;
* chamadas HTTP;
* transformação de dados;
* gerenciamento de estado;
* navegação;
* validação;
* controle de permissões.

Separar responsabilidades de acordo com o contexto.

---

## 2. Dependency Rule

Dependências devem apontar para abstrações mais estáveis.

A camada de apresentação não deve conhecer detalhes de infraestrutura.

Preferir:

```text
UI
 ↓
Application
 ↓
Domain
 ↓
Infrastructure
```

A direção das dependências deve ser controlada.

Evitar:

```text
Component
 ↓
fetch()
 ↓
API específica
 ↓
transformações
 ↓
regras de negócio
```

---

# Arquitetura por Features

Organizar o código principalmente por domínio/feature e não apenas por tipo técnico.

Preferir:

```text
src/
├── app/
├── features/
│   ├── products/
│   ├── categories/
│   ├── brands/
│   └── inventory/
├── shared/
└── infrastructure/
```

Evitar estruturas excessivamente centralizadas como:

```text
components/
hooks/
services/
utils/
types/
pages/
```

contendo centenas de arquivos de diferentes funcionalidades.

---

# Feature Boundaries

Cada feature deve possuir limites claros.

Exemplo:

```text
features/products/
├── components/
├── pages/
├── hooks/
├── services/
├── schemas/
├── types/
└── index.ts
```

Uma feature não deve acessar diretamente detalhes internos de outra feature.

Preferir uma API pública da feature.

Exemplo:

```text
features/products/index.ts
```

pode expor:

```text
Product
ProductList
ProductService
useProducts
```

Enquanto detalhes internos permanecem privados.

---

# Shared

`shared` deve conter somente funcionalidades realmente compartilhadas.

Exemplos:

```text
shared/
├── components/
├── hooks/
├── utils/
├── types/
└── constants/
```

Não utilizar `shared` como depósito para código que ainda não possui um domínio definido.

Regra:

```text
Uso local
    ↓
Feature
    ↓
Shared somente quando houver reutilização real
```

---

# App Layer

A camada `app` deve coordenar a aplicação.

Responsabilidades possíveis:

* bootstrap;
* routing;
* providers;
* configuração global;
* tema;
* autenticação global;
* error boundaries;
* configuração de observabilidade;
* inicialização de serviços.

Evitar colocar regras específicas de negócio dentro de `app`.

---

# Domain Layer

A camada de domínio representa conceitos e regras que não dependem da interface.

Exemplos:

```text
Product
Category
Brand
Stock
InventoryMovement
```

O domínio pode conter:

* entidades;
* value objects;
* regras de negócio;
* tipos de domínio;
* validações de domínio.

Não deve depender de:

* React;
* browser APIs;
* componentes visuais;
* bibliotecas específicas de UI;
* detalhes HTTP.

---

# Application Layer

A camada de aplicação coordena casos de uso.

Exemplos:

```text
CreateProduct
UpdateProduct
DeleteProduct
ListProducts
MoveStock
```

Responsabilidades:

* orquestrar operações;
* coordenar domínio;
* chamar portas/interfaces;
* preparar dados para apresentação quando necessário.

Não deve conhecer detalhes visuais.

---

# Infrastructure Layer

Infrastructure contém detalhes técnicos.

Exemplos:

```text
HTTP Client
API Client
Storage
Authentication Adapter
Telemetry
Configuration
```

Exemplo:

```text
infrastructure/http/
infrastructure/auth/
infrastructure/storage/
```

Infrastructure pode depender de bibliotecas externas.

Domain não deve depender de Infrastructure.

---

# Presentation Layer

Presentation contém:

* páginas;
* componentes;
* layouts;
* hooks de apresentação;
* estados visuais;
* interação.

Presentation não deve implementar regras de negócio complexas.

Exemplo:

```text
ProductPage
```

pode coordenar:

```text
ProductHeader
ProductFilters
ProductTable
ProductForm
```

mas não deve implementar diretamente regras complexas de estoque.

---

# Component Hierarchy

Componentes devem seguir uma hierarquia clara.

```text
Page
 ↓
Feature Components
 ↓
Shared Components
 ↓
Primitive Components
```

Exemplo:

```text
ProductPage
 ├── ProductHeader
 ├── ProductFilters
 ├── ProductTable
 │    ├── Table
 │    ├── TableHeader
 │    ├── TableRow
 │    └── TableCell
 └── ProductDialog
```

Evitar componentes gigantes.

---

# Smart vs Presentational

Não aplicar dogmaticamente uma separação `Smart/Presentational`.

Utilizar separação quando ela melhorar:

* reutilização;
* testabilidade;
* compreensão;
* isolamento de responsabilidades.

Componentes simples podem possuir estado local sem necessidade de criar uma camada adicional.

---

# Hooks

Hooks devem possuir responsabilidade clara.

Tipos comuns:

```text
useProducts
useProduct
useCreateProduct
useForm
useDebounce
useMediaQuery
```

Evitar hooks que façam tudo.

Exemplo ruim:

```text
useProductManagement()
```

responsável por:

* buscar;
* criar;
* editar;
* excluir;
* filtrar;
* paginar;
* controlar modal;
* validar;
* navegar.

Preferir hooks menores e composáveis quando a complexidade justificar.

---

# Server State

Dados provenientes do backend devem ser tratados como server state.

Considerar:

* cache;
* refetch;
* invalidation;
* stale data;
* loading;
* error;
* retry;
* optimistic update quando apropriado.

Não copiar indiscriminadamente server state para global state.

---

# Client State

Estado puramente de interface deve permanecer local quando possível.

Exemplos:

```text
isModalOpen
selectedTab
expandedRow
inputValue
isSidebarOpen
```

Não transformar estado local em estado global sem necessidade.

---

# URL State

Utilizar a URL para estado que deve sobreviver a:

* refresh;
* compartilhamento;
* navegação;
* histórico do browser.

Exemplos:

```text
search
page
sort
filters
tab
```

Exemplo:

```text
/products?search=brake&page=2&sort=name
```

A URL deve representar estado navegável quando isso fizer sentido para o usuário.

---

# Global State

Global state deve ser utilizado somente quando existir uma necessidade real de compartilhamento.

Possíveis exemplos:

* sessão;
* preferências globais;
* tema;
* contexto de aplicação;
* estado compartilhado entre áreas distantes.

Não colocar automaticamente todos os dados da aplicação em uma store global.

---

# State Ownership

Todo estado deve possuir um proprietário claro.

Perguntar:

```text
Quem precisa desse estado?
```

Se somente um componente precisa:

```text
Local state
```

Se componentes próximos precisam:

```text
Lift state / Context
```

Se o estado representa dados remotos:

```text
Server state
```

Se representa estado navegável:

```text
URL state
```

Se realmente atravessa diferentes partes da aplicação:

```text
Global state
```

---

# API Architecture

A comunicação com o backend deve possuir uma camada de abstração.

Preferir:

```text
Component
 ↓
Hook
 ↓
Application Service
 ↓
Repository / API Client
 ↓
HTTP Client
 ↓
Backend
```

Componentes não devem conhecer:

* URLs;
* headers;
* detalhes HTTP;
* códigos de status;
* interceptors;
* serialização.

---

# API Client

O API Client deve centralizar preocupações técnicas comuns.

Exemplos:

* base URL;
* headers;
* autenticação;
* interceptors;
* timeout;
* parsing;
* tratamento técnico de erros;
* observabilidade.

Não colocar regras de negócio dentro do HTTP client.

---

# Repository

Quando a complexidade justificar, utilizar interfaces para representar acesso aos dados.

Exemplo:

```ts
interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product>;
  create(product: CreateProduct): Promise<Product>;
}
```

A implementação concreta pode utilizar HTTP.

```text
ProductRepository
        ↑
HttpProductRepository
```

Não criar repositories apenas por seguir um padrão.

A abstração deve existir quando contribuir para:

* isolamento;
* testabilidade;
* substituição;
* clareza arquitetural.

---

# DTOs

Não assumir que DTO da API é automaticamente o modelo utilizado pela interface.

Quando necessário, separar:

```text
API DTO
   ↓
Mapper
   ↓
Domain Model
   ↓
View Model
```

Isso é especialmente importante quando o backend possui estruturas diferentes das necessidades da UI.

Não criar mapeamentos artificiais quando DTO e domínio forem equivalentes e não houver benefício real.

---

# Validation

Separar diferentes tipos de validação.

### UI Validation

Responsável por:

* feedback imediato;
* formato;
* required;
* interação.

### Domain Validation

Responsável por:

* regras de negócio;
* invariantes;
* consistência.

### Backend Validation

Sempre considerada autoridade final.

Nunca assumir que validação frontend substitui validação backend.

---

# Error Handling

Erros devem possuir níveis diferentes.

```text
Infrastructure Error
        ↓
Application Error
        ↓
Presentation Error
```

Detalhes técnicos não devem vazar diretamente para o usuário.

Exemplo:

```text
HTTP 500
```

não deve ser necessariamente exibido diretamente.

A camada de apresentação deve transformar erros técnicos em mensagens adequadas ao contexto.

---

# Authentication

Autenticação deve ficar isolada da UI.

A aplicação deve possuir uma abstração para:

* sessão;
* token;
* login;
* logout;
* refresh;
* usuário atual.

Componentes não devem implementar diretamente mecanismos de autenticação.

---

# Authorization

Autorização real é responsabilidade do backend.

O frontend pode:

* ocultar ações;
* desabilitar ações;
* adaptar navegação;
* informar falta de permissão.

Mas nunca considerar a UI como mecanismo de segurança.

```text
Frontend
→ UX / Presentation

Backend
→ Security / Authorization
```

---

# Routing

Routing deve ser centralizado na camada de aplicação.

Responsabilidades:

* rotas;
* layouts;
* parâmetros;
* guards;
* lazy loading;
* páginas de erro.

Rotas devem refletir a arquitetura funcional da aplicação.

---

# Lazy Loading

Utilizar lazy loading quando houver benefício real.

Candidatos:

* páginas;
* features grandes;
* áreas administrativas;
* funcionalidades raramente utilizadas.

Não utilizar lazy loading indiscriminadamente em componentes pequenos.

---

# Error Boundaries

Utilizar Error Boundaries para evitar que uma falha localizada derrube toda a aplicação quando isso puder ser evitado.

Definir estratégia de fallback.

Quando possível:

```text
Feature Error
→ fallback da feature
```

em vez de:

```text
Feature Error
→ aplicação inteira inutilizada
```

---

# Dependency Management

Evitar dependências desnecessárias.

Antes de adicionar uma biblioteca:

1. verificar se o projeto já possui solução;
2. verificar se a plataforma resolve o problema;
3. avaliar tamanho e impacto;
4. avaliar manutenção;
5. avaliar acessibilidade;
6. avaliar compatibilidade;
7. avaliar necessidade real.

Não adicionar bibliotecas para problemas triviais.

---

# Abstraction Rules

Criar abstrações somente quando houver uma razão concreta.

Sinais de uma boa abstração:

* reduz duplicação real;
* melhora clareza;
* possui responsabilidade clara;
* possui consumidores reais;
* reduz acoplamento.

Sinais de uma abstração ruim:

* existe apenas para "organizar";
* possui apenas um consumidor sem necessidade;
* exige muitos parâmetros;
* esconde comportamento simples;
* aumenta a complexidade.

---

# Colocation

Manter código próximo ao local onde é utilizado quando isso melhorar a compreensão.

Exemplo:

```text
ProductTable/
├── ProductTable.tsx
├── ProductTable.test.tsx
├── ProductTable.types.ts
└── ProductTable.utils.ts
```

Não centralizar todos os arquivos do projeto apenas por categoria técnica.

---

# Naming

Nomes devem representar intenção.

Preferir:

```text
ProductList
ProductFilters
CreateProductForm
useProducts
ProductRepository
```

Evitar:

```text
DataComponent
CommonComponent
Helper
Manager
Utils
Handler
Stuff
```

quando não houver significado específico.

---

# File Size

Arquivos devem permanecer compreensíveis.

Quando um arquivo crescer significativamente, avaliar separação por responsabilidade.

Não dividir arquivos artificialmente apenas para reduzir número de linhas.

---

# Circular Dependencies

Evitar dependências circulares entre:

* features;
* componentes;
* hooks;
* services;
* módulos.

Dependências devem possuir direção clara.

---

# Feature Communication

Features devem se comunicar através de contratos explícitos.

Evitar:

```text
Feature A
 ↓
acesso direto a internals
 ↓
Feature B
```

Preferir:

```text
Feature A
 ↓
Public API
 ↓
Feature B
```

Isso reduz acoplamento e facilita evolução.

---

# Reusability

Reutilização deve surgir de necessidades reais.

Não criar componentes genéricos excessivamente abstratos como:

```text
UniversalTable
UniversalForm
UniversalModal
UniversalPage
```

quando isso exigir dezenas de propriedades e comportamentos.

Preferir componentes composáveis e específicos.

---

# Performance Architecture

Performance deve ser considerada arquiteturalmente.

Avaliar:

* bundle size;
* code splitting;
* lazy loading;
* rendering;
* network requests;
* caching;
* image loading;
* data fetching;
* re-rendering.

Evitar otimizações prematuras.

Otimizar com base em evidências sempre que possível.

---

# Observability

Quando o projeto possuir observabilidade frontend, manter a instrumentação separada da lógica de negócio.

Considerar:

* erros;
* performance;
* navegação;
* chamadas importantes;
* métricas;
* tracing quando aplicável.

Não espalhar código de telemetria manualmente por todos os componentes.

---

# Testing Architecture

A arquitetura deve facilitar testes.

Priorizar:

```text
Unit
 ↓
Integration
 ↓
Component
 ↓
End-to-End
```

Testar principalmente comportamento observável.

Evitar testar detalhes internos da implementação quando não forem relevantes para o comportamento.

---

# Architecture Decision Process

Antes de introduzir uma nova solução arquitetural:

1. identificar o problema;
2. avaliar a solução mais simples;
3. verificar padrões existentes;
4. avaliar impacto;
5. considerar alternativas;
6. implementar;
7. documentar quando a decisão for significativa.

Não introduzir arquitetura complexa sem necessidade real.

---

# Anti-Patterns

Evitar:

* componentes gigantes;
* global state para tudo;
* chamadas HTTP dentro da UI;
* lógica de negócio em componentes;
* duplicação de API clients;
* `utils` como depósito geral;
* `common` como depósito geral;
* abstrações prematuras;
* dependências circulares;
* componentes excessivamente configuráveis;
* barrel exports indiscriminados;
* prop drilling excessivo sem avaliar alternativas;
* Context usado como substituto universal de state management;
* copiar server state para global state sem necessidade.

---

# Definition of Done

Uma mudança arquitetural deve ser considerada concluída quando:

* [ ] responsabilidades estão claramente separadas;
* [ ] dependências possuem direção clara;
* [ ] feature boundaries foram respeitadas;
* [ ] estado possui ownership claro;
* [ ] API está isolada da apresentação;
* [ ] regras de negócio não estão em componentes visuais;
* [ ] erros possuem tratamento adequado;
* [ ] autenticação está isolada;
* [ ] autorização não depende do frontend;
* [ ] não foram introduzidas abstrações desnecessárias;
* [ ] não foram adicionadas dependências sem justificativa;
* [ ] testes podem ser implementados sem acoplamento excessivo;
* [ ] estrutura permanece compreensível para novos desenvolvedores.
