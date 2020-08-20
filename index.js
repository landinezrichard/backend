'use strict';

const mongoose = require('mongoose');

//conexion BD
//mongoose.connect('url', {opciones})
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true})
	.then( () =>{
		console.log("La conexión a la BD se ha realizado!!!");
	});