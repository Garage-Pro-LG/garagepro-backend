
const { createClient } = require('@libsql/client');
require('dotenv').config();

// Conectar con la base de datos Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function dropAllTables() {
  try {
    console.log('🚨 Eliminando todas las tablas de la base de datos...');

    // Desactivar restricciones de claves foráneas (si aplica)
    await db.execute('PRAGMA foreign_keys = OFF;');

    // Lista de tablas que deseas eliminar
    const tables = ['cars', 'clients', 'authorized', 'events']; 

    // Borrar las tablas en orden
    for (const table of tables) {
      await db.execute(`DROP TABLE IF EXISTS ${table};`);
      console.log(`✅ Tabla ${table} eliminada`);
    }

    // Reactivar restricciones de claves foráneas
    await db.execute('PRAGMA foreign_keys = ON;');

    console.log('🚀 Base de datos limpia con éxito.');
  } catch (err) {
    console.error('❌ Error al eliminar las tablas:', err.message);
  } finally {
    process.exit(); // Finalizar el proceso una vez completado
  }
}

// Ejecutar la migración
dropAllTables();