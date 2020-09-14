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
				status: "error",
				message: "Faltan datos por enviar !!!"
			});
		}

		// si validación correcta
		if( validate_title && validate_content){
			
			// Crear el objeto (articulo) a guardar
			let article = new Article();

			// Asignar valores
			article.title = params.title;
			article.content = params.content;
			article.image = null;

			// Guardar el articulo
			article.save( (err, articleStored) => {
				if(err || !articleStored){
					return res.status(404).send({
						status: "error",
						message: "El articulo no se ha guardado !!!"
					});
				}

				// Devolver Respuesta
				return res.status(200).send({
					status: "success",
					article: articleStored
				});

			});
		}else{
			return res.status(200).send({
				status: "error",
				message: "Los datos no son válidos !!!"
			});
		}

	},

	// Metodo para devolver todos los articulos
	getArticles: (req, res) => {
		let last = req.params.last;
		let query = Article.find({});
 
		if (last || last != undefined) {
			query.limit(parseInt(last));
		}
		// Busqueda de articulos con "find"
		query.sort("-_id").exec( (err, articles) => {
			if(err){
				return res.status(500).send({
					status: "error",
					message: "Error al devolver los artículos !!!"
				});
			}

			if(!articles){
				return res.status(404).send({
					status: "error",
					message: "No hay artículos para mostrar !!!"
				});
			}

			return res.status(200).send({
				status: "success",
				articles
			});

		});
	},

	//Metodo para devolver un articulo por "_id"
	getArticle: (req, res) => {
		// Tomar el "id" de la URL
		let articleId = req.params.id;
		// Comprobar que el "id" existe
		if(!articleId || articleId == null || articleId == undefined){
			return res.status(404).send({
				status: "error",
				message: "No existe el artículo !!!"
			});
		}
		// Buscar el articulo
		Article.findById(articleId, (err, article) => {
			if(err || !article){
				return res.status(404).send({
					status: "error",
					message: "No existe el artículo !!!"
				});
			}
			// Devolver respuesta JSON
			return res.status(200).send({
				status: "success",
				article
			});
		});
	},

	//Metodo para actualizar datos de un articulo
	update: (req, res) => {
		// Recoger el "id" del articulo por la URL
		let articleId = req.params.id;

		// Recoger los datos que llegan por PUT
		let params = req.body;

		// Validar datos
		let validate_title, validate_content;

		try {
			validate_title = !validator.isEmpty(params.title);
			validate_content = !validator.isEmpty(params.content);
		} catch (err) {
			return res.status(200).send({
				status: "error",
				message: "Faltan datos por enviar !!!"
			});
		}

		if( validate_title && validate_content){
			// Find and update
			Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
				if(err){
					return res.status(500).send({
						status: "error",
						message: "Error al actualizar !!!"
					});
				}

				if(!articleUpdated){
					return res.status(404).send({
						status: "error",
						message: "No existe el artículo !!!"
					});
				}

				// Devolver respuesta
				return res.status(200).send({
					status: "success",
					article: articleUpdated
				});
			});
		}else{
			return res.status(200).send({
				status: "error",
				message: "Los datos no son válidos !!!"
			});
		}
	},

	//Metodo para eliminar un articulo
	delete: (req, res) => {
		// Recoger el "id" de la URL
		let articleId = req.params.id;

		// Find and delete
		Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
			if(err){
				return res.status(500).send({
					status: "error",
					message: "Error al borrar !!!"
				});
			}
			if(!articleRemoved){
				return res.status(404).send({
					status: "error",
					message: "No se ha borrado el articulo, posiblemente no exista !!!"
				});
			}
			return res.status(200).send({
				status: "success",
				article: articleRemoved
			});
		});
	}

}; // end controller

module.exports = controller;