// Configuración de la conexión a la base de datos
const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'AQUI_TU_CONTRASEÑA',
  database: process.env.DB_NAME || 'rutina_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
