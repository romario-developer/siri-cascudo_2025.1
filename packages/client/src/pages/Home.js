import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUtensils, FaMotorcycle, FaAward } from 'react-icons/fa';

const HeroSection = styled.section`
  position: relative;
  height: 70vh;
  min-height: 500px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('/images/hero-burger.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin: -${props => props.theme.spacing.large} -${props => props.theme.spacing.medium} 0;
  padding: 0 ${props => props.theme.spacing.medium};
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroText = styled.p`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.large};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.medium};
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-decoration: none;
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: #e5b100;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: ${props => props.theme.fontSizes.xxlarge};
  margin: ${props => props.theme.spacing.xlarge} 0 ${props => props.theme.spacing.large};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: ${props => props.theme.colors.primary};
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.large};
  margin: ${props => props.theme.spacing.xlarge} 0;
`;

const FeatureCard = styled.div`
  flex: 1;
  min-width: 250px;
  text-align: center;
  padding: ${props => props.theme.spacing.large};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  background-color: white;
  transition: transform ${props => props.theme.transitions.medium};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.small};
`;

const PopularItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.large};
  margin: ${props => props.theme.spacing.xlarge} 0;
`;

const ItemCard = styled.div`
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: transform ${props => props.theme.transitions.medium};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ItemImage = styled.div`
  height: 200px;
  background-color: #f0f0f0;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const ItemContent = styled.div`
  padding: ${props => props.theme.spacing.medium};
  background-color: white;
`;

const ItemTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.xsmall};
`;

const ItemPrice = styled.div`
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.medium};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.small};
`;

const ItemDescription = styled.p`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const ViewAllContainer = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing.large} 0;
`;

const ViewAllButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const Home = () => {
  // Dados de exemplo para os itens populares (serão substituídos por dados reais da API)
  const popularItems = [
    {
      id: 1,
      name: "Hambúrguer Clássico",
      price: 24.90,
      description: "Pão, hambúrguer, queijo, alface, tomate e molho especial.",
      image: "/images/classic-burger.jpg"
    },
    {
      id: 2,
      name: "Hambúrguer de Frango",
      price: 22.90,
      description: "Pão, frango empanado, queijo, alface, tomate e maionese.",
      image: "/images/chicken-burger.jpg"
    },
    {
      id: 3,
      name: "Hambúrguer Vegetariano",
      price: 26.90,
      description: "Pão, hambúrguer de legumes, queijo, alface, tomate e molho especial.",
      image: "/images/veggie-burger.jpg"
    },
    {
      id: 4,
      name: "Siri Especial",
      price: 32.90,
      description: "Pão, hambúrguer duplo, queijo cheddar, bacon, cebola caramelizada e molho barbecue.",
      image: "/images/special-burger.jpg"
    }
  ];

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Bem-vindo ao Siri Cascudo</HeroTitle>
          <HeroText>Experimente os melhores hambúrgueres da cidade. Feitos com ingredientes frescos e de alta qualidade.</HeroText>
          <CTAButton to="/menu">Ver Cardápio</CTAButton>
        </HeroContent>
      </HeroSection>

      <SectionTitle>Por que escolher o Siri Cascudo?</SectionTitle>
      <FeaturesContainer>
        <FeatureCard>
          <FeatureIcon><FaUtensils /></FeatureIcon>
          <FeatureTitle>Ingredientes de Qualidade</FeatureTitle>
          <p>Utilizamos apenas ingredientes frescos e de alta qualidade em todos os nossos produtos.</p>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon><FaMotorcycle /></FeatureIcon>
          <FeatureTitle>Entrega Rápida</FeatureTitle>
          <p>Entregamos seu pedido em até 30 minutos ou o próximo hambúrguer é por nossa conta.</p>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon><FaAward /></FeatureIcon>
          <FeatureTitle>Premiado</FeatureTitle>
          <p>Eleito o melhor hambúrguer da cidade por 3 anos consecutivos.</p>
        </FeatureCard>
      </FeaturesContainer>

      <SectionTitle>Mais Populares</SectionTitle>
      <PopularItemsContainer>
        {popularItems.map(item => (
          <ItemCard key={item.id}>
            <ItemImage image={item.image} />
            <ItemContent>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemPrice>R$ {item.price.toFixed(2)}</ItemPrice>
              <ItemDescription>{item.description}</ItemDescription>
              <ViewAllButton as={Link} to={`/menu/${item.id}`}>Ver Detalhes</ViewAllButton>
            </ItemContent>
          </ItemCard>
        ))}
      </PopularItemsContainer>

      <ViewAllContainer>
        <ViewAllButton to="/menu">Ver Cardápio Completo</ViewAllButton>
      </ViewAllContainer>
    </>
  );
};

export default Home;