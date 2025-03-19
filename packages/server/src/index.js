const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');

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

// Rotas (a serem importadas posteriormente)
app.get('/', (req, res) => {
  res.send('API do Siri Cascudo está funcionando');
});

// Conexão Socket.IO
io.on('connection', (socket) => {
  console.log('Um usuário conectou:', socket.id);

  // Gerenciar atualizações em tempo real para pedidos
  socket.on('join_restaurant', () => {
    socket.join('restaurant');
    console.log(`Socket ${socket.id} entrou na sala do restaurante`);
  });

  socket.on('new_order', (orderData) => {
    io.to('restaurant').emit('order_update', orderData);
    console.log('Novo pedido recebido e transmitido:', orderData);
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