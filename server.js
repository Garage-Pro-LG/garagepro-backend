require('dotenv').config();
const express = require('express');
const { createClient } = require('@libsql/client');

const app = express();
app.use(express.json());

// Conectar con Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function setupDatabase() {
    try {
      // Crear tabla de usuarios
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL
        )
      `);
  
      // Crear tabla de coches (car)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS car (
          plate TEXT PRIMARY KEY,
          model TEXT NOT NULL,
          color TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
  
      console.log('✅ Tablas creadas correctamente');
  
      // Insertar datos de ejemplo si están vacías
      await seedDatabase();
    } catch (err) {
      console.error('❌ Error en la base de datos:', err.message);
    }
  }



  async function seedDatabase() {
    // Verificar si ya hay datos en users
    const usersCount = await db.execute('SELECT COUNT(*) as count FROM users');
    if (usersCount.rows[0].count === 0) {
      console.log('🔹 Insertando datos en users...');
      await db.execute(`
        INSERT INTO users (name, email) VALUES 
        ('Juan Pérez', 'juan@mail.com'),
        ('María López', 'maria@mail.com'),
        ('Carlos García', 'carlos@mail.com'),
        ('Ana Rodríguez', 'ana@mail.com'),
        ('Pedro Fernández', 'pedro@mail.com')
      `);
    }
  
    // Verificar si ya hay datos en car
    const carCount = await db.execute('SELECT COUNT(*) as count FROM car');
    if (carCount.rows[0].count === 0) {
      console.log('🔹 Insertando datos en car...');
  
      // Obtener IDs de los usuarios recién creados
      const users = await db.execute('SELECT id FROM users');
  
      // Insertar 5 coches asociados a usuarios aleatorios
      await db.execute(`
        INSERT INTO car (plate, model, color, user_id) VALUES
        ('ABC123', 'Toyota Corolla', 'Rojo', ${users.rows[0].id}),
        ('XYZ789', 'Honda Civic', 'Azul', ${users.rows[1].id}),
        ('DEF456', 'Ford Focus', 'Negro', ${users.rows[2].id}),
        ('GHI321', 'Chevrolet Spark', 'Blanco', ${users.rows[3].id}),
        ('JKL654', 'Volkswagen Golf', 'Gris', ${users.rows[4].id})
      `);
    }
  
    console.log('✅ Datos insertados correctamente');
  }
  

// Ruta para obtener usuarios
app.get('/users', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para agregar usuario
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.json({ message: 'Usuario agregado', name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Obtener todos los coches con su usuario asociado
app.get('/cars', async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT car.plate, car.model, car.color, users.name AS owner
        FROM car
        JOIN users ON car.user_id = users.id
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Agregar un coche
  app.post('/cars', async (req, res) => {
    const { plate, model, color, user_id } = req.body;
    try {
      await db.execute('INSERT INTO car (plate, model, color, user_id) VALUES (?, ?, ?, ?)', [plate, model, color, user_id]);
      res.json({ message: 'Coche agregado', plate, model, color, user_id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  

// Iniciar servidor y base de datos
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  await setupDatabase();
});
