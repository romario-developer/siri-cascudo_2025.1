import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  activeOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
  totalPages: 1,
  currentPage: 1
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Ações para carregar pedidos
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload.data;
      state.totalPages = Math.ceil(action.payload.count / 10);
      state.error = null;
    },
    fetchOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Ações para carregar pedidos ativos
    fetchActiveOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchActiveOrdersSuccess: (state, action) => {
      state.loading = false;
      state.activeOrders = action.payload;
      state.error = null;
    },
    fetchActiveOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Ações para carregar um pedido específico
    fetchOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.error = null;
    },
    fetchOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Ações para atualizar um pedido
    updateOrderStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateOrderSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.currentOrder = action.payload;
      
      // Atualizar o pedido na lista de pedidos
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      
      // Atualizar o pedido na lista de pedidos ativos
      const activeIndex = state.activeOrders.findIndex(order => order._id === action.payload._id);
      if (activeIndex !== -1) {
        if (action.payload.status === 'active') {
          state.activeOrders[activeIndex] = action.payload;
        } else {
          // Remover da lista de ativos se não estiver mais ativo
          state.activeOrders.splice(activeIndex, 1);
        }
      }
    },
    updateOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    
    // Ação para adicionar um novo pedido à lista
    addNewOrder: (state, action) => {
      if (action.payload.status === 'active') {
        state.activeOrders.unshift(action.payload);
      }
      state.orders.unshift(action.payload);
    },
    
    // Ação para atualizar um pedido recebido via Socket.IO
    updateOrderViaSocket: (state, action) => {
      const order = action.payload;
      
      // Atualizar na lista de pedidos
      const index = state.orders.findIndex(o => o._id === order._id);
      if (index !== -1) {
        state.orders[index] = order;
      } else {
        state.orders.unshift(order);
      }
      
      // Atualizar na lista de pedidos ativos
      const activeIndex = state.activeOrders.findIndex(o => o._id === order._id);
      if (order.status === 'active') {
        if (activeIndex !== -1) {
          state.activeOrders[activeIndex] = order;
        } else {
          state.activeOrders.unshift(order);
        }
      } else if (activeIndex !== -1) {
        // Remover da lista de ativos se não estiver mais ativo
        state.activeOrders.splice(activeIndex, 1);
      }
      
      // Atualizar pedido atual se estiver visualizando
      if (state.currentOrder && state.currentOrder._id === order._id) {
        state.currentOrder = order;
      }
    },
    
    // Ação para limpar o estado após logout
    clearOrderState: (state) => {
      return initialState;
    },
    
    // Ação para definir a página atual
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  }
});

export const { 
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
  updateOrderViaSocket,
  clearOrderState,
  setCurrentPage
} = orderSlice.actions;

// Seletores
export const selectOrders = (state) => state.order.orders;
export const selectActiveOrders = (state) => state.order.activeOrders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderSuccess = (state) => state.order.success;
export const selectTotalPages = (state) => state.order.totalPages;
export const selectCurrentPage = (state) => state.order.currentPage;

export default orderSlice.reducer;