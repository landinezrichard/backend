"use strict";

const mongoose = require("mongoose");
let app = require("./app");
let port = 3900;

// desactivar metodos viejos de mongoose
mongoose.set("useFindAndModify", false);

// habilitamos las promesas para MongoDB
mongoose.Promise = global.Promise;
//conexion BD
//mongoose.connect("url", {opciones})
mongoose.connect("mongodb://localhost:27017/api_rest_blog", {useNewUrlParser: true,useUnifiedTopology: true})
	.then( () =>{
		console.log("La conexión a la BD se ha realizado!!!");
		//crear servidor y escuchar peticiones HTTP
		app.listen(port, () => {
			console.log("Servidor corriendo en http://localhost:" + port);
		});
	});