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
  FaEye
} from 'react-icons/fa';

// Componentes estilizados
const Header = styled.header`
  background-color: ${props => props.theme.colors.primary};
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
  border-radius: ${props => props.theme.borderRadius.medium};
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
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
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
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  background-color: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
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
  border-radius: ${props => props.theme.borderRadius.small};
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
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const OrderItems = styled.div`
  padding: 1rem;
`;

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ItemRow = styled.li`
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
  gap: 0.5rem;
`;

const ItemQuantity = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const OrderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.primary ? props.theme.colors.primary : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.primaryDark : '#e0e0e0'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
`;

const EmptyText = styled.h3`
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 0.5rem 0;
`;

const EmptySubtext = styled.p`
  font-size: 1rem;
  color: #999;
  margin: 0;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: #FFEBEE;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  color: #D32F2F;
  margin-bottom: 1rem;
`;

const ErrorText = styled.h3`
  font-size: 1.2rem;
  color: #D32F2F;
  margin: 0 0 0.5rem 0;
`;

const ErrorSubtext = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 1rem 0;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #D32F2F;
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #B71C1C;
  }
`;

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Estado local para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Dados mockados para demonstração
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD-001',
      status: 'completed',
      date: '2023-06-15T14:30:00',
      customer: 'João Silva',
      total: 89.90,
      items: [
        { id: 1, name: 'Hambúrguer Clássico', quantity: 2, price: 29.90 },
        { id: 2, name: 'Batata Frita Grande', quantity: 1, price: 15.90 },
        { id: 3, name: 'Refrigerante 500ml', quantity: 2, price: 7.50 }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      status: 'active',
      date: '2023-06-16T18:45:00',
      customer: 'Maria Oliveira',
      total: 63.80,
      items: [
        { id: 4, name: 'Pizza Média Margherita', quantity: 1, price: 45.90 },
        { id: 5, name: 'Refrigerante 1L', quantity: 1, price: 9.90 },
        { id: 6, name: 'Sobremesa Petit Gateau', quantity: 1, price: 18.00 }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      status: 'cancelled',
      date: '2023-06-14T20:15:00',
      customer: 'Carlos Mendes',
      total: 42.70,
      items: [
        { id: 7, name: 'Sanduíche Vegetariano', quantity: 1, price: 27.90 },
        { id: 8, name: 'Suco Natural 500ml', quantity: 1, price: 14.80 }
      ]
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Função para formatar data
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Data não disponível';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };
  
  // Função para formatar valor monetário
  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    } catch (error) {
      console.error('Erro ao formatar valor:', error);
      return 'Valor inválido';
    }
  };
  
  // Função para buscar pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulando uma chamada de API com timeout
      // Em um ambiente real, isso seria substituído por uma chamada à API
      setTimeout(() => {
        // Os dados já estão mockados no estado
        setLoading(false);
      }, 1000);
      
      // Em um ambiente real, seria algo como:
      // const response = await api.get('/orders', { params: { page: currentPage, status: statusFilter, ... } });
      // setOrders(response.data.orders);
      // setTotalPages(response.data.totalPages);
      // setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Não foi possível carregar os pedidos. Por favor, tente novamente.');
      console.error('Erro ao buscar pedidos:', err);
    }
  };
  
  // Efeito para buscar pedidos quando os filtros ou a página mudam
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, dateFilter]);
  
  // Função para filtrar pedidos localmente (simulando filtro do backend)
  const filteredOrders = orders.filter(order => {
    // Filtro por termo de busca
    const searchMatch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    
    // Filtro por data
    let dateMatch = true;
    if (dateFilter === 'custom' && startDate && endDate) {
      const orderDate = new Date(order.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Ajustar para o final do dia
      
      dateMatch = orderDate >= start && orderDate <= end;
    } else if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const orderDate = new Date(order.date);
      dateMatch = orderDate >= today && orderDate < tomorrow;
    } else if (dateFilter === 'week') {
      const today = new Date();
      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - today.getDay());
      firstDay.setHours(0, 0, 0, 0);
      
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 7);
      
      const orderDate = new Date(order.date);
      dateMatch = orderDate >= firstDay && orderDate < lastDay;
    } else if (dateFilter === 'month') {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      
      const orderDate = new Date(order.date);
      dateMatch = orderDate >= firstDay && orderDate <= lastDay;
    }
    
    return searchMatch && statusMatch && dateMatch;
  });
  
  // Função para lidar com a mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Função para lidar com a visualização de detalhes do pedido
  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  
  // Função para lidar com a repetição de um pedido
  const handleRepeatOrder = (order) => {
    // Aqui você implementaria a lógica para adicionar os itens do pedido ao carrinho
    // e redirecionar para a página de checkout
    console.log('Repetir pedido:', order);
    // Exemplo: dispatch(addItemsToCart(order.items));
    // navigate('/checkout');
  };
  
  // Função para tentar novamente após um erro
  const handleRetry = () => {
    fetchOrders();
  };
  
  // Renderização dos botões de paginação
  const renderPaginationButtons = () => {
    const buttons = [];
    
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PageButton 
          key={i} 
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    
    return buttons;
  };
  
  // Renderização do componente
  return (
    <>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
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
              placeholder="Buscar por número do pedido ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputContainer>
          
          <FilterSelect 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="active">Em andamento</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </FilterSelect>
          
          <FilterSelect 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Todas as datas</option>
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="custom">Período personalizado</option>
          </FilterSelect>
          
          {dateFilter === 'custom' && (
            <>
              <DateInput 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Data inicial"
              />
              <DateInput 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Data final"
              />
            </>
          )}
        </FiltersContainer>
        
        {/* Estado de carregamento */}
        {loading && (
          <LoadingState>
            <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginLeft: '0.5rem' }}>Carregando pedidos...</span>
          </LoadingState>
        )}
        
        {/* Estado de erro */}
        {error && (
          <ErrorState>
            <ErrorIcon>
              <FaExclamationTriangle />
            </ErrorIcon>
            <ErrorText>Ops! Algo deu errado.</ErrorText>
            <ErrorSubtext>{error}</ErrorSubtext>
            <RetryButton onClick={handleRetry}>
              Tentar novamente
            </RetryButton>
          </ErrorState>
        )}
        
        {/* Estado vazio */}
        {!loading && !error && filteredOrders.length === 0 && (
          <EmptyState>
            <EmptyIcon>
              <FaReceipt />
            </EmptyIcon>
            <EmptyText>Nenhum pedido encontrado</EmptyText>
            <EmptySubtext>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Você ainda não realizou nenhum pedido.'}
            </EmptySubtext>
          </EmptyState>
        )}
        
        {/* Lista de pedidos */}
        {!loading && !error && filteredOrders.length > 0 && (
          <>
            <OrdersGrid>
              {filteredOrders.map(order => (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <OrderNumber>
                      <FaReceipt />
                      {order.orderNumber}
                    </OrderNumber>
                    <OrderStatus status={order.status}>
                      {order.status === 'active' && 'Em andamento'}
                      {order.status === 'completed' && 'Concluído'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </OrderStatus>
                  </OrderHeader>
                  
                  <OrderInfo>
                    <InfoItem>
                      <InfoLabel>Data</InfoLabel>
                      <InfoValue>{formatDate(order.date)}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Cliente</InfoLabel>
                      <InfoValue>{order.customer}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Total</InfoLabel>
                      <InfoValue>{formatCurrency(order.total)}</InfoValue>
                    </InfoItem>
                  </OrderInfo>
                  
                  <OrderItems>
                    <InfoLabel>Itens</InfoLabel>
                    <ItemsList>
                      {order.items.map(item => (
                        <ItemRow key={item.id}>
                          <ItemName>
                            <FaUtensils style={{ color: '#999', fontSize: '0.8rem' }} />
                            {item.name}
                          </ItemName>
                          <ItemQuantity>{item.quantity}x</ItemQuantity>
                        </ItemRow>
                      ))}
                    </ItemsList>
                  </OrderItems>
                  
                  <OrderActions>
                    <ActionButton onClick={() => handleViewOrder(order.id)}>
                      <FaEye />
                      Ver detalhes
                    </ActionButton>
                    
                    {order.status === 'completed' && (
                      <ActionButton primary onClick={() => handleRepeatOrder(order)}>
                        <FaUtensils />
                        Pedir novamente
                      </ActionButton>
                    )}
                  </OrderActions>
                </OrderCard>
              ))}
            </OrdersGrid>
            
            {totalPages > 1 && (
              <Pagination>
                <PageButton 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &lt;
                </PageButton>
                
                {renderPaginationButtons()}
                
                <PageButton 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &gt;
                </PageButton>
              </Pagination>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default OrderHistory;