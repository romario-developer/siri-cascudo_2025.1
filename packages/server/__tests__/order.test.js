const request = require('supertest');
const app = require('../src/app');
const Order = require('../src/models/Order');

jest.mock('../src/models/Order');

describe('Order Flow', () => {
  beforeEach(() => {
    Order.mockClear();
  });

  test('Criar novo pedido', async () => {
    const mockOrder = {
      _id: 'order123',
      items: [{ item: 'Hambúrguer', quantity: 2 }],
      status: 'recebido'
    };
    
    Order.prototype.save = jest.fn().mockResolvedValue(mockOrder);

    const response = await request(app)
      .post('/api/orders')
      .send(mockOrder);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('recebido');
  });

  test('Atualizar status do pedido', async () => {
    const mockOrder = {
      _id: 'order123',
      status: 'em_preparo',
      save: jest.fn().mockResolvedValue(true)
    };

    Order.findById.mockResolvedValue(mockOrder);

    const response = await request(app)
      .patch('/api/orders/order123')
      .send({ status: 'pronto' });

    expect(response.statusCode).toBe(200);
    expect(mockOrder.status).toBe('pronto');
  });
});