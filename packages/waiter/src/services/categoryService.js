import api from './api';

// Serviço para gerenciar categorias
const categoryService = {
  // Obter todas as categorias
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar categorias' };
    }
  },
  
  // Obter categoria por ID
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar categoria' };
    }
  }
};

export default categoryService;