const express = require('express');
const { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  updateOrderItems,
  cancelOrder 
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin', 'waiter'), getOrders)
  .post(protect, authorize('admin', 'waiter'), createOrder);

router
  .route('/:id')
  .get(protect, authorize('admin', 'waiter'), getOrderById)
  .put(protect, authorize('admin', 'waiter'), updateOrder)
  .delete(protect, authorize('admin', 'waiter'), cancelOrder);

router
  .route('/:id/items')
  .put(protect, authorize('admin', 'waiter'), updateOrderItems);

module.exports = router;