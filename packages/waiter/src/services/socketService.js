import { io } from 'socket.io-client';

let socket;

// Serviço para gerenciar conexões Socket.IO
const socketService = {
  // Inicializar conexão
  init: (token) => {
    if (socket) return socket;
    
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket']
    });
    
    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Erro de conexão Socket.IO:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Desconectado do servidor Socket.IO:', reason);
    });
    
    return socket;
  },
  
  // Entrar na sala do restaurante
  joinRestaurant: () => {
    if (!socket) return;
    socket.emit('join_restaurant');
  },
  
  // Entrar na sala de uma mesa específica
  joinTable: (tableId) => {
    if (!socket || !tableId) return;
    socket.emit('join_table', { tableId });
  },
  
  // Enviar novo pedido
  sendNewOrder: (order) => {
    if (!socket) return;
    socket.emit('new_order', { order });
  },
  
  // Atualizar pedido existente
  updateOrder: (order) => {
    if (!socket) return;
    socket.emit('update_order', { order });
  },
  
  // Alterar status de pedido
  changeOrderStatus: (orderId, status) => {
    if (!socket) return;
    socket.emit('order_status_change', { orderId, status });
  },
  
  // Atualizar status de mesa
  updateTableStatus: (tableId, status) => {
    if (!socket) return;
    socket.emit('update_table', { tableId, status });
  },
  
  // Registrar ouvinte para eventos
  on: (event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
  },
  
  // Remover ouvinte de eventos
  off: (event, callback) => {
    if (!socket) return;
    socket.off(event, callback);
  },
  
  // Desconectar
  disconnect: () => {
    if (!socket) return;
    socket.disconnect();
    socket = null;
  }
};

export default socketService;