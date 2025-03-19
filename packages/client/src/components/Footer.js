import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.text};
  color: white;
  padding: ${props => props.theme.spacing.large} ${props => props.theme.spacing.medium};
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.secondary};
`;

const FooterLink = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: ${props => props.theme.spacing.small};
  transition: color ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: ${props => props.theme.spacing.medium};
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: color ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.large};
  padding-top: ${props => props.theme.spacing.medium};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>Siri Cascudo</SectionTitle>
          <p>Os melhores hambúrgueres da cidade, com ingredientes de qualidade e sabor incomparável.</p>
          <SocialLinks>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Links Úteis</SectionTitle>
          <FooterLink to="/">Início</FooterLink>
          <FooterLink to="/menu">Cardápio</FooterLink>
          <FooterLink to="/about">Sobre Nós</FooterLink>
          <FooterLink to="/contact">Contato</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Horário de Funcionamento</SectionTitle>
          <p>Segunda a Sexta: 11h às 23h</p>
          <p>Sábados e Domingos: 11h às 00h</p>
          <p>Feriados: 12h às 22h</p>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Contato</SectionTitle>
          <ContactItem>
            <FaMapMarkerAlt />
            <span>Rua Fenda do Biquíni, 123</span>
          </ContactItem>
          <ContactItem>
            <FaPhone />
            <span>(11) 91234-5678</span>
          </ContactItem>
          <ContactItem>
            <FaEnvelope />
            <span>contato@siricascudo.com</span>
          </ContactItem>
        </FooterSection>
      </FooterContent>

      <Copyright>
        &copy; {currentYear} Siri Cascudo. Todos os direitos reservados.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;