// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    let error = { ...err };
    error.message = err.message;
  
    // Erro de ID de MongoDB inválido
    if (err.name === 'CastError') {
      const message = `Recurso não encontrado com id ${err.value}`;
      error = new Error(message);
      error.statusCode = 404;
    }
  
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = new Error(message);
      error.statusCode = 400;
    }
  
    // Erro de chave duplicada do MongoDB
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      const message = `Valor duplicado: ${field}=${value}. Por favor, use outro valor.`;
      error = new Error(message);
      error.statusCode = 400;
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  };
  
  module.exports = errorHandler;