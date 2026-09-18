---
inclusion: always
---

# Contexto de Produto — Template Frontend React Corporativo

Este workspace é a base de um **template frontend React reutilizável**, com qualidade de produção, usado como fundação para diversos projetos e aplicações corporativas.

O objetivo **não** é desenvolver uma aplicação de negócio específica, mas construir uma **fundação frontend completa, modular, extensível e reutilizável**, de modo que novos projetos nasçam a partir deste template sem reimplementar funcionalidades comuns.

Todas as demais steerings do frontend devem ser interpretadas sob esta ótica: cada decisão de UX, design e engenharia serve a um **produto-plataforma**, não a um app monolítico único.

---

## Papel esperado

Atuar simultaneamente como:

* Senior Frontend Engineer;
* Senior UX/UI Designer;
* especialista em Design Systems.

Aplicando as melhores práticas atuais de desenvolvimento frontend e priorizando qualidade de produção.

---

## Natureza do produto

O projeto é um **Admin Template corporativo**: uma base administrativa reutilizável, não um produto de negócio final.

```text
Template (núcleo reutilizável)
        ↓
Projeto A  |  Projeto B  |  Projeto C
(compõem features de negócio sobre o núcleo)
```

O template resolve problemas comuns **uma única vez**. Projetos futuros apenas **compõem** essas funcionalidades.

---

## Capacidades fornecidas pelo template

O núcleo reutilizável deve fornecer:

### Shell e sessão

* Application Shell;
* Login e autenticação;
* Controle de sessão;
* Rotas públicas e protegidas;
* Autorização baseada em permissões.

### Layout administrativo

* Layout administrativo responsivo;
* Sidebar;
* Header;
* Breadcrumb;
* Menu do usuário;
* Notificações;
* Dashboard base.

### Componentes reutilizáveis

* Formulários reutilizáveis;
* Data Grid reutilizável;
* Tabelas;
* Listagens;
* Filtros;
* Paginação;
* Ordenação;
* Dialogs;
* Modais;
* Toasts;
* Alerts;
* Componentes de navegação;
* Componentes de feedback.

### Estados e infraestrutura

* Loading states;
* Empty states;
* Error states;
* Tratamento padronizado de erros;
* Integração com APIs REST;
* Infraestrutura para novos módulos/features.

---

## Filosofia

O projeto deve ser tratado como um **produto frontend reutilizável**, não como uma aplicação específica.

Funcionalidades de negócio devem permanecer **isoladas** das funcionalidades compartilhadas do núcleo.

O template fornece infraestrutura e componentes genéricos para que um novo projeto implemente features como:

```text
Produtos
Clientes
Usuários
Pedidos
Financeiro
Estoque
Relatórios
```

sem modificar nem duplicar o núcleo do template.

---

## Regra Fundamental

> O template deve resolver problemas comuns uma única vez e permitir que projetos futuros apenas componham essas funcionalidades.

Não implementar componentes ou serviços específicos de um domínio de negócio dentro do núcleo reutilizável.

---

## Núcleo vs Features de Negócio

Esta separação é a decisão de produto mais importante e orienta a arquitetura (ver `hexagonal-architecture.md` e `frontend-architecture.md`).

```text
core / shell / shared        →  genérico, reutilizável, estável
features de negócio          →  específico de cada projeto, descartável
```

### Pertence ao núcleo (genérico)

* application shell, layout, navegação;
* autenticação, sessão, autorização;
* componentes do Design System;
* Data Grid, formulários, feedback, estados;
* camada de integração com API (HttpClient, tratamento de erro padronizado);
* infraestrutura para registrar novas features.

### Pertence às features (específico do projeto)

* domínio de negócio (Produtos, Clientes, Pedidos, etc.);
* regras, telas e fluxos específicos;
* endpoints e modelos próprios do projeto.

### Teste de decisão

Antes de adicionar algo ao núcleo, perguntar:

```text
Isso serviria a QUALQUER projeto que use o template?
```

* Sim → pode pertencer ao núcleo.
* Não → é feature de negócio; mantê-la isolada.

Na dúvida, manter fora do núcleo. É mais barato promover algo específico para genérico depois do que remover acoplamento indevido do núcleo.

---

## Extensibilidade

O template deve permitir que um novo projeto adicione features **sem editar o núcleo**.

Preferir mecanismos de composição e registro:

* registro de rotas por feature;
* registro de itens de navegação/menu;
* pontos de extensão para permissões;
* providers e configuração injetável;
* API pública por feature (ver `frontend-architecture.md` → Feature Boundaries).

Evitar que o núcleo conheça features de negócio concretas (dependência apontando para dentro, nunca do núcleo para uma feature específica).

---

## Configurabilidade

O que muda entre projetos deve ser **configuração**, não fork do núcleo.

Candidatos a configuração:

* branding e tema (tokens do Design System);
* base URL e ambiente da API;
* provedor e regras de autenticação;
* estrutura de navegação;
* módulos/features habilitados;
* i18n quando aplicável.

Não fixar (hardcode) no núcleo valores que variam por projeto.

---

## Diretrizes de produto para o Kiro

* Resolver o problema pedido; não adicionar features, camadas ou configuração além do necessário (YAGNI).
* Preferir clareza e simplicidade a sofisticação; quebrar uma regra exige justificativa técnica explícita.
* Gerar código pronto para produção: acessível, responsivo, seguro, testável e manutenível.
* Manter a separação núcleo × negócio em toda contribuição.
* Não introduzir domínio de negócio específico no núcleo reutilizável.
* Ao criar componentes ou infraestrutura, projetá-los para reutilização por múltiplos projetos.
* Seguir o Design System e o UX Design; não gerar estética genérica de "dashboard de IA" (ver `design-system.md` e `ux-design.md` → AI Aesthetic Prevention).

---

## Relação com as demais steerings

```text
product (este arquivo)   → o que é o produto e a regra núcleo × negócio
hexagonal-architecture   → fronteiras e direção de dependências
frontend-architecture    → features, estado, comunicação, roteamento
clean-code               → qualidade dentro de cada unidade de código
frontend-engineering     → implementação React/TS, a11y, performance, testes
design-system / ux-design→ linguagem visual e experiência
```

Referência universal do workspace: `apps/steerings/instructions.md`.
