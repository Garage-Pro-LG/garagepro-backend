const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config();

// Conectar con la base de datos Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createTables() {
  try {
    console.log('⏳ Creando tablas...');

    // Tabla de clientes
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id_client TEXT PRIMARY KEY CHECK(LENGTH(id_client) <= 9),   
        name TEXT CHECK(LENGTH(name) <= 45) NOT NULL,                
        surname TEXT CHECK(LENGTH(surname) <= 90) NOT NULL,                   
        email TEXT CHECK(LENGTH(email) <= 100) NOT NULL,    
        phone TEXT CHECK(LENGTH(phone) <= 15),                      
        address TEXT CHECK(LENGTH(address) <= 120),                  
        city TEXT CHECK(LENGTH(city) <= 50),                         
        state TEXT CHECK(LENGTH(state) <= 50),                      
        zip INTEGER,                          
        country TEXT CHECK(LENGTH(country) <= 50),                   
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de eventos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id_event INTEGER PRIMARY KEY AUTOINCREMENT,            
        car_id TEXT CHECK(LENGTH(car_id) <= 12),                  
        damage TEXT,                                           
        booking_date DATE,                                     
        booking_time TIME,                                     
        reparation_start DATE,                             
        reparation_end DATE,                               
        delayed_date DATE,                                     
        hours_forecast FLOAT,                                   
        hours_real FLOAT,                                      
        courtesy_car INTEGER CHECK(courtesy_car IN (0, 1)),  
        details TEXT,                                           
        event_status TEXT CHECK(event_status IN ('Active', 'Inactive')),  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         
        FOREIGN KEY (car_id) REFERENCES cars(id_car) ON DELETE CASCADE
      )
    `);

    // Tabla de coches
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
        FOREIGN KEY (client_id) REFERENCES clients(id_client) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id_event) ON DELETE CASCADE
      )
    `);

    // Tabla de autorizados
    await db.execute(`
      CREATE TABLE IF NOT EXISTS authorized (
        id_authorized TEXT CHECK(LENGTH(id_authorized) <= 9) PRIMARY KEY,  
        name TEXT CHECK(LENGTH(name) <= 45) NOT NULL,      
        surname TEXT CHECK(LENGTH(surname) <= 45) NOT NULL,                             
        event_id INTEGER,                                                 
        address TEXT CHECK(LENGTH(address) <= 120),                       
        city TEXT CHECK(LENGTH(city) <= 50),                              
        phone TEXT CHECK(LENGTH(phone) <= 15),                            
        email TEXT CHECK(LENGTH(email) <= 100),                           
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                   
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                   
        FOREIGN KEY (event_id) REFERENCES events(id_event) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tablas creadas correctamente');
  } catch (err) {
    console.error('❌ Error al crear las tablas:', err.message);
  } finally {
    process.exit();
  }
}

// Ejecutar la migración
createTables();


