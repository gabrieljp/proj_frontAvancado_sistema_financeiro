# Correspondência com os requisitos do professor

Fonte: as três páginas do PDF “Documentação de Diagramas UML - Sistema Financeiro” fornecido pelo grupo. O arquivo não foi copiado para o repositório.

| Requisito | Implementação | Como verificar |
| --- | --- | --- |
| Pessoa: nome, ativo e endereço completo | `domain/Pessoa.java`, `domain/Endereco.java`, tela Pessoas | Criar e editar nome/endereço; inativar e reativar |
| Endereço embutido na Pessoa | JPA `@Embedded` e `@Embeddable` | Endereço salvo nas colunas da pessoa, sem tabela ou ID próprios |
| Categoria: nome | `domain/Categoria.java`, tela Categorias | Criar, editar e excluir categoria sem vínculos |
| Lançamento com descrição, vencimento, pagamento, valor e observação | `domain/Lancamento.java`, formulário de lançamento | Salvar e reabrir um lançamento |
| Receita ou despesa | `TipoLancamento` e `@Enumerated(EnumType.STRING)` | Criar os dois tipos; conferir os totais |
| Valor `BigDecimal` | Coluna `DECIMAL(15,2)` com validação de precisão | Valores positivos, até duas casas decimais |
| Lançamento N:1 Pessoa e Categoria | Duas relações `@ManyToOne(optional=false)` | API exige `pessoaId` e `categoriaId` existentes |
| UC01: manter pessoas, incluindo endereço | GET/POST/PUT `/pessoas`; PATCH `/pessoas/{id}/ativo` | Histórico permanece após inativação |
| UC02: gerenciar categorias | GET/POST/PUT/DELETE `/categorias` | Nomes duplicados e exclusão de categoria em uso são bloqueados |
| UC03: registrar lançamento com pessoa ativa e categoria existente | `LancamentoController` → `LancamentoService` → repositórios JPA | Pessoa inativa recebe HTTP 422; vínculo inexistente recebe HTTP 404 |
| UC04: consultar autenticado por datas, pessoa e categoria | Sessão Spring Security; GET `/lancamentos?inicio=...&fim=...&pessoaId=...&categoriaId=...` | Filtros combináveis; datas de vencimento inclusivas |
| Sequência POST → Controller → Service → Repository → DB → HTTP 201 JSON | POST `/lancamentos`, DTO validado, serviço transacional e H2 persistente | HTTP 201, cabeçalho Location e registro JSON |

Os caminhos `domain/`, `service/`, `repository/` e `web/` estão em `backend/src/main/java/br/edu/financeiro/`.

## Decisões para pontos não definidos no PDF

- O PDF exige estar autenticado, mas não define cadastro de usuários, perfis ou recuperação de senha. Esta versão tem um operador configurável por variáveis de ambiente e sessões de 30 minutos, com senha codificada por BCrypt e proteção CSRF.
- O filtro de datas usa **vencimento**, indicado na interface. Pagamento é opcional: vazio significa pendente. Uma data de pagamento futura é recusada; pagamento antecipado é permitido.
- Endereço é obrigatório, com complemento opcional. Cidade e estado são campos separados, e a UF é validada.
- Pessoa é inativada, preservando os lançamentos. Alterar ou criar lançamento exige uma pessoa atualmente ativa, inclusive ao editar um lançamento antigo.
- Categorias com lançamentos não podem ser excluídas. Isso evita apagar a classificação do histórico.
- O saldo mostrado é **previsto**, incluindo valores pagos e pendentes do resultado filtrado. O sistema não movimenta dinheiro nem integra bancos.
- Foram acrescentados edição/exclusão de lançamentos, filtro por tipo, busca por descrição, totais e exportação CSV para facilitar a revisão.
- Não havia backend no repositório original. Foi incluído Spring Boot com JPA/Hibernate e H2 em arquivo, em vez de simular persistência no navegador. Não há dependência de API externa.

## Limites desta versão acadêmica

Um único operador e uma única base local compartilhada; sem segregação de dados por usuário, auditoria, integrações bancárias, upload de comprovantes ou infraestrutura de produção. O H2 local permite revisar o projeto sem instalar um servidor de banco. A geração de esquema usa `ddl-auto=update`; migrações versionadas e implantação pública ficam para uma etapa posterior.

Referências técnicas: [Spring Data JPA](https://spring.io/guides/gs/accessing-data-jpa/), [bancos SQL no Spring Boot](https://docs.spring.io/spring-boot/3.5/reference/data/sql.html).
