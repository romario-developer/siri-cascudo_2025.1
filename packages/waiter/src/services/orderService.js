import api from './api';

// Serviço para gerenciar pedidos
const orderService = {
  // Obter todos os pedidos
  getOrders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar filtros à query string
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/orders?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedidos' };
    }
  },
  
  // Obter pedido por ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedido' };
    }
  },
  
  // Criar novo pedido
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar pedido' };
    }
  },
  
  // Atualizar pedido
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await api.put(`/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar pedido' };
    }
  },
  
  // Atualizar itens do pedido
  updateOrderItems: async (orderId, items) => {
    try {
      const response = await api.put(`/orders/${orderId}/items`, { items });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar itens do pedido' };
    }
  },
  
  // Cancelar pedido
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao cancelar pedido' };
    }
  }
};

export default orderService;