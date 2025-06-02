const db = require("../models/database");

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

const obtenerAnalisis = async (req, res) => {
    const { usuario_id } = req.query;

    if (!usuario_id) {
    return res.status(400).json({ mensaje: "usuario_id es obligatorio" });
    }

    try {
        const queryIngresos = `
            SELECT AVG(valor) AS promedio_ingresos FROM movimientos
            WHERE usuario_id = ? AND LOWER(tipo) = 'ingreso'
        `;

    const queryEgresos = `
        SELECT AVG(valor) AS promedio_egresos FROM movimientos
        WHERE usuario_id = ? AND LOWER(tipo) = 'egreso'
    `;

    const queryTotales = `
        SELECT
        SUM(CASE WHEN LOWER(tipo) = 'ingreso' THEN valor ELSE 0 END) AS total_ingresos,
        SUM(CASE WHEN LOWER(tipo) = 'egreso' THEN valor ELSE 0 END) AS total_egresos
        FROM movimientos WHERE usuario_id = ?
    `;

    const queryCategorias = `
        SELECT c.nombre AS categoria, AVG(m.valor) AS gasto_promedio
        FROM movimientos m
        JOIN categorias c ON m.categoria_id = c.id
        WHERE m.usuario_id = ? AND LOWER(m.tipo) = 'egreso'
        GROUP BY c.nombre
    `;

    const [ingresos, egresos, totales, categorias] = await Promise.all([
        query(queryIngresos, [usuario_id]),
        query(queryEgresos, [usuario_id]),
        query(queryTotales, [usuario_id]),
        query(queryCategorias, [usuario_id]),
    ]);

    const totalIngresos = totales[0].total_ingresos || 0;
    const totalEgresos = totales[0].total_egresos || 0;

    const porcentajeAhorro = totalIngresos ? ((totalIngresos - totalEgresos) / totalIngresos * 100).toFixed(2) : "N/A";

    const relacionIE = totalEgresos > 0 ? (totalIngresos / totalEgresos).toFixed(2) : "N/A";

    res.status(200).json({
        promedio_ingresos: ingresos[0].promedio_ingresos || 0,
        promedio_egresos: egresos[0].promedio_egresos || 0,
        porcentaje_ahorro: porcentajeAhorro,
        relacion_ingresos_egresos: relacionIE,
        gasto_por_categoria: categorias,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

module.exports = { obtenerAnalisis };
