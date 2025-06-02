const db = require("../models/database");

const crearMovimiento = (req, res) => {
    const { tipo, valor, categoria_id, usuario_id } = req.body;

    if (!tipo || !valor || !categoria_id || !usuario_id) {
        return res.status(400).json({ mensaje : "Todos los campos son obligatorios"});
    }

    const query = "INSERT INTO movimientos (tipo, valor, categoria_id, usuario_id) VALUES (?, ?, ?, ?)";

    db.query(query, [tipo, valor, categoria_id, usuario_id], (err, resultado) => {
        if (err) {
            console.error("Error al crear el movimiento: ", err);
            return res.status(500).json({ mensaje: "Error al registrar el movimiento"});
        }

        return res.status(201).json({ mensaje: "Movimiento registrado exitosamente"});
    });
};

const obtenerMovimientos = (req, res) => {
    const { usuario_id } = req.query;

    if (!usuario_id) { 
        return res.status(400).json({ mensaje: "usuario_id es obigatorio"});
    }

    const query = `
        SELECT movimientos.*, categorias.nombre AS categoria
        FROM movimientos
        JOIN categorias ON movimientos.categoria_id = categorias.id
        WHERE movimientos.usuario_id = ?
        ORDER BY movimientos.fecha DESC
    `;

    db.query(query, [usuario_id], (err, resultados) => {
        if (err) {
            console.error("Error al obtener movimientos: ", err);
            return res.status(500).json({ mensaje: "Error al obtener los movimientos "});
        }

        return res.status(200).json(resultados);
    });
};

module.exports = { crearMovimiento, obtenerMovimientos };