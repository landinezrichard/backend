"use strict";

let express = require("express");
// Cargamos el controlador
let ArticleController = require("../controllers/article");

// llamamos al router de express
let router = express.Router();

// creamos las rutas

// Rutas de Prueba
router.post("/datos-curso", ArticleController.datosCurso);
router.get("/test-de-controlador", ArticleController.test);

// Rutas para artículos
router.post("/save", ArticleController.save);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.put("/article/:id", ArticleController.update);
router.delete("/article/:id", ArticleController.delete);
router.post("/upload-image/:id", ArticleController.upload);

module.exports = router;