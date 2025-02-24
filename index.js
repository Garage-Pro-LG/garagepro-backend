const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const clientRoutes = require("./routes/client.routes");

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();
const port = 3000;

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Usar las rutas definidas
app.use(clientRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
