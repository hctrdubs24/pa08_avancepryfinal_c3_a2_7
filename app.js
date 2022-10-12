const express = require("express"),
  app = express(),
  session = require("express-session"),
  dotenv = require("dotenv");

// Establecer el motor de plantillas
app.set("view engine", "ejs");

// Uso del directorio public
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

// Configuración para obtener datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Uso de variables de entorno
dotenv.config({ path: "./env/.env" });

// uso de sesiones
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Llamada a las rutas
app.use("/", require("./routes/index.routes"));

// Servidor
app.listen(3000, (req, res) => {
  console.log("El servidor está corriendo en http://localhost:3000");
});
