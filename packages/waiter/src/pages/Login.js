import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2.5rem 2rem;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #D32F2F;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  color: #666;
  margin: 0.5rem 0 0;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #D32F2F;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background-color: #D32F2F;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #b81c1c;
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #D32F2F;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ForgotPassword = styled.a`
  display: block;
  text-align: center;
  color: #666;
  margin-top: 1.5rem;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulação de uma chamada à API de autenticação
      // Aqui, você implementará a integração real com seu backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Credenciais de teste
      if (username === 'admin' && password === 'admin') {
        // Armazenar token (ou dados de usuário) no localStorage
        localStorage.setItem('waiterToken', 'fake-jwt-token');
        localStorage.setItem('waiterName', 'Admin');
        
        // Redirecionar para a página de mesas
        navigate('/tables');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente mais tarde.');
      console.error('Erro de login:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LogoContainer>
          <Logo>Siri Cascudo</Logo>
          <Subtitle>Comanda Garçom</Subtitle>
        </LogoContainer>
        
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Icon><FaUser /></Icon>
            <Input 
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>
          
          <FormGroup>
            <Icon><FaLock /></Icon>
            <Input 
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <LoginButton type="submit" disabled={isLoading}>
            <FaSignInAlt />
            {isLoading ? 'Entrando...' : 'Entrar'}
          </LoginButton>
        </LoginForm>
        
        <ForgotPassword href="#">Esqueceu sua senha?</ForgotPassword>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;