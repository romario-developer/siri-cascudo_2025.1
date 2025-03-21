import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaPlus, FaMinus, FaCheck, FaTimes } from 'react-icons/fa';
import { addItem } from '../store/reducers/cartSlice';

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  height: 160px;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x160?text=Sem+Imagem'});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProductAvailability = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.available ? '#4CAF50' : '#F44336'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const ProductInfo = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem;
  flex: 1;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #D32F2F;
  margin-top: auto;
`;

const ProductIngredients = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin: 0.5rem 0;
`;

const AddButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #43A047;
  }
`;

// Modal para personalização do produto
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #D32F2F;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  color: #666;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityText = styled.span`
  margin: 0 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
`;

const IngredientsSection = styled.div`
  margin: 1rem 0;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.5rem;
`;

const IngredientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const IngredientItem = styled.div`
  display: flex;
  align-items: center;
`;

const IngredientCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const NotesInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 0.75rem;
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
  margin-top: 1rem;
  
  &:hover {
    background-color: #43A047;
  }
`;

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [removedIngredients, setRemovedIngredients] = useState([]);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setQuantity(1);
    setNotes('');
    setRemovedIngredients([]);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleAddToCart = () => {
    dispatch(addItem({
      product,
      quantity,
      notes,
      removedIngredients
    }));
    handleCloseModal();
  };
  
  const handleIngredientToggle = (ingredient) => {
    setRemovedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(item => item !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };
  
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  return (
    <>
      <ProductCard>
        <ProductImage src={product.imageUrl}>
          {!product.isAvailable && (
            <ProductAvailability available={false}>Indisponível</ProductAvailability>
          )}
        </ProductImage>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
          <AddButton onClick={handleOpenModal} disabled={!product.isAvailable}>
            <FaPlus /> Adicionar
          </AddButton>
        </ProductInfo>
      </ProductCard>
      
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Personalizar Pedido</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <h4>{product.name}</h4>
            <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
            
            <QuantityControl>
              <QuantityButton 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </QuantityButton>
              <QuantityText>{quantity}</QuantityText>
              <QuantityButton onClick={() => setQuantity(prev => prev + 1)}>
                <FaPlus />
              </QuantityButton>
            </QuantityControl>
            
            {product.ingredients && product.ingredients.length > 0 && (
              <IngredientsSection>
                <SectionTitle>Ingredientes (remover):</SectionTitle>
                <IngredientsList>
                  {product.ingredients.map((ingredient, index) => (
                    <IngredientItem key={index}>
                      <IngredientCheckbox 
                        type="checkbox" 
                        id={`ingredient-${index}`}
                        checked={removedIngredients.includes(ingredient)}
                        onChange={() => handleIngredientToggle(ingredient)}
                      />
                      <label htmlFor={`ingredient-${index}`}>{ingredient}</label>
                    </IngredientItem>
                  ))}
                </IngredientsList>
              </IngredientsSection>
            )}
            
            <SectionTitle>Observações:</SectionTitle>
            <NotesInput 
              placeholder="Ex: Ponto da carne, preferências, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            <ConfirmButton onClick={handleAddToCart}>
              <FaCheck /> Adicionar ao Pedido
            </ConfirmButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ProductItem;