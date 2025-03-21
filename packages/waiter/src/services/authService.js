import api from './api';

// Serviço para autenticação
const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Armazenar token e informações do usuário no localStorage
      if (response.data.success && response.data.token) {
        localStorage.setItem('waiterToken', response.data.token);
        localStorage.setItem('waiterUser', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer login' };
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('waiterToken');
    localStorage.removeItem('waiterUser');
  },
  
  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('waiterToken');
  },
  
  // Obter usuário atual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('waiterUser');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      // Se o token for inválido, fazer logout
      authService.logout();
      throw error.response?.data || { message: 'Sessão expirada' };
    }
  }
};

export default authService;