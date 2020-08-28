"use strict";

let validator = require("validator");
let Article = require("../models/article");

let controller = {

	// Metodo o acción "datosCurso"
	datosCurso: (req, res) => {
		let hola = req.body.hola;

		return res.status(200).send({
			curso: "Master en Frameworks JS",
			autor: "Víctor Robles",
			url: "victorroblesweb.es",
			hola
		});
	},

	// Metodo o acción "test"
	test: (req, res) => {
		return res.status(200).send({
			message: "Soy la acción 'test' de mi controlador de articulos"
		});
	},

	// Metodo para crear un nuevo articulo
	save: (req, res) => {
		// Recoger parametros por POST
		let params = req.body;
		let validate_title, validate_content;

		// Validar datos (libreria "validator")
		try{
			validate_title = !validator.isEmpty(params.title); // da "true" cuando el parametro "title" no este vacio
			validate_content = !validator.isEmpty(params.content);
		}catch(err){
			return res.status(200).send({
				message: "Faltan datos por enviar !!!"
			});
		}

		// si validación correcta
		if( validate_title && validate_content){
			
			// Crear el objeto (articulo) a guardar

			// Asignar valores

			// Guardar el articulo

			// Devolver Respuesta
			return res.status(200).send({
				article: params
			});
		}else{
			return res.status(200).send({
				message: "Los datos no son válidos !!!"
			});
		}

	}
}; // end controller

module.exports = controller;