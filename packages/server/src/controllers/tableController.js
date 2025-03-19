const Table = require('../models/Table');
const Order = require('../models/Order');

// @desc    Obter todas as mesas
// @route   GET /api/tables
// @access  Private/Waiter
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true })
      .populate('waiter', 'name')
      .populate('currentOrder')
      .sort('number');
    
    res.json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    console.error('Erro ao obter mesas:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter mesas' });
  }
};

// @desc    Obter uma mesa por ID
// @route   GET /api/tables/:id
// @access  Private/Waiter
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
      .populate('waiter', 'name')
      .populate({
        path: 'currentOrder',
        populate: {
          path: 'items.product',
          select: 'name price imageUrl ingredients'
        }
      });
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }
    
    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Erro ao obter mesa:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter mesa' });
  }
};

// @desc    Criar uma nova mesa
// @route   POST /api/tables
// @access  Private/Admin
exports.createTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;
    
    // Verificar se o número da mesa já existe
    const tableExists = await Table.findOne({ number });
    if (tableExists) {
      return res.status(400).json({ success: false, message: 'Uma mesa com este número já existe' });
    }
    
    const table = await Table.create({
      number,
      capacity
    });
    
    res.status(201).json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Erro ao criar mesa:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar mesa' });
  }
};

// @desc    Atualizar uma mesa
// @route   PUT /api/tables/:id
// @access  Private/Admin or Waiter
exports.updateTable = async (req, res) => {
  try {
    const { status, currentCustomers, waiter } = req.body;
    
    let table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }
    
    // Se estiver atualizando para "ocupada", registrar a hora
    const occupied_at = status === 'occupied' && table.status !== 'occupied' ? 
      new Date() : table.occupied_at;
    
    table = await Table.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        currentCustomers, 
        waiter: waiter || req.user._id, 
        occupied_at 
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Erro ao atualizar mesa:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar mesa' });
  }
};

// @desc    Excluir uma mesa
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }
    
    // Verificar se a mesa tem um pedido ativo
    if (table.currentOrder) {
      return res.status(400).json({ 
        success: false, 
        message: 'Esta mesa tem um pedido ativo. Finalize o pedido antes de excluir a mesa.' 
      });
    }
    
    // Soft delete
    table.isActive = false;
    await table.save();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erro ao excluir mesa:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir mesa' });
  }
};