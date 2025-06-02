const express = require("express");
const router = express.Router();

const {
    crearMovimiento,
    obtenerMovimientos
} = require("../controllers/movimientoController");

router.post("/", crearMovimiento);
router.get("/", obtenerMovimientos);

module.exports = router;