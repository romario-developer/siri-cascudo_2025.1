import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaMinus, 
  FaTrash, 
  FaUtensils, 
  FaPrint, 
  FaCheck, 
  FaCreditCard,
  FaEdit,
  FaStickyNote,
  FaTimes,
  FaExclamationTriangle,
  FaRegClock,
  FaBan,
  FaSearch
} from 'react-icons/fa';

// Importar componentes
import Cart from '../components/Cart';
import ProductItem from '../components/ProductItem';
import CategoryList from '../components/CategoryList';

// Importar serviços
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import tableService from '../services/tableService';
import socketService from '../services/socketService';

// Importar ações e seletores do Redux
import { setTableId } from '../store/reducers/cartSlice';
import { 
  fetchActiveOrders, 
  fetchOrderById, 
  updateOrder, 
  changeOrderStatus,
  setupOrderSocketListeners
} from '../store/thunks/orderThunks';
import {
  selectActiveOrders,
  selectCurrentOrder,
  selectOrderLoading
} from '../store/reducers/orderSlice';

// Componentes estilizados para a interface
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

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
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

const MenuSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 1rem;
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

const SearchContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ProductSearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
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

const MenuProductsGrid = styled.div`
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
  flex-direction: column;
`;

const OrderItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const OrderItemDetails = styled.div`
  flex: 1;
`;

const OrderItemName = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
`;

const OrderItemBadge = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  background-color: ${props => props.color || '#f0f0f0'};
  color: ${props => props.textColor || '#333'};
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

const ItemActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
    color: #D32F2F;
  }
`;

const OrderItemTotal = styled.div`
  font-weight: 500;
  margin-left: auto;
`;

const OrderItemNotes = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: flex-start;
`;

const NoteIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: #D32F2F;
`;

const OrderItemCustomizations = styled.div`
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
`;

const CustomizationItem = styled.div`
  display: flex;
  align-items: center;
  
  &:before {
    content: '•';
    margin-right: 0.25rem;
  }
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

// Modais
const Modal = styled.div`
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
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #D32F2F;
  }
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  ${props => props.selected && `
    border-color: #D32F2F;
    background-color: #FFF5F5;
  `}
`;

const Radio = styled.input`
  margin-right: 0.5rem;
`;

const PaymentIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.25rem;
`;

