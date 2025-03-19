import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

// Importações de páginas
import Login from './pages/Login';
import Tables from './pages/Tables';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('waiterToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tables" element={
          <ProtectedRoute>
            <Tables />
          </ProtectedRoute>
        } />
        <Route path="/order/:tableId" element={
          <ProtectedRoute>
            <div>Página de Pedido (placeholder)</div>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <div>Histórico de Pedidos (placeholder)</div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </AppContainer>
  );
}

export default App;