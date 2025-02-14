const express = require('express');
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCar,
  updateCarDetails,
  deleteCarById
} = require('../controllers/car.controller');

// Ruta para crear un nuevo coche
router.post('/cars', createCar);

// Ruta para obtener todos los coches
router.get('/cars', getAllCars);

// Ruta para obtener un coche por id_car
router.get('/cars/:id_car', getCar);

// Ruta para actualizar un coche
router.put('/cars/:id_car', updateCarDetails);

// Ruta para eliminar un coche
router.delete('/cars/:id_car', deleteCarById);

module.exports = router;
