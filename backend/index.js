require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usamos la versión promise

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'notas-db',  // Nombre del servicio en Render
  user: process.env.DB_USER || 'notasuser',
  password: process.env.DB_PASS || 'notaspwd',
  database: process.env.DB_NAME || 'notasdb',
  waitForConnections: true,
  connectionLimit: 10
};

const pool = mysql.createPool(dbConfig);

// Verificar conexión
pool.getConnection()
  .then(conn => {
    console.log('Conectado a MySQL correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  });

// Rutas
app.get('/notas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notas');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notas' });
  }
});

app.post('/notas', async (req, res) => {
  const { titulo, contenido } = req.body;
  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO notas (titulo, contenido) VALUES (?, ?)',
      [titulo, contenido]
    );
    res.status(201).json({ 
      ok: true, 
      id: result.insertId,
      nota: { id: result.insertId, titulo, contenido }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar nota' });
  }
});

app.listen(5000, () => console.log('Backend en http://localhost:5000'));