const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/client.controller');

// Ruta para crear un nuevo cliente
router.post('/clients', createClient);

// Ruta para obtener todos los clientes
router.get('/clients', getClients);

// Ruta para obtener un cliente por id_client
router.get('/clients/:id_client', getClientById);

// Ruta para actualizar un cliente
router.put('/clients/:id_client', updateClient);

// Ruta para eliminar un cliente
router.delete('/clients/:id_client', deleteClient);

module.exports = router;
