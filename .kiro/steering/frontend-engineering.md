# Frontend Engineering

## Objetivo

Atuar como um engenheiro de software frontend sênior durante o desenvolvimento da aplicação.

Toda implementação deve buscar qualidade de produção, considerando simultaneamente:

* funcionalidade;
* acessibilidade;
* responsividade;
* performance;
* segurança;
* manutenibilidade;
* testabilidade;
* reutilização;
* experiência do usuário;
* consistência com o Design System.

O código deve ser simples de entender, fácil de testar e preparado para evolução.

---

# Princípios Fundamentais

## Production Quality First

Não implementar interfaces apenas para atender ao caminho feliz.

Toda funcionalidade deve considerar, quando aplicável:

```text id="8p4m2d"
Initial
Loading
Success
Empty
Error
Disabled
Unauthorized
Retry
```

A implementação somente deve ser considerada completa quando os estados relevantes estiverem tratados.

---

## Simplicity First

Preferir a solução mais simples que resolva corretamente o problema.

Não introduzir:

* abstrações prematuras;
* bibliotecas desnecessárias;
* padrões complexos;
* gerenciamento global de estado sem necessidade;
* otimizações prematuras.

Complexidade deve ser justificada pelo problema que resolve.

---

# TypeScript

Utilizar TypeScript de forma rigorosa.

Priorizar:

* tipos explícitos quando agregarem clareza;
* inferência quando suficiente;
* interfaces ou type aliases de acordo com o contexto;
* union types;
* discriminated unions;
* generics quando realmente necessários.

Evitar:

```ts id="n9g9t8"
any
```

quando existir uma alternativa tipada.

Não utilizar `any` apenas para contornar erros de tipagem.

Quando `unknown` for apropriado, preferi-lo a `any` e realizar narrowing explícito.

---

# Strict Typing

Evitar:

```ts id="2qj0p5"
as any
```

e casts indiscriminados.

Type assertions devem ser utilizadas somente quando houver garantia da validade do tipo.

Não utilizar casts para silenciar erros arquiteturais ou inconsistências de contrato.

---

# Nullability

Tratar explicitamente valores que possam ser:

```text id="1p90yx"
null
undefined
empty
```

Não assumir que dados da API sempre estarão completos.

A UI deve possuir comportamento previsível para dados incompletos ou inesperados.

---

# React Components

Componentes devem possuir responsabilidade clara.

Preferir componentes:

* pequenos;
* coesos;
* composáveis;
* previsíveis;
* testáveis.

Evitar componentes gigantes que concentram:

* fetching;
* regras de negócio;
* transformação de dados;
* estado global;
* navegação;
* validação;
* apresentação.

---

# Component Composition

Preferir composição em vez de componentes altamente configuráveis.

Preferir:

```tsx id="2p0ah5"
<Card>
  <CardHeader>
    <CardTitle>Produtos</CardTitle>
  </CardHeader>

  <CardContent>
    <ProductList />
  </CardContent>
</Card>
```

em vez de:

```tsx id="8r1s7g"
<Card
  title="Produtos"
  showHeader
  headerSize="large"
  rounded
  shadow
  padding="medium"
  content={<ProductList />}
/>
```

Se um componente precisar de muitas propriedades para representar casos diferentes, avaliar composição ou divisão do componente.

---

# Component Props

Props devem representar o contrato do componente.

Preferir:

```ts id="b6a7n3"
type ProductCardProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};
```

Evitar APIs genéricas demais.

Não utilizar dezenas de flags booleanas quando composição resolver melhor o problema.

---

# Controlled vs Uncontrolled

Escolher conscientemente entre componentes controlados e não controlados.

Utilizar controlled components quando:

* o estado precisa ser observado;
* validação depende do estado;
* comportamento externo depende do valor.

Utilizar uncontrolled quando:

* controle externo não é necessário;
* o formulário ou componente possui comportamento simples;
* a solução reduz complexidade.

Não transformar todos os inputs em controlled components automaticamente.

---

# State Management

Utilizar a menor solução capaz de resolver o problema.

Ordem de preferência:

