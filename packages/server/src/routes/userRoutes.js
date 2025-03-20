const express = require('express');
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  updatePassword, 
  deleteUser 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação e permissão de administrador
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);

router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/password').put(updatePassword);

module.exports = router;