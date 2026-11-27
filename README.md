💰 Sistema Financeiro

Projeto desenvolvido para a 2ª Avaliação da disciplina Tecnologia para Frontend Avançado (Sistemas para Internet, 4º período) do Centro Universitário UNIESP, semestre 2026.2. Professor: Álekiss Manço de Mélo.

O sistema permite controlar receitas e despesas, cadastrar pessoas (clientes e fornecedores) com endereço e acompanhar o saldo em um painel resumido. O front-end segue o modelo de domínio definido nos diagramas UML do projeto (Lançamento, Pessoa, Endereço e Categoria).

👥 Integrantes da equipe
Nome completo	GitHub
Gabriel Marcos Ferreira de Oliveira	@gabrieljp
Lucas Custa (completar com o nome completo)	[link do GitHub]
Gustavo (completar sobrenome)	[link do GitHub]
Miguel (completar sobrenome)	[link do GitHub]

Cada integrante desenvolveu em sua própria branch (feature/nome) e integrou na main por Pull Request.

✨ Funcionalidades
Home (dashboard): total de receitas, despesas e saldo, calculados a partir dos lançamentos.
Lançamentos:
lista com tipo (receita/despesa), pessoa, categoria, vencimento e valor;
cadastro com validação (somente pessoas ativas podem receber lançamentos);
tela de detalhes (/lancamentos/:id) com exclusão mediante confirmação.
Pessoas:
lista com busca por nome e filtro por situação;
cadastro e edição com endereço completo e preenchimento automático pelo CEP (API ViaCEP);
ativar/inativar sem apagar o histórico de lançamentos.
Sobre: descrição do projeto e da equipe.
Experiência de uso: estados de carregamento e de erro reutilizáveis, mensagens de sucesso e layout responsivo.
🛠️ Tecnologias
React + TypeScript + Vite
React Router (rotas e navegação)
Material UI (MUI) (biblioteca de componentes)
axios (requisições HTTP)
json-server (API simulada local, porta 3001)
ViaCEP (API externa de consulta de CEP)
📁 Estrutura de pastas
src/
├── components/   componentes reutilizáveis (AppLayout, ResumoCard, LoadingState, ErrorState, PessoaForm)
├── pages/        telas (Home, Lancamentos, LancamentoForm, LancamentoDetalhe, Pessoas, Sobre)
├── routes/       definição das rotas
├── services/     acesso às APIs (api.ts, lancamentoService.ts, pessoaService.ts)
└── types/        interfaces TypeScript baseadas no UML
db.json           dados da API simulada (categorias, pessoas, lançamentos)
🚀 Como executar

Requisitos: Node.js instalado.

bash
# 1. instalar as dependências
npm install

Mantenha dois terminais abertos na raiz do projeto:

bash
# Terminal 1: interface
npm run dev

# Terminal 2: API simulada (porta 3001)
npm run api

Abra o endereço informado pelo Vite, normalmente http://localhost:5173.

Para verificar o código:

bash
npm run build
npm run lint

Se a API não estiver rodando, as telas exibem uma mensagem de erro em vez de dados.

🧭 Rotas
Rota	Tela
/	Home com resumo financeiro
/lancamentos	Lista de lançamentos
/lancamentos/novo	Novo lançamento
/lancamentos/:id	Detalhes do lançamento
/pessoas	Gestão de pessoas
/sobre	Sobre o projeto
🧪 Como revisar
Em Pessoas, cadastre uma pessoa digitando um CEP real (ex.: 58015-430) e confira o endereço preenchido automaticamente. Edite, filtre e inative/reative o cadastro.
Em Novo lançamento, confirme que somente pessoas ativas aparecem no seletor.
Salve uma receita e uma despesa e confira os totais na Home.
Abra um lançamento pela lista, veja os detalhes e exclua-o.
Pare a API (Ctrl + C no terminal do npm run api) e recarregue as telas para ver o tratamento de erro.
📝 Observações
O json-server é uma API de desenvolvimento: não implementa validações de negócio no servidor, então as regras (como "somente pessoa ativa") são aplicadas no front-end.
O projeto foi construído a partir dos diagramas UML (classes, casos de uso e sequência) da documentação do sistema.