```text id="r3o9pp"
Local State
    ↓
Shared Local State
    ↓
Context
    ↓
URL State
    ↓
Server State
    ↓
Global State
```

Não promover estado para uma camada superior sem necessidade.

---

# Server State

Dados provenientes da API devem ser tratados como server state.

Considerar:

* caching;
* stale data;
* refetch;
* invalidation;
* retry;
* loading;
* error;
* optimistic updates quando apropriado.

Evitar armazenar server state em uma global store apenas por conveniência.

---

# URL State

Utilizar URL state para informações que representam o estado navegável da página.

Exemplos:

```text id="v6m8zi"
search
page
sort
filters
tab
```

Isso permite:

* refresh;
* compartilhamento;
* navegação pelo histórico;
* deep linking.

---

# Effects

Utilizar `useEffect` somente quando existir sincronização real com algo externo ao ciclo de renderização.

Exemplos apropriados:

* subscriptions;
* browser APIs;
* timers;
* integração com sistemas externos;
* sincronização externa.

Não utilizar `useEffect` automaticamente para:

* calcular valores derivados;
* transformar props;
* executar lógica que poderia ocorrer durante render;
* sincronizar estados que não precisam ser sincronizados.

Evitar cadeias complexas de effects.

---

# Derived State

Não armazenar como estado aquilo que pode ser calculado diretamente.

Evitar:

```tsx id="3a5gkj"
const [filteredProducts, setFilteredProducts] = useState([]);
```

quando:

```tsx id="h3t5xw"
const filteredProducts = products.filter(...);
```

for suficiente.

Manter uma única fonte de verdade.

---

# Memoization

Não utilizar:

```text id="2a8b6q"
useMemo
useCallback
memo
```

indiscriminadamente.

Memoização deve ser aplicada quando:

* houver custo computacional relevante;
* houver re-renderização relevante;
* houver necessidade real de estabilidade de referência;
* profiling indicar benefício.

Não utilizar memoização apenas por hábito.

---

# Rendering

Evitar renderizações desnecessárias.

Considerar:

* ownership do estado;
* component boundaries;
* composição;
* memoização quando necessária;
* tamanho da árvore;
* listas grandes.

Não otimizar prematuramente.

---

# Lists

Listas devem possuir `key` estável e semanticamente correta.

Preferir identificadores persistentes:

```tsx id="i5u7n3"
key={product.id}
```

Evitar utilizar índice como key quando os elementos puderem:

* ser reordenados;
* inseridos;
* removidos;
* filtrados.

---

# Conditional Rendering

Condições devem ser claras e previsíveis.

Evitar componentes com níveis excessivos de condicionais.

Quando a lógica crescer, extrair:

* componentes;
* funções;
* hooks;
* mappers;
* view models.

---

# Async Operations

Toda operação assíncrona deve possuir tratamento apropriado.

Considerar:

```text id="zv48n9"
Idle
Loading
Success
Empty
Error
Retry
```

Evitar promessas sem tratamento.

Erros não devem ser silenciosamente ignorados.

---

# Race Conditions

Operações assíncronas devem considerar concorrência quando aplicável.

Exemplo:

```text id="5qypa8"
Search: "bra"
      ↓
Search: "brake"
      ↓
Search: "brake pad"
```

Uma resposta antiga não deve sobrescrever uma resposta mais recente.

Utilizar mecanismos apropriados para cancelamento ou invalidação.

---

# Forms Engineering

Formulários devem possuir:

* schema/validation consistente;
* tipos;
* estado previsível;
* tratamento de submissão;
* loading;
* erro;
* sucesso;
* acessibilidade.

A validação frontend melhora UX, mas não substitui validação backend.

---

# Accessibility

Acessibilidade é requisito funcional.

Utilizar WCAG como baseline.

Preferir HTML semântico.

Exemplo:

```tsx id="om3d1z"
<button>
```

em vez de:

```tsx id="l7tq8s"
<div onClick={...}>
```

quando o elemento representa uma ação.

---

# Keyboard Navigation

Todos os elementos interativos devem possuir comportamento adequado via teclado.

Verificar:

* `Tab`;
* `Shift + Tab`;
* `Enter`;
* `Space`;
* `Escape`;
* setas quando aplicável.

