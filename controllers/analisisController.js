const db = require("../models/database");

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

const getPromedioIngresos = async (usuario_id) => {
    const sql = `
        SELECT AVG(valor) AS promedio FROM movimientos
        WHERE usuario_id = ? AND LOWER(tipo) = 'ingreso'
        `;
    const [result] = await query(sql, [usuario_id]);
    return result.promedio || 0;
};

const getPromedioEgresos = async(usuario_id) => {
    const sql = `
        SELECT AVG(valor) AS promedio FROM movimientos
        WHERE usuario_id = ? AND LOWER(tipo) = 'egreso'
        `;
    const [result] = await query(sql, [usuario_id]);
    return result.promedio || 0;
};

const getTotales = async (usuario_id) => {
    const sql = `
    SELECT
      SUM(CASE WHEN LOWER(tipo) = 'ingreso' THEN valor ELSE 0 END) AS total_ingresos,
      SUM(CASE WHEN LOWER(tipo) = 'egreso' THEN valor ELSE 0 END) AS total_egresos
    FROM movimientos
    WHERE usuario_id = ?
    `;
   const [result] = await query(sql, [usuario_id]);
   return {
    totalIngresos: result.total_ingresos || 0,
    totalEgresos: result.total_egresos || 0
    };
};

const getGastoPorCategoria = async (usuario_id) => {
    const sql = `
    SELECT c.nombre AS categoria, AVG(m.valor) AS gasto_promedio
    FROM movimientos m
    JOIN categorias c ON m.categoria_id = c.id
    WHERE m.usuario_id = ? AND LOWER(m.tipo) = 'egreso'
    GROUP BY c.nombre
    `;
    return await query(sql, [usuario_id]);
};

const obtenerAnalisis = async (req, res) => {
    const { usuario_id } = req.query;

    if (!usuario_id) {
        return res.status(400).json({ mensaje: "usuario_id es obligatorio"});
    }

    try {
        const [
            promedioIngresos,
            promedioEgresos,
            { totalIngresos, totalEgresos },
            gastoPorCategoria
        ] = await Promise.all([
            getPromedioIngresos(usuario_id),
            getPromedioEgresos(usuario_id),
            getTotales(usuario_id),
            getGastoPorCategoria(usuario_id),
        ]);

        const porcentajeAhorro = totalIngresos ? ((totalIngresos - totalEgresos) / totalIngresos * 100).toFixed(2): "N/A";

        const relacionIE = totalEgresos > 0 ? (totalIngresos / totalEgresos).toFixed(2): "N/A";

        res.status(200).json({
            promedio_ingresos: promedioIngresos,
            promedio_egresos: promedioEgresos,
            porcentaje_ahorro: porcentajeAhorro,
            relacion_ingresos_egresos: relacionIE,
            gasto_por_categoria: gastoPorCategoria
        });
    } catch (error) {
        console.error("Error en análisis: ", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

module.exports = { obtenerAnalisis };
