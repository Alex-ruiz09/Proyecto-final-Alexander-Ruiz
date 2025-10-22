import express from 'express';
import mongoose from 'mongoose';
import cargaAcademicaRoutes from './routes/AcademicLoad.js'
import dotenv from 'dotenv';
import connectDB from './db.js'; 
import cors from 'cors';
import morgan from 'morgan'

dotenv.config(); // Carga variables de entorno (.env)
connectDB(); // Conexión a MongoDB

const app = express();

// Middlewares globales
app.use(cors()); // Permitir peticiones de otros orígenes
app.use(express.json()); // Parsear JSON
app.use(morgan('dev')); // Logs de peticiones (opcional)

// Routes
app.use('/api/carga-academica', cargaAcademicaRoutes);

/* app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
}); */

// Manejo básico de errores (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada 😕' });
});

// Servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

/*# ✅ RUTA BASE PARA VERIFICAR
GET http://localhost:3000/api/test

# ✅ OBTENER CARGAS POR AÑO
GET http://localhost:3000/api/carga-academica/anio/2024
Authorization: Bearer {{token}}

# ✅ OBTENER CARGA POR ID
GET http://localhost:3000/api/carga-academica/{{carga_id}}
Authorization: Bearer {{token}}

# ✅ OBTENER CARGAS POR PROFESOR (ruta simplificada)
GET http://localhost:3000/api/carga-academica/profesor/{{profesor_id}}
Authorization: Bearer {{token}}

# ✅ OBTENER CARGAS POR PROFESOR CON AÑO ESPECÍFICO
GET http://localhost:3000/api/carga-academica/profesor/{{profesor_id}}?anio=2024
Authorization: Bearer {{token}}

# ✅ OBTENER CARGAS POR GRUPO (ruta simplificada)
GET http://localhost:3000/api/carga-academica/grupo/{{grupo_id}}
Authorization: Bearer {{token}}

# ✅ CREAR CARGA ACADÉMICA
POST http://localhost:3000/api/carga-academica
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "profesor": "64abc123def456789012345",
  "materia": "64abc123def456789012346",
  "grupo": "64abc123def456789012347",
  "año": 2024,
  "intensidadHoraria": "4 horas semanales",
  "porcentaje": 25
}*/