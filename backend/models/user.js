// Modelo de usuario
const pool = require('../config/db-config');
const bcrypt = require('bcrypt');

const User = {
  // Crear un nuevo usuario
  async create(username, password, displayName) {
    try {
      // Comprobar si el usuario ya existe
      const [existingUsers] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (existingUsers.length > 0) {
        return {
          success: false,
          message: 'El nombre de usuario ya existe'
        };
      }

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insertar el nuevo usuario
      const [result] = await pool.query(
        'INSERT INTO users (username, password, display_name, created_at) VALUES (?, ?, ?, NOW())',
        [username, hashedPassword, displayName || username]
      );

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        userId: result.insertId
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return {
        success: false,
        message: 'Error al crear usuario. Por favor, intenta de nuevo.'
      };
    }
  },

  // Autenticar usuario
  async authenticate(username, password) {
    try {
      const [users] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return {
          success: false,
          message: 'Nombre de usuario o contraseña incorrectos'
        };
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return {
          success: false,
          message: 'Nombre de usuario o contraseña incorrectos'
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name
        }
      };
    } catch (error) {
      console.error('Error al autenticar usuario:', error);
      return {
        success: false,
        message: 'Error al iniciar sesión. Por favor, intenta de nuevo.'
      };
    }
  },

  // Obtener información de un usuario por ID
  async getById(userId) {
    try {
      const [users] = await pool.query(
        'SELECT id, username, display_name, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
    }
  }
};

module.exports = User;
