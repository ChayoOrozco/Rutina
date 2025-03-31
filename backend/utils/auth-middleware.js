// Middleware para autenticación con JWT
const { verifyToken } = require('./password-utils');

const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado. Se requiere token de autenticación.'
    });
  }

  // Verificar el token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }

  // Añadir información del usuario al objeto de solicitud
  req.user = {
    id: decoded.id,
    username: decoded.username
  };

  next();
};

module.exports = authMiddleware;
