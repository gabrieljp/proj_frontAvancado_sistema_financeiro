# Roteiro para revisão do grupo

Execute o backend e o frontend conforme o README. Uma instalação nova começa sem pessoas, categorias ou lançamentos. A revisão feita pelo assistente usou apenas dados fictícios na base local, que não acompanha o Git.

1. Entre com `operador` / `grupo12345`. Uma senha errada deve exibir erro; sair deve voltar à tela de acesso.
2. Em Pessoas, cadastre uma pessoa com nome, logradouro, número, bairro, CEP, cidade e UF. Salve, reabra e edite o endereço. Complemento é opcional.
3. Em Categorias, crie “Serviços” e “Alimentação”. Tente repetir um nome: o sistema deve recusar.
4. Registre uma receita de R$ 1.500,50 e uma despesa de R$ 200,25 com a pessoa ativa e categorias existentes. O saldo previsto deve ser R$ 1.300,25.
5. Deixe um pagamento vazio e preencha outro com uma data passada. Confira os estados pendente, vencido, pago/recebido, conforme os vencimentos.
6. Edite descrição, valor, observação e datas de um lançamento. Reabra para conferir a gravação.
7. Filtre por intervalo de vencimento, pessoa, categoria e tipo; combine os filtros. Teste intervalo sem resultados e data inicial maior que a final. Limpar restaura a consulta.
8. Busque por descrição. Exporte CSV e confira valores, acentos e somente os registros exibidos no extrato.
9. Inative a pessoa. Ela deve continuar no histórico e nos filtros, mas não estar disponível para novos lançamentos. Reative-a e verifique que volta a estar disponível.
10. Tente excluir uma categoria usada: deve ser bloqueado. Crie e exclua uma categoria sem vínculos. Cancele uma confirmação de exclusão para verificar que nada é apagado.
11. Recarregue o navegador. Reinicie o backend e entre novamente: os cadastros e lançamentos devem permanecer.
12. Confira em celular ou janela estreita. O menu e a tabela podem ser rolados horizontalmente, mantendo os formulários acessíveis.

## Verificações automatizadas

- Backend: 13 testes de integração em `FinanceiroIntegrationTest`, com banco H2 isolado em memória e rollback por teste.
- Cobrem autenticação, login/logout, CSRF, endereço, atualização/inativação, categorias duplicadas, integridade dos vínculos, pessoa inativa, receitas/despesas, HTTP 201, valores/datas inválidos, filtros inclusivos e combinados e preservação de categoria em uso.
- Frontend: verificação TypeScript, build Vite e ESLint.

## Conferências realizadas nesta entrega

- Os 13 testes de integração passaram sem falhas nem testes ignorados.
- TypeScript, build de produção e ESLint passaram na cópia de verificação com os mesmos fontes e dependências. A instalação original do pnpm apresentou travamento no Windows; a validação foi feita com instalação isolada.
- No navegador: login, pessoa com endereço, categoria, receita de R$ 1.500,50, saldo, filtro por despesa sem resultados, limpeza dos filtros, recuperação após recarregar e logout.
- Layout inspecionado em desktop e largura de 390 px.

O roteiro completo acima é para a aprovação manual do grupo; não representa todos os passos como executados no navegador pelo assistente.
