import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaPlus, FaMinus, FaTrash, FaUtensils, FaPrint, FaCheck, FaCreditCard } from 'react-icons/fa';

const Header = styled.header`
  background-color: #D32F2F;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  margin-right: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  flex: 1;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MenuSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableInfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const TableInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TableIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #D32F2F;
  color: white;
  border-radius: 50%;
  font-size: 1.25rem;
`;

const TableDetails = styled.div``;

const TableNumber = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const TableStatus = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => {
    switch (props.status) {
      case 'available': return '#4CAF50';
      case 'occupied': return '#FFC107';
      case 'finishing': return '#F44336';
      default: return '#666';
    }
  }};
`;

const TableActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.primary ? '#D32F2F' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: 1px solid ${props => props.primary ? '#D32F2F' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.primary ? '500' : 'normal'};
  
  &:hover {
    background-color: ${props => props.primary ? '#b81c1c' : '#f5f5f5'};
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  /* Hide scrollbar but allow scrolling */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? '#D32F2F' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#D32F2F' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.active ? '#D32F2F' : '#f5f5f5'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
  
  /* Customize scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const ProductCard = styled.div`
  background-color: white;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  height: 120px;
  background-color: #f0f0f0;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const ProductContent = styled.div`
  padding: 0.75rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
`;

const ProductPrice = styled.div`
  font-weight: 500;
  color: #D32F2F;
`;

const OrderSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const OrderTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const OrderItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  
  /* Customize scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const EmptyOrder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
  
  p {
    margin-top: 0.5rem;
  }
`;

const OrderItem = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const OrderItemDetails = styled.div`
  flex: 1;
`;

const OrderItemName = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
`;

const OrderItemPrice = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const OrderItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: ${props => props.round === 'left' ? '4px 0 0 4px' : props.round === 'right' ? '0 4px 4px 0' : '0'};
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
    color: #aaa;
  }
`;

const QuantityValue = styled.div`
  width: 30px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-width: 1px 0;
  font-weight: 500;
  font-size: 0.875rem;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    color: #D32F2F;
  }
`;

const OrderItemTotal = styled.div`
  font-weight: 500;
  margin-left: auto;
`;

const OrderFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const OrderSummary = styled.div`
  margin-bottom: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 1.1rem;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid #eee;
`;

const OrderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const OrderButton = styled(ActionButton)`
  flex: 1;
`;

const OrderModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.primary ? '#D32F2F' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: 1px solid ${props => props.primary ? '#D32F2F' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.primary ? '500' : 'normal'};
  
  &:hover {
    background-color: ${props => props.primary ? '#b81c1c' : '#f5f5f5'};
  }
