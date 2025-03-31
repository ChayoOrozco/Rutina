// Controlador de autenticación
const User = require('../models/user');
const { generateToken } = require('../utils/password-utils');

const authController = {
  // Registrar un nuevo usuario
  async register(req, res) {
    try {
      const { username, password, displayName } = req.body;

      // Validaciones
      if (!username || username.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      const result = await User.create(username, password, displayName);

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Autenticar al usuario recién creado
      const authResult = await User.authenticate(username, password);
      
      if (!authResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Usuario creado pero error al iniciar sesión automáticamente'
        });
      }

      // Generar token
      const token = generateToken(authResult.user.id, authResult.user.username);

      // Enviar respuesta con token y datos del usuario
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        token,
        user: authResult.user
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al registrar usuario'
      });
    }
  },

  // Iniciar sesión
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const result = await User.authenticate(username, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      // Generar token
      const token = generateToken(result.user.id, result.user.username);

      // Enviar respuesta con token y datos del usuario
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        user: result.user
      });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al iniciar sesión'
      });
    }
  },

  // Obtener información del usuario actual
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.getById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al obtener información del usuario'
      });
    }
  }
};

module.exports = authController;
