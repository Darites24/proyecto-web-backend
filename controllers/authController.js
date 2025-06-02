const db = require("../models/database");
const bcrypt = require("bcrypt");

const registerUser = (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios"});
    }

    const queryBuscar = "SELECT * FROM usuarios WHERE correo = ?";
    db.query(queryBuscar, [correo], async (err, resultados) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error en la base de datos"});
        }

        if (resultados.length > 0) {
            return res.status(400).json({ mensaje: "El correo ya está registrado"});
        }

        const contraseñaHash = await bcrypt.hash(contraseña, 10);

        const queryInsertar = "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)";
        db.query(queryInsertar, [nombre, correo, contraseñaHash], (err, resultado) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al registrar el usuario"});
            }

            return res.status(201).json({ mensaje: "Usuario registrado exitosamente"})
        });
    });
};

const jwt = require("jsonwebtoken");

const loginUser = (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios"});
    }

    const query = "SELECT * FROM usuarios WHERE correo = ?";
    db.query(query, [correo], async (err, resultados) => {
        if (err) {
            console.error("Error en la base de datos: ", err);
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }

        if (resultados.length === 0) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const usuario = resultados[0];

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!esValida) {
            return res.status(401).json({ mensaje:"Correo o contraseña incorrectos" });
        }

        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario_id: usuario.id
        });
    });
};

module.exports = { 
    registerUser,
    loginUser 
};
