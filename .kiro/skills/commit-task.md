# Skill: Commit de Task Concluída

## Objetivo

Ao concluir uma task, esta Skill deve revisar todo o trabalho realizado, validar a implementação, criar um commit em uma branch dedicada e abrir uma Pull Request para a `main`, seguindo os padrões definidos pelo projeto.

O objetivo é garantir que cada task concluída resulte em um commit limpo, consistente e de fácil rastreabilidade, entregue por meio de uma branch própria e uma Pull Request para revisão, sem alterar a `main` diretamente.

A Skill é capaz de identificar automaticamente alterações realizadas tanto no código da aplicação quanto nos artefatos do Kiro, gerando commits adequados para cada contexto.

---

## Fluxo de Execução

### 1. Validar o repositório

Antes de qualquer ação:

* Verificar se o diretório atual é um repositório Git.
* Verificar se existem arquivos modificados (`git status`).
* Caso não existam alterações, interromper a execução informando que não há nada para ser commitado.

---

### 2. Revisar e classificar todas as alterações

Analisar todos os arquivos modificados (`git diff`, `git diff --cached` e `git status`).

#### 2.1 Classificação de código da aplicação

Para cada arquivo de código alterado, identificar:

* Nova funcionalidade
* Correção de bug
* Refatoração
* Performance
* Segurança
* Testes
* Documentação

#### 2.2 Classificação de artefatos do Kiro

Reconhecer automaticamente alterações nos seguintes diretórios:

| Tipo     | Caminho              |
|----------|----------------------|
| Spec     | `.kiro/specs/**`     |
| Steering | `.kiro/steering/**`  |
| Skill    | `.kiro/skills/**`    |
| Hook     | `.kiro/hooks/**`     |
| MCP      | `.kiro/mcp/**`       |
| Prompt   | `.kiro/prompts/**`   |
| Template | `.kiro/templates/**` |

Para cada arquivo alterado dentro de `.kiro/`, identificar a operação:

* Criação — arquivo novo
* Atualização — arquivo existente modificado
* Remoção — arquivo deletado
* Renomeação — arquivo renomeado
* Reorganização — arquivo movido para outro diretório

#### 2.3 Resumo

Gerar um pequeno resumo do que foi desenvolvido, separando alterações de código e alterações de artefatos do Kiro.

---

### 3. Validar a qualidade do código

Antes do commit verificar:

* Erros evidentes de sintaxe
* Código comentado desnecessário
* Código de debug (ex.: `System.out.println`, `console.log` temporários)
* Logs temporários
* TODOs esquecidos
* FIXMEs esquecidos
* Credenciais hardcoded
* Tokens
* Chaves de API
* Arquivos temporários
* Arquivos gerados automaticamente (ex.: `build/`, `dist/`, `node_modules/`)
* Arquivos que não deveriam ser versionados (verificar `.gitignore`)

Caso encontre qualquer problema, **interromper o processo** e informar o motivo ao usuário.

---

### 4. Validar o projeto

Executar as validações disponíveis no projeto **quando houver alterações em código da aplicação**.

Esta plataforma é composta por microsserviços **backend Java** com **Gradle (Kotlin DSL)**
(ver `tech.md` e `build-gradle.md`). A validação padrão é o build Gradle:

```bash
./gradlew build
```

O comando `build` do Gradle já executa:
* Compilação
* Testes unitários
* Testes de integração
* Análise estática (quando configurada)

Caso alguma validação falhe, **não criar o commit**. Informar ao usuário o que falhou.

**Nota:** Quando o commit envolver apenas artefatos do Kiro (documentação, specs, skills, steering, hooks, etc.), a validação de build não é obrigatória.

---

### 5. Validar a Spec

Localizar a Spec relacionada à task em `.kiro/specs/`.

Verificar se:

* Os requisitos foram atendidos.
* As tasks implementadas estão marcadas como concluídas (checkbox marcado `[x]`).
* A documentação permanece consistente com a implementação.

Caso existam tarefas não concluídas ou inconsistências, informar ao usuário antes de prosseguir.

