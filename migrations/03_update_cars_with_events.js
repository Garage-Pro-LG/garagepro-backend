const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config();

// Conectar con la base de datos Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


async function updateCarsWithEvents() {
    try {
      console.log('🔄 Asignando eventos a coches...');
  
      // Obtener los 10 eventos insertados
      const events = await db.execute('SELECT id_event, car_id FROM events');
  
      for (const event of events.rows) {
        // Asignar event_id al coche correspondiente
        await db.execute(
          'UPDATE cars SET event_id = ? WHERE id_car = ?',
          [event.id_event, event.car_id]
        );
      }
  
      console.log('✅ Coches actualizados con sus eventos correctamente');
    } catch (err) {
      console.error('❌ Error al actualizar coches con eventos:', err.message);
    } finally {
      process.exit();
    }
  }
  
  // Llamar la función después del seed
  updateCarsWithEvents();