import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import App from './App';
import theme from './styles/theme';
import GlobalStyle from './styles/global';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './store/reducers/cartSlice';
import orderReducer from './store/reducers/orderSlice';

// Configurar o store com Redux Toolkit
const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);