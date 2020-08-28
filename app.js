"use strict";

// Cargar modulos de node para crear el servidor
let express = require("express");
let bodyParser = require("body-parser");

// Ejecutar express (http)
let app = express();

// Cargar ficheros rutas
let article_routes = require("./routes/article");

// Middlewares

	// usar el body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS

// Añadir prefijos a rutas / Cargar Rutas
app.use("/api", article_routes);

// Exportar modulo (fichero actual)
module.exports = app;