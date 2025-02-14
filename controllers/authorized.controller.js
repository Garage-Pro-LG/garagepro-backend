const { addAuthorized, getAuthorized, getAuthorizedById, updateAuthorized, deleteAuthorized } = require('../models/authorized.model');

async function createAuthorized(req, res) {
  const { id_authorized, name, event_id, address, city, phone, email } = req.body;

  // Validaciones
  if (!id_authorized || id_authorized.length !== 9) {
    return res.status(400).json({ error: 'El id_authorized debe tener 9 caracteres' });
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
    // Verificar que el event_id exista en la base de datos
    const [event] = await db.execute('SELECT * FROM events WHERE id_event = ?', [event_id]);
    if (event.length === 0) {
      return res.status(400).json({ error: 'El event_id no existe en la base de datos' });
    }

    // Crear el autorizado
    await addAuthorized(id_authorized, name, event_id, address, city, phone, email);
    res.json({ message: 'Autorizado creado', id_authorized, name, event_id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAllAuthorized(req, res) {
  try {
    const [authorized] = await getAuthorized();
    res.json(authorized);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAuthorizedById(req, res) {
  const { id_authorized } = req.params;
  try {
    const [authorized] = await getAuthorizedById(id_authorized);
    if (authorized.length === 0) {
      return res.status(404).json({ error: 'Autorizado no encontrado' });
    }
    res.json(authorized[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateAuthorizedDetails(req, res) {
  const { id_authorized } = req.params;
  const { name, event_id, address, city, phone, email } = req.body;

  // Validaciones
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
    // Verificar que el event_id exista en la base de datos
    const [event] = await db.execute('SELECT * FROM events WHERE id_event = ?', [event_id]);
    if (event.length === 0) {
      return res.status(400).json({ error: 'El event_id no existe en la base de datos' });
    }

    // Actualizar el autorizado
    await updateAuthorized(id_authorized, name, event_id, address, city, phone, email);
    res.json({ message: 'Autorizado actualizado', id_authorized });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteAuthorizedById(req, res) {
  const { id_authorized } = req.params;
  try {
    await deleteAuthorized(id_authorized);
    res.json({ message: 'Autorizado eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { createAuthorized, getAllAuthorized, getAuthorizedById, updateAuthorizedDetails, deleteAuthorizedById };
