const { addCar, getCars, getCarById, updateCar, deleteCar } = require('../models/car.model');
const { v4: uuidv4 } = require('uuid');

async function createCar(req, res) {
    const { client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type } = req.body;
    const id_car = uuidv4(); // Generamos un id único para el coche
  
    // Validaciones
    if (!client_id || client_id.length > 9) return res.status(400).json({ error: 'El client_id debe ser un número de 9 cifras' });
    if (!car_brand || car_brand.length > 50) return res.status(400).json({ error: 'La marca del coche debe tener máximo 50 caracteres' });
    if (!model || model.length > 30) return res.status(400).json({ error: 'El modelo del coche debe tener máximo 30 caracteres' });
    if (!insurance || insurance.length > 50) return res.status(400).json({ error: 'El seguro debe tener máximo 50 caracteres' });
    if (!insurance_policy || insurance_policy.length > 30) return res.status(400).json({ error: 'La póliza de seguro debe tener máximo 30 caracteres' });
    if (!chassis || chassis.length > 70) return res.status(400).json({ error: 'El chasis debe tener máximo 70 caracteres' });
    if (!event_id) return res.status(400).json({ error: 'El event_id es obligatorio' });
    if (details && details.length > 255) return res.status(400).json({ error: 'Los detalles deben tener máximo 255 caracteres' });
    if (!car_status || !['Active', 'Inactive'].includes(car_status)) return res.status(400).json({ error: 'El estado del coche debe ser "Active" o "Inactive"' });
    if (!car_usage_type || !['Personal', 'Professional', 'Other'].includes(car_usage_type)) return res.status(400).json({ error: 'El tipo de uso del coche debe ser "Personal", "Professional" o "Other"' });
  
    // Verificación de claves foráneas (client_id y event_id)
    try {
      // Verificar si el client_id existe en la tabla `clients`
      const [client] = await db.execute('SELECT * FROM clients WHERE id_client = ?', [client_id]);
      if (client.length === 0) {
        return res.status(400).json({ error: 'El client_id no existe en la base de datos' });
      }
  
      // Verificar si el event_id existe en la tabla `events`
      const [event] = await db.execute('SELECT * FROM events WHERE id_event = ?', [event_id]);
      if (event.length === 0) {
        return res.status(400).json({ error: 'El event_id no existe en la base de datos' });
      }
  
      // Si todo está bien, insertamos el coche
      await addCar(id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type);
      res.json({ message: 'Coche agregado', id_car, client_id, car_brand, model });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

async function getAllCars(req, res) {
  try {
    const [cars] = await getCars();
    res.json(cars);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getCar(req, res) {
  const { id_car } = req.params;
  try {
    const [car] = await getCarById(id_car);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: 'Coche no encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateCarDetails(req, res) {
  const { id_car } = req.params;
  const { client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type } = req.body;

  try {
    await updateCar(id_car, client_id, car_brand, model, insurance, insurance_policy, chassis, event_id, details, car_status, car_usage_type);
    res.json({ message: 'Coche actualizado', id_car });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteCarById(req, res) {
  const { id_car } = req.params;
  try {
    await deleteCar(id_car);
    res.json({ message: 'Coche eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { createCar, getAllCars, getCar, updateCarDetails, deleteCarById };
