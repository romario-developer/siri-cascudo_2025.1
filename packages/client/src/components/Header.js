import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.secondary};
  font-size: ${props => props.theme.fontSizes.xlarge};
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.primary};
    padding: 1rem;
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: all ${props => props.theme.transitions.fast};
  border-radius: ${props => props.theme.borderRadius.small};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CartCount = styled.span`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 50%;
  font-weight: bold;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Mock cart items count (will be replaced with real data from Redux store)
  const cartItemsCount = 2;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <Logo to="/">Siri Cascudo</Logo>
      
      <MobileMenuButton onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
      
      <NavItems isOpen={mobileMenuOpen}>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/menu">Cardápio</NavLink>
        <NavLink to="/about">Sobre</NavLink>
        <IconLink to="/cart">
          <FaShoppingCart /> Carrinho
          {cartItemsCount > 0 && <CartCount>{cartItemsCount}</CartCount>}
        </IconLink>
        <IconLink to="/profile">
          <FaUser /> Perfil
        </IconLink>
      </NavItems>
    </HeaderContainer>
  );
};

export default Header;