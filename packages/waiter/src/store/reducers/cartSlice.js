import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  tableId: null,
  notes: '',
  loading: false,
  error: null,
  success: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Adicionar item ao carrinho
    addItem: (state, action) => {
      const { product, quantity, notes, removedIngredients } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === product._id && 
               JSON.stringify(item.removedIngredients) === JSON.stringify(removedIngredients || [])
      );

      if (existingItemIndex >= 0) {
        // Se o item já existe com os mesmos ingredientes removidos, apenas atualize a quantidade
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Caso contrário, adicione um novo item
        state.items.push({
          product,
          quantity,
          price: product.price,
          notes: notes || '',
          removedIngredients: removedIngredients || [],
          status: 'pending'
        });
      }
    },
    
    // Remover item do carrinho
    removeItem: (state, action) => {
      const { index } = action.payload;
      state.items.splice(index, 1);
    },
    
    // Atualizar quantidade de um item
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items[index].quantity = quantity;
      }
    },
    
    // Atualizar observações de um item
    updateItemNotes: (state, action) => {
      const { index, notes } = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items[index].notes = notes;
      }
    },
    
    // Atualizar ingredientes removidos de um item
    updateRemovedIngredients: (state, action) => {
      const { index, removedIngredients } = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items[index].removedIngredients = removedIngredients;
      }
    },
    
    // Definir a mesa para o pedido
    setTableId: (state, action) => {
      state.tableId = action.payload;
    },
    
    // Definir observações gerais do pedido
    setOrderNotes: (state, action) => {
      state.notes = action.payload;
    },
    
    // Limpar o carrinho após finalizar o pedido
    clearCart: (state) => {
      state.items = [];
      state.notes = '';
      state.success = false;
      state.error = null;
    },
    
    // Estados para gerenciar o envio do pedido
    orderStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    orderSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    orderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  updateItemNotes,
  updateRemovedIngredients,
  setTableId,
  setOrderNotes,
  clearCart,
  orderStart,
  orderSuccess,
  orderFail
} = cartSlice.actions;

// Seletores
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectTableId = (state) => state.cart.tableId;
export const selectOrderNotes = (state) => state.cart.notes;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartSuccess = (state) => state.cart.success;

export default cartSlice.reducer;