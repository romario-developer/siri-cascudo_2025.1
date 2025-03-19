const Order = require('../models/Order');
const Table = require('../models/Table');
const Product = require('../models/Product');

// @desc    Obter todos os pedidos
// @route   GET /api/orders
// @access  Private/Waiter
exports.getOrders = async (req, res) => {
  try {
    const { status, waiter, table, date } = req.query;
    
    const filter = {};
    
    // Filtros
    if (status) {
      filter.status = status;
    }
    
    if (waiter) {
      filter.waiter = waiter;
    } else if (req.user.role === 'waiter') {
      // Se for garçom, mostrar apenas seus pedidos
      filter.waiter = req.user._id;
    }
    
    if (table) {
      filter.table = table;
    }
    
    // Filtro por data (hoje)
    if (date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.createdAt = { $gte: today };
    }
    
    const orders = await Order.find(filter)
      .populate('table', 'number')
      .populate('waiter', 'name')
      .populate('customer', 'name')
      .populate('items.product', 'name price')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Erro ao obter pedidos:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter pedidos' });
  }
};

// @desc    Obter um pedido por ID
// @route   GET /api/orders/:id
// @access  Private/Waiter
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table', 'number')
      .populate('waiter', 'name')
      .populate('customer', 'name')
      .populate('items.product', 'name price imageUrl ingredients');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    
    // Verificar permissão (apenas o garçom responsável ou admin)
    if (req.user.role === 'waiter' && order.waiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para visualizar este pedido' 
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter pedido' });
  }
};

// @desc    Criar um novo pedido
// @route   POST /api/orders
// @access  Private/Waiter
exports.createOrder = async (req, res) => {
  try {
    const { tableId, items, notes } = req.body;
    
    // Verificar se a mesa existe e está disponível
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }
    
    if (table.status !== 'available' && table.status !== 'occupied') {
      return res.status(400).json({ 
        success: false, 
        message: `Mesa não disponível. Status atual: ${table.status}` 
      });
    }
    
    // Verificar se todos os produtos existem e calcular totais
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Produto não encontrado: ${item.productId}` 
        });
      }
      
      if (!product.isAvailable) {
        return res.status(400).json({ 
          success: false, 
          message: `Produto indisponível: ${product.name}` 
        });
      }
      
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
        notes: item.notes || '',
        removedIngredients: item.removedIngredients || []
      });
    }
    
    // Calcular taxa de serviço (10%)
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;
    
    // Criar o pedido
    const order = await Order.create({
      table: tableId,
      waiter: req.user._id,
      items: orderItems,
      subtotal,
      serviceFee,
      total,
      notes
    });
    
    // Atualizar o status da mesa para 'occupied' e vincular o pedido
    await Table.findByIdAndUpdate(tableId, {
      status: 'occupied',
      currentOrder: order._id,
      waiter: req.user._id,
      occupied_at: new Date()
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar pedido' });
  }
};

// @desc    Atualizar um pedido (adicionar itens ou atualizar status)
// @route   PUT /api/orders/:id
// @access  Private/Waiter
exports.updateOrder = async (req, res) => {
  try {
    const { items, status, paymentMethod, notes } = req.body;
    
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    
    // Verificar permissão (apenas o garçom responsável ou admin)
    if (req.user.role === 'waiter' && order.waiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para atualizar este pedido' 
      });
    }
    
    // Atualizar itens se fornecidos
    if (items && items.length > 0) {
      // Processar apenas novos itens
      const newItems = [];
      let subtotalAdded = 0;
      
      for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          return res.status(404).json({ 
            success: false, 
            message: `Produto não encontrado: ${item.productId}` 
          });
        }
        
        if (!product.isAvailable) {
          return res.status(400).json({ 
            success: false, 
            message: `Produto indisponível: ${product.name}` 
          });
        }
        
        const itemPrice = product.price;
        const itemTotal = itemPrice * item.quantity;
        subtotalAdded += itemTotal;
        
        newItems.push({
          product: product._id,
          quantity: item.quantity,
          price: itemPrice,
          notes: item.notes || '',
          removedIngredients: item.removedIngredients || [],
          status: 'pending'
        });
      }
      
      // Atualizar totais
      const newSubtotal = order.subtotal + subtotalAdded;
      const newServiceFee = newSubtotal * 0.1;
      const newTotal = newSubtotal + newServiceFee;
      
      // Adicionar novos itens ao pedido existente
      order.items.push(...newItems);
      order.subtotal = newSubtotal;
      order.serviceFee = newServiceFee;
      order.total = newTotal;
    }
    
    // Atualizar status do pedido se fornecido
    if (status) {
      order.status = status;
      
      // Se o pedido for concluído ou cancelado
      if (status === 'completed' || status === 'cancelled') {
        order.completedAt = new Date();
        
        // Atualizar mesa
        if (order.table) {
          await Table.findByIdAndUpdate(order.table, {
            status: 'available',
            currentOrder: null,
            currentCustomers: 0
          });
        }
      }
    }
    
    // Atualizar método de pagamento se fornecido
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
      order.paymentStatus = 'paid';
    }
    
    // Atualizar notas se fornecidas
    if (notes) {
      order.notes = notes;
    }
    
    await order.save();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar pedido' });
  }
};

// @desc    Atualizar o status de itens do pedido
// @route   PUT /api/orders/:id/items
// @access  Private/Waiter
exports.updateOrderItems = async (req, res) => {
  try {
    const { itemIds, status } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Forneça uma lista de IDs de itens para atualizar' 
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    
    // Verificar permissão (apenas o garçom responsável ou admin)
    if (req.user.role === 'waiter' && order.waiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para atualizar este pedido' 
      });
    }
    
    // Atualizar status dos itens
    let updated = false;
    
    order.items.forEach(item => {
      if (itemIds.includes(item._id.toString())) {
        item.status = status;
        
        // Registrar timestamp conforme o status
        if (status === 'sent') {
          item.sentAt = new Date();
        } else if (status === 'ready') {
          item.readyAt = new Date();
        } else if (status === 'delivered') {
          item.deliveredAt = new Date();
        }
        
        updated = true;
      }
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Itens não encontrados no pedido' });
    }
    
    await order.save();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao atualizar itens do pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar itens do pedido' });
  }
};

// @desc    Cancelar um pedido
// @route   DELETE /api/orders/:id
// @access  Private/Waiter
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    
    // Verificar permissão (apenas o garçom responsável ou admin)
    if (req.user.role === 'waiter' && order.waiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para cancelar este pedido' 
      });
    }
    
    // Verificar se o pedido já está concluído
    if (order.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Não é possível cancelar um pedido já concluído' 
      });
    }
    
    // Atualizar status do pedido
    order.status = 'cancelled';
    order.completedAt = new Date();
    await order.save();
    
    // Atualizar mesa
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, {
        status: 'available',
        currentOrder: null,
        currentCustomers: 0
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao cancelar pedido' });
  }
};