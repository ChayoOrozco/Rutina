// Rutas de autenticación
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../utils/auth-middleware');

// Ruta para registro de usuarios
router.post('/register', authController.register);

// Ruta para inicio de sesión
router.post('/login', authController.login);

// Ruta protegida para obtener información del usuario actual
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
