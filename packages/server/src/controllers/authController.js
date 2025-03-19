const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Usuário já existe' });
    }

    // Criar o usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'waiter' // Default para 'waiter' se não for especificado
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } else {
      res.status(400).json({ success: false, message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ success: false, message: 'Erro ao registrar usuário' });
  }
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, forneça email e senha' });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Verificar se a senha corresponde
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Conta desativada' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erro ao login:', error);
    res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
};

// @desc    Obter dados do usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter dados do usuário' });
  }
};