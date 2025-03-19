const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, available, search } = req.query;
    
    // Construir o filtro
    const filter = { isAvailable: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featuredItem = true;
    }
    
    if (available === 'false') {
      filter.isAvailable = false;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter produtos' });
  }
};

// @desc    Obter um produto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter produto' });
  }
};

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      imageUrl, 
      ingredients, 
      isAvailable, 
      preparationTime, 
      featuredItem 
    } = req.body;
    
    // Verificar se a categoria existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Categoria inválida' });
    }
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      ingredients,
      isAvailable,
      preparationTime,
      featuredItem
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar produto' });
  }
};

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      imageUrl, 
      ingredients, 
      isAvailable, 
      preparationTime, 
      featuredItem 
    } = req.body;
    
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    // Verificar se a categoria existe, se fornecida
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Categoria inválida' });
      }
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        price, 
        category, 
        imageUrl, 
        ingredients, 
        isAvailable, 
        preparationTime, 
        featuredItem 
      },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto' });
  }
};

// @desc    Excluir um produto
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    // Hard delete
    await product.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
  }
};