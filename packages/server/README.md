# Siri Cascudo - Backend API

API RESTful para o sistema de gerenciamento da hamburgueria Siri Cascudo.

## Configuração

1. Crie um arquivo `.env` baseado no `.env.example`
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   npm run dev
   ```

## Modelos de Dados

- **User**: Usuários do sistema (admin, garçons, clientes)
- **Category**: Categorias de produtos
- **Product**: Produtos disponíveis no cardápio
- **Table**: Mesas do restaurante
- **Order**: Pedidos realizados

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email/senha
- `GET /api/auth/me` - Obter dados do usuário logado

### Usuários
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `PUT /api/users/:id/password` - Atualizar senha
- `DELETE /api/users/:id` - Desativar usuário

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Obter categoria por ID
- `POST /api/categories` - Criar nova categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Desativar categoria

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter produto por ID
- `POST /api/products` - Criar novo produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Excluir produto

### Mesas
- `GET /api/tables` - Listar todas as mesas
- `GET /api/tables/:id` - Obter mesa por ID
- `POST /api/tables` - Criar nova mesa
- `PUT /api/tables/:id` - Atualizar mesa
- `DELETE /api/tables/:id` - Desativar mesa

### Pedidos
- `GET /api/orders` - Listar todos os pedidos
- `GET /api/orders/:id` - Obter pedido por ID
- `POST /api/orders` - Criar novo pedido
- `PUT /api/orders/:id` - Atualizar pedido
- `PUT /api/orders/:id/items` - Atualizar itens do pedido
- `DELETE /api/orders/:id` - Cancelar pedido

## Comunicação em Tempo Real (Socket.IO)

O servidor utiliza Socket.IO para comunicação em tempo real entre:
- Aplicativo do cliente
- Aplicativo do garçom
- Cozinha

### Eventos disponíveis:
- `join_restaurant` - Entrar na sala do restaurante
- `join_kitchen` - Entrar na sala da cozinha
- `join_table` - Entrar na sala de uma mesa específica
- `new_order` - Enviar novo pedido
- `update_order` - Atualizar pedido existente
- `order_status_change` - Alterar status de pedido
- `update_table` - Atualizar status de mesa