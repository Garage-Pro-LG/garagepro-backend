const db = require('../config/db');

// Crear la tabla `events`
async function createEventTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id_event INTEGER PRIMARY KEY AUTOINCREMENT,            
      car_id TEXT CHECK(LENGTH(car_id) = 12),                 
      damage TEXT,                                           
      booking_date DATE,                                     
      booking_time TIME,                                     
      reparation_start DATE,                             
      reparation_end DATE,                               
      delayed_date DATE,                                     
      hours_forecast FLOAT,                                   
      hours_real FLOAT,                                      
      courtesy_car INTEGER CHECK(courtesy_car IN (0, 1)) 
      details TEXT,                                           
      event_status TEXT CHECK(event_status IN ('Active', 'Inactive')),  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         
      
      -- Definición de las claves foráneas
      FOREIGN KEY (car_id) REFERENCES cars(id_car) ON DELETE CASCADE
    )
  `);
}

// Insertar un nuevo evento
async function addEvent(id_event, car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
  hours_forecast, hours_real, courtesy_car, details, event_status) {
  return db.execute(
    `INSERT INTO events (id_event, car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date,
      hours_forecast, hours_real, courtesy_car, details, event_status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_event, car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
     hours_forecast, hours_real, courtesy_car, details, event_status]
  );
}

// Obtener todos los eventos
async function getEvents() {
  return db.execute('SELECT * FROM events');
}

// Obtener un evento por su id_event
async function getEventById(id_event) {
  return db.execute('SELECT * FROM events WHERE id_event = ?', [id_event]);
}

// Actualizar un evento
async function updateEvent(id_event, car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
  hours_forecast, hours_real, courtesy_car, details, event_status) {
  return db.execute(
    `UPDATE events SET car_id = ?, damage = ?, booking_date = ?, booking_time = ?, reparation_start = ?, reparation_end = ?, 
    delayed_date = ?, hours_forecast = ?, hours_real = ?, courtesy_car = ?, details = ?, event_status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id_event = ?`,
    [car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, hours_forecast, hours_real, 
    courtesy_car, details, event_status, id_event]
  );
}

// Eliminar un evento
async function deleteEvent(id_event) {
  return db.execute('DELETE FROM events WHERE id_event = ?', [id_event]);
}

module.exports = { createEventTable, addEvent, getEvents, getEventById, updateEvent, deleteEvent };
