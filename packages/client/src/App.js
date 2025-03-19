import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Importações de componentes e páginas
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/menu" element={
          <Layout>
            <Menu />
          </Layout>
        } />
        <Route path="/cart" element={
          <Layout>
            <Cart />
          </Layout>
        } />
        <Route path="/checkout" element={
          <Layout>
            <div>Checkout (placeholder)</div>
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <div>Perfil do Usuário (placeholder)</div>
          </Layout>
        } />
        <Route path="/status" element={
          <Layout>
            <div>Status do Pedido (placeholder)</div>
          </Layout>
        } />
        <Route path="*" element={
          <Layout>
            <div>404 - Página Não Encontrada</div>
          </Layout>
        } />
      </Routes>
    </AppContainer>
  );
}

export default App;