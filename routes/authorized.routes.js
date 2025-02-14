const express = require('express');
const router = express.Router();
const { 
  addAuthorized, 
  getAuthorized, 
  getAuthorizedById, 
  updateAuthorized, 
  deleteAuthorized 
} = require('../models/authorized');

// Crear un nuevo autorizado
router.post('/authorized', async (req, res) => {
  const { id_authorized, name, event_id, address, city, phone, email } = req.body;

  // Validaciones de los campos según las limitaciones
  if (!id_authorized || id_authorized.length !== 9) {
    return res.status(400).json({ error: 'id_authorized debe tener 9 caracteres' });
  }
  if (!name || name.length > 45) {
    return res.status(400).json({ error: 'El nombre debe tener máximo 45 caracteres' });
  }
  if (!address || address.length > 120) {
    return res.status(400).json({ error: 'La dirección debe tener máximo 120 caracteres' });
  }
  if (!city || city.length > 50) {
    return res.status(400).json({ error: 'La ciudad debe tener máximo 50 caracteres' });
  }
  if (!phone || phone.length > 15) {
    return res.status(400).json({ error: 'El teléfono debe tener máximo 15 caracteres' });
  }
  if (!email || email.length > 100) {
    return res.status(400).json({ error: 'El correo electrónico debe tener máximo 100 caracteres' });
  }
  if (!event_id) {
    return res.status(400).json({ error: 'El event_id es obligatorio' });
  }

  try {
    await addAuthorized(id_authorized, name, event_id, address, city, phone, email);
    res.status(201).json({ message: 'Autorizado creado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el autorizado', details: err.message });
  }
});

// Obtener todos los autorizados
router.get('/authorized', async (req, res) => {
  try {
    const [rows] = await getAuthorized();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los autorizados', details: err.message });
  }
});

// Obtener un autorizado por su id
router.get('/authorized/:id_authorized', async (req, res) => {
  const { id_authorized } = req.params;

  try {
    const [rows] = await getAuthorizedById(id_authorized);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Autorizado no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el autorizado', details: err.message });
  }
});

// Actualizar un autorizado
router.put('/authorized/:id_authorized', async (req, res) => {
  const { id_authorized } = req.params;
  const { name, event_id, address, city, phone, email } = req.body;

  // Validaciones de los campos
  if (!name || name.length > 45) {
    return res.status(400).json({ error: 'El nombre debe tener máximo 45 caracteres' });
  }
  if (!address || address.length > 120) {
    return res.status(400).json({ error: 'La dirección debe tener máximo 120 caracteres' });
  }
  if (!city || city.length > 50) {
    return res.status(400).json({ error: 'La ciudad debe tener máximo 50 caracteres' });
  }
  if (!phone || phone.length > 15) {
    return res.status(400).json({ error: 'El teléfono debe tener máximo 15 caracteres' });
  }
  if (!email || email.length > 100) {
    return res.status(400).json({ error: 'El correo electrónico debe tener máximo 100 caracteres' });
  }
  if (!event_id) {
    return res.status(400).json({ error: 'El event_id es obligatorio' });
  }

  try {
    await updateAuthorized(id_authorized, name, event_id, address, city, phone, email);
    res.json({ message: 'Autorizado actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el autorizado', details: err.message });
  }
});

// Eliminar un autorizado
router.delete('/authorized/:id_authorized', async (req, res) => {
  const { id_authorized } = req.params;

  try {
    await deleteAuthorized(id_authorized);
    res.json({ message: 'Autorizado eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el autorizado', details: err.message });
  }
});

module.exports = router;
