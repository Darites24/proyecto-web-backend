const express = require("express");
const router = express.Router();
const { obtenerAnalisis } = require("../controllers/analisisController");

router.get("/", obtenerAnalisis);

module.exports = router;