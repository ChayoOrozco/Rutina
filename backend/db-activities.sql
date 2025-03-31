-- Script para crear la tabla de actividades
USE rutina_app;

-- Crear tabla de actividades
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  activity_id VARCHAR(100) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  date_key DATE NOT NULL,
  timestamp DATETIME NOT NULL,
  day VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY user_activity_date (user_id, activity_id, date_key)
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX idx_user_date ON activities(user_id, date_key);
CREATE INDEX idx_activity_id ON activities(activity_id);
