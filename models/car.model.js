const db = require('../config/db');

// Crear la tabla `cars`
async function createCarTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cars (
      id_car TEXT CHECK(LENGTH(id_car) <= 12) PRIMARY KEY,                        
      client_id TEXT,                                
      car_brand TEXT CHECK(LENGTH(car_brand) <= 50),  
      model TEXT CHECK(LENGTH(model) <= 30),          
      insurance TEXT CHECK(LENGTH(insurance) <= 50),  
      insurance_policy TEXT CHECK(LENGTH(insurance_policy) <= 30), 
      chassis TEXT CHECK(LENGTH(chassis) <= 70),      
      event_id INTEGER,                               
      car_status TEXT CHECK(car_status IN ('Active', 'Inactive')), 
      car_usage_type TEXT CHECK(car_usage_type IN ('Personal', 'Professional', 'Other')), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


      -- Definición de las claves foráneas
      FOREIGN KEY (client_id) REFERENCES clients(id_client) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id_event) ON DELETE CASCADE
    )

  `);
}

// Insertar un nuevo coche
async function addCar(id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type) {
  return db.execute(
    `INSERT INTO cars (id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type]
  );
}

// Obtener todos los coches
async function getCars() {
  return db.execute('SELECT * FROM cars');
}

// Obtener un coche por su id_car
async function getCarById(id_car) {
  return db.execute('SELECT * FROM cars WHERE id_car = ?', [id_car]);
}

// Actualizar un coche
async function updateCar(id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type) {
  return db.execute(
    `UPDATE cars SET client_id = ?, car_brand = ?, model = ?, insurance = ?, insurance_policy = ?, chassis = ?, event_id = ?, details = ?, car_status = ?, car_usage_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id_car = ?`,
    [client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type, id_car]
  );
}

// Eliminar un coche
async function deleteCar(id_car) {
  return db.execute('DELETE FROM cars WHERE id_car = ?', [id_car]);
}

// Validar que el car_id existe en la tabla cars
async function validateCarIdExists(car_id) {
    const [rows] = await db.execute('SELECT 1 FROM cars WHERE id_car = ?', [car_id]);
    return rows.length > 0;  // Devuelve true si el car_id existe, de lo contrario false
  }
  
  module.exports = { createEventTable, addEvent, getEvents, getEventById, updateEvent, deleteEvent, validateCarIdExists };
  