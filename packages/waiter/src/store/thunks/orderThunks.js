import orderService from '../../services/orderService';
import socketService from '../../services/socketService';
import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFail,
  fetchActiveOrdersStart,
  fetchActiveOrdersSuccess,
  fetchActiveOrdersFail,
  fetchOrderStart,
  fetchOrderSuccess,
  fetchOrderFail,
  updateOrderStart,
  updateOrderSuccess,
  updateOrderFail,
  addNewOrder,
  updateOrderViaSocket
} from '../reducers/orderSlice';

// Thunk para buscar todos os pedidos com filtros
export const fetchOrders = (filters = {}) => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    const response = await orderService.getOrders(filters);
    dispatch(fetchOrdersSuccess(response));
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao buscar pedidos';
    dispatch(fetchOrdersFail(errorMessage));
    throw error;
  }
};

// Thunk para buscar pedidos ativos
export const fetchActiveOrders = () => async (dispatch) => {
  try {
    dispatch(fetchActiveOrdersStart());
    const response = await orderService.getOrders({ status: 'active' });
    dispatch(fetchActiveOrdersSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao buscar pedidos ativos';
    dispatch(fetchActiveOrdersFail(errorMessage));
    throw error;
  }
};

// Thunk para buscar um pedido específico por ID
export const fetchOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch(fetchOrderStart());
    const response = await orderService.getOrderById(orderId);
    dispatch(fetchOrderSuccess(response));
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao buscar pedido';
    dispatch(fetchOrderFail(errorMessage));
    throw error;
  }
};

// Thunk para criar um novo pedido
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(updateOrderStart());
    const response = await orderService.createOrder(orderData);
    
    // Adicionar o novo pedido ao estado
    dispatch(addNewOrder(response));
    
    // Notificar via Socket.IO
    socketService.sendNewOrder(response);
    
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao criar pedido';
    dispatch(updateOrderFail(errorMessage));
    throw error;
  }
};

// Thunk para atualizar um pedido existente
export const updateOrder = (orderId, orderData) => async (dispatch) => {
  try {
    dispatch(updateOrderStart());
    const response = await orderService.updateOrder(orderId, orderData);
    
    // Atualizar o pedido no estado
    dispatch(updateOrderSuccess(response));
    
    // Notificar via Socket.IO
    socketService.updateOrder(response);
    
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao atualizar pedido';
    dispatch(updateOrderFail(errorMessage));
    throw error;
  }
};

// Thunk para atualizar itens de um pedido
export const updateOrderItems = (orderId, items) => async (dispatch) => {
  try {
    dispatch(updateOrderStart());
    const response = await orderService.updateOrderItems(orderId, items);
    
    // Atualizar o pedido no estado
    dispatch(updateOrderSuccess(response));
    
    // Notificar via Socket.IO
    socketService.updateOrder(response);
    
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao atualizar itens do pedido';
    dispatch(updateOrderFail(errorMessage));
    throw error;
  }
};

// Thunk para cancelar um pedido
export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(updateOrderStart());
    const response = await orderService.cancelOrder(orderId);
    
    // Atualizar o pedido no estado
    dispatch(updateOrderSuccess(response));
    
    // Notificar via Socket.IO
    socketService.changeOrderStatus(orderId, 'cancelled');
    
    return response;
  } catch (error) {
    const errorMessage = error.message || 'Erro ao cancelar pedido';
    dispatch(updateOrderFail(errorMessage));
    throw error;
  }
};

// Thunk para alterar o status de um pedido
export const changeOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    dispatch(updateOrderStart());
    const response = await orderService.updateOrder(orderId, { status });
    
    // Atualizar o pedido no estado
    dispatch(updateOrderSuccess(response));
    
    // Notificar via Socket.IO
    socketService.changeOrderStatus(orderId, status);
    
    return response;
  } catch (error) {
    const errorMessage = error.message || `Erro ao alterar status do pedido para ${status}`;
    dispatch(updateOrderFail(errorMessage));
    throw error;
  }
};

// Função para configurar ouvintes de Socket.IO para pedidos
export const setupOrderSocketListeners = (dispatch) => {
  // Ouvir por novos pedidos
  socketService.on('new_order', (data) => {
    dispatch(addNewOrder(data.order));
  });
  
  // Ouvir por atualizações de pedidos
  socketService.on('order_updated', (data) => {
    dispatch(updateOrderViaSocket(data.order));
  });
  
  // Ouvir por alterações de status de pedidos
  socketService.on('order_status_changed', (data) => {
    dispatch(updateOrderViaSocket(data.order));
  });
  
  // Retornar função para remover ouvintes
  return () => {
    socketService.off('new_order');
    socketService.off('order_updated');
    socketService.off('order_status_changed');
  };
};