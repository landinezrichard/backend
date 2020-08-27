"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

// Definimos el esquema
let ArticleSchema = Schema({
	title: String,
	content: String,
	date: { type: Date, default: Date.now },
	image: String
});

// Definimos el modelo
// "Article" es el nombre del modelo
module.exports = mongoose.model("Article", ArticleSchema);
// articles --> guarda documentos de tipo y estructura "Article" dentro de la colección.