const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const errorHandler = require('./middleware/error');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicativo Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Conexão com o banco de dados
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/siri-cascudo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro de conexão com MongoDB:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.send('API do Siri Cascudo está funcionando');
});

// Manipulador de erros
app.use(errorHandler);

// Conexão Socket.IO
io.on('connection', (socket) => {
  console.log('Um usuário conectou:', socket.id);

  // Entrada em salas
  socket.on('join_restaurant', () => {
    socket.join('restaurant');
    console.log(`Socket ${socket.id} entrou na sala do restaurante`);
  });

  socket.on('join_kitchen', () => {
    socket.join('kitchen');
    console.log(`Socket ${socket.id} entrou na sala da cozinha`);
  });

  socket.on('join_table', (tableId) => {
    const roomName = `table_${tableId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} entrou na sala ${roomName}`);
  });

  // Eventos de pedidos
  socket.on('new_order', (orderData) => {
    io.to('restaurant').to('kitchen').emit('order_update', {
      type: 'new_order',
      data: orderData
    });
    console.log('Novo pedido recebido e transmitido:', orderData);
  });

  socket.on('update_order', (orderData) => {
    io.to('restaurant').to('kitchen').to(`table_${orderData.tableId}`).emit('order_update', {
      type: 'update_order',
      data: orderData
    });
    console.log('Atualização de pedido transmitida:', orderData);
  });

  socket.on('order_status_change', (data) => {
    io.to('restaurant').to('kitchen').to(`table_${data.tableId}`).emit('order_update', {
      type: 'status_change',
      data
    });
    console.log('Status do pedido alterado:', data);
  });

  // Atualização de mesa
  socket.on('update_table', (tableData) => {
    io.to('restaurant').emit('table_update', tableData);
    console.log('Atualização de mesa transmitida:', tableData);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});