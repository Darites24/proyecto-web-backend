const db = require("../models/database");

const crearCategoria = (req, res) => {
    const { nombre, usuario_id } = req.body;

    if (!nombre || !usuario_id) {
        return res.status(400).json({ mensaje: "Nombre y usuario_id son obligatorios" });
    }

    const query = "INSERT INTO categorias (nombre, usuario_id) VALUES (?, ?)";
    db.query(query, [nombre, usuario_id], (err, resultado) => {
        if (err) {
            console.error("Error al crear categoría: ", err);
            return res.status(500).json({ mensaje: "Error al crear la categoría" });
        }

        return res.status(201).json({ mensaje: "Categoría creada correctamente" });
    });
};

const obtenerCategorias = (req, res) => { 
    const { usuario_id } = req.query;

    if (!usuario_id) {
        return res.status(400).json({ mensaje: "usuario_id es obligatorio" });
    }

    const query = "SELECT * FROM categorias WHERE usuario_id = ?";
    db.query(query, [usuario_id], (err, resultados) => {
        if (err) {
            console.error("Error al obtener categorias:", err);
            return res.status(500).json({ mensaje: "Error al obtener las categorias "});
        }

        return res.status(200).json(resultados);
    });
};

const eliminarCategoria = (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM categorias WHERE id = ?";
    db.query(query, [id], (err, resultado) => {
        if (err) {
            console.error("Error al eliminar categoría: ", err);
            return res.status(500).json({ mensaje: "Error al eliminar la categoría" });
        }

        return res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
    });
};

module.exports = { crearCategoria, obtenerCategorias, eliminarCategoria };