`;

const Order = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  
  const [table, setTable] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [showSendOrderModal, setShowSendOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Carregar dados da mesa e produtos
  useEffect(() => {
    // Simular carregamento de dados da API
    setTimeout(() => {
      // Dados da mesa
      const tableData = {
        id: parseInt(tableId),
        number: parseInt(tableId),
        status: 'occupied',
        statusLabel: 'Ocupada',
        capacity: 4,
        customers: 3,
        time: '20:30'
      };
      
      setTable(tableData);
      
      // Dados de produtos
      const productsData = [
        {
          id: 1,
          name: "Hambúrguer Clássico",
          price: 24.90,
          category: "hamburger",
          image: "/images/classic-burger.jpg"
        },
        {
          id: 2,
          name: "Hambúrguer de Frango",
          price: 22.90,
          category: "chicken",
          image: "/images/chicken-burger.jpg"
        },
        {
          id: 3,
          name: "Hambúrguer Vegetariano",
          price: 26.90,
          category: "vegetarian",
          image: "/images/veggie-burger.jpg"
        },
        {
          id: 4,
          name: "Siri Especial",
          price: 32.90,
          category: "hamburger",
          image: "/images/special-burger.jpg"
        },
        {
          id: 5,
          name: "Batata Frita",
          price: 14.90,
          category: "sides",
          image: "/images/fries.jpg"
        },
        {
          id: 6,
          name: "Onion Rings",
          price: 16.90,
          category: "sides",
          image: "/images/onion-rings.jpg"
        },
        {
          id: 7,
          name: "Refrigerante",
          price: 7.90,
          category: "drinks",
          image: "/images/soda.jpg"
        },
        {
          id: 8,
          name: "Milkshake",
          price: 15.90,
          category: "drinks",
          image: "/images/milkshake.jpg"
        },
        {
          id: 9,
          name: "Brownie com Sorvete",
          price: 18.90,
          category: "desserts",
          image: "/images/brownie.jpg"
        },
        {
          id: 10,
          name: "Cheesecake",
          price: 16.90,
          category: "desserts",
          image: "/images/cheesecake.jpg"
        }
      ];
      
      setProducts(productsData);
      
      // Verificar se há itens de pedido existentes para esta mesa
      const existingOrder = [
        {
          id: 4,
          name: "Siri Especial",
          price: 32.90,
          quantity: 1
        },
        {
          id: 5,
          name: "Batata Frita",
          price: 14.90,
          quantity: 2
        }
      ];
      
      setOrderItems(existingOrder);
    }, 1000);
  }, [tableId]);
  
  // Atualizar total do pedido sempre que os itens forem alterados
  useEffect(() => {
    const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setOrderTotal(total);
  }, [orderItems]);
  
  // Categorias disponíveis
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'hamburger', name: 'Hambúrgueres' },
    { id: 'chicken', name: 'Frango' },
    { id: 'vegetarian', name: 'Vegetarianos' },
    { id: 'sides', name: 'Acompanhamentos' },
    { id: 'drinks', name: 'Bebidas' },
    { id: 'desserts', name: 'Sobremesas' },
  ];
  
  // Filtrar produtos por categoria
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  const handleAddProduct = (product) => {
    // Verificar se o produto já está no pedido
    const existingItemIndex = orderItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Se já estiver no pedido, incrementar a quantidade
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Se não estiver no pedido, adicionar com quantidade 1
      setOrderItems([...orderItems, { ...product, quantity: 1 }]);
    }
  };
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleRemoveItem = (itemId) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const handleSendOrder = () => {
    setShowSendOrderModal(true);
  };
  
  const confirmSendOrder = () => {
    // Aqui você enviaria os dados para o backend
    console.log("Enviando pedido:", orderItems);
    setShowSendOrderModal(false);
    
    // Simular resposta do servidor
    alert("Pedido enviado com sucesso para a cozinha!");
  };
  
  const handlePayment = () => {
    setShowPaymentModal(true);
  };
  
  const confirmPayment = () => {
    // Lógica para processar pagamento
    console.log("Processando pagamento:", orderTotal);
    setShowPaymentModal(false);
    
    // Após pagamento, voltar para a lista de mesas
    alert("Pagamento processado com sucesso!");
    navigate('/tables');
  };
  
  const handleBackClick = () => {
    navigate('/tables');
  };
  
  if (!table) {
    return (
      <Container>
        <div>Carregando dados da mesa...</div>
      </Container>
    );
  }
  
  return (
    <>
      <Header>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>Pedido - Mesa {table.number}</PageTitle>
      </Header>
      
      <Container>
        <TableInfoBar>
          <TableInfo>
            <TableIcon>
              <FaUtensils />
            </TableIcon>
            <TableDetails>
              <TableNumber>Mesa {table.number}</TableNumber>
              <TableStatus status={table.status}>{table.statusLabel}</TableStatus>
            </TableDetails>
          </TableInfo>
          
          <TableActions>
            <ActionButton>
              <FaPrint />
              Imprimir Comanda
            </ActionButton>
          </TableActions>
        </TableInfoBar>
        
        <OrderGrid>
          <MenuSection>
            <CategoriesContainer>
              {categories.map(category => (
                <CategoryButton 
                  key={category.id} 
                  active={activeCategory === category.id}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </CategoriesContainer>
            
            <ProductsGrid>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                >
                  <ProductImage image={product.image} />
                  <ProductContent>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>R$ {product.price.toFixed(2)}</ProductPrice>
                  </ProductContent>
                </ProductCard>
              ))}
            </ProductsGrid>
          </MenuSection>
          
          <OrderSection>
            <OrderTitle>Itens do Pedido</OrderTitle>
            
            <OrderItemsList>
              {orderItems.length === 0 ? (
                <EmptyOrder>
                  <FaUtensils size={32} />
                  <p>Nenhum item adicionado ao pedido.</p>
                </EmptyOrder>
              ) : (
                orderItems.map(item => (
                  <OrderItem key={item.id}>
                    <OrderItemDetails>
                      <OrderItemName>{item.name}</OrderItemName>
                      <OrderItemPrice>R$ {item.price.toFixed(2)}</OrderItemPrice>
                      
                      <OrderItemActions>
                        <QuantityControl>
                          <QuantityButton
                            round="left"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={10} />
                          </QuantityButton>
                          <QuantityValue>{item.quantity}</QuantityValue>
                          <QuantityButton
                            round="right"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <FaPlus size={10} />
                          </QuantityButton>
                        </QuantityControl>
                        
                        <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                          <FaTrash size={12} />
                        </RemoveButton>
                        
                        <OrderItemTotal>
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </OrderItemTotal>
                      </OrderItemActions>
                    </OrderItemDetails>
                  </OrderItem>
                ))
              )}
            </OrderItemsList>
            
            <OrderFooter>
              <OrderSummary>
                <SummaryRow>
                  <span>Subtotal</span>
                  <span>R$ {orderTotal.toFixed(2)}</span>
                </SummaryRow>
                <TotalRow>
                  <span>Total</span>
                  <span>R$ {orderTotal.toFixed(2)}</span>
                </TotalRow>
              </OrderSummary>
              
              <OrderActions>
                <OrderButton 
                  primary
                  onClick={handleSendOrder}
                  disabled={orderItems.length === 0}
                >
                  <FaCheck />
                  Enviar para Cozinha
                </OrderButton>
                <OrderButton
                  onClick={handlePayment}
                  disabled={orderItems.length === 0}
                >
                  <FaCreditCard />
                  Pagamento
                </OrderButton>
              </OrderActions>
            </OrderFooter>
          </OrderSection>
        </OrderGrid>
      </Container>
      
      {/* Modal de Confirmação de Envio */}
      {showSendOrderModal && (
        <OrderModal>
          <ModalContent>
            <ModalTitle>Confirmar Pedido</ModalTitle>
            <ModalText>
              Deseja enviar o pedido para a cozinha? Esta ação não pode ser desfeita.
            </ModalText>
            <ModalActions>
              <ModalButton onClick={() => setShowSendOrderModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton primary onClick={confirmSendOrder}>
                Confirmar
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </OrderModal>
      )}
      
      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <OrderModal>
          <ModalContent>
            <ModalTitle>Pagamento</ModalTitle>
            <ModalText>
              Valor total a pagar: R$ {orderTotal.toFixed(2)}
              <br /><br />
              Selecione a forma de pagamento:
            </ModalText>
            <ModalActions>
              <ModalButton onClick={() => setShowPaymentModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton primary onClick={confirmPayment}>
                Finalizar Pagamento
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </OrderModal>
      )}
    </>
  );
};

export default Order;