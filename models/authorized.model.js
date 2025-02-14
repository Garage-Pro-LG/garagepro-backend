const db = require('../config/db');

// Crear la tabla `authorized`
async function createAuthorizedTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS authorized (
      id_authorized TEXT CHECK(LENGTH(id_authorized) = 9) PRIMARY KEY,  
      name TEXT CHECK(LENGTH(name) <= 45) NOT NULL,      
      surname TEXT CHECK(LENGTH(surname) <= 45) NOT NULL,                             
      event_id INTEGER,                                                
      address TEXT CHECK(LENGTH(address) <= 120),                       
      city TEXT CHECK(LENGTH(city) <= 50),                              
      phone TEXT CHECK(LENGTH(phone) <= 15),                            
      email TEXT CHECK(LENGTH(email) <= 100),                           
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                   
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                  

      -- Definición de la clave foránea
      FOREIGN KEY (event_id) REFERENCES events(id_event) ON DELETE CASCADE
    )
  `);
}

// Insertar un nuevo autorizado
async function addAuthorized(id_authorized, name, event_id, address, city, phone, email) {
  return db.execute(
    `INSERT INTO authorized (id_authorized, name, event_id, address, city, phone, email) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id_authorized, name, event_id, address, city, phone, email]
  );
}

// Obtener todos los autorizados
async function getAuthorized() {
  return db.execute('SELECT * FROM authorized');
}

// Obtener un autorizado por su id_authorized
async function getAuthorizedById(id_authorized) {
  return db.execute('SELECT * FROM authorized WHERE id_authorized = ?', [id_authorized]);
}

// Actualizar un autorizado
async function updateAuthorized(id_authorized, name, event_id, address, city, phone, email) {
  return db.execute(
    `UPDATE authorized SET name = ?, event_id = ?, address = ?, city = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id_authorized = ?`,
    [name, event_id, address, city, phone, email, id_authorized]
  );
}

// Eliminar un autorizado
async function deleteAuthorized(id_authorized) {
  return db.execute('DELETE FROM authorized WHERE id_authorized = ?', [id_authorized]);
}

module.exports = { createAuthorizedTable, addAuthorized, getAuthorized, getAuthorizedById, updateAuthorized, deleteAuthorized };
