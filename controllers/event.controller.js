const express = require('express');
const router = express.Router();
const { addEvent, getEvents, getEventById, updateEvent, deleteEvent, validateCarIdExists } = require('../models/event');

// Crear un nuevo evento
router.post('/events', async (req, res) => {
    const { car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
      hours_forecast, hours_real, courtesy_car, details, event_status } = req.body;
  
    // Validación de entrada
    if (!car_id || car_id.length !== 12) return res.status(400).json({ error: 'El car_id debe tener 12 caracteres' });
    
    // Validar que el car_id exista en la tabla cars
    const carExists = await validateCarIdExists(car_id);
    if (!carExists) return res.status(400).json({ error: 'El car_id proporcionado no existe en la base de datos' });
  
    if (!event_status || !['Active', 'Inactive'].includes(event_status)) return res.status(400).json({ error: 'El estado del evento debe ser "Active" o "Inactive"' });
    if (courtesy_car !== undefined && ![0, 1].includes(courtesy_car)) return res.status(400).json({ error: 'El valor de courtesy_car debe ser 0 o 1' });
  
    try {
      // Llamada a la función para insertar el nuevo evento
      await addEvent(null, car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
        hours_forecast, hours_real, courtesy_car, details, event_status);
      res.json({ message: 'Evento creado correctamente' });
    } catch (err) {
      res.status(500).json({ error: 'Error al crear el evento', details: err.message });
    }
  });

// Obtener todos los eventos
router.get('/events', async (req, res) => {
  try {
    const [rows] = await getEvents();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los eventos', details: err.message });
  }
});

// Obtener un evento por su id_event
router.get('/events/:id_event', async (req, res) => {
  const { id_event } = req.params;
  
  try {
    const [rows] = await getEventById(id_event);
    if (rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el evento', details: err.message });
  }
});

// Actualizar un evento
router.put('/events/:id_event', async (req, res) => {
    const { id_event } = req.params;
    const { car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
      hours_forecast, hours_real, courtesy_car, details, event_status } = req.body;
  
    // Validación de entrada
    if (!car_id || car_id.length !== 12) return res.status(400).json({ error: 'El car_id debe tener 12 caracteres' });
    
    // Validar que el car_id exista en la tabla cars
    const carExists = await validateCarIdExists(car_id);
    if (!carExists) return res.status(400).json({ error: 'El car_id proporcionado no existe en la base de datos' });
  
    if (!event_status || !['Active', 'Inactive'].includes(event_status)) return res.status(400).json({ error: 'El estado del evento debe ser "Active" o "Inactive"' });
    if (courtesy_car !== undefined && ![0, 1].includes(courtesy_car)) return res.status(400).json({ error: 'El valor de courtesy_car debe ser 0 o 1' });
  
    try {
      // Llamada a la función para actualizar el evento
      await updateEvent(id_event, car_id, damage, booking_date, booking_time, reparation_start, reparation_end, delayed_date, 
        hours_forecast, hours_real, courtesy_car, details, event_status);
      res.json({ message: 'Evento actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el evento', details: err.message });
    }
  });

// Eliminar un evento
router.delete('/events/:id_event', async (req, res) => {
  const { id_event } = req.params;

  try {
    // Llamada a la función para eliminar el evento
    await deleteEvent(id_event);
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el evento', details: err.message });
  }
});

module.exports = router;