---

### 6. Validar artefatos do Kiro

Sempre que existirem alterações dentro da pasta `.kiro/`, executar validações específicas por tipo.

#### 6.1 Specs (`.kiro/specs/**`)

Validar os arquivos:
* `requirements.md`
* `design.md`
* `tasks.md`

Verificar:
* Estrutura dos documentos (seções obrigatórias presentes)
* Consistência entre requisitos, design e tarefas
* Markdown válido
* Links válidos
* Tarefas concluídas marcadas corretamente (`[x]`)

#### 6.2 Steering (`.kiro/steering/**`)

Verificar:
* Organização dos arquivos
* Estrutura do conteúdo
* Duplicações de regras
* Consistência com demais artefatos

#### 6.3 Skills (`.kiro/skills/**`)

Verificar:
* Objetivo definido
* Fluxo consistente
* Etapas numeradas
* Exemplos válidos
* Markdown válido

#### 6.4 Hooks (`.kiro/hooks/**`)

Verificar:
* Estrutura JSON válida
* Comandos definidos
* Eventos (triggers) válidos
* Consistência com o projeto

#### 6.5 MCP (`.kiro/mcp/**`)

Verificar:
* Configurações válidas
* Estrutura do arquivo
* Referências corretas

Caso alguma inconsistência seja encontrada, **interromper o processo de commit** e apresentar um relatório ao usuário.

---

### 7. Preparar os arquivos

Adicionar ao commit apenas os arquivos relacionados à task usando `git add` com arquivos específicos.

**Evitar incluir:**

* Alterações não relacionadas à task
* Arquivos temporários
* Arquivos de IDE (`.idea/`, `.vscode/`)
* Builds (`build/`, `dist/`, `out/`)
* Logs
* Arquivos de cache (`.gradle/`, `node_modules/`)

Usar `git status` para confirmar o que será commitado antes de prosseguir.

---

### 8. Gerar a mensagem do Commit

Utilizar obrigatoriamente o padrão **Conventional Commits**.

#### 8.1 Tipos permitidos

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `perf` | Melhoria de performance |
| `docs` | Alteração em documentação |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de manutenção |
| `build` | Alterações no build ou dependências |
| `ci` | Alterações em CI/CD |

#### 8.2 Escopo automático

Determinar o escopo automaticamente utilizando o caminho dos arquivos modificados:

| Caminho           | Escopo     |
|-------------------|------------|
| `.kiro/specs`     | `spec`     |
| `.kiro/skills`    | `skill`    |
| `.kiro/steering`  | `steering` |
| `.kiro/hooks`     | `hook`     |
| `.kiro/mcp`       | `mcp`      |
| `.kiro/prompts`   | `prompt`   |
| `.kiro/templates` | `template` |
| `src/main`        | `backend`  |
| `src/test`        | `test`     |
| `*.gradle.kts`, `gradle/`, `gradle.properties` | `build` |

Caso existam arquivos pertencentes a diferentes escopos, identificar qual representa a alteração principal e utilizar esse escopo na mensagem do commit.

#### 8.3 Formato

```text
tipo(escopo): descrição curta
```

#### 8.4 Regras da descrição

* Em **português**
* Iniciando com verbo no presente do indicativo
* Sem ponto final
* Máximo de 72 caracteres

#### 8.5 Exemplos para código

```text
feat(backend): adiciona registro no Eureka ao config-service
fix(backend): corrige expiração do JWT
refactor(backend): simplifica emissão de token
test(test): adiciona testes de integração do Config Server
perf(backend): otimiza validação de JWT via cache de JWKS
build(build): atualiza dependências no version catalog
```

#### 8.6 Exemplos para artefatos do Kiro

```text
feat(skill): adiciona skill para commit automático
fix(skill): corrige validação da criação de commits
docs(skill): atualiza documentação da skill de commit
feat(spec): adiciona especificação do config-service
docs(spec): atualiza requisitos do discovery-service
refactor(spec): reorganiza documentação da spec de auth
feat(steering): adiciona padrão para arquitetura backend
docs(steering): atualiza convenções de desenvolvimento
feat(hook): adiciona validação antes do commit
fix(hook): corrige execução do pre-commit
feat(mcp): adiciona integração com GitHub
docs(mcp): atualiza configuração do servidor MCP
chore(kiro): reorganiza estrutura de documentação
```

---

### 9. Corpo do Commit

Quando a alteração for significativa, gerar automaticamente um corpo contendo:

```text
tipo(escopo): descrição curta

O que foi feito:
- Item 1
- Item 2

Motivo da alteração:
- Item 1

Observações:
- Item 1 (opcional)
```

O corpo deve ser separado da primeira linha por uma linha em branco.

#### 9.1 Alterações mistas (código + artefatos do Kiro)

Quando houver alterações tanto em código quanto em artefatos do Kiro:

* Identificar qual alteração representa o objetivo principal da task.
* Utilizar essa alteração na primeira linha do commit.
* Mencionar as demais alterações no corpo do commit.

Exemplo:

```text
feat(backend): adiciona registro no Eureka ao config-service

O que foi feito:
- Configura o cliente Eureka no config-service
- Ajusta os perfis git e native
- Adiciona testes de integração do registro

Também foram atualizados:
- Spec config-service/001-project-setup
- Skill Commit
- Steering cloud-gateway

Motivo da alteração:
- Permitir a descoberta do config-service pelos demais serviços
```

---

### 10. Criar a branch da task

Todo commit deve ocorrer em uma branch dedicada, nunca diretamente na `main`.

Antes de commitar:

1. Garantir que a base está atualizada:

```bash
git switch main
git pull --ff-only
```

2. Criar e alternar para a branch da task a partir da `main`:

```bash
git switch -c <tipo>/<escopo>-<descricao-kebab>
```

#### 10.1 Convenção de nome da branch

Derivar o nome da branch da mensagem do commit:

```text
<tipo>/<escopo>-<descricao-kebab>
```

* `tipo`: mesmo tipo do Conventional Commits (`feat`, `fix`, `docs`, etc.).
* `escopo`: mesmo escopo automático determinado pelo caminho dos arquivos (`spec`, `skill`, `steering`, `backend`, etc.).
* `descricao-kebab`: descrição curta em kebab-case, em português, sem acentos.

Exemplos:

```text
feat/skill-commit-de-task
docs/spec-roadmap-e-specs
feat/steering-padrao-de-arquitetura
```

**Nunca commitar diretamente na `main`.** Se a task foi iniciada com a `main` ativa, criar a branch antes do commit.

---

### 11. Criar o Commit

Com a branch da task ativa, criar o commit utilizando a mensagem gerada:

```bash
git commit -m "mensagem"
```

Ou para commits com corpo:

```bash
git commit -m "tipo(escopo): descrição" -m "corpo do commit"
```

**Nunca executar automaticamente:**

* `git push --force`
* `git commit --amend`

---

### 12. Push da branch

Enviar a branch da task para o remoto, configurando o tracking:

```bash
git push -u origin <tipo>/<escopo>-<descricao-kebab>
```

Regras:

* Fazer push **apenas** da branch da task.
* **Nunca** fazer push na branch `main`.
* **Nunca** usar `git push --force`.

---

### 13. Abrir a Pull Request

Abrir uma Pull Request da branch da task para a `main`, usando o GitHub CLI (`gh`).

```bash
gh pr create --base main --head <tipo>/<escopo>-<descricao-kebab> \
  --title "tipo(escopo): descrição curta" \
  --body "corpo da PR"
```

Regras da PR:

* **Título**: igual à primeira linha do commit (Conventional Commits), no máximo 70 caracteres.
* **Base**: sempre `main`.
* **Corpo**: reaproveitar o corpo do commit, estruturado em:

```text
## Resumo
- O que foi entregue

## O que foi feito
- Item 1
- Item 2

## Como testar / validar
- Passos ou comandos de validação (ex.: pnpm typecheck, lint, test)

## Observações
- Itens opcionais (ex.: artefatos do Kiro atualizados, specs relacionadas)
```

* O **merge da PR é manual**: a Skill **não** faz merge automático da PR.

Fallback quando o `gh` não estiver disponível ou autenticado:

* Não interromper o trabalho já concluído (commit e push permanecem válidos).
* Informar o usuário e fornecer o link para abrir a PR manualmente:

```bash
# obter a URL de comparação para abrir a PR no navegador
git remote get-url origin
```

* Orientar o usuário a abrir a PR pela interface do GitHub a partir da branch enviada.

---

### 14. Exibir o resultado

Ao finalizar, apresentar um relatório completo.

#### 14.1 Informações do commit e da PR

* Nome da branch criada
* Hash do commit (curto)
* Mensagem utilizada
* Quantidade de arquivos
* Linhas adicionadas
* Linhas removidas
* URL da Pull Request aberta (ou link para abertura manual, no fallback)

#### 14.2 Código (quando aplicável)

* Funcionalidades implementadas
* Bugs corrigidos
* Refatorações
* Testes
* Documentação

#### 14.3 Artefatos do Kiro (quando aplicável)

* Specs alteradas
* Skills alteradas
* Steering alterados
* Hooks alterados
* MCP alterados
* Prompts alterados
* Templates alterados

#### 14.4 Resumo funcional

Gerar uma frase resumindo a entrega.

Exemplo:

> "Implementado o registro do config-service no Eureka, incluindo ajuste de perfis, testes de integração e atualização da Spec."

Comandos úteis para obter as informações:

```bash
git branch --show-current
git log -1 --pretty=format:"%h %s"
git diff --stat HEAD~1
gh pr view --json url --jq .url
```

---

## Regras

### Sempre

* Criar apenas um commit por task concluída.
* Criar uma branch dedicada por task, a partir da `main` atualizada.
* Nomear a branch no padrão `<tipo>/<escopo>-<descricao-kebab>`.
* Seguir Conventional Commits.
* Manter commits pequenos e focados.
* Classificar automaticamente alterações em código e artefatos do Kiro.
* Determinar o escopo automaticamente pelo caminho dos arquivos.
* Validar o projeto antes do commit (quando houver código alterado).
* Validar artefatos do Kiro antes do commit (quando houver alterações em `.kiro/`).
* Validar a documentação.
* Validar a Spec.
* Validar os testes.
* Usar `git add` com arquivos específicos (nunca `git add .` ou `git add -A`).
* Priorizar automaticamente a alteração principal quando houver múltiplos tipos de arquivos.
* Fazer push da branch da task (com `-u`).
* Abrir uma Pull Request da branch da task para a `main` via `gh`.

### Nunca

* Commitar diretamente na branch `main`.
* Fazer push na branch `main`.
* Usar `git push --force`.
* Fazer merge da PR automaticamente (o merge é manual).
* Ignorar testes falhando.
* Commitar credenciais, tokens ou chaves de API.
* Commitar arquivos temporários.
* Commitar artefatos de build.
* Misturar alterações de múltiplas tasks em um único commit.
* Usar `--no-verify` para ignorar hooks.
* Usar `--amend` em commits já existentes.
* Ignorar erros de validação dos artefatos do Kiro.

---

## Resultado Esperado

Ao finalizar a execução da Skill, deve existir:

* uma branch dedicada à task, nomeada no padrão `<tipo>/<escopo>-<descricao-kebab>`;
* um único commit limpo, validado e documentado nessa branch, representando exatamente uma task concluída;
* a branch enviada ao remoto (push com tracking);
* uma Pull Request aberta da branch para a `main`, pronta para revisão e merge manual.

O commit e a PR devem ser facilmente compreendidos por qualquer desenvolvedor do projeto e estar em conformidade com os padrões de desenvolvimento adotados pela equipe.

A branch `main` nunca é alterada diretamente: toda mudança chega a ela por meio de uma Pull Request.

O histórico Git deve representar corretamente tanto alterações no código quanto nos artefatos do Kiro.
