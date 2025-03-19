import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

const MenuContainer = styled.div`
  width: 100%;
`;

const MenuHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.large};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fontSizes.medium};
  
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
  color: ${props => props.theme.colors.lightText};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.medium};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: ${props => props.theme.spacing.small};
  padding-bottom: ${props => props.theme.spacing.small};
  margin-bottom: ${props => props.theme.spacing.large};

  /* Hide scrollbar but allow scrolling */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : '#ddd'};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : '#f5f5f5'};
  }
`;

const MenuItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.large};
`;

const MenuItem = styled.div`
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform ${props => props.theme.transitions.medium}, box-shadow ${props => props.theme.transitions.medium};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const MenuItemImage = styled.div`
  height: 180px;
  background-color: #f0f0f0;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const MenuItemContent = styled.div`
  padding: ${props => props.theme.spacing.medium};
  background-color: white;
`;

const MenuItemTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.xsmall};
`;

const MenuItemPrice = styled.div`
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.medium};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.small};
`;

const MenuItemDescription = styled.p`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: ${props => props.theme.spacing.medium};
  min-height: 60px;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-weight: bold;
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: #b81c1c;
  }
`;

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Categorias de exemplo
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'hamburger', name: 'Hambúrgueres' },
    { id: 'chicken', name: 'Frango' },
    { id: 'vegetarian', name: 'Vegetarianos' },
    { id: 'sides', name: 'Acompanhamentos' },
    { id: 'drinks', name: 'Bebidas' },
    { id: 'desserts', name: 'Sobremesas' },
  ];
  
  // Dados de exemplo para os itens do menu (serão substituídos por dados reais da API)
  useEffect(() => {
    // Simulando uma chamada à API
    setTimeout(() => {
      const dummyMenuItems = [
        {
          id: 1,
          name: "Hambúrguer Clássico",
          price: 24.90,
          description: "Pão, hambúrguer, queijo, alface, tomate e molho especial.",
          image: "/images/classic-burger.jpg",
          category: "hamburger"
        },
        {
          id: 2,
          name: "Hambúrguer de Frango",
          price: 22.90,
          description: "Pão, frango empanado, queijo, alface, tomate e maionese.",
          image: "/images/chicken-burger.jpg",
          category: "chicken"
        },
        {
          id: 3,
          name: "Hambúrguer Vegetariano",
          price: 26.90,
          description: "Pão, hambúrguer de legumes, queijo, alface, tomate e molho especial.",
          image: "/images/veggie-burger.jpg",
          category: "vegetarian"
        },
        {
          id: 4,
          name: "Siri Especial",
          price: 32.90,
          description: "Pão, hambúrguer duplo, queijo cheddar, bacon, cebola caramelizada e molho barbecue.",
          image: "/images/special-burger.jpg",
          category: "hamburger"
        },
        {
          id: 5,
          name: "Batata Frita",
          price: 14.90,
          description: "Porção de batata frita crocante com sal e temperos especiais.",
          image: "/images/fries.jpg",
          category: "sides"
        },
        {
          id: 6,
          name: "Onion Rings",
          price: 16.90,
          description: "Anéis de cebola empanados e fritos, servidos com molho barbecue.",
          image: "/images/onion-rings.jpg",
          category: "sides"
        },
        {
          id: 7,
          name: "Refrigerante",
          price: 7.90,
          description: "Lata de 350ml. Opções: Coca-Cola, Guaraná, Sprite, Fanta.",
          image: "/images/soda.jpg",
          category: "drinks"
        },
        {
          id: 8,
          name: "Milkshake",
          price: 15.90,
          description: "Milkshake cremoso. Sabores: Chocolate, Baunilha, Morango.",
          image: "/images/milkshake.jpg",
          category: "drinks"
        },
        {
          id: 9,
          name: "Brownie com Sorvete",
          price: 18.90,
          description: "Brownie de chocolate quente com sorvete de baunilha.",
          image: "/images/brownie.jpg",
          category: "desserts"
        },
        {
          id: 10,
          name: "Cheesecake",
          price: 16.90,
          description: "Cheesecake com cobertura de frutas vermelhas.",
          image: "/images/cheesecake.jpg",
          category: "desserts"
        }
      ];
      
      setMenuItems(dummyMenuItems);
      setFilteredItems(dummyMenuItems);
    }, 1000);
  }, []);
  
  // Filtrar itens com base na categoria e pesquisa
  useEffect(() => {
    let filtered = [...menuItems];
    
    // Filtrar por categoria
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [activeCategory, searchQuery, menuItems]);
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <MenuContainer>
      <MenuHeader>
        <PageTitle>Cardápio</PageTitle>
      </MenuHeader>
      
      <FilterBar>
        <SearchContainer>
          <SearchIcon><FaSearch /></SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar itens..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        
        <FilterButton>
          <FaFilter />
          Filtrar
        </FilterButton>
      </FilterBar>
      
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
      
      <MenuItemsGrid>
        {filteredItems.map(item => (
          <MenuItem key={item.id}>
            <MenuItemImage image={item.image} />
            <MenuItemContent>
              <MenuItemTitle>{item.name}</MenuItemTitle>
              <MenuItemPrice>R$ {item.price.toFixed(2)}</MenuItemPrice>
              <MenuItemDescription>{item.description}</MenuItemDescription>
              <AddToCartButton>
                <FaPlus />
                Adicionar ao Carrinho
              </AddToCartButton>
            </MenuItemContent>
          </MenuItem>
        ))}
      </MenuItemsGrid>
    </MenuContainer>
  );
};

export default Menu;