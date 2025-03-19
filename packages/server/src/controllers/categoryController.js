const Category = require('../models/Category');

// @desc    Obter todas as categorias
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('order');
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter categorias' });
  }
};

// @desc    Obter uma categoria por ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erro ao obter categoria:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter categoria' });
  }
};

// @desc    Criar uma nova categoria
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, order } = req.body;
    
    // Verificar se a categoria já existe
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Uma categoria com este nome já existe' });
    }
    
    const category = await Category.create({
      name,
      description,
      imageUrl,
      order
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar categoria' });
  }
};

// @desc    Atualizar uma categoria
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, order, isActive } = req.body;
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    
    // Verificar se o nome já está em uso por outra categoria
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        return res.status(400).json({ success: false, message: 'Uma categoria com este nome já existe' });
      }
    }
    
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl, order, isActive },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar categoria' });
  }
};

// @desc    Excluir uma categoria
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    
    // Soft delete - apenas marca como inativo
    category.isActive = false;
    await category.save();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir categoria' });
  }
};