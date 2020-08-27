"use strict";

let express = require("express");
// Cargamos el controlador
let ArticleController = require("../controllers/article");

// llamamos al router de express
let router = express.Router();

// creamos las rutas
router.post("/datos-curso", ArticleController.datosCurso);
router.get("/test-de-controlador", ArticleController.test);

module.exports = router;