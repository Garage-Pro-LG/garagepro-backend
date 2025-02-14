const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config();

// Conectar con la base de datos Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seedDatabase() {
  try {
    console.log('⏳ Insertando datos de prueba...');

    // Insertar 10 clientes con DNIs reales
    await db.execute(`
      INSERT INTO clients (id_client, name, surname, email, phone, address, city, state, zip, country)
      VALUES
      ('12345678A', 'Juan', 'Pérez', 'juan.perez@mail.com', '612345678', 'Calle Mayor 1', 'Madrid', 'Madrid', '28001', 'España'),
      ('87654321B', 'María', 'López', 'maria.lopez@mail.com', '698765432', 'Avenida Diagonal 2', 'Barcelona', 'Cataluña', '08001', 'España'),
      ('11223344C', 'Carlos', 'García', 'carlos.garcia@mail.com', '611223344', 'Calle Colón 3', 'Valencia', 'Valencia', '46001', 'España'),
      ('44332211D', 'Ana', 'Rodríguez', 'ana.rodriguez@mail.com', '644332211', 'Plaza Nueva 4', 'Sevilla', 'Andalucía', '41001', 'España'),
      ('55667788E', 'Pedro', 'Fernández', 'pedro.fernandez@mail.com', '655667788', 'Gran Vía 5', 'Bilbao', 'País Vasco', '48001', 'España'),
      ('99887766F', 'Lucía', 'Gómez', 'lucia.gomez@mail.com', '699887766', 'Paseo Independencia 6', 'Zaragoza', 'Aragón', '50001', 'España'),
      ('33445566G', 'Javier', 'Martínez', 'javier.martinez@mail.com', '633445566', 'Paseo del Parque 7', 'Málaga', 'Andalucía', '29001', 'España'),
      ('77889900H', 'Elena', 'Torres', 'elena.torres@mail.com', '677889900', 'Calle Murcia 8', 'Murcia', 'Murcia', '30001', 'España'),
      ('22334455I', 'Sergio', 'Díaz', 'sergio.diaz@mail.com', '622334455', 'Rúa Príncipe 9', 'Vigo', 'Galicia', '36201', 'España'),
      ('66778899J', 'Laura', 'Ruiz', 'laura.ruiz@mail.com', '666778899', 'Calle Burgos 10', 'Santander', 'Cantabria', '39001', 'España')
    `);
    console.log('✅ 10 Clientes insertados correctamente');

    // Insertar 10 coches con matrículas españolas reales
    await db.execute(`
      INSERT INTO cars (id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, car_status, car_usage_type)
      VALUES
      ('1234ABC', '12345678A', 'Toyota', 'Corolla', 'MAPFRE', 'XYZ123', 'CHS0001', 'Active', 'Personal'),
      ('5678DEF', '87654321B', 'Honda', 'Civic', 'AXA', 'ABC456', 'CHS0002', 'Inactive', 'Professional'),
      ('9101GHI', '11223344C', 'Ford', 'Focus', 'Allianz', 'DEF789', 'CHS0003', 'Active', 'Personal'),
      ('1121JKL', '44332211D', 'Volkswagen', 'Golf', 'Mutua', 'GHI012', 'CHS0004', 'Active', 'Professional'),
      ('3141MNO', '55667788E', 'Chevrolet', 'Spark', 'Zurich', 'JKL345', 'CHS0005', 'Inactive', 'Personal'),
      ('5161PQR', '99887766F', 'Nissan', 'Micra', 'Reale', 'MNO678', 'CHS0006', 'Active', 'Other'),
      ('7181STU', '33445566G', 'Mazda', 'CX-5', 'Pelayo', 'PQR901', 'CHS0007', 'Active', 'Personal'),
      ('9202VWX', '77889900H', 'BMW', 'Serie 3', 'Genesis', 'STU234', 'CHS0008', 'Inactive', 'Professional'),
      ('1222YZA', '22334455I', 'Audi', 'A4', 'Caser', 'VWX567', 'CHS0009', 'Active', 'Personal'),
      ('3242BCD', '66778899J', 'Mercedes', 'Clase C', 'Lineadirecta', 'YZA890', 'CHS0010', 'Active', 'Professional')
    `);
    console.log('✅ 10 Coches insertados correctamente');

    // Insertar 10 eventos de reparación
    await db.execute(`
      INSERT INTO events (car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, hours_forecast, hours_real, courtesy_car, details, event_status)
      VALUES
      ('1234ABC', 'Golpe en la puerta', '2025-02-01', '10:00', '2025-02-02', '2025-02-05', NULL, 10, 9.5, 1, 'Reparación de chapa y pintura', 'Active'),
      ('5678DEF', 'Cambio de aceite', '2025-02-03', '14:00', '2025-02-04', '2025-02-04', NULL, 2, 2, 0, 'Mantenimiento rutinario', 'Inactive'),
      ('9101GHI', 'Fallo en el motor', '2025-02-05', '09:00', '2025-02-06', '2025-02-10', NULL, 20, 22, 1, 'Revisión completa del motor', 'Active'),
      ('1121JKL', 'Cambio de frenos', '2025-02-07', '11:30', '2025-02-08', '2025-02-09', NULL, 5, 5, 0, 'Sustitución de pastillas de freno', 'Inactive'),
      ('3141MNO', 'Avería en la batería', '2025-02-10', '13:00', '2025-02-11', '2025-02-11', NULL, 3, 3, 0, 'Sustitución de batería', 'Active'),
      ('5161PQR', 'Revisión de transmisión', '2025-02-12', '08:45', '2025-02-13', '2025-02-15', NULL, 15, 16, 1, 'Revisión completa de la transmisión', 'Active'),
      ('7181STU', 'Fallo en la suspensión', '2025-02-16', '10:15', '2025-02-17', '2025-02-19', NULL, 12, 12, 1, 'Cambio de amortiguadores', 'Inactive'),
      ('9202VWX', 'Pintura de capó', '2025-02-20', '09:30', '2025-02-21', '2025-02-23', NULL, 8, 8, 0, 'Reparación de pintura por arañazos', 'Active'),
      ('1222YZA', 'Cambio de correa de distribución', '2025-02-24', '14:45', '2025-02-25', '2025-02-26', NULL, 6, 6, 0, 'Cambio de correa y tensores', 'Inactive'),
      ('3242BCD', 'Golpe en la defensa trasera', '2025-02-27', '12:00', '2025-02-28', '2025-03-01', NULL, 10, 10, 1, 'Reparación de defensa trasera', 'Active')
    `);
    console.log('✅ 10 Eventos insertados correctamente');

  } catch (err) {
    console.error('❌ Error al insertar datos:', err.message);
  } finally {
    process.exit();
  }
}

// Ejecutar el seeding
seedDatabase();
