# Siri Cascudo Hamburgueria

Um aplicativo PWA (Progressive Web App) para uma hamburgueria chamada "Siri Cascudo", com um aplicativo separado para gerenciamento de comandas por garçons.

## Estrutura do Projeto

Este é um monorepo que contém três pacotes principais:

- **Client**: Aplicativo PWA principal voltado para clientes
- **Waiter**: Aplicativo para garçons (Comanda Garçom)
- **Server**: Backend em Node.js que serve ambos os aplicativos

## Tecnologias Utilizadas

- **Frontend**:
  - React
  - React Router
  - Redux
  - styled-components
  - PWA features (Service Workers, Manifest)

- **Backend**:
  - Node.js
  - Express
  - MongoDB (com Mongoose)
  - Socket.IO para atualizações em tempo real
  - JWT para autenticação

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js (v14 ou superior)
- Yarn
- MongoDB

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   yarn install
   ```
3. Configure as variáveis de ambiente:
   - Crie arquivos `.env` nas pastas `packages/client`, `packages/waiter` e `packages/server`

4. Inicie o servidor de desenvolvimento:
   ```
   yarn start
   ```

Isso iniciará o servidor backend, o aplicativo cliente e o aplicativo de garçom em modo de desenvolvimento.

## Scripts Disponíveis

- `yarn start`: Inicia todos os aplicativos em modo de desenvolvimento
- `yarn start:client`: Inicia apenas o aplicativo cliente
- `yarn start:waiter`: Inicia apenas o aplicativo de garçom
- `yarn start:server`: Inicia apenas o servidor backend
- `yarn build`: Cria builds de produção para os aplicativos cliente e garçom

## Características

### Aplicativo Cliente (PWA)
- Visualização do cardápio
- Carrinho de compras
- Checkout
- Acompanhamento de pedidos
- Perfil do usuário

### Aplicativo de Garçom
- Gerenciamento de mesas
- Criação e edição de comandas
- Histórico de pedidos
- Atualizações em tempo real

### Backend
- API RESTful
- Autenticação JWT
- Persistência de dados com MongoDB
- Comunicação em tempo real via Socket.IO