import api from './api';

// Serviço para gerenciar produtos
const productService = {
  // Obter todos os produtos
  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar filtros à query string
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/products?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos' };
    }
  },
  
  // Obter produto por ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produto' };
    }
  },
  
  // Obter produtos por categoria
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/products?category=${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos por categoria' };
    }
  },
  
  // Obter produtos em destaque
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products?featuredItem=true');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos em destaque' };
    }
  }
};

export default productService;