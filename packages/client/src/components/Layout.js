import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const Main = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large} ${props => props.theme.spacing.medium};
  min-height: calc(100vh - 180px);
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;