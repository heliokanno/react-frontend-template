# Design System

## Objetivo

Atuar como um especialista sênior em Design Systems durante o desenvolvimento da aplicação.

O Design System deve fornecer uma linguagem visual consistente, reutilizável, acessível e escalável para toda a aplicação.

O Design System é a fonte de verdade para:

* cores;
* tipografia;
* espaçamento;
* dimensões;
* bordas;
* radius;
* sombras;
* elevação;
* ícones;
* componentes;
* estados;
* feedback visual;
* responsividade;
* acessibilidade;
* motion.

---

## Princípios

### Consistency First

Interfaces diferentes que resolvem problemas semelhantes devem utilizar os mesmos padrões.

Preferir:

```text
Reutilizar
    ↓
Compor
    ↓
Adaptar
    ↓
Criar novo
```

Não criar uma nova solução visual quando já existir uma solução adequada.

---

## Single Source of Truth

Tokens e componentes devem possuir uma única fonte de verdade.

Evitar valores visuais duplicados em diferentes arquivos.

Não espalhar valores como:

```css
margin: 13px;
border-radius: 7px;
color: #6b7280;
```

sem justificativa.

Preferir tokens:

```css
margin: var(--spacing-3);
border-radius: var(--radius-md);
color: var(--color-text-secondary);
```

Os nomes exatos dos tokens devem seguir o sistema adotado pelo projeto.

---

# Design Tokens

Tokens devem representar decisões de design reutilizáveis.

Categorias principais:

```text
Color
Typography
Spacing
Sizing
Radius
Border
Shadow
Elevation
Motion
Breakpoint
Z-index
```

---

## Color Tokens

Não utilizar cores diretamente nos componentes quando existir um token equivalente.

Preferir tokens semânticos.

Exemplo conceitual:

```text
color.text.primary
color.text.secondary
color.text.muted

color.surface.default
color.surface.subtle
color.surface.elevated

color.border.default
color.border.strong

color.action.primary
color.action.primary.hover
color.action.primary.active

color.feedback.success
color.feedback.warning
color.feedback.error
color.feedback.info
```

Separar:

```text
Primitive Tokens
        ↓
Semantic Tokens
        ↓
Components
```

Exemplo:

```text
blue-500
    ↓
color.action.primary
    ↓
Button
```

Componentes devem consumir tokens semânticos sempre que possível.

---

## Dark Mode

Se a aplicação possuir suporte a dark mode, não criar cores específicas diretamente nos componentes.

Utilizar tokens semânticos que possam receber valores diferentes por tema.

Exemplo:

```text
color.surface.default
```

pode possuir valores diferentes para:

```text
Light Theme
Dark Theme
```

Componentes não devem precisar conhecer o tema atual.

---

## Contrast

Garantir contraste adequado entre:

* texto e background;
* elementos interativos e background;
* estados;
* bordas importantes;
* indicadores;
* controles.

Não utilizar uma cor somente porque ela parece visualmente agradável.

A escolha deve considerar acessibilidade.

---

# Typography

Definir uma escala tipográfica consistente.

Considerar:

* família;
* tamanho;
* peso;
* line-height;
* letter-spacing;
* estilo;
* hierarquia.

Exemplo conceitual:

```text
Display
Heading
Title
Subtitle
Body
Body Small
Caption
Label
```

Não criar tamanhos arbitrários para cada componente.

---

## Typography Hierarchy

A hierarquia deve comunicar claramente:

```text
Page Title
    ↓
Section Title
    ↓
Subsection
    ↓
Body
    ↓
Supporting Information
```

Não utilizar peso ou tamanho excessivo apenas para chamar atenção.

---

# Spacing

Utilizar uma escala consistente de espaçamento.

Exemplo conceitual:

```text
space-1
space-2
space-3
space-4
space-5
space-6
space-8
space-10
space-12
space-16
```

A escala real deve ser definida pelo projeto.

Evitar valores arbitrários.

Exemplo:

```css
padding: 17px;
margin-top: 23px;
gap: 11px;
```

quando existir um token equivalente.

---

## Layout Spacing

O espaçamento deve comunicar relacionamento entre elementos.

Utilizar menor espaçamento para elementos relacionados.

Utilizar maior espaçamento para separar grupos diferentes.

Exemplo:

```text
Label
  ↓ pequeno
Input
  ↓ médio
Outro campo
  ↓ grande
Nova seção
```

Não utilizar espaçamento de maneira puramente estética.

---

# Border Radius

Utilizar uma escala consistente.

Exemplo:

```text
radius-none
radius-sm
radius-md
radius-lg
radius-xl
radius-full
```

O radius deve ser utilizado de maneira coerente.

Evitar aplicar `border-radius` elevado em todos os elementos indiscriminadamente.

---

# Borders

Bordas devem possuir propósito.

Utilizar principalmente para:

* separar conteúdo;
* delimitar controles;
* indicar estado;
* estruturar componentes.

Evitar bordas decorativas excessivas.

---

# Shadows e Elevation

Sombras devem comunicar profundidade ou hierarquia.

Exemplos de uso:

* dropdown;
* popover;
* dialog;
* elemento elevado;
* navegação sobreposta.

Não utilizar sombras em todos os componentes.

Cards não precisam necessariamente possuir sombra.

---

# Icons

Ícones devem possuir significado funcional.

Preferir uma biblioteca de ícones consistente.

Não misturar diferentes estilos de ícones sem justificativa.

Considerar:

* tamanho;
* alinhamento;
* peso;
* área de interação;
* acessibilidade.

Ícones puramente decorativos não devem competir com o conteúdo.

Ícones que representam ações devem possuir nome acessível quando necessário.

---

# Componentes

Componentes devem representar padrões de interface reutilizáveis.

Exemplos:

```text
Button
Input
Select
Checkbox
Radio
Switch
Textarea
Form
Card
Badge
Alert
Toast
Dialog
Drawer
Dropdown
Tooltip
Tabs
Table
Pagination
Breadcrumb
Navigation
Sidebar
Header
Skeleton
Spinner
EmptyState
```

A lista deve evoluir conforme as necessidades reais do produto.

Não criar componentes apenas para aumentar a quantidade de abstrações.

---

# Component API

Componentes devem possuir APIs simples e previsíveis.

Preferir composição quando houver necessidade de estruturas complexas.

Evitar componentes com dezenas de propriedades booleanas.

Evitar APIs como:

```tsx
<Component
  isLarge
  isSmall
  hasBorder
  hasShadow
  rounded
  noPadding
  compact
  centered
/>
```

Quando isso indicar que o componente possui responsabilidades demais, dividir ou utilizar composição.

---

# Component States

Componentes interativos devem definir estados quando aplicável:

```text
Default
Hover
Focus
Active
Disabled
Loading
Selected
Checked
Expanded
Error
Success
```

Os estados devem ser visualmente consistentes em toda a aplicação.

---

# Buttons

Botões devem possuir hierarquia clara.

Categorias comuns:

```text
Primary
Secondary
Tertiary
Destructive
Ghost
Icon
```

A quantidade real de variantes deve permanecer pequena.

Não criar uma variante para cada necessidade individual.

---

## Button Rules

O botão primário deve representar a ação principal do contexto.

Evitar múltiplos botões primários competindo pela mesma atenção.

Ações destrutivas devem possuir aparência claramente identificável.

Estados:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Durante loading, impedir submissões duplicadas quando apropriado.

---

# Forms

Componentes de formulário devem possuir padrões consistentes para:

* label;
* required;
* hint;
* input;
* validation;
* error;
* success;
* disabled;
* read-only.

Exemplo:

```text
Label
Input
Supporting text
Error message
```

Mensagens de erro devem estar visualmente e semanticamente associadas ao campo.

---

# Feedback Components

Utilizar padrões consistentes para comunicar:

```text
Success
Warning
Error
Information
Loading
```

Escolher o componente de acordo com a importância e duração da mensagem.

Exemplos:

```text
Toast
Alert
Inline message
Banner
Dialog
```

Não utilizar toast para informações que precisam permanecer disponíveis.

---

# Dialogs

Dialogs devem seguir padrões consistentes de:

* tamanho;
* posicionamento;
* overlay;
* foco;
* teclado;
* fechamento;
* ações.

O foco deve ser gerenciado corretamente.

`Escape` deve fechar dialogs quando o comportamento permitir.

Dialogs não devem ser utilizados como substitutos de páginas complexas.

---

# Tables

Tabelas devem possuir padrões consistentes para:

* header;
* row;
* hover;
* selected;
* sorting;
* pagination;
* empty;
* loading;
* error;
* actions.

A densidade deve ser definida de forma consistente.

Evitar criar tabelas visualmente diferentes para cada feature.

---

# Cards

Cards devem ser utilizados quando representarem uma unidade lógica de conteúdo.

Não utilizar cards simplesmente porque existe espaço disponível.

Evitar:

```text
Card dentro de Card dentro de Card
```

Cards não devem substituir automaticamente:

* sections;
* tables;
* lists;
* layouts;
* navigation.

---

# Navigation

Elementos de navegação devem seguir padrões consistentes.

Considerar:

```text
Header
Sidebar
Breadcrumb
Tabs
Pagination
Mobile Navigation
```

A navegação deve indicar claramente:

* localização atual;
* destino;
* estado ativo;
* possibilidade de interação.

---

# Responsive Design

Componentes devem possuir comportamento previsível em diferentes breakpoints.

Considerar:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Responsividade pode alterar:

* tamanho;
* espaçamento;
* layout;
* visibilidade;
* posição;
* densidade;
* interação.

Não simplesmente reduzir componentes proporcionalmente.

---

# Accessibility

Todos os componentes devem ser desenvolvidos considerando acessibilidade desde o início.

Utilizar WCAG como referência.

Garantir:

* contraste adequado;
* foco visível;
* navegação por teclado;
* nomes acessíveis;
* labels;
* estados compreensíveis;
* semântica correta;
* suporte a leitores de tela.

Preferir HTML semântico antes de adicionar ARIA.

Não utilizar ARIA para substituir HTML semântico quando um elemento nativo adequado existir.

---

# Focus

Estados de foco devem ser claramente visíveis.

Nunca remover o outline sem fornecer uma alternativa acessível.

Exemplo inadequado:

```css
outline: none;
```

sem substituição equivalente.

O foco deve ser consistente entre componentes.

---

# Motion

Animações devem ter propósito.

Utilizar motion para:

* comunicar mudança;
* indicar transição;
* reforçar feedback;
* orientar atenção.

Evitar animações excessivas.

Respeitar:

```text
prefers-reduced-motion
```

quando aplicável.

---

# Responsive Density

A densidade da interface pode variar conforme o dispositivo.

Desktop pode apresentar mais informações simultaneamente.

Mobile deve priorizar:

* tarefas principais;
* informações essenciais;
* controles acessíveis.

Não tentar preservar exatamente a mesma densidade em todas as telas.

---

# Content

Componentes devem funcionar com conteúdo real.

Não assumir que textos possuem tamanho fixo.

Testar situações como:

* textos longos;
* nomes extensos;
* números grandes;
* ausência de dados;
* múltiplas linhas;
* traduções futuras.

Evitar layouts que dependam de textos curtos artificiais.

---

# Internationalization Readiness

Mesmo que a aplicação inicialmente utilize apenas um idioma, componentes não devem assumir que textos terão tamanho fixo.

Evitar:

```css
width: 100px;
```

para acomodar textos específicos quando isso puder causar problemas futuros.

Layouts devem permitir expansão de conteúdo.

---

# Component Composition

Componentes complexos devem ser construídos através de componentes menores.

Exemplo:

```text
DataTable
├── TableHeader
├── TableToolbar
├── TableBody
├── TableRow
├── TableCell
└── TablePagination
```

A composição deve permitir reutilização sem transformar o componente em uma abstração excessivamente complexa.

---

# Avoid Premature Abstraction

Não criar abstrações antes de existir necessidade real.

Uma solução específica pode permanecer local quando:

* é utilizada uma única vez;
* possui comportamento específico;
* não existe evidência de reutilização.

Promover para componente compartilhado quando existir:

* repetição real;
* comportamento consistente;
* necessidade de manutenção centralizada.

---

# Avoid One-Off Styling

Evitar estilos criados especificamente para uma única tela quando o padrão puder ser representado pelo Design System.

Antes de adicionar CSS específico:

1. verificar tokens;
2. verificar componentes;
3. verificar variantes existentes;
4. verificar composição;
5. somente então criar uma solução específica.

---

# Visual Consistency

Elementos equivalentes devem parecer e funcionar de maneira equivalente.

Exemplos:

```text
Primary Button
→ mesmo comportamento

Form Field
→ mesma estrutura

Error Message
→ mesmo padrão

Page Header
→ mesmo padrão

Modal
→ mesmo comportamento
```

Não criar pequenas variações visuais sem motivo.

---

# AI Aesthetic Prevention

O Design System não deve seguir automaticamente tendências visuais.

Evitar como padrão:

* glassmorphism;
* gradientes excessivos;
* sombras exageradas;
* excesso de rounded cards;
* excesso de elementos flutuantes;
* dashboards compostos apenas por cards;
* roxo/azul como paleta automática;
* elementos decorativos sem função;
* layouts visualmente genéricos.

A identidade deve ser definida pelo produto.

---

# Design System Governance

Novos padrões devem ser avaliados antes de serem incorporados ao Design System.

Perguntar:

1. Esse padrão é realmente reutilizável?
2. Existe um componente semelhante?
3. Existe uma necessidade real?
4. O comportamento é consistente?
5. É acessível?
6. É responsivo?
7. A API do componente é simples?
8. O padrão pode ser utilizado em diferentes features?

Não adicionar componentes apenas para resolver um caso isolado.

---

# Relationship with UX

O UX Design define:

* necessidade;
* fluxo;
* comportamento;
* hierarquia;
* experiência.

O Design System define:

* linguagem visual;
* componentes;
* tokens;
* padrões de interação;
* consistência.

Quando houver conflito:

1. compreender o objetivo da experiência;
2. verificar se existe padrão equivalente;
3. adaptar o Design System somente quando necessário;
4. evitar criar exceções permanentes para casos isolados.

---

# Relationship with Frontend Engineering

O Design System define o comportamento visual e estrutural dos componentes.

Frontend Engineering é responsável por sua implementação técnica.

Componentes devem manter alinhamento entre:

```text
Design
   ↕
Accessibility
   ↕
Implementation
   ↕
Testing
```

Um componente não é considerado completo apenas por estar visualmente correto.

---

# Definition of Done

Um componente do Design System pode ser considerado pronto quando:

* [ ] possui propósito claro;
* [ ] possui API simples;
* [ ] possui documentação adequada;
* [ ] utiliza tokens;
* [ ] possui estados necessários;
* [ ] possui comportamento responsivo;
* [ ] é acessível;
* [ ] funciona via teclado quando aplicável;
* [ ] possui foco visível;
* [ ] possui tratamento de conteúdo longo;
* [ ] possui testes relevantes;
* [ ] não duplica componente existente;
* [ ] não introduz complexidade desnecessária;
* [ ] pode ser reutilizado por diferentes features.
