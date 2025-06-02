const express = require("express");
const router = express.Router();
const {
    crearCategoria,
    obtenerCategorias,
    eliminarCategoria
} = require("../controllers/categoriaController");

router.post("/", crearCategoria);
router.get("/", obtenerCategorias);
router.delete("/:id", eliminarCategoria);


module.exports = router;