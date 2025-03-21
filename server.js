const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware personalizado para atualizar itens do pedido
server.use(jsonServer.bodyParser);
server.put('/api/orders/:id/items', (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const { itemIds, status } = req.body;
  
  // Encontra o pedido
  const order = db.get('orders').find({ id: parseInt(id) }).value();
  
  if (!order) {
    return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
  }
  
  // Atualiza o status dos itens
  let updated = false;
  const updatedItems = order.items.map(item => {
    if (itemIds.includes(item.id)) {
      updated = true;
      return { ...item, status };
    }
    return item;
  });
  
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Itens não encontrados' });
  }
  
  // Atualiza o pedido no banco de dados
  db.get('orders')
    .find({ id: parseInt(id) })
    .assign({ items: updatedItems })
    .write();
  
  const updatedOrder = db.get('orders').find({ id: parseInt(id) }).value();
  
  return res.json({
    success: true,
    data: updatedOrder
  });
});

// Usar rotas padrão para outras requisições
server.use(middlewares);
server.use('/api', router);

// Iniciar servidor
server.listen(5001, () => {
  console.log('JSON Server está rodando em http://localhost:5000');
});