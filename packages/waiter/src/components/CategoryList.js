import React from 'react';
import styled from 'styled-components';

const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? '#D32F2F' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#D32F2F' : '#ddd'};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  white-space: nowrap;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#C62828' : '#f5f5f5'};
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const CategoryList = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <CategoriesContainer>
      <CategoryButton 
        active={!activeCategory} 
        onClick={() => onSelectCategory(null)}
      >
        Todos
      </CategoryButton>
      
      {categories.map(category => (
        <CategoryButton
          key={category._id}
          active={activeCategory === category._id}
          onClick={() => onSelectCategory(category._id)}
        >
          {category.name}
        </CategoryButton>
      ))}
    </CategoriesContainer>
  );
};

export default CategoryList;