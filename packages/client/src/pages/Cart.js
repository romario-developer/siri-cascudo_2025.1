import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaCreditCard } from 'react-icons/fa';

const CartContainer = styled.div`
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const EmptyCartMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.spacing.xlarge} 0;
  
  p {
    font-size: ${props => props.theme.fontSizes.large};
    color: ${props => props.theme.colors.lightText};
    margin: ${props => props.theme.spacing.medium} 0;
  }
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${props => props.theme.spacing.large};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
`;

const CartItemsList = styled.div`
  border-top: 1px solid #eee;
`;

const CartHeader = styled.div`
  padding: ${props => props.theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.large};
  margin: 0;
`;

const ClearCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.small};
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartItem = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing.medium};
  border-bottom: 1px solid #eee;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-right: ${props => props.theme.spacing.medium};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.spacing.small};
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium};
  margin: 0 0 ${props => props.theme.spacing.xsmall} 0;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${props => props.theme.spacing.small};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: space-between;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${props => props.theme.spacing.medium};
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.disabled ? '#f0f0f0' : 'white'};
  border: 1px solid #ddd;
  border-radius: ${props => props.round === 'left' ? '4px 0 0 4px' : props.round === 'right' ? '0 4px 4px 0' : '0'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#aaa' : '#333'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#f0f0f0' : '#f5f5f5'};
  }
`;

const QuantityValue = styled.div`
  width: 40px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-width: 1px 0;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.small};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ItemTotal = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-left: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0;
    margin-top: ${props => props.theme.spacing.small};
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing.medium};
  position: sticky;
  top: 20px;
`;

const SummaryTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.large};
  margin: 0 0 ${props => props.theme.spacing.medium} 0;
  padding-bottom: ${props => props.theme.spacing.small};
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.small};
  font-size: ${props => props.theme.fontSizes.medium};
  
  &:last-of-type {
    margin-bottom: ${props => props.theme.spacing.medium};
  }
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.large};
  border-top: 1px solid #eee;
  padding-top: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.small};
`;

const CheckoutButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.medium};
  text-decoration: none;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: #b81c1c;
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ContinueShoppingLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: ${props => props.theme.spacing.large};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0
  });
  const navigate = useNavigate();
  
  // Carregar itens do carrinho (simulando uma recuperação do localStorage ou estado Redux)
  useEffect(() => {
    // Itens de exemplo para demonstração
    const dummyCartItems = [
      {
        id: 4,
        name: "Hambúrguer Especial",
        price: 32.90,
        quantity: 1,
        image: "/images/special-burger.jpg"
      },
      {
        id: 5,
        name: "Batata Frita",
        price: 14.90,
        quantity: 2,
        image: "/images/fries.jpg"
      },
      {
        id: 7,
        name: "Refrigerante",
        price: 7.90,
        quantity: 2,
        image: "/images/soda.jpg"
      }
    ];
    
    setCartItems(dummyCartItems);
  }, []);
  
  // Calcular resumo do pedido sempre que os itens do carrinho forem alterados
  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = 0; // Poderia implementar lógica de desconto
    const deliveryFee = subtotal > 0 ? 5.00 : 0; // Taxa de entrega gratuita para pedidos acima de X valor
    
    setSummary({
      subtotal,
      discount,
      deliveryFee,
      total: subtotal - discount + deliveryFee
    });
  }, [cartItems]);
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };
  
  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <PageTitle>Seu Carrinho</PageTitle>
        <EmptyCartMessage>
          <p>Seu carrinho está vazio.</p>
          <ContinueShoppingLink to="/menu">
            <FaArrowLeft />
            Ver Cardápio
          </ContinueShoppingLink>
        </EmptyCartMessage>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer>
      <PageTitle>Seu Carrinho</PageTitle>
      <CartGrid>
        <CartItemsSection>
          <CartHeader>
            <CartTitle>Itens do Pedido</CartTitle>
            <ClearCartButton onClick={handleClearCart}>
              <FaTrash />
              Limpar Carrinho
            </ClearCartButton>
          </CartHeader>
          
          <CartItemsList>
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <ItemImage image={item.image} />
                <ItemDetails>
                  <ItemTitle>{item.name}</ItemTitle>
                  <ItemPrice>R$ {item.price.toFixed(2)}</ItemPrice>
                  
                  <ItemActions>
                    <QuantityControl>
                      <QuantityButton
                        round="left"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton
                        round="right"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <FaPlus size={12} />
                      </QuantityButton>
                    </QuantityControl>
                    
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                      <FaTrash />
                      Remover
                    </RemoveButton>
                    
                    <ItemTotal>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </ItemTotal>
                  </ItemActions>
                </ItemDetails>
              </CartItem>
            ))}
          </CartItemsList>
        </CartItemsSection>
        
        <OrderSummary>
          <SummaryTitle>Resumo do Pedido</SummaryTitle>
          <SummaryRow>
            <span>Subtotal</span>
            <span>R$ {summary.subtotal.toFixed(2)}</span>
          </SummaryRow>
          {summary.discount > 0 && (
            <SummaryRow>
              <span>Desconto</span>
              <span>-R$ {summary.discount.toFixed(2)}</span>
            </SummaryRow>
          )}
          <SummaryRow>
            <span>Taxa de Entrega</span>
            <span>R$ {summary.deliveryFee.toFixed(2)}</span>
          </SummaryRow>
          <TotalRow>
            <span>Total</span>
            <span>R$ {summary.total.toFixed(2)}</span>
          </TotalRow>
          
          <CheckoutButton to="/checkout">
            <FaCreditCard />
            Finalizar Pedido
          </CheckoutButton>
        </OrderSummary>
      </CartGrid>
      
      <ContinueShoppingLink to="/menu">
        <FaArrowLeft />
        Continuar Comprando
      </ContinueShoppingLink>
    </CartContainer>
  );
};

export default Cart;