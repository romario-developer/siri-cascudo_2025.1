import api from './api';

// Serviço para gerenciar mesas
const tableService = {
  // Obter todas as mesas
  getTables: async () => {
    try {
      const response = await api.get('/tables');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar mesas' };
    }
  },
  
  // Obter mesa por ID
  getTableById: async (tableId) => {
    try {
      const response = await api.get(`/tables/${tableId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar mesa' };
    }
  },
  
  // Atualizar status da mesa
  updateTableStatus: async (tableId, status) => {
    try {
      const response = await api.put(`/tables/${tableId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar status da mesa' };
    }
  },
  
  // Obter pedidos ativos de uma mesa
  getTableActiveOrders: async (tableId) => {
    try {
      const response = await api.get(`/orders?table=${tableId}&status=active`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedidos da mesa' };
    }
  }
};

export default tableService;