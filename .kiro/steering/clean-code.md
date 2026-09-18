# Clean Code

## Objetivo

Atuar como um engenheiro de software frontend sênior comprometido com Clean Code durante todo o desenvolvimento.

O código deve ser escrito primeiro para ser lido por pessoas e só depois para ser executado por máquinas.

Toda implementação deve priorizar:

* clareza;
* simplicidade;
* coesão;
* baixo acoplamento;
* intenção explícita;
* previsibilidade;
* facilidade de manutenção;
* facilidade de teste;
* facilidade de exclusão.

Código "inteligente" porém difícil de entender é considerado um problema, não uma qualidade.

Esta steering complementa `frontend-engineering.md` (implementação) e `hexagonal-architecture.md` (estrutura de camadas). Em caso de conflito, a decisão deve favorecer clareza e a regra de dependência definida na arquitetura.

---

# Princípios Fundamentais

## Legibilidade Primeiro

O leitor do código é o principal cliente.

Preferir:

```text
Código óbvio
    ↓
Código explicado
    ↓
Código comentado
```

Se o código precisa de um comentário para ser compreendido, avaliar primeiro se ele pode ser reescrito para ser óbvio.

---

## Simplicidade Primeiro

Preferir a solução mais simples que resolva corretamente o problema.

Não adicionar:

* abstrações prematuras;
* generalizações especulativas;
* configurabilidade sem consumidor real;
* camadas sem propósito;
* padrões complexos sem necessidade.

A complexidade precisa ser justificada pelo problema.

---

## Boy Scout Rule

Deixar o código mais limpo do que estava.

Melhorias pequenas e seguras são bem-vindas quando fizerem parte do contexto que já está sendo alterado.

Não misturar refactoring amplo com nova funcionalidade no mesmo change (ver `frontend-engineering.md` → Git-Friendly Changes).

---

# Idioma do Código

O código-fonte é escrito em **inglês**, sempre.

Aplica-se a:

* nomes de arquivos;
* nomes de diretórios;
* variáveis, funções, parâmetros;
* tipos, interfaces, classes, enums;
* componentes e hooks;
* chaves de objetos e constantes;
* nomes de teste;
* mensagens de commit e identificadores técnicos.

Preferir:

```ts
// products/CreateProductForm.tsx
function calculateOrderTotal(order: Order): Money { /* ... */ }
const activeProducts = products.filter((product) => product.isActive);
```

Evitar:

```ts
// produtos/FormularioCriarProduto.tsx
function calcularTotalPedido(pedido: Pedido): Dinheiro { /* ... */ }
const produtosAtivos = produtos.filter((produto) => produto.ativo);
```

Exceções legítimas ao inglês:

* **texto voltado ao usuário** (labels, mensagens, conteúdo de UI), que segue o i18n/idioma do produto;
* **termos de domínio sem tradução adequada**, quando traduzir prejudicar a clareza — nesse caso, manter o termo consistente em toda a base.

## Idioma da Documentação e Artefatos

Documentação e artefatos escritos são em **português (BR)**.

Aplica-se a:

* comentários de código;
* README e documentação do projeto;
* steerings;
* ADRs e decisões de arquitetura;
* documentos de design, requisitos e specs;
* descrições de Pull Request;
* changelog e notas de release voltadas à equipe;
* JSDoc/TSDoc de intenção e regras de negócio.

Resumo da regra de idioma:

```text
Código (nomes, identificadores, arquivos, diretórios)  → inglês
Documentação e artefatos escritos                      → português (BR)
Texto voltado ao usuário                               → idioma do produto / i18n
```

A regra do inglês vale para o **código**; a prosa que o explica é em português.

---

# Nomes

Nomes devem revelar intenção.

Um bom nome responde:

```text
O que é?
Para que serve?
Como é usado?
```

Preferir:

```ts
const activeProducts = products.filter((product) => product.isActive);

function calculateOrderTotal(order: Order): Money { /* ... */ }
```

Evitar:

```ts
const data = products.filter((p) => p.a);

function calc(o: Order): number { /* ... */ }
```

---

## Regras de Nomeação

* usar nomes pronunciáveis e pesquisáveis;
* usar nomes por domínio, não por tipo técnico;
* manter consistência de vocabulário em todo o projeto;
* evitar abreviações ambíguas;
* evitar ruído (`Data`, `Info`, `Object`, `Manager`, `Helper`, `Util`) quando não comunicarem responsabilidade;
* booleanos devem soar como perguntas (`isActive`, `hasPermission`, `canSubmit`, `shouldRetry`);
* funções devem começar com verbo (`createProduct`, `mapToDomain`, `formatCurrency`);
* componentes e tipos em `PascalCase`; funções, variáveis e hooks em `camelCase`; hooks com prefixo `use`.

Manter alinhamento com a seção Naming de `frontend-architecture.md` e `frontend-engineering.md`.

---

## Um Conceito, Um Termo

Utilizar o mesmo termo para o mesmo conceito.

Evitar misturar sinônimos para a mesma ideia:

```text
fetch / get / load / retrieve
```

para a mesma operação em contextos equivalentes.

Escolher um vocabulário e mantê-lo.

---

# Funções

Funções devem ser pequenas e fazer uma única coisa.

Uma função faz uma coisa quando todas as suas instruções estão no mesmo nível de abstração.

Preferir:

```ts
function submitProduct(input: CreateProductInput): Promise<Product> {
  const product = buildProduct(input);
  validateProduct(product);
  return productRepository.create(product);
}
```

Evitar funções que misturam níveis:

```ts
function submitProduct(input: CreateProductInput) {
  // validação de formato + regra de negócio + fetch + parsing + navegação + toast
}
```

---

## Regras de Funções

* manter funções curtas e focadas;
* um único nível de abstração por função;
* limitar a quantidade de parâmetros (preferir no máximo 3; acima disso, encapsular em um objeto/tipo);
* evitar parâmetros booleanos que alteram o comportamento (indicam que a função faz mais de uma coisa);
* evitar efeitos colaterais escondidos;
* preferir funções puras quando possível;
* retornar cedo (early return) para reduzir aninhamento;
* nomear a função pelo que ela faz, não por como faz.

Exemplo de flag argument a evitar:

```ts
renderProduct(product, true); // o que é true?
```

Preferir:

```ts
renderActiveProduct(product);
renderArchivedProduct(product);
```

---

## Command Query Separation

Uma função deve **fazer algo** ou **responder algo**, não ambos.

```text
Command → altera estado, não retorna dado de consulta
Query   → retorna dado, não altera estado
```

Evitar funções que consultam e mutam simultaneamente sem que isso fique explícito.

---

# Argumentos e Retornos

* preferir objetos nomeados para conjuntos de parâmetros relacionados;
* evitar `null`/`undefined` como retorno ambíguo quando um tipo explícito comunicar melhor;
* tratar nullability de forma explícita (ver `frontend-engineering.md` → Nullability);
* preferir `Result`/discriminated unions a lançar exceções para fluxos de erro esperados, quando isso melhorar a clareza.

Exemplo:

```ts
type LoadResult =
  | { status: "success"; products: Product[] }
  | { status: "empty" }
  | { status: "error"; error: AppError };
```

---

# SOLID no Frontend

Aplicar SOLID de forma pragmática, sem transformar em cerimônia.

## Single Responsibility

Um componente, hook, módulo ou função deve possuir um único motivo para mudar.

Separar:

* apresentação;
* estado;
* regra de negócio;
* acesso a dados;
* transformação;
* navegação.

## Open/Closed

Preferir composição e extensão a modificar código estável repetidamente.

Em React, favorecer composição de componentes e injeção de comportamento via props/hooks.

## Liskov Substitution

Implementações de uma mesma interface (ex.: um `ProductRepository`) devem ser intercambiáveis sem quebrar consumidores.

## Interface Segregation

Preferir contratos pequenos e específicos.

Não forçar um componente a receber props que não usa; não forçar uma interface com métodos irrelevantes ao consumidor.

## Dependency Inversion

Módulos de alto nível dependem de abstrações, não de detalhes.

A UI depende de portas/interfaces, não de implementações concretas de HTTP (detalhado em `hexagonal-architecture.md`).

---

# DRY com Cuidado

Evitar duplicação de conhecimento, não de código superficialmente parecido.

```text
Duplicação real de regra → eliminar
Semelhança acidental     → manter separado
```

Não criar abstrações apenas porque dois trechos parecem iguais hoje. Acoplar conceitos diferentes por coincidência gera abstrações frágeis.

Regra prática:

```text
Duplicar uma vez pode ser aceitável.
A terceira ocorrência costuma justificar a abstração.
```

---

# Complexidade

Reduzir complexidade acidental.

* evitar aninhamento profundo de condicionais;
* extrair condições complexas para funções/variáveis com nome;
* preferir tabelas de mapeamento a longas cadeias `if/else` ou `switch`;
* quebrar componentes e funções grandes por responsabilidade;
* evitar cadeias longas de effects e estados derivados desnecessários.

Exemplo:

```ts
const canCheckout = hasItems && isAuthenticated && !isBlocked;

if (!canCheckout) return <CheckoutBlocked reason={...} />;
```

