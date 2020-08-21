"use strict";

// Cargar modulos de node para crear el servidor
let express = require("express");
let bodyParser = require("body-parser");


// Ejecutar express (http)
let app = express();

// Cargar ficheros rutas

// Middlewares

	// usar el body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS

// Añadir prefijos a rutas

	// ruta o metodo de prueba para el API REST
app.get("/probando", (req, res) => {
	console.log("Hola mundo!!!");
	return res.status(200).send(
		{
			curso: "Master Frameworks JS",
			autor: "Víctor Robles",
			url: "victorroblesweb.es"
		}
	);
});

// Exportar modulo (fichero actual)
module.exports = app;