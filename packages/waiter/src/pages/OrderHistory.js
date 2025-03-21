import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FaArrowLeft, 
  FaFilter, 
  FaSearch, 
  FaReceipt, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheck,
  FaSpinner,
  FaUtensils,
  FaEye,
  FaPrint
} from 'react-icons/fa';

// Importar serviços
import socketService from '../services/socketService';

// Importar thunks e seletores do Redux
import { fetchOrders, setupOrderSocketListeners } from '../store/thunks/orderThunks';
import {
  selectOrders,
  selectOrderLoading,
  selectOrderError,
  selectTotalPages,
  selectCurrentPage,
  setCurrentPage
} from '../store/reducers/orderSlice';

// Componentes estilizados
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

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const OrderHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderNumber = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OrderStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'active': return '#FFF9C4';
      case 'completed': return '#E8F5E9';
      case 'cancelled': return '#FFEBEE';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#FFA000';
      case 'completed': return '#43A047';
      case 'cancelled': return '#D32F2F';
      default: return '#666';
    }
  }};
`;

const OrderInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const InfoValue = styled.span`
  font-weight: 500;
`;

const OrderItems = styled.div`
  padding: 1rem;
`;

const OrderItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OrderItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  display: flex;
  align-items: center;
`;

const ItemQuantity = styled.span`
  background-color: #f0f0f0;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;

const ItemPrice = styled.span`
  color: #666;
`;

const OrderFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderTotal = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const OrderActions = styled.div`
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  background-color: rgba(211, 47, 47, 0.1);
  color: #D32F2F;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#D32F2F' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    background-color: ${props => props.active ? '#D32F2F' : '#f5f5f5'};
  }
`;

const OrderHistory = () => {
  const navigate = useNavigate();
  
  // Estados locais apenas para filtros de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Usar seletores do Redux
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);
  
  // Carregar pedidos
  useEffect(() => {
    // Preparar filtros
    const filters = {};
    
    if (statusFilter) {
      filters.status = statusFilter;
    }
    
    if (dateFilter) {
      filters.date = dateFilter;
    }
    
    // Adicionar paginação
    filters.page = currentPage;
    filters.limit = 10;
    
    // Buscar pedidos usando o thunk
    dispatch(fetchOrders(filters));
    
    // Inicializar Socket.IO para atualizações em tempo real
    const token = localStorage.getItem('waiterToken');
    if (token) {
      const socket = socketService.init(token);
      socketService.joinRestaurant();
      
      // Configurar ouvintes de Socket.IO para pedidos
      const removeListeners = setupOrderSocketListeners(dispatch);
      
      return () => {
        // Limpar ouvintes ao desmontar o componente
        removeListeners();
      };
    }
  }, [dispatch, currentPage, statusFilter, dateFilter]);
  
  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Função para formatar hora
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Função para formatar valor monetário
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Função para visualizar detalhes do pedido
  const handleViewOrder = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };
  
  // Função para imprimir pedido
  const handlePrintOrder = (order) => {
    // Implementação da impressão do pedido
    console.log('Imprimir pedido:', order);
  };
  
  // Filtrar pedidos pelo termo de busca
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      (order.table && order.table.number.toString().includes(searchLower)) ||
      (order.customer && order.customer.name.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <>
      <Header>
        <BackButton onClick={() => navigate('/tables')}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>Histórico de Pedidos</PageTitle>
      </Header>
      
      <Container>
        <FiltersContainer>
          <SearchInputContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Buscar pedido por número, mesa ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputContainer>
          
          <FilterSelect 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </FilterSelect>
          
          <FilterSelect 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Todas as datas</option>
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
          </FilterSelect>
        </FiltersContainer>
        
        {loading ? (
          <LoadingContainer>
            <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginLeft: '0.5rem' }}>Carregando pedidos...</span>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <FaExclamationTriangle />
            {error}
          </ErrorContainer>
        ) : filteredOrders.length === 0 ? (
          <EmptyContainer>
            <EmptyIcon>
              <FaReceipt />
            </EmptyIcon>
            <h3>Nenhum pedido encontrado</h3>
            <p>Não há pedidos que correspondam aos filtros selecionados.</p>
          </EmptyContainer>
        ) : (
          <OrdersGrid>
            {filteredOrders.map(order => (
              <OrderCard key={order._id}>
                <OrderHeader>
                  <OrderNumber>
                    <FaReceipt />
                    Pedido #{order.orderNumber}
                    <OrderStatus status={order.status}>
                      {order.status === 'active' ? 'Ativo' : 
                       order.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </OrderStatus>
                  </OrderNumber>
                  <span>{formatDate(order.createdAt)} {formatTime(order.createdAt)}</span>
                </OrderHeader>
                
                <OrderInfo>
                  <InfoItem>
                    <InfoLabel>Mesa</InfoLabel>
                    <InfoValue>{order.table ? order.table.number : 'N/A'}</InfoValue>
                  </InfoItem>
                  
                  <InfoItem>
                    <InfoLabel>Cliente</InfoLabel>
                    <InfoValue>{order.customer ? order.customer.name : 'N/A'}</InfoValue>
                  </InfoItem>
                  
                  <InfoItem>
                    <InfoLabel>Garçom</InfoLabel>
                    <InfoValue>{order.waiter ? order.waiter.name : 'N/A'}</InfoValue>
                  </InfoItem>
                  
                  <InfoItem>
                    <InfoLabel>Pagamento</InfoLabel>
                    <InfoValue>
                      {order.paymentMethod ? 
                        (order.paymentMethod === 'credit' ? 'Crédito' : 
                         order.paymentMethod === 'debit' ? 'Débito' : 
                         order.paymentMethod === 'cash' ? 'Dinheiro' : 'PIX') : 'Pendente'}
                    </InfoValue>
                  </InfoItem>
                </OrderInfo>
                
                <OrderItems>
                  <OrderItemsList>
                    {order.items.slice(0, 3).map((item, index) => (
                      <OrderItem key={index}>
                        <ItemName>
                          <ItemQuantity>{item.quantity}x</ItemQuantity>
                          {item.product.name}
                        </ItemName>
                        <ItemPrice>{formatCurrency(item.price * item.quantity)}</ItemPrice>
                      </OrderItem>
                    ))}
                    {order.items.length > 3 && (
                      <OrderItem>
                        <ItemName>+ {order.items.length - 3} itens adicionais</ItemName>
                      </OrderItem>
                    )}
                  </OrderItemsList>
                </OrderItems>
                
                <OrderFooter>
                  <OrderTotal>{formatCurrency(order.total)}</OrderTotal>
                  <OrderActions>
                    <ActionButton onClick={() => handleViewOrder(order._id)}>
                      <FaEye />
                      Detalhes
                    </ActionButton>
                    <ActionButton onClick={() => handlePrintOrder(order)}>
                      <FaPrint />
                      Imprimir
                    </ActionButton>
                  </OrderActions>
                </OrderFooter>
              </OrderCard>
            ))}
          </OrdersGrid>
        )}
        
        {totalPages > 1 && (
          <Pagination>
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PageButton 
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}
            
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </PageButton>
          </Pagination>
        )}
      </Container>
    </>
  );
};

export default OrderHistory;