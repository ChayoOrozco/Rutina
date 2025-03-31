// Servidor principal
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth-routes');
const activityRoutes = require('./routes/activity-routes');

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);

// Ruta básica para probar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API de Rutina App está funcionando!' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
