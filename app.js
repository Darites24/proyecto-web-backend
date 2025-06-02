const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./models/database");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API de finanzas funcionando")
});

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

const categoriaRoutes = require("./routes/categoriaRoutes");
app.use("/api/categorias", categoriaRoutes);

const movimientoRoutes = require("./routes/movimientoRoutes");
app.use("/api/movimientos", movimientoRoutes);

const analisisRoutes = require("./routes/analisisRoutes");
app.use("/api/analisis", analisisRoutes);