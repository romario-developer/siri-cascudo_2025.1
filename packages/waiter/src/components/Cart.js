import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaMinus, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectOrderNotes,
  selectCartLoading,
  selectCartError,
  removeItem, 
  updateQuantity, 
  setOrderNotes,
  clearCart,
  orderStart,
  orderSuccess,
  orderFail
} from '../store/reducers/cartSlice';
import { createOrder } from '../store/thunks/orderThunks';
import socketService from '../services/socketService';

const CartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CartHeader = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const CartTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CartItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
  height: 100%;
`;

const CartItem = styled.div`
  display: flex;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  position: relative;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.25rem;
`;

const ItemPrice = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemNotes = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
  font-style: italic;
`;

const ItemRemovedIngredients = styled.div`
  font-size: 0.8rem;
  color: #D32F2F;
  margin-top: 0.25rem;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

const QuantityButton = styled.button`
  background-color: ${props => props.disabled ? '#f5f5f5' : '#f0f0f0'};
  color: ${props => props.disabled ? '#ccc' : '#666'};
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.75rem;
  
  &:hover {
    background-color: ${props => props.disabled ? '#f5f5f5' : '#e0e0e0'};
  }
`;

const QuantityText = styled.span`
  margin: 0 0.5rem;
  font-size: 0.9rem;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #D32F2F;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background-color: rgba(211, 47, 47, 0.1);
  }
`;

const CartFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const OrderNotes = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const TotalLabel = styled.span`
  font-size: 1.1rem;
`;

const TotalValue = styled.span`
  font-size: 1.2rem;
  color: #D32F2F;
`;

const SendOrderButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #43A047;
  }
  
  &:disabled {
    background-color: #A5D6A7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #D32F2F;
  background-color: rgba(211, 47, 47, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const Cart = ({ tableId, onOrderSent }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const orderNotes = useSelector(selectOrderNotes);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  
  const [sending, setSending] = useState(false);
  
  const handleRemoveItem = (index) => {
    dispatch(removeItem({ index }));
  };
  
  const handleUpdateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ index, quantity }));
  };
  
  const handleNotesChange = (e) => {
    dispatch(setOrderNotes(e.target.value));
  };
  
  const handleSendOrder = async () => {
    if (!tableId || cartItems.length === 0 || sending) return;
    
    setSending(true);
    dispatch(orderStart());
    
    try {
      // Preparar dados do pedido
      const orderData = {
        tableId,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
          removedIngredients: item.removedIngredients
        })),
        notes: orderNotes
      };
      
      // Usar o thunk para criar o pedido
      const response = await dispatch(createOrder(orderData)).unwrap();
      
      // Marcar como sucesso no Redux
      dispatch(orderSuccess());
      
      // Limpar carrinho
      dispatch(clearCart());
      
      // Notificar componente pai
      if (onOrderSent) {
        onOrderSent(response);
      }
      
      setSending(false);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      dispatch(orderFail(error.message || 'Erro ao enviar pedido'));
      setSending(false);
    }
  };
  
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  return (
    <CartContainer>
      <CartHeader>
        <CartTitle>
          Comanda
          <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}</span>
        </CartTitle>
      </CartHeader>
      
      <CartItemsContainer>
        {cartItems.length === 0 ? (
          <EmptyCart>
            <p>Seu carrinho está vazio</p>
            <p>Adicione itens do menu para criar um pedido</p>
          </EmptyCart>
        ) : (
          cartItems.map((item, index) => (
            <CartItem key={`${item.product._id}-${index}`}>
              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemPrice>{formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}</ItemPrice>
                {item.notes && <ItemNotes>Obs: {item.notes}</ItemNotes>}
                {item.removedIngredients && item.removedIngredients.length > 0 && (
                  <ItemRemovedIngredients>
                    Sem: {item.removedIngredients.join(', ')}
                  </ItemRemovedIngredients>
                )}
              </ItemInfo>
              <ItemActions>
                <QuantityControl>
                  <QuantityButton 
                    onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </QuantityButton>
                  <QuantityText>{item.quantity}</QuantityText>
                  <QuantityButton onClick={() => handleUpdateQuantity(index, item.quantity + 1)}>
                    <FaPlus />
                  </QuantityButton>
                </QuantityControl>
                <RemoveButton onClick={() => handleRemoveItem(index)}>
                  <FaTrash />
                </RemoveButton>
              </ItemActions>
            </CartItem>
          ))
        )}
      </CartItemsContainer>
      
      <CartFooter>
        {error && (
          <ErrorMessage>
            <FaExclamationTriangle />
            {error}
          </ErrorMessage>
        )}
        
        <OrderNotes 
          placeholder="Observações gerais para o pedido..."
          value={orderNotes}
          onChange={handleNotesChange}
        />
        
        <TotalContainer>
          <TotalLabel>Total:</TotalLabel>
          <TotalValue>{formatCurrency(cartTotal)}</TotalValue>
        </TotalContainer>
        
        <SendOrderButton 
          onClick={handleSendOrder}
          disabled={cartItems.length === 0 || loading || sending}
        >
          {loading || sending ? 'Enviando...' : (
            <>
              <FaCheck /> Enviar Pedido
            </>
          )}
        </SendOrderButton>
      </CartFooter>
    </CartContainer>
  );
};

export default Cart;