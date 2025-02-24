const { addClient, getClientsFromDB, getClientByIdDB, updateClient, deleteClient } = require('../models/client.model');
const { v4: uuidv4 } = require('uuid');

// Obtener todos los clientes
async function getClients(req, res) {
  try {
    const clients = await getClientsFromDB(); // Aquí usamos la función del modelo
    res.render("clientsView", { clients }); // Asegúrate de tener bien configurada la vista
  } catch (error) {
    res.status(500).send("Error al obtener los clientes.");
  }
}

// Obtener cliente por ID
async function getClientById(req, res) {
  const { id_client } = req.params;
  try {
    const client = await getClientByIdDB(id_client);
    if (client.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(client.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Crear un nuevo cliente
async function createClient(req, res) {
  const { name, surname, email, phone, address, city, state, zip, country } = req.body;
  const id_client = req.body.id_client; // Asumimos que id_client se pasa desde el frontend

  // Validaciones
  if (!id_client || id_client.length > 9 || !/^\d{1,9}$/.test(id_client))
    return res.status(400).json({ error: 'El id_client debe ser un número de hasta 9 cifras' });
  if (!name || name.length > 45) return res.status(400).json({ error: 'El nombre debe tener máximo 45 caracteres' });
  if (surname && surname.length > 90) return res.status(400).json({ error: 'El apellido debe tener máximo 90 caracteres' });
  if (!email || email.length > 100) return res.status(400).json({ error: 'El email debe tener máximo 100 caracteres' });
  if (phone && phone.length > 15) return res.status(400).json({ error: 'El teléfono debe tener máximo 15 caracteres' });
  if (address && address.length > 120) return res.status(400).json({ error: 'La dirección debe tener máximo 120 caracteres' });
  if (city && city.length > 50) return res.status(400).json({ error: 'La ciudad debe tener máximo 50 caracteres' });
  if (state && state.length > 50) return res.status(400).json({ error: 'El estado debe tener máximo 50 caracteres' });
  if (!zip || !/^\d{5}$/.test(zip)) return res.status(400).json({ error: 'El ZIP debe ser un número de 5 dígitos' });
  if (country && country.length > 50) return res.status(400).json({ error: 'El país debe tener máximo 50 caracteres' });

  try {
    await addClient(id_client, name, surname, email, phone, address, city, state, zip, country);
    res.json({ message: 'Cliente agregado', id_client, name, surname, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Editar un cliente
async function editClient(req, res) {
  const { id_client } = req.params;
  const { name, email, phone, address, city, state, zip, country } = req.body;
  try {
    await updateClient(id_client, name, email, phone, address, city, state, zip, country);
    res.json({ message: 'Cliente actualizado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Eliminar un cliente
async function removeClient(req, res) {
  const { id_client } = req.params;
  try {
    await deleteClient(id_client);
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getClients, createClient, getClientById, editClient, removeClient };
