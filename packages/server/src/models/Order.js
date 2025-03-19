const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  removedIngredients: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'sent', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  readyAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  waiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  paymentMethod: {
    type: String,
    enum: ['credit', 'debit', 'cash', 'pix'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Gerar número único para o pedido antes de salvar
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Formato: ANO + MÊS + DIA + 4 dígitos sequenciais
    const date = new Date();
    const prefix = date.getFullYear().toString().slice(-2) + 
                  (date.getMonth() + 1).toString().padStart(2, '0') + 
                  date.getDate().toString().padStart(2, '0');
    
    // Encontrar o último pedido para gerar um número sequencial
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    
    let counter = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastCounter = parseInt(lastOrder.orderNumber.slice(-4));
      if (!isNaN(lastCounter)) {
        counter = lastCounter + 1;
      }
    }
    
    this.orderNumber = prefix + counter.toString().padStart(4, '0');
  }
  
  next();
});

module.exports = mongoose.model('Order', OrderSchema);