const OrderHistory = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const OrderHistoryTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
`;

const OrderHistoryItem = styled.div`
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
`;

const OrderHistoryStatus = styled.span`
  font-weight: 500;
  color: ${props => {
    switch (props.status) {
      case 'sent': return '#4CAF50';
      case 'preparing': return '#FFC107';
      case 'ready': return '#2196F3';
      default: return '#666';
    }
  }};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#D32F2F' : 'transparent'};
  color: ${props => props.active ? '#D32F2F' : '#666'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  
  &:hover {
    color: #D32F2F;
  }
`;

const Order = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Estados
  const [table, setTable] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Estados para o pedido
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Estados para modais
  const [showSendOrderModal, setShowSendOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [itemNotes, setItemNotes] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit');
  
  // Estados para o histórico de pedidos
  const [orderHistory, setOrderHistory] = useState([]);
  
  // Estado para ingredientes disponíveis para remoção (exemplo)
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  
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
          image: "/images/classic-burger.jpg",
          ingredients: [
            "Pão", "Hambúrguer", "Queijo", "Alface", "Tomate", "Cebola", "Molho especial"
          ]
        },
        {
          id: 2,
          name: "Hambúrguer de Frango",
          price: 22.90,
          category: "chicken",
          image: "/images/chicken-burger.jpg",
          ingredients: [
            "Pão", "Frango empanado", "Queijo", "Alface", "Tomate", "Maionese"
          ]
        },
        {
          id: 3,
          name: "Hambúrguer Vegetariano",
          price: 26.90,
          category: "vegetarian",
          image: "/images/veggie-burger.jpg",
          ingredients: [
            "Pão", "Hambúrguer de legumes", "Queijo", "Alface", "Tomate", "Cebola roxa", "Molho especial"
          ]
        },
        {
          id: 4,
          name: "Siri Especial",
          price: 32.90,
          category: "hamburger",
          image: "/images/special-burger.jpg",
          ingredients: [
            "Pão", "Hambúrguer duplo", "Queijo cheddar", "Bacon", "Cebola caramelizada", "Molho barbecue"
          ]
        },
        {
          id: 5,
          name: "Batata Frita",
          price: 14.90,
          category: "sides",
          image: "/images/fries.jpg",
          ingredients: ["Batata", "Sal"]
        },
        {
          id: 6,
          name: "Onion Rings",
          price: 16.90,
          category: "sides",
          image: "/images/onion-rings.jpg",
          ingredients: ["Cebola", "Farinha", "Temperos"]
        },
        {
          id: 7,
          name: "Refrigerante",
          price: 7.90,
          category: "drinks",
          image: "/images/soda.jpg",
          ingredients: []
        },
        {
          id: 8,
          name: "Milkshake",
          price: 15.90,
          category: "drinks",
          image: "/images/milkshake.jpg",
          ingredients: ["Leite", "Sorvete", "Calda"]
        },
        {
          id: 9,
          name: "Brownie com Sorvete",
          price: 18.90,
          category: "desserts",
          image: "/images/brownie.jpg",
          ingredients: ["Brownie", "Sorvete de baunilha", "Calda de chocolate"]
        },
        {
          id: 10,
          name: "Cheesecake",
          price: 16.90,
          category: "desserts",
          image: "/images/cheesecake.jpg",
          ingredients: ["Massa de biscoito", "Cream cheese", "Calda de frutas vermelhas"]
        }
      ];
      
      setProducts(productsData);
      
      // Verificar se há itens de pedido existentes para esta mesa
      const existingOrder = [
        {
          id: 4,
          name: "Siri Especial",
          price: 32.90,
          quantity: 1,
          notes: "Ponto médio da carne.",
          removedIngredients: ["Bacon"],
          status: "sent",
          sentAt: "20:35"
        },
        {
          id: 5,
          name: "Batata Frita",
          price: 14.90,
          quantity: 2,
          notes: "",
          removedIngredients: [],
          status: "sent",
          sentAt: "20:35"
        }
      ];
      
      setOrderItems(existingOrder);
      
      // Histórico de pedidos
      const historyData = [
        {
          timestamp: "20:35",
          status: "sent",
          description: "Pedido enviado para a cozinha"
        },
        {
          timestamp: "20:40",
          status: "preparing",
          description: "Pedido em preparação"
        }
      ];
      
      setOrderHistory(historyData);
    }, 500);
  }, [tableId]);
  
  // Atualizar total do pedido sempre que os itens forem alterados
  useEffect(() => {
    const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setOrderTotal(total);
  }, [orderItems]);
  
  // Filtrar produtos com base na categoria e pesquisa
  useEffect(() => {
    let filtered = [...products];
    
    // Filtrar por categoria
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [activeCategory, searchQuery, products]);
  
  // Carregar categorias da API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        // Adicionar a categoria 'Todos' no início
        const allCategories = [
          { id: 'all', name: 'Todos' },
          ...response.data.map(category => ({
            id: category._id,
            name: category.name
          }))
        ];
        setCategories(allCategories);
        setActiveCategory('all');
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Fallback para categorias padrão em caso de erro
        setCategories([
          { id: 'all', name: 'Todos' },
          { id: 'hamburger', name: 'Hambúrgueres' },
          { id: 'chicken', name: 'Frango' },
          { id: 'vegetarian', name: 'Vegetarianos' },
          { id: 'sides', name: 'Acompanhamentos' },
          { id: 'drinks', name: 'Bebidas' },
          { id: 'desserts', name: 'Sobremesas' },
        ]);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Opções de pagamento
  const paymentMethods = [
    { id: 'credit', label: 'Cartão de Crédito', icon: <FaCreditCard /> },
    { id: 'debit', label: 'Cartão de Débito', icon: <FaCreditCard /> },
    { id: 'cash', label: 'Dinheiro', icon: <FaCreditCard /> },
    { id: 'pix', label: 'PIX', icon: <FaCreditCard /> }
  ];
  
  // Manipuladores de eventos
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAddProduct = (product) => {
    // Verificar se o produto já está no pedido
    const existingItemIndex = orderItems.findIndex(item => 
      item.id === product.id && 
      !item.notes && 
      item.removedIngredients?.length === 0 &&
      item.status !== 'sent'
    );
    
    if (existingItemIndex !== -1) {
      // Se já estiver no pedido, incrementar a quantidade
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Se não estiver no pedido, adicionar com quantidade 1
      setOrderItems([...orderItems, { 
        ...product, 
        quantity: 1,
        notes: '',
        removedIngredients: [],
        status: 'pending'
      }]);
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
  
  const handleOpenNotesModal = (itemId) => {
    const item = orderItems.find(item => item.id === itemId);
    if (item && item.status === 'sent') {
      alert("Não é possível editar um item já enviado para a cozinha.");
      return;
    }
    
    setCurrentItemId(itemId);
    setItemNotes(item.notes || '');
    setShowNotesModal(true);
  };
  
  const handleSaveNotes = () => {
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === currentItemId ? { ...item, notes: itemNotes } : item
      )
    );
    setShowNotesModal(false);
  };
  
  const handleOpenCustomizationModal = (itemId) => {
    const item = orderItems.find(item => item.id === itemId);
    if (item && item.status === 'sent') {
      alert("Não é possível editar um item já enviado para a cozinha.");
      return;
    }
    
    const product = products.find(p => p.id === itemId);
    if (product && product.ingredients.length > 0) {
      setCurrentItemId(itemId);
      setAvailableIngredients(product.ingredients);
      setRemovedIngredients(item.removedIngredients || []);
      setShowCustomizationModal(true);
    } else {
      alert("Este produto não possui ingredientes para personalização.");
    }
  };
  
  const handleIngredientToggle = (ingredient) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(removedIngredients.filter(i => i !== ingredient));
    } else {
      setRemovedIngredients([...removedIngredients, ingredient]);
    }
  };
  
  const handleSaveCustomization = () => {
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === currentItemId ? { ...item, removedIngredients } : item
      )
    );
    setShowCustomizationModal(false);
  };
  
  const handleSendOrder = () => {
    // Verificar se há itens pendentes para enviar
    const pendingItems = orderItems.filter(item => item.status === 'pending');
    if (pendingItems.length === 0) {
      alert("Não há novos itens para enviar à cozinha.");
      return;
    }
    setShowSendOrderModal(true);
  };
  
  const confirmSendOrder = () => {
    // Aqui você enviaria os dados para o backend
    console.log("Enviando pedido:", orderItems.filter(item => item.status === 'pending'));
    
    // Atualizar status dos itens
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
                       
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.status === 'pending' ? { 
          ...item, 
          status: 'sent',
          sentAt: timeString
        } : item
      )
    );
    
    // Adicionar ao histórico
    setOrderHistory([
      ...orderHistory,
      {
        timestamp: timeString,
        status: "sent",
        description: "Novos itens enviados para a cozinha"
      }
    ]);
    
    setShowSendOrderModal(false);
  };
  
  const handlePayment = () => {
    setShowPaymentModal(true);
  };
  
  const confirmPayment = () => {
    // Lógica para processar pagamento
    console.log("Processando pagamento:", {
      total: orderTotal,
      method: selectedPaymentMethod
    });
    
    // Adicionar ao histórico
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
                       
    setOrderHistory([
      ...orderHistory,
      {
        timestamp: timeString,
        status: "completed",
        description: `Pagamento realizado via ${
          paymentMethods.find(m => m.id === selectedPaymentMethod)?.label
        }`
      }
    ]);
    
    setShowPaymentModal(false);
    
    // Após pagamento, voltar para a lista de mesas
    setTimeout(() => {
      alert("Pagamento processado com sucesso!");
      navigate('/tables');
    }, 500);
  };
  
  const handleBackClick = () => {
    navigate('/tables');
  };
  
  // Renderização condicional durante carregamento
  if (!table) {
    return (
      <Container>
        <div>Carregando dados da mesa...</div>
      </Container>
    );
  }
  
  // Determinar quais itens estão pendentes vs. enviados
  const pendingItems = orderItems.filter(item => item.status === 'pending');
  const sentItems = orderItems.filter(item => item.status === 'sent');
  
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
            <SearchContainer>
              <ProductSearchInput
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </SearchContainer>
            
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
            
            <MenuProductsGrid>
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
              
              {filteredProducts.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#666' }}>
                  Nenhum produto encontrado.
                </div>
              )}
            </MenuProductsGrid>
          </MenuSection>
          
          <OrderSection>
            <TabsContainer>
              <Tab active={true}>Comanda</Tab>
            </TabsContainer>
            
            <OrderTitle>Itens do Pedido</OrderTitle>
            
            <OrderItemsList>
              {orderItems.length === 0 ? (
                <EmptyOrder>
                  <FaUtensils size={32} />
                  <p>Nenhum item adicionado ao pedido.</p>
                </EmptyOrder>
              ) : (
                <>
                  {/* Itens pendentes */}
                  {pendingItems.length > 0 && (
                    <>
                      <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', fontWeight: '500' }}>
                        Novos Itens
                      </div>
                      {pendingItems.map(item => (
                        <OrderItem key={`pending-${item.id}`}>
                          <OrderItemHeader>
                            <OrderItemDetails>
                              <OrderItemName>
                                {item.name}
                                <OrderItemBadge 
                                  color="#FFF3CD" 
                                  textColor="#856404"
                                >
                                  Pendente
                                </OrderItemBadge>
                              </OrderItemName>
                              <OrderItemPrice>R$ {item.price.toFixed(2)}</OrderItemPrice>
                            </OrderItemDetails>
                          </OrderItemHeader>
                          
                          {/* Personalizações */}
                          {item.removedIngredients && item.removedIngredients.length > 0 && (
                            <OrderItemCustomizations>
                              <strong>Sem:</strong>
                              {item.removedIngredients.map((ingredient, idx) => (
                                <CustomizationItem key={idx}>
                                  {ingredient}
                                </CustomizationItem>
                              ))}
                            </OrderItemCustomizations>
                          )}
                          
                          {/* Observações */}
                          {item.notes && (
                            <OrderItemNotes>
                              <NoteIcon><FaStickyNote /></NoteIcon>
                              <span>{item.notes}</span>
                            </OrderItemNotes>
                          )}
                          
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
                            
                            <ItemActionButton onClick={() => handleOpenNotesModal(item.id)}>
                              <FaStickyNote size={12} />
                              Observações
                            </ItemActionButton>
                            
                            <ItemActionButton onClick={() => handleOpenCustomizationModal(item.id)}>
                              <FaEdit size={12} />
                              Personalizar
                            </ItemActionButton>
                            
                            <ItemActionButton onClick={() => handleRemoveItem(item.id)}>
                              <FaTrash size={12} />
                              Remover
                            </ItemActionButton>
                            
                            <OrderItemTotal>
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </OrderItemTotal>
                          </OrderItemActions>
                        </OrderItem>
                      ))}
                    </>
                  )}
                  
                  {/* Itens enviados */}
                  {sentItems.length > 0 && (
                    <>
                      <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', fontWeight: '500' }}>
                        Itens Enviados
                      </div>
                      {sentItems.map(item => (
                        <OrderItem key={`sent-${item.id}`}>
                          <OrderItemHeader>
                            <OrderItemDetails>
                              <OrderItemName>
                                {item.name}
                                <OrderItemBadge 
                                  color="#D4EDDA" 
                                  textColor="#155724"
                                >
                                  Enviado {item.sentAt}
                                </OrderItemBadge>
                              </OrderItemName>
                              <OrderItemPrice>R$ {item.price.toFixed(2)}</OrderItemPrice>
                            </OrderItemDetails>
                          </OrderItemHeader>
                          
                          {/* Personalizações */}
                          {item.removedIngredients && item.removedIngredients.length > 0 && (
                            <OrderItemCustomizations>
                              <strong>Sem:</strong>
                              {item.removedIngredients.map((ingredient, idx) => (
                                <CustomizationItem key={idx}>
                                  {ingredient}
                                </CustomizationItem>
                              ))}
                            </OrderItemCustomizations>
                          )}
                          
                          {/* Observações */}
                          {item.notes && (
                            <OrderItemNotes>
                              <NoteIcon><FaStickyNote /></NoteIcon>
                              <span>{item.notes}</span>
                            </OrderItemNotes>
                          )}
                          
                          <OrderItemActions>
                            <QuantityValue>{item.quantity}</QuantityValue>
                            <OrderItemTotal>
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </OrderItemTotal>
                          </OrderItemActions>
                        </OrderItem>
                      ))}
                    </>
                  )}
                </>
              )}
            </OrderItemsList>
            
            <OrderFooter>
              <OrderSummary>
                <SummaryRow>
                  <span>Subtotal</span>
                  <span>R$ {orderTotal.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Taxa de Serviço (10%)</span>
                  <span>R$ {(orderTotal * 0.1).toFixed(2)}</span>
                </SummaryRow>
                <TotalRow>
                  <span>Total</span>
                  <span>R$ {(orderTotal * 1.1).toFixed(2)}</span>
                </TotalRow>
              </OrderSummary>
              
              <OrderActions>
                <OrderButton 
                  primary
                  onClick={handleSendOrder}
                  disabled={pendingItems.length === 0}
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
              
              {/* Histórico do Pedido */}
              {orderHistory.length > 0 && (
                <OrderHistory>
                  <OrderHistoryTitle>Histórico do Pedido</OrderHistoryTitle>
                  {orderHistory.map((event, index) => (
                    <OrderHistoryItem key={index}>
                      <span>{event.description}</span>
                      <OrderHistoryStatus status={event.status}>
                        {event.timestamp}
                      </OrderHistoryStatus>
                    </OrderHistoryItem>
                  ))}
                </OrderHistory>
              )}
            </OrderFooter>
          </OrderSection>
        </OrderGrid>
      </Container>
      
      {/* Modal de Observações */}
      {showNotesModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Observações</ModalTitle>
              <CloseButton onClick={() => setShowNotesModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <FormLabel>Adicione instruções especiais para este item:</FormLabel>
              <TextArea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Ex: Sem cebola, molho à parte, etc."
              />
            </FormGroup>
            
            <ModalActions>
              <ModalButton onClick={() => setShowNotesModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton primary onClick={handleSaveNotes}>
                Salvar
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
      
      {/* Modal de Personalização */}
      {showCustomizationModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Personalizar Item</ModalTitle>
              <CloseButton onClick={() => setShowCustomizationModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <FormLabel>Remover ingredientes:</FormLabel>
              <CheckboxGroup>
                {availableIngredients.map((ingredient, index) => (
                  <CheckboxItem key={index}>
                    <Checkbox
                      type="checkbox"
                      checked={removedIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                    />
                    {ingredient}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </FormGroup>
            
            <ModalActions>
              <ModalButton onClick={() => setShowCustomizationModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton primary onClick={handleSaveCustomization}>
                Confirmar
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
      
      {/* Modal de Confirmação de Envio */}
      {showSendOrderModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirmar Pedido</ModalTitle>
              <CloseButton onClick={() => setShowSendOrderModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalText>
              Deseja enviar {pendingItems.length} {pendingItems.length === 1 ? 'item' : 'itens'} para a cozinha? 
              Esta ação não pode ser desfeita e os itens não poderão ser modificados após o envio.
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
        </Modal>
      )}
      
      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Pagamento</ModalTitle>
              <CloseButton onClick={() => setShowPaymentModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <FormLabel>Valor total a pagar:</FormLabel>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                R$ {(orderTotal * 1.1).toFixed(2)}
              </div>
              
              <FormLabel>Forma de pagamento:</FormLabel>
              <RadioGroup>
                {paymentMethods.map(method => (
                  <RadioItem 
                    key={method.id}
                    selected={selectedPaymentMethod === method.id}
                  >
                    <Radio
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                    />
                    <PaymentIcon>{method.icon}</PaymentIcon>
                    {method.label}
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>
            
            <ModalActions>
              <ModalButton onClick={() => setShowPaymentModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton primary onClick={confirmPayment}>
                Finalizar Pagamento
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Order;