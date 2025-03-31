// Controlador de actividades
const Activity = require('../models/activity');

const activityController = {
  // Guardar el estado de una actividad
  async saveActivity(req, res) {
    try {
      const { activityId, completed, dateKey, day } = req.body;
      const userId = req.user.id;

      // Validaciones
      if (!activityId) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el ID de la actividad'
        });
      }

      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'El estado de completado debe ser un valor booleano'
        });
      }

      if (!dateKey) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere la fecha'
        });
      }

      if (!day) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el día'
        });
      }

      const result = await Activity.saveActivityStatus(userId, activityId, completed, dateKey, day);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al guardar actividad'
      });
    }
  },

  // Obtener actividades por fecha
  async getActivitiesByDate(req, res) {
    try {
      const { dateKey } = req.params;
      const userId = req.user.id;

      const result = await Activity.getActivitiesByDate(userId, dateKey);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error al obtener actividades por fecha:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al obtener actividades'
      });
    }
  },

  // Obtener actividades por día
  async getActivitiesByDay(req, res) {
    try {
      const { day } = req.params;
      const userId = req.user.id;

      const result = await Activity.getActivitiesByDay(userId, day);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error al obtener actividades por día:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al obtener actividades'
      });
    }
  },

  // Obtener todas las actividades
  async getAllActivities(req, res) {
    try {
      const userId = req.user.id;

      const result = await Activity.getAllActivities(userId);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error al obtener todas las actividades:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al obtener actividades'
      });
    }
  },

  // Obtener estadísticas semanales
  async getWeeklyStats(req, res) {
    try {
      const userId = req.user.id;

      const result = await Activity.getWeeklyStats(userId);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error al obtener estadísticas semanales:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al obtener estadísticas'
      });
    }
  },

  // Obtener estadísticas de un día
  async getDayStats(req, res) {
    try {
      const { day } = req.params;
      const userId = req.user.id;

      const result = await Activity.getDayStats(userId, day);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error al obtener estadísticas del día:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor al obtener estadísticas'
      });
    }
  }
};

module.exports = activityController;
