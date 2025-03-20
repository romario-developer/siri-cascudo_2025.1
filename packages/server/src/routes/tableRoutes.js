const express = require('express');
const { 
  getTables, 
  getTableById, 
  createTable, 
  updateTable, 
  deleteTable 
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin', 'waiter'), getTables)
  .post(protect, authorize('admin'), createTable);

router
  .route('/:id')
  .get(protect, authorize('admin', 'waiter'), getTableById)
  .put(protect, authorize('admin', 'waiter'), updateTable)
  .delete(protect, authorize('admin'), deleteTable);

module.exports = router;