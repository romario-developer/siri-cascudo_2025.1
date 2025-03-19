import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUtensils, FaPlus, FaSignOutAlt, FaHistory, FaSearch, FaFilter } from 'react-icons/fa';

const Header = styled.header`
  background-color: #D32F2F;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchInputContainer = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
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

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    border-color: #D32F2F;
  }
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
`;

const TableCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  ${({ status }) => {
    if (status === 'available') {
      return `
        border-top: 4px solid #4CAF50;
      `;
    } else if (status === 'occupied') {
      return `
        border-top: 4px solid #FFC107;
      `;
    } else if (status === 'finishing') {
      return `
        border-top: 4px solid #F44336;
      `;
    }
  }}
`;

const TableNumber = styled.h3`
  font-size: 1.5rem;
  margin: 0.5rem 0;
`;

const TableInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const TableStatus = styled.div`
  font-size: 0.85rem;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  
  ${({ status }) => {
    if (status === 'available') {
      return `
        background-color: #E8F5E9;
        color: #4CAF50;
      `;
    } else if (status === 'occupied') {
      return `
        background-color: #FFF8E1;
        color: #FFC107;
      `;
    } else if (status === 'finishing') {
      return `
        background-color: #FFEBEE;
        color: #F44336;
      `;
    }
  }}
`;

const TableDetails = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
  width: 100%;
`;

const TableDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
`;

const TableIcon = styled.div`
  font-size: 2.5rem;
  color: #BBB;
  margin-bottom: 0.5rem;
`;

const AddTableButton = styled(TableCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  border-top: none;
  
  &:hover {
    color: #D32F2F;
  }
`;

const AddTableIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTables, setFilteredTables] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simular carregamento de dados da API
    setTimeout(() => {
      const dummyTables = [
        { 
          id: 1, 
          number: 1, 
          status: 'available', 
          capacity: 4, 
          statusLabel: 'Disponível',
          lastUpdate: null
        },
        { 
          id: 2, 
          number: 2, 
          status: 'occupied', 
          capacity: 2, 
          customers: 2, 
          time: '19:30', 
          statusLabel: 'Ocupada',
          lastUpdate: '19:30'
        },
        { 
          id: 3, 
          number: 3, 
          status: 'occupied', 
          capacity: 6, 
          customers: 4, 
          time: '20:15', 
          statusLabel: 'Ocupada',
          lastUpdate: '20:15'
        },
        { 
          id: 4, 
          number: 4, 
          status: 'finishing', 
          capacity: 4, 
          customers: 3, 
          time: '18:45', 
          statusLabel: 'Finalizando',
          lastUpdate: '18:45'
        },
        { 
          id: 5, 
          number: 5, 
          status: 'available', 
          capacity: 2, 
          statusLabel: 'Disponível',
          lastUpdate: null
        },
        { 
          id: 6, 
          number: 6, 
          status: 'available', 
          capacity: 8, 
          statusLabel: 'Disponível',
          lastUpdate: null
        },
        { 
          id: 7, 
          number: 7, 
          status: 'occupied', 
          capacity: 4, 
          customers: 4, 
          time: '20:00', 
          statusLabel: 'Ocupada',
          lastUpdate: '20:00'
        },
        { 
          id: 8, 
          number: 8, 
          status: 'finishing', 
          capacity: 2, 
          customers: 2, 
          time: '19:00', 
          statusLabel: 'Finalizando',
          lastUpdate: '19:00'
        }
      ];
      
      setTables(dummyTables);
      setFilteredTables(dummyTables);
    }, 1000);
  }, []);
  
  useEffect(() => {
    // Filtrar mesas com base na pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = tables.filter(table => 
        table.number.toString().includes(query) || 
        table.statusLabel.toLowerCase().includes(query)
      );
      setFilteredTables(filtered);
    } else {
      setFilteredTables(tables);
    }
  }, [searchQuery, tables]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTableClick = (tableId) => {
    navigate(`/order/${tableId}`);
  };
  
  const handleLogout = () => {
    // Limpar dados de autenticação e redirecionar para login
    localStorage.removeItem('waiterToken');
    localStorage.removeItem('waiterName');
    navigate('/');
  };
  
  const handleHistoryClick = () => {
    navigate('/history');
  };
  
  const waiterName = localStorage.getItem('waiterName') || 'Usuário';
  
  return (
    <>
      <Header>
        <LogoContainer>
          <Logo>Siri Cascudo</Logo>
        </LogoContainer>
        <UserName>{waiterName}</UserName>
        <ActionsContainer>
          <ActionButton onClick={handleHistoryClick} title="Histórico de Pedidos">
            <FaHistory />
          </ActionButton>
          <ActionButton onClick={handleLogout} title="Sair">
            <FaSignOutAlt />
          </ActionButton>
        </ActionsContainer>
      </Header>
      
      <Container>
        <Title>Mesas</Title>
        
        <SearchContainer>
          <SearchInputContainer>
            <SearchIcon><FaSearch /></SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Buscar mesa..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchInputContainer>
          
          <FilterButton>
            <FaFilter />
            Filtrar
          </FilterButton>
        </SearchContainer>
        
        <TablesGrid>
          {filteredTables.map(table => (
            <TableCard 
              key={table.id} 
              status={table.status}
              onClick={() => handleTableClick(table.id)}
            >
              <TableIcon>
                <FaUtensils />
              </TableIcon>
              <TableNumber>Mesa {table.number}</TableNumber>
              <TableStatus status={table.status}>
                {table.statusLabel}
              </TableStatus>
              <TableInfo>
                {table.status !== 'available' && (
                  <TableDetails>
                    <TableDetail>
                      <span>Pessoas:</span>
                      <span>{table.customers} / {table.capacity}</span>
                    </TableDetail>
                    <TableDetail>
                      <span>Desde:</span>
                      <span>{table.time}</span>
                    </TableDetail>
                  </TableDetails>
                )}
                {table.status === 'available' && (
                  <TableDetails>
                    <TableDetail>
                      <span>Capacidade:</span>
                      <span>{table.capacity} pessoas</span>
                    </TableDetail>
                  </TableDetails>
                )}
              </TableInfo>
            </TableCard>
          ))}
          
          <AddTableButton>
            <AddTableIcon>
              <FaPlus />
            </AddTableIcon>
            <span>Adicionar Mesa</span>
          </AddTableButton>
        </TablesGrid>
      </Container>
    </>
  );
};

export default Tables;