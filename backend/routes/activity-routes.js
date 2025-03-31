// Rutas de actividades
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity-controller');
const authMiddleware = require('../utils/auth-middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Ruta para guardar el estado de una actividad
router.post('/save', activityController.saveActivity);

// Ruta para obtener actividades por fecha
router.get('/date/:dateKey', activityController.getActivitiesByDate);

// Ruta para obtener actividades por día
router.get('/day/:day', activityController.getActivitiesByDay);

// Ruta para obtener todas las actividades
router.get('/all', activityController.getAllActivities);

// Ruta para obtener estadísticas semanales
router.get('/stats/weekly', activityController.getWeeklyStats);

// Ruta para obtener estadísticas de un día
router.get('/stats/day/:day', activityController.getDayStats);

module.exports = router;