em vez de aninhar múltiplas condições ao longo do JSX.

---

# Comentários

Preferir código autoexplicativo a comentários.

Comentários úteis explicam **por quê**, não **o quê**.

Bons comentários:

* explicam decisões não óbvias;
* documentam trade-offs;
* alertam sobre consequências;
* explicam regras de negócio não evidentes;
* referenciam contexto externo relevante.

Evitar:

* comentários que repetem o código;
* código comentado (usar histórico do versionamento);
* comentários desatualizados;
* `TODO`/`FIXME` sem contexto ou responsável.

---

# Formatação e Consistência

Seguir o formatador e o linter do projeto.

* não discutir estilo manualmente quando houver ferramenta configurada;
* manter organização vertical: itens relacionados próximos;
* uma ordem previsível dentro de arquivos e componentes;
* imports organizados e sem itens não utilizados.

Formatação não é preferência pessoal; é consistência de time.

---

# Tratamento de Erros

Erros fazem parte do design, não são um caso à parte.

* separar erro técnico de erro apresentado ao usuário (ver `frontend-architecture.md` → Error Handling);
* não engolir erros silenciosamente;
* não usar `catch` vazio;
* falhar de forma previsível;
* preferir tipos de erro específicos a strings soltas;
* nunca expor stack trace ou dado sensível ao usuário.

Exemplo inadequado:

```ts
try {
  await save();
} catch {
  // silêncio
}
```

---

# Estruturas de Dados e Objetos

* preferir dados imutáveis quando possível;
* não expor estruturas internas mutáveis;
* preferir `readonly` e tipos imutáveis em contratos;
* evitar objetos com muitos campos opcionais que representam estados inválidos;
* modelar estados válidos de forma que estados inválidos sejam irrepresentáveis (discriminated unions).

Exemplo:

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: AppError };
```

---

# Fronteiras (Boundaries)

Isolar dependências externas atrás de contratos próprios.

* não espalhar chamadas de biblioteca externa por toda a base de código;
* encapsular integrações em módulos dedicados;
* tratar dados vindos de fora (API, storage, URL) como não confiáveis até validação.

Detalhado em `hexagonal-architecture.md`.

---

# Testabilidade

Código limpo é testável por consequência.

* preferir funções puras e dependências injetadas;
* evitar acoplamento a singletons globais e a detalhes de implementação;
* testar comportamento observável, não estrutura interna (ver `frontend-engineering.md` → Testing);
* se algo é difícil de testar, geralmente é sinal de acoplamento ou responsabilidade excessiva.

---

# Code Smells a Evitar

* funções e componentes gigantes;
* muitos parâmetros;
* flags booleanas que alteram comportamento;
* aninhamento profundo;
* nomes genéricos (`data`, `handle`, `manager`, `helper`, `util`) sem significado;
* números e strings mágicas sem constante nomeada;
* estado derivado duplicado;
* efeitos colaterais escondidos;
* comentários explicando código confuso em vez de simplificá-lo;
* `any` e casts para silenciar o compilador;
* duplicação de regra de negócio;
* abstração prematura;
* dependências circulares;
* `utils`/`common` como depósito geral.

---

# Refactoring

Refatorar continuamente e em passos pequenos.

* refatorar com testes cobrindo o comportamento;
* uma intenção por commit;
* não misturar refactoring com mudança de comportamento;
* preferir renomear para revelar intenção antes de comentar;
* extrair função/componente quando um trecho ganhar nome próprio.

---

# Relação com as Demais Steerings

```text
clean-code
   → como escrever cada unidade de código

hexagonal-architecture
   → onde cada responsabilidade vive e como as dependências fluem

frontend-architecture
   → estrutura de features, estado e comunicação

frontend-engineering
   → implementação React/TS, a11y, performance, testes

design-system / ux-design
   → linguagem visual e experiência
```

Clean Code atua dentro de cada arquivo; a arquitetura define as fronteiras entre eles.

---

# Definition of Done

Uma unidade de código pode ser considerada limpa quando:

* [ ] os nomes revelam intenção;
* [ ] cada função/componente tem uma responsabilidade clara;
* [ ] funções são pequenas e em um único nível de abstração;
* [ ] não há duplicação de regra de negócio;
* [ ] a complexidade condicional está controlada;
* [ ] estados inválidos são difíceis de representar;
* [ ] erros são tratados de forma explícita e adequada;
* [ ] não há `any` ou casts injustificados;
* [ ] não há code smells relevantes;
* [ ] não há comentários redundantes ou código morto;
* [ ] o código pode ser testado sem acoplamento excessivo;
* [ ] a mudança está focada e coesa;
* [ ] o formatador e o linter do projeto passam.
