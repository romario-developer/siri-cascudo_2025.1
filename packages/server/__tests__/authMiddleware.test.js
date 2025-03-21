const { protect, authorize } = require('../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');

jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

describe('Auth Middleware', () => {
  let mockRequest, mockResponse, nextFunction;

  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  test('deve retornar erro 401 sem token', async () => {
    await protect(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });

  test('deve adicionar usuário ao request com token válido', async () => {
    mockRequest.headers.authorization = 'Bearer valid.token';
    jwt.verify.mockReturnValue({ id: 'user123' });
    User.findById.mockResolvedValue({ _id: 'user123', name: 'Test User' });

    await protect(mockRequest, mockResponse, nextFunction);
    expect(mockRequest.user).toBeDefined();
    expect(nextFunction).toHaveBeenCalled();
  });
});