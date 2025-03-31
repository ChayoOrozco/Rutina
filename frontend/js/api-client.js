// Cliente API para comunicarse con el backend
// Cambiado a la URL completa para evitar problemas con CORS
const API_URL = 'http://localhost:3000/api';

const ApiClient = {
  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('rutina_token');
  },

  // Métodos para actividades
  async saveActivity(activityId, completed, day) {
    const dateKey = new Date().toISOString().slice(0, 10);
    try {
      return await this.request('/activities/save', 'POST', {
        activityId,
        completed,
        dateKey,
        day
      });
    } catch (error) {
      console.warn('Error al guardar actividad, usando localStorage como fallback');
      // Fallback a localStorage si falla la solicitud al backend
      const timestamp = new Date().toISOString();
      
      // Obtener datos existentes o crear nuevo almacenamiento
      let trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
      
      // Crear entrada de fecha si no existe
      if (!trackingData[dateKey]) {
        trackingData[dateKey] = {};
      }
      
      // Crear o actualizar actividad
      trackingData[dateKey][activityId] = {
        completed: completed,
        timestamp: timestamp,
        day: day
      };
      
      // Guardar en localStorage
      localStorage.setItem('rutina_tracking_data', JSON.stringify(trackingData));
      
      return {
        success: true,
        message: 'Estado de actividad guardado localmente (modo fallback)'
      };
    }
  },
  
  async getActivitiesByDate(dateKey) {
    try {
      return await this.request(`/activities/date/${dateKey}`, 'GET');
    } catch (error) {
      console.warn('Error al obtener actividades por fecha, usando localStorage como fallback');
      // Fallback a localStorage
      const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
      const activities = [];
      
      if (trackingData[dateKey]) {
        for (const activityId in trackingData[dateKey]) {
          const activity = trackingData[dateKey][activityId];
          activities.push({
            activity_id: activityId,
            completed: activity.completed,
            date_key: dateKey,
            timestamp: activity.timestamp,
            day: activity.day
          });
        }
      }
      
      return {
        success: true,
        activities: activities
      };
    }
  },
  
  async getActivitiesByDay(day) {
    try {
      return await this.request(`/activities/day/${day}`, 'GET');
    } catch (error) {
      console.warn('Error al obtener actividades por día, usando localStorage como fallback');
      // Fallback a localStorage
      const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
      const activities = [];
      
      for (const dateKey in trackingData) {
        for (const activityId in trackingData[dateKey]) {
          if (activityId.startsWith(`${day}-`)) {
            const activity = trackingData[dateKey][activityId];
            activities.push({
              activity_id: activityId,
              completed: activity.completed,
              date_key: dateKey,
              timestamp: activity.timestamp,
              day: activity.day || day
            });
          }
        }
      }
      
      return {
        success: true,
        activities: activities
      };
    }
  },
  
  async getAllActivities() {
    try {
      return await this.request('/activities/all', 'GET');
    } catch (error) {
      console.warn('Error al obtener todas las actividades, usando localStorage como fallback');
      // Fallback a localStorage
      const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
      const activities = [];
      
      for (const dateKey in trackingData) {
        for (const activityId in trackingData[dateKey]) {
          const activity = trackingData[dateKey][activityId];
          activities.push({
            activity_id: activityId,
            completed: activity.completed,
            date_key: dateKey,
            timestamp: activity.timestamp,
            day: activity.day || activityId.split('-')[0]
          });
        }
      }
      
      return {
        success: true,
        activities: activities
      };
    }
  },
  
  async getWeeklyStats() {
    try {
      return await this.request('/activities/stats/weekly', 'GET');
    } catch (error) {
      console.warn('Error al obtener estadísticas semanales, usando localStorage como fallback');
      // Implementación simplificada de getWeeklyStats() del archivo activity-tracker.js
      const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
      const weeklyData = {};
      const today = new Date();
      const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      
      // Go back 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);
        
        let dailyCompleted = 0;
        let dailyTotal = 0;
        
        // Get today's tracking data
        if (trackingData[dateStr]) {
          // Count activities for each day
          for (const day of days) {
            // Look for activities for this specific day (e.g., "lunes-*")
            Object.keys(trackingData[dateStr]).forEach(activityId => {
              if (activityId.startsWith(`${day}-`)) {
                dailyTotal++;
                if (trackingData[dateStr][activityId].completed) {
                  dailyCompleted++;
                }
              }
            });
          }
        }
        
        weeklyData[dateStr] = {
          date: dateStr,
          completed: dailyCompleted,
          total: dailyTotal,
          completionRate: dailyTotal > 0 ? (dailyCompleted / dailyTotal) * 100 : 0
        };
      }
      
      return {
        success: true,
        stats: weeklyData
      };
    }
  },
  
  async getDayStats(day) {
    try {
      return await this.request(`/activities/stats/day/${day}`, 'GET');
    } catch (error) {
      console.warn('Error al obtener estadísticas del día, usando localStorage como fallback');
      // Implementación simplificada de getDayStats() del archivo activity-tracker.js
      const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
      
      // Inicializar objeto de estadísticas
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
      
      // Buscar todas las actividades para este día en localStorage
      Object.keys(trackingData).forEach(dateKey => {
        Object.keys(trackingData[dateKey]).forEach(activityId => {
          if (activityId.startsWith(`${day}-`)) {
            const idParts = activityId.split('-');
            if (idParts.length >= 2) {
              const person = idParts[1]; // isra, chayo, or ambos
              stats.total++;
              
              if (person === 'isra' || person === 'chayo' || person === 'ambos') {
                stats[person].total++;
              }
              
              if (trackingData[dateKey][activityId].completed) {
                stats.completed++;
                
                if (person === 'isra' || person === 'chayo' || person === 'ambos') {
                  stats[person].completed++;
                }
              }
            }
          }
        });
      });
      
      // Calcular tasas de finalización
      if (stats.total > 0) {
        stats.completionRate = (stats.completed / stats.total) * 100;
      }
      
      if (stats.isra.total > 0) {
        stats.isra.completionRate = (stats.isra.completed / stats.isra.total) * 100;
      }
      
      if (stats.chayo.total > 0) {
        stats.chayo.completionRate = (stats.chayo.completed / stats.chayo.total) * 100;
      }
      
      if (stats.ambos.total > 0) {
        stats.ambos.completionRate = (stats.ambos.completed / stats.ambos.total) * 100;
      }
      
      return {
        success: true,
        stats: stats
      };
    }
  },

  // Guardar token en localStorage
  setToken(token) {
    localStorage.setItem('rutina_token', token);
  },

  // Eliminar token (logout)
  removeToken() {
    localStorage.removeItem('rutina_token');
  },

  // Opciones comunes para las solicitudes
  requestOptions(method, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Añadir token de autenticación si existe
    const token = this.getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Añadir cuerpo de la solicitud si hay datos
    if (data) {
      options.body = JSON.stringify(data);
    }

    return options;
  },

  // Realizar una solicitud al API
  async request(endpoint, method, data = null) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, this.requestOptions(method, data));
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error en la solicitud');
      }

      return result;
    } catch (error) {
      console.error(`Error en solicitud ${method} a ${endpoint}:`, error);
      throw error;
    }
  },

  // Métodos de autenticación
  async register(username, password, displayName) {
    try {
      // Intentar solicitud normal al backend
      const result = await this.request('/auth/register', 'POST', {
        username,
        password,
        displayName
      });
      
      if (result.success && result.token) {
        this.setToken(result.token);
        this.setUserInfo(result.user);
      }
      
      return result;
    } catch (error) {
      console.warn('Usando modo de prueba (sin backend real)');
      // Modo fallback para desarrollo/pruebas sin backend
      const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
      const mockUser = {
        id: 1,
        username: username,
        displayName: displayName || username
      };
      
      this.setToken(mockToken);
      this.setUserInfo(mockUser);
      
      return {
        success: true,
        message: 'Usuario creado exitosamente (modo prueba)',
        token: mockToken,
        user: mockUser
      };
    }
  },

  async login(username, password) {
    try {
      // Intentar solicitud normal al backend
      const result = await this.request('/auth/login', 'POST', {
        username,
        password
      });

      if (result.success && result.token) {
        this.setToken(result.token);
        this.setUserInfo(result.user);
      }

      return result;
    } catch (error) {
      console.warn('Usando modo de prueba (sin backend real)');
      // Modo fallback para desarrollo/pruebas sin backend
      const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
      const mockUser = {
        id: 1,
        username: username,
        displayName: username // En modo prueba usamos el username como displayName
      };
      
      this.setToken(mockToken);
      this.setUserInfo(mockUser);
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso (modo prueba)',
        token: mockToken,
        user: mockUser
      };
    }
  },

  logout() {
    this.removeToken();
    localStorage.removeItem('rutina_user');
    localStorage.removeItem('rutina_user_display');
    localStorage.removeItem('rutina_logged_in');
  },

  // Métodos para información de usuario
  setUserInfo(user) {
    localStorage.setItem('rutina_user', user.username);
    localStorage.setItem('rutina_user_display', user.displayName);
    localStorage.setItem('rutina_logged_in', 'true');
  },

  isAuthenticated() {
    return localStorage.getItem('rutina_logged_in') === 'true' && this.getToken() !== null;
  },

  getCurrentUser() {
    if (this.isAuthenticated()) {
      return {
        username: localStorage.getItem('rutina_user'),
        displayName: localStorage.getItem('rutina_user_display')
      };
    }
    return null;
  },

  async fetchCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const result = await this.request('/auth/me', 'GET');
      return result.user;
    } catch (error) {
      console.warn('Usando modo de prueba (sin backend real)');
      // En modo fallback, devolver un usuario simulado basado en localStorage
      const username = localStorage.getItem('rutina_user');
      const displayName = localStorage.getItem('rutina_user_display');
      
      if (username && displayName) {
        return {
          id: 1,
          username: username,
          displayName: displayName
        };
      }
      
      // Si no hay datos en localStorage, hacer logout
      this.logout();
      return null;
    }
  }
};
