import express from 'express';
import cors from 'cors';
import { connectDB } from './database.js';
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getStats,
  migrateLoan
} from './loanService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas de API

// GET /api/loans - Obtener todos los préstamos
app.get('/api/loans', async (req, res) => {
  const result = await getAllLoans();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// GET /api/loans/:id - Obtener un préstamo por ID
app.get('/api/loans/:id', async (req, res) => {
  const result = await getLoanById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// POST /api/loans - Crear un nuevo préstamo
app.post('/api/loans', async (req, res) => {
  const result = await createLoan(req.body);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// PUT /api/loans/:id - Actualizar un préstamo
app.put('/api/loans/:id', async (req, res) => {
  const result = await updateLoan(req.params.id, req.body);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// DELETE /api/loans/:id - Eliminar un préstamo
app.delete('/api/loans/:id', async (req, res) => {
  const result = await deleteLoan(req.params.id);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// POST /api/migrate - Migrar un préstamo (con manejo de duplicados)
app.post('/api/migrate', async (req, res) => {
  const result = await migrateLoan(req.body);
  if (result.success) {
    if (result.skipped) {
      res.status(200).json({ 
        data: result.data, 
        skipped: true, 
        message: result.message 
      });
    } else {
      res.status(201).json(result.data);
    }
  } else {
    res.status(400).json({ error: result.error });
  }
});

// GET /api/stats - Obtener estadísticas generales
app.get('/api/stats', async (req, res) => {
  const result = await getStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API de PréstamoBnk funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