Não criar componentes customizados que exijam mouse quando um componente nativo resolver o problema.

---

# Focus Management

Garantir:

* foco visível;
* ordem lógica;
* foco inicial apropriado em dialogs;
* retorno do foco após fechamento;
* ausência de focus traps incorretos.

Nunca remover foco visual sem fornecer alternativa acessível.

---

# ARIA

Utilizar ARIA somente quando necessário.

Preferência:

```text id="8z8q9q"
HTML semântico
    ↓
Componente nativo
    ↓
ARIA quando necessário
```

Não adicionar ARIA indiscriminadamente.

ARIA incorreto pode piorar a acessibilidade.

---

# Forms Accessibility

Inputs devem possuir:

* label associado;
* descrição quando necessária;
* mensagem de erro associada;
* indicação de required;
* estado disabled/read-only corretamente comunicado.

Evitar utilizar placeholder como substituto do label.

---

# Color Accessibility

Não utilizar cor como único mecanismo de comunicação.

Exemplo inadequado:

```text id="k3i6a2"
🔴 = erro
🟢 = sucesso
```

sem texto ou outro indicador acessível.

Combinar cor com:

* texto;
* ícone;
* estrutura;
* estado semântico.

---

# Responsive Implementation

Implementar interfaces considerando mobile-first quando apropriado.

Evitar desenvolver exclusivamente para uma resolução.

Testar pelo menos:

```text id="dd1y1n"
Mobile
Tablet
Desktop
Large Desktop
```

Considerar:

* viewport;
* overflow;
* conteúdo longo;
* orientação;
* touch;
* teclado;
* densidade.

---

# CSS

CSS deve permanecer organizado e previsível.

Priorizar:

* tokens;
* classes semânticas;
* composição;
* layout moderno;
* flexbox;
* grid;
* container queries quando apropriado.

Evitar:

* valores arbitrários;
* `!important`;
* seletores excessivamente específicos;
* estilos globais desnecessários;
* hacks de posicionamento.

`!important` deve ser exceção justificada.

---

# Layout

Preferir layouts fluidos.

Evitar depender de:

```css id="0m7vvl"
position: absolute;
```

para estruturar a página inteira.

Utilizar:

* flex;
* grid;
* normal document flow;
* containers;
* gap;
* responsive constraints.

Absolute positioning deve ser utilizado principalmente para elementos que realmente precisam de posicionamento sobreposto.

---

# Design Tokens

Nunca duplicar decisões visuais sem necessidade.

Utilizar tokens definidos pelo Design System para:

* cores;
* espaçamento;
* tipografia;
* radius;
* sombras;
* breakpoints;
* motion.

Se um valor recorrente não possuir token apropriado, avaliar se deve ser adicionado ao Design System.

---

# Icons

Utilizar a biblioteca de ícones definida pelo projeto.

Não misturar bibliotecas sem necessidade.

Ícones de ação devem possuir nome acessível quando necessário.

Ícones decorativos devem ser ocultados de tecnologias assistivas quando apropriado.

---

# Images

Imagens devem considerar:

* tamanho adequado;
* formatos modernos quando suportados;
* lazy loading quando apropriado;
* dimensões;
* aspect ratio;
* texto alternativo;
* comportamento responsivo.

Não utilizar imagens sem dimensões quando isso puder causar layout shift.

---

# Performance

Performance deve ser considerada desde o desenvolvimento.

Observar:

* bundle size;
* code splitting;
* lazy loading;
* renderização;
* network requests;
* imagens;
* fontes;
* caching;
* JavaScript desnecessário.

Não adicionar dependências pesadas para funcionalidades simples.

---

# Web Vitals

Quando aplicável, considerar métricas como:

* LCP;
* INP;
* CLS.

Problemas de performance devem ser investigados com métricas e profiling quando possível.

Não realizar otimizações baseadas apenas em suposições.

---

# Code Splitting

Aplicar code splitting principalmente em:

* páginas;
* features grandes;
* áreas administrativas;
* funcionalidades raramente acessadas.

Não dividir componentes pequenos sem benefício.

---

# Error Boundaries

Utilizar Error Boundaries em pontos apropriados da aplicação.

Uma falha isolada não deve necessariamente derrubar toda a aplicação.

Quando apropriado:

```text id="z5a0u2"
Application
 ├── Feature A
 ├── Feature B
 └── Feature C
```

Uma falha em Feature B deve possuir fallback adequado sem necessariamente destruir A e C.

---

# Error Handling

Erros técnicos devem ser separados de erros apresentados ao usuário.

Exemplo:

```text id="j71x9b"
HTTP 500
```

pode ser registrado na observabilidade, enquanto a UI apresenta:

```text id="4zv7qq"
Não foi possível carregar os produtos.
Tente novamente.
```

Nunca expor stack traces ou informações sensíveis ao usuário.

---

# Security

Nunca armazenar secrets no frontend.

Assumir que todo código frontend é público.

Não considerar:

```text id="pxj5qd"
hidden button
```

como mecanismo de segurança.

Autorização real deve ser aplicada pelo backend.

Validar e tratar dados provenientes de fontes externas.

---

# XSS

Não inserir HTML arbitrário sem necessidade.

Evitar APIs equivalentes a:

```tsx id="51gqg4"
dangerouslySetInnerHTML
```

quando uma implementação segura e declarativa for possível.

Quando HTML externo realmente precisar ser renderizado, aplicar sanitização apropriada.

---

# Authentication

Isolar autenticação da apresentação.

A UI pode consumir abstrações como:

```text id="1k93n2"
useCurrentUser()
useAuth()
login()
logout()
```

mas não deve espalhar detalhes de tokens e mecanismos de autenticação pelos componentes.

---

# Testing

Testes devem priorizar comportamento observável.

Prioridade:

```text id="z2cxm8"
Unit
Integration
Component
End-to-End
```

conforme a natureza da funcionalidade.

---

# Component Testing

Testar:

* renderização;
* interação;
* estados;
* validação;
* acessibilidade relevante;
* comportamento esperado.

Evitar testes excessivamente acoplados a:

* estrutura interna;
* implementação específica;
* nomes de classes;
* detalhes que o usuário não observa.

---

# End-to-End

Utilizar E2E para fluxos críticos.

Exemplos:

```text id="a9wq4s"
Login
Cadastro
Criação de produto
Movimentação de estoque
Checkout
```

A seleção deve seguir criticidade real da aplicação.

---

# Accessibility Testing

Quando possível, combinar:

* testes automatizados;
* navegação por teclado;
* inspeção semântica;
* testes manuais.

Ferramentas automatizadas não detectam todos os problemas de acessibilidade.

---

# Code Quality

Código deve ser:

* legível;
* consistente;
* previsível;
* coeso;
* simples.

Preferir código explícito a abstrações inteligentes porém difíceis de entender.

---

# Naming

Nomes devem representar intenção.

Preferir:

```text id="e1p8q6"
ProductList
ProductFilters
CreateProductForm
useProducts
ProductRepository
```

Evitar:

```text id="0w5n7v"
Helper
Manager
Handler
Common
Data
Utils
Component
```

quando não comunicarem claramente a responsabilidade.

---

# Utils

Não utilizar `utils` como depósito de funções sem domínio.

Uma função deve permanecer próxima ao contexto em que é utilizada quando não existir necessidade real de compartilhamento.

Promover para shared somente quando houver reutilização real.

---

# Dependencies

Antes de adicionar uma dependência:

1. verificar se já existe solução no projeto;
2. verificar se a plataforma resolve;
3. avaliar manutenção;
4. avaliar tamanho;
5. avaliar segurança;
6. avaliar acessibilidade;
7. avaliar impacto no bundle;
8. avaliar se a dependência é realmente necessária.

---

# Browser APIs

Preferir APIs nativas quando forem suficientes.

Exemplos:

* `fetch`;
* `URL`;
* `URLSearchParams`;
* `FormData`;
* `AbortController`;
* `IntersectionObserver`;
* `ResizeObserver`;
* Web APIs relevantes.

Não adicionar biblioteca para resolver problemas triviais já solucionados pela plataforma.

---

# Observability

Quando observabilidade frontend estiver configurada, registrar informações úteis como:

* erros;
* falhas de requests;
* performance;
* eventos relevantes;
* tracing quando aplicável.

Não inserir logs indiscriminadamente.

Não registrar:

* passwords;
* tokens;
* secrets;
* dados pessoais desnecessários;
* informações sensíveis.

---

# Console

Não deixar:

```ts id="3g1c8k"
console.log(...)
```

de debug em código de produção sem justificativa.

Warnings e errors devem ser tratados adequadamente.

---

# Git-Friendly Changes

Mudanças devem permanecer pequenas e focadas.

Evitar misturar em um mesmo change:

* refactoring amplo;
* mudança visual;
* mudança arquitetural;
* nova funcionalidade.

Quando possível, separar responsabilidades em mudanças independentes.

---

# Browser Validation

Depois de implementar uma interface relevante:

1. executar a aplicação;
2. abrir a página real;
3. testar o fluxo principal;
4. testar estados de loading;
5. testar empty;
6. testar error;
7. testar diferentes resoluções;
8. testar teclado;
9. verificar foco;
10. verificar console;
11. verificar overflow;
12. verificar problemas visuais.

Não considerar uma implementação concluída apenas porque o TypeScript compila.

---

# Visual Quality

A implementação deve refletir o Design System e o UX Design.

Evitar automaticamente:

* excesso de cards;
* excesso de sombras;
* excesso de border-radius;
* gradientes sem propósito;
* glassmorphism sem justificativa;
* layouts genéricos;
* espaçamentos arbitrários;
* elementos decorativos sem função.

A interface deve parecer uma aplicação real, não um protótipo gerado automaticamente.

---

# Review Checklist

Antes de finalizar uma implementação, verificar:

### Architecture

* [ ] responsabilidade está na camada correta;
* [ ] feature boundaries foram respeitadas;
* [ ] não existem dependências circulares;
* [ ] não foram criadas abstrações prematuras.

### React

* [ ] componentes possuem responsabilidade clara;
* [ ] effects são realmente necessários;
* [ ] derived state não está duplicado;
* [ ] keys são estáveis;
* [ ] estado possui ownership adequado.

### TypeScript

* [ ] não existe `any` desnecessário;
* [ ] casts estão justificados;
* [ ] nullability foi tratada;
* [ ] contratos estão tipados.

### UX

* [ ] fluxo principal funciona;
* [ ] feedback está presente;
* [ ] loading foi tratado;
* [ ] empty foi tratado;
* [ ] errors foram tratados;
* [ ] ações destrutivas foram consideradas.

### Accessibility

* [ ] HTML semântico;
* [ ] teclado;
* [ ] foco;
* [ ] labels;
* [ ] contraste;
* [ ] estados acessíveis;
* [ ] ARIA utilizado corretamente.

### Responsive

* [ ] mobile;
* [ ] tablet;
* [ ] desktop;
* [ ] overflow;
* [ ] conteúdo longo;
* [ ] interação touch.

### Performance

* [ ] requests desnecessários evitados;
* [ ] imagens adequadas;
* [ ] dependências justificadas;
* [ ] renders desnecessários avaliados;
* [ ] code splitting considerado quando apropriado.

### Quality

* [ ] testes relevantes;
* [ ] sem debug logs;
* [ ] sem warnings relevantes;
* [ ] código legível;
* [ ] Design System respeitado;
* [ ] interface validada no navegador.

---

# Definition of Done

Uma implementação frontend somente deve ser considerada concluída quando:

* [ ] requisito funcional atendido;
* [ ] arquitetura respeitada;
* [ ] código tipado;
* [ ] componentes reutilizados quando apropriado;
* [ ] Design System respeitado;
* [ ] UX implementado corretamente;
* [ ] loading tratado;
* [ ] empty tratado;
* [ ] error tratado;
* [ ] acessibilidade validada;
* [ ] responsividade validada;
* [ ] performance avaliada;
* [ ] segurança considerada;
* [ ] testes relevantes implementados;
* [ ] aplicação validada no navegador;
* [ ] nenhuma regressão conhecida introduzida.
