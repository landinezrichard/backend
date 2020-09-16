"use strict";

let validator = require("validator");
let Article = require("../models/article");
let multipart = require("multiparty");
let fs = require("fs");
let path = require("path");

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
	},

	//Metodo para subir imagenes
	upload: (req, res) => {
		// Configurar modulo multiparty

		// analizar(parse/parsing) la carga de un archivo
		let form = new multipart.Form({ uploadDir: "./upload/articles" });
		
		form.parse(req, (err, fields, files) => {
			// Recoger el fichero de la petición
			let file_name = "Imagen no subida...";

			if(err || files.file0[0].size == 0){
				// borrar archivo basura que intenta guardar
				if(fs.existsSync(files.file0[0].path)) {
					fs.unlinkSync(files.file0[0].path);
				}
				return res.status(404).send({
					status: "error",
					message: file_name
				});
			}
			// Conseguir nombre y extensión del archivo
			let file_path = files.file0[0].path;
			let file_split = file_path.split("\\");

			// ADVERTENCIA * en Linux o MAC
			// let file_split = file_path.split("/");

			// Nombre del archivo
			file_name = file_split[2];

			// Extensión del fichero
			let extension_split = file_name.split("\.");
			let file_ext = extension_split[1].toLowerCase();

			// Comprobar la extensión (solo imagenes), si no es valido, borrar fichero
			if(file_ext != "png" && file_ext != "jpg" && file_ext != "jpeg" && file_ext != "gif"){
				// borrar archivo subido
				fs.unlink(file_path, (err) => {
					return res.status(200).send({
						status: "error",
						message: "La extensión de la imagen no es válida !!!"
					});
				});
			}else{
				// Si todo es válido
				// Sacar el "id" de la URL
				let articleId = req.params.id;

				// Borrar imagen antigua (si la hay)
				Article.findById({_id: articleId}, (err, article) => {
					if(err || !article){
						return res.status(404).send({
							status: 'error',
							message: 'Error no hay articulo para actualizar'
						});
					}
					if(article.image !== null){
						let old_image = "upload\\articles\\" + article.image;
						console.log("Borrando Imagen Antigua");
						fs.unlink(old_image, (err) => {
							if (err) {
								return res.status(400).send({
									status: 'error',
									message: 'Error al borrar imagen antigua / fs unlink'
								});
							}
						});
					}
					return;
				});

				// Buscar articulo, asignarle el nombre de la imagen y actualizarlo
				Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
					if(err || !articleUpdated){
						return res.status(500).send({
							status: "error",
							message: "Error al guardar la imagen del articulo !!!"
						});
					}

					return res.status(200).send({
						status: "success",
						article: articleUpdated
					});
				});
				
			}

		});

	}

}; // end controller

module.exports = controller;