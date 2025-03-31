// Utilidades para manejo de contraseñas y tokens JWT
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_para_jwt';

// Generar un token JWT con la información del usuario
const generateToken = (userId, username) => {
  return jwt.sign(
    { id: userId, username },
    jwtSecret,
    { expiresIn: '7d' } // Token válido por 7 días
  );
};

// Verificar un token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
