# Financeiro

Versão de teste do sistema financeiro do grupo, implementada a partir dos diagramas UML fornecidos pelo professor. Frontend React/TypeScript e API Java com persistência relacional.

**Branch de revisão:** `versao-test-do-projeto`. Nenhuma alteração foi integrada à `main`.

## Executar localmente

Pré-requisitos: Node.js 24 LTS com npm, JDK 21 e Git. O Maven Wrapper incluído baixa o Maven na primeira execução; não é necessário instalá-lo separadamente. As instalações iniciais exigem internet.

Abra dois terminais na pasta do projeto.

**Terminal 1 — API no Windows/PowerShell:**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Em Linux/macOS: `cd backend` e `sh ./mvnw spring-boot:run`.

**Terminal 2 — interface, a partir da raiz do projeto:**

```powershell
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente [http://localhost:5173](http://localhost:5173). Mantenha os dois terminais abertos; `Ctrl+C` encerra cada serviço.

**Acesso de teste:** usuário `operador`, senha `grupo12345`. São credenciais de demonstração, sem dados reais. Para alterar, defina `FINANCEIRO_USUARIO` e `FINANCEIRO_SENHA` no terminal do backend antes de iniciá-lo. A sessão expira em 30 minutos de inatividade; o logout a invalida. Não há cadastro público de usuários nesta versão.

O frontend usa `/api`, que o proxy do Vite encaminha à API em `http://localhost:8080`, removendo esse prefixo. Assim, `POST /api/lancamentos` no navegador chega ao backend como `POST /lancamentos`, conforme o diagrama. Não abra o HTML diretamente pelo explorador.

## Funcionalidades

- Pessoas: cadastro e edição com endereço completo, inativação e reativação.
- Categorias: cadastro, edição e exclusão com proteção de vínculos.
- Lançamentos: receitas/despesas, descrição, valor, vencimento, pagamento opcional e observação; pessoa ativa e categoria obrigatórias.
- Consulta: filtros por vencimento, pessoa, categoria e tipo, busca por descrição, totais e extrato CSV.
- Validação na API, mensagens de erro, confirmação de exclusão e interface responsiva.

O saldo é **previsto**: soma receitas e subtrai despesas dos registros exibidos, incluindo pagos e pendentes.

## Dados e configuração

O banco H2 fica em `backend/data/financeiro.mv.db` quando a API é iniciada na pasta `backend`. Ele permanece após reiniciar a aplicação e não é versionado. Uma nova cópia do repositório começa com o banco vazio. Cadastre pessoas e categorias antes de lançar movimentações.

| Variável do backend | Padrão | Finalidade |
| --- | --- | --- |
| `PORT` | `8080` | Porta da API |
| `DB_URL` | `jdbc:h2:file:./data/financeiro` | Arquivo/base H2 |
| `DB_USER` | `sa` | Usuário do banco |
| `DB_PASSWORD` | vazio | Senha do banco |
| `FINANCEIRO_USUARIO` | `operador` | Nome do operador |
| `FINANCEIRO_SENHA` | `grupo12345` | Senha de acesso |

Se alterar a porta da API, ajuste o destino do proxy em `vite.config.ts`. Execute apenas uma instância do backend sobre o mesmo arquivo de banco. O projeto não carrega `.env` automaticamente; configure as variáveis no terminal ou na IDE.

## Testes e build

Na raiz:

```powershell
npm run lint
npm run build
```

No backend:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

O backend contém **13 testes de integração** com banco em memória, separado dos cadastros de revisão. O TypeScript foi ajustado para a série 6, compatível com a API usada pelo `typescript-eslint` do projeto.

Após o build, `npm run preview` permite conferir o frontend compilado com a API local ainda em execução. Isso é uma prévia local; não é uma configuração de servidor de produção. O JAR executável é gerado em `backend/target/financeiro-api-1.0.0.jar` e pode ser iniciado, dentro de `backend`, com `java -jar target/financeiro-api-1.0.0.jar`.

## Estrutura e API

```text
src/                        Interface, formulários e cliente HTTP
backend/src/main/java/br/edu/financeiro/
  domain/                   Entidades JPA, enum e endereço embutido
  repository/               Repositórios Spring Data JPA
  service/                  Regras de negócio e transações
  web/                      Controladores REST, DTOs e erros
  config/                   Autenticação, sessão e CSRF
backend/src/test/            Testes de integração
docs/                       Matriz de requisitos e roteiro do grupo
```

Rotas principais da API: `/pessoas`, `/categorias` e `/lancamentos`. POST de criação retorna 201 com JSON e `Location`; PUT atualiza; DELETE remove categorias sem vínculos ou lançamentos; PATCH `/pessoas/{id}/ativo?valor=false` inativa. Consulta de lançamentos aceita `inicio`, `fim`, `pessoaId`, `categoriaId` e `tipo` (`RECEITA`/`DESPESA`); datas no formato `AAAA-MM-DD` e limites inclusivos por vencimento.

As rotas de dados exigem sessão. `GET /csrf` fornece o token; `POST /login` recebe `username` e `password` como formulário; `GET /sessao` consulta a sessão; `POST /logout` encerra. Requisições de escrita devem incluir o cabeçalho de CSRF informado por `/csrf`; renove o token após entrar ou sair. O cliente `src/api.ts` implementa esse fluxo.

## Revisão e envio da branch

Consulte a [matriz de atendimento ao PDF](docs/REQUISITOS.md) e o [roteiro de revisão do grupo](docs/REVISAO.md).

A conta do conector GitHub consultada não possui permissão de escrita no repositório original. Se a branch não estiver publicada, alguém com acesso de colaborador pode enviar a cópia local:

```powershell
git switch versao-test-do-projeto
git push -u origin versao-test-do-projeto
```

Para abrir a cópia entregue como Git bundle, em uma pasta nova:

```powershell
git clone -b versao-test-do-projeto caminho/versao-test-do-projeto.bundle financeiro-revisao
cd financeiro-revisao
git remote set-url origin https://github.com/gabrieljp/proj_frontAvancado_sistema_financeiro.git
```

Depois de revisar com o grupo, vocês podem decidir a integração manual na `main`. Esta entrega não faz merge nem ativa integração automática.

O escopo é acadêmico e local: operador único, sem integração bancária ou configuração de produção. As escolhas para pontos não detalhados no PDF estão documentadas na matriz de requisitos.
