# Sistema Financeiro - Faculdade UNIESP

# 💰 Sistema Financeiro - Front-end Avançado

Projeto de um sistema web para gestão financeira, desenvolvido no âmbito da disciplina de **Front-end Avançado** da **Faculdade UNIESP**. 

A aplicação foi estruturada com foco em boas práticas de desenvolvimento de software moderno, utilizando uma stack robusta baseada em **TypeScript**, **React**, **Vite**, **HTML5** e **CSS**, com roteamento dinâmico e controle de acesso.

---

## Executar o projeto

Instale as dependências com `npm ci`. Depois, mantenha dois terminais abertos na raiz do projeto:

```bash
# Terminal 1: interface
npm run dev

# Terminal 2: API simulada (porta 3001)
npm run api
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.
Para verificar o código, execute `npm run build` e `npm run lint`.

## Contribuição da branch feature/Lucas

A tela **Pessoas** permite listar e buscar clientes/fornecedores, filtrar por situação,
cadastrar e editar pessoas com endereço completo e ativar/inativar sem apagar o histórico.
Nome, logradouro, número, bairro, CEP, cidade e UF são obrigatórios; complemento é opcional.
O CEP aceita oito dígitos com ou sem hífen. As alterações são gravadas na API existente (`db.json`).

Para revisar: cadastre uma pessoa, edite o endereço, teste a busca e os filtros e inative/reative
o cadastro. Em **Novo lançamento**, somente pessoas ativas devem aparecer. Recarregue a página
para conferir a persistência. Se a API estiver desligada, a tela deve informar o erro e permitir
tentar novamente sem perder os dados digitados no formulário.

Essa contribuição mantém o layout, as rotas, os tipos e a API simulada da `main`.
A seleção de pessoas ativas no formulário de lançamentos já existe no projeto;
o `json-server` é uma API de desenvolvimento e não implementa validações de negócio no servidor.

---

## 👥 Integrantes da Equipe

| Nome | GitHub |
| **Gabriel Marcos Ferreira de Oliveira** | [@gabrieljp](https://github.com/gabrieljp) |
| *[Nome 2]* | *[Link do GitHub]* |
| *[Nome 3]* | *[Link do GitHub]* |
| *[Nome 4]* | *[Link do GitHub]* |

---

## 🚀


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
