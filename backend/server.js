const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, testConnection } = require('./src/config/database');

// Importar modelos y asociaciones
const {
  CP,
  Direccion,
  Usuario,
  UnidadAcademica,
  Carrera,
  Arrendatario,
  Arrendador,
  Propiedad,
  Fotos,
  Arrendamiento,
  Resena,
  Servicio,
  ServicioHasPropiedad,
  Administrador,
} = require('./src/models/associations');

// Importar rutas
const catalogosRoutes = require('./src/routes/catalogos.routes');
const cpRoutes = require('./src/routes/cp.routes');
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const contactoRoutes = require('./src/routes/contacto.routes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/cp', cpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contactoRoutes);
// Ruta de prueba para verificar modelos
app.get('/test-models', async (req, res) => {
  try {
    const cps = await CP.findAll({ limit: 5 });
    const usuarios = await Usuario.findAll({ limit: 5 });
    const propiedades = await Propiedad.findAll({ limit: 5 });
    res.json({
      message: 'Todos los modelos funcionando',
      cpsCount: cps.length,
      usuariosCount: usuarios.length,
      propiedadesCount: propiedades.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API de Burroomies funcionando' });
});

const startServer = async () => {
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();