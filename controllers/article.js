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
		let uploadFile = {path: "", type: ""};
		let supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png','image/gif'];
		let errors = [];

		form.on('error', (err) => {
			console.log('error');
			if(fs.existsSync(uploadFile.path)) {
				fs.unlinkSync(uploadFile.path);
				console.log('error');
			}
		});
		
		// Escucha eventos de archivo
		form.on("file", (name,file) => {

			// Ruta archivo
			uploadFile.path = file.path;

			// Verificamos que no se envie una petición sin archivo
			if(file.size == 0){
				errors.push("Error seleccione un archivo !!!");
				return res.status(404).send({
					status: "error",
					message: "Error seleccione un archivo !!!"
				});
			}
			// Conseguir nombre y extensión del archivo
			let file_path = file.path;
			let file_split = file_path.split("\\");
			// Nombre del archivo
			let file_name = file_split[2];

			// Conseguir el tipo de archivo que se quiere subir (MIME_type)
			uploadFile.type = file.headers['content-type'];

			// Comprobar la extensión (solo imagenes)
			if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
				errors.push("La extensión de la imagen no es válida !!!");
				return res.status(200).send({
					status: "error",
					message: "La extensión de la imagen no es válida !!!"
				});
			}

		});

		// analizar(parse) the form
		form.parse(req, (err, fields, files) => {
			//files["file0"][0].path;
			if(errors.length == 0) {
				// Si todo es válido
				// Sacar el "id" de la URL
				let articleId = req.params.id;

				// Borrar imagen antigua (si la hay)
				Article.findById({_id: articleId}, (err, article) => {
					if(err || !article){
						return res.status(404).send({
							status: 'error',
							message: 'Error no hay articulo !!!'
						});
					}
					if(article.image !== null){
						let old_image = "upload\\articles\\" + article.image;
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

				console.log("PATH");
				console.log(uploadFile.path);

				let file_split = uploadFile.path.split("\\");
				// Nombre de la imagen nueva
				let file_name = file_split[2];

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

				// res.send({
				// 	status: 'ok',
				// 	fields: fields,
				// 	files: files
				// });
			}else{
				// borrar archivo basura que intenta guardar
				if(fs.existsSync(uploadFile.path)) {
					fs.unlinkSync(uploadFile.path);
				}
				console.log(errors);
			}
		});		

	},

	//Metodo para obtener imagen
	getImage: (req, res) => {
		//obtener el fichero que se pide por URL
		let file = req.params.image;
		let path_file = "./upload/articles/" + file;

		// comprobar si el archivo existe
		fs.access(path_file, fs.constants.F_OK, (err) => {
			if (err) {
				return res.status(404).send({
					status: "error",
					message: "La imagen no existe !!!"
				});
			} else {
				//devolvemos el fichero, para incrustarlo en etiquetas de imagen
				return res.sendFile(path.resolve(path_file));
			}
		});
	}

}; // end controller

module.exports = controller;