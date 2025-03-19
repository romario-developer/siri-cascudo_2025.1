import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Importar reducers (a serem criados posteriormente)
// import authReducer from './reducers/authReducer';
// import menuReducer from './reducers/menuReducer';
// import cartReducer from './reducers/cartReducer';
// import orderReducer from './reducers/orderReducer';

// Reducers placeholder
const authReducer = (state = { user: null, isAuthenticated: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const menuReducer = (state = { items: [], loading: false, error: null }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const cartReducer = (state = { items: [], total: 0 }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const orderReducer = (state = { orders: [], currentOrder: null, loading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Combinar todos os reducers
const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  cart: cartReducer,
  order: orderReducer,
});

// Criar store com middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;