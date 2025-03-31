// Modelo de actividades
const pool = require('../config/db-config');

const Activity = {
  // Guardar o actualizar el estado de una actividad
  async saveActivityStatus(userId, activityId, isCompleted, dateKey, day) {
    try {
      // Verificar si ya existe un registro para esta actividad y fecha
      const [existingActivities] = await pool.query(
        'SELECT * FROM activities WHERE user_id = ? AND activity_id = ? AND date_key = ?',
        [userId, activityId, dateKey]
      );

      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      if (existingActivities.length > 0) {
        // Actualizar el registro existente
        await pool.query(
          'UPDATE activities SET completed = ?, timestamp = ? WHERE user_id = ? AND activity_id = ? AND date_key = ?',
          [isCompleted, timestamp, userId, activityId, dateKey]
        );
      } else {
        // Crear un nuevo registro
        await pool.query(
          'INSERT INTO activities (user_id, activity_id, completed, date_key, timestamp, day) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, activityId, isCompleted, dateKey, timestamp, day]
        );
      }

      return {
        success: true,
        message: 'Estado de actividad guardado exitosamente'
      };
    } catch (error) {
      console.error('Error al guardar estado de actividad:', error);
      return {
        success: false,
        message: 'Error al guardar estado de actividad. Por favor, intenta de nuevo.'
      };
    }
  },

  // Obtener todas las actividades de un usuario para una fecha específica
  async getActivitiesByDate(userId, dateKey) {
    try {
      const [activities] = await pool.query(
        'SELECT * FROM activities WHERE user_id = ? AND date_key = ?',
        [userId, dateKey]
      );

      return {
        success: true,
        activities
      };
    } catch (error) {
      console.error('Error al obtener actividades por fecha:', error);
      return {
        success: false,
        message: 'Error al obtener actividades. Por favor, intenta de nuevo.'
      };
    }
  },

  // Obtener todas las actividades de un usuario para un día específico (lunes, martes, etc.)
  async getActivitiesByDay(userId, day) {
    try {
      const [activities] = await pool.query(
        'SELECT * FROM activities WHERE user_id = ? AND day = ?',
        [userId, day]
      );

      return {
        success: true,
        activities
      };
    } catch (error) {
      console.error('Error al obtener actividades por día:', error);
      return {
        success: false,
        message: 'Error al obtener actividades. Por favor, intenta de nuevo.'
      };
    }
  },

  // Obtener todas las actividades de un usuario
  async getAllActivities(userId) {
    try {
      const [activities] = await pool.query(
        'SELECT * FROM activities WHERE user_id = ? ORDER BY date_key DESC, activity_id',
        [userId]
      );

      return {
        success: true,
        activities
      };
    } catch (error) {
      console.error('Error al obtener todas las actividades:', error);
      return {
        success: false,
        message: 'Error al obtener actividades. Por favor, intenta de nuevo.'
      };
    }
  },

  // Obtener estadísticas semanales
  async getWeeklyStats(userId) {
    try {
      // Obtener los últimos 7 días de actividad
      const [results] = await pool.query(
        `SELECT 
          date_key, 
          COUNT(*) as total, 
          SUM(completed) as completed
        FROM activities 
        WHERE user_id = ? 
        AND date_key >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY date_key
        ORDER BY date_key DESC`,
        [userId]
      );

      const stats = {};

      // Formatear los resultados
      results.forEach(row => {
        stats[row.date_key] = {
          date: row.date_key,
          total: row.total,
          completed: row.completed,
          completionRate: row.total > 0 ? (row.completed / row.total) * 100 : 0
        };
      });

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas semanales:', error);
      return {
        success: false,
        message: 'Error al obtener estadísticas. Por favor, intenta de nuevo.'
      };
    }
  },

  // Obtener estadísticas diarias para un día específico
  async getDayStats(userId, day) {
    try {
      // Obtener estadísticas generales para el día
      const [totalStats] = await pool.query(
        `SELECT 
          day,
          COUNT(*) as total, 
          SUM(completed) as completed
        FROM activities 
        WHERE user_id = ? AND day = ?
        GROUP BY day`,
        [userId, day]
      );

      // Obtener estadísticas por persona (isra, chayo, ambos)
      const [personStats] = await pool.query(
        `SELECT 
          SUBSTRING_INDEX(SUBSTRING_INDEX(activity_id, '-', 2), '-', -1) as person,
          COUNT(*) as total, 
          SUM(completed) as completed
        FROM activities 
        WHERE user_id = ? AND day = ?
        GROUP BY SUBSTRING_INDEX(SUBSTRING_INDEX(activity_id, '-', 2), '-', -1)`,
        [userId, day]
      );

      const stats = {
        total: 0,
        completed: 0,
        completionRate: 0,
        isra: {
          total: 0,
          completed: 0,
          completionRate: 0
        },
        chayo: {
          total: 0,
          completed: 0,
          completionRate: 0
        },
        ambos: {
          total: 0,
          completed: 0,
          completionRate: 0
        }
      };

      // Actualizar estadísticas generales
      if (totalStats.length > 0) {
        stats.total = totalStats[0].total;
        stats.completed = totalStats[0].completed;
        stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      }

      // Actualizar estadísticas por persona
      personStats.forEach(row => {
        if (row.person === 'isra' || row.person === 'chayo' || row.person === 'ambos') {
          stats[row.person].total = row.total;
          stats[row.person].completed = row.completed;
          stats[row.person].completionRate = row.total > 0 ? (row.completed / row.total) * 100 : 0;
        }
      });

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del día:', error);
      return {
        success: false,
        message: 'Error al obtener estadísticas. Por favor, intenta de nuevo.'
      };
    }
  }
};

module.exports = Activity;
