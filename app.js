require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const Twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000; // <-- CAMBIO CLAVE

app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const whatsappNumber = process.env.WHATSAPP_NUMBER;

const client = new Twilio(accountSid, authToken);

// Forzar zona horaria MySQL a GMT-5 (Ecuador)
db.query("SET time_zone = '-05:00';")
  .then(() => console.log("Zona horaria de MySQL configurada a GMT-5"))
  .catch(err => console.error("Error al configurar zona horaria:", err));

// Rutas
const clientesRoutes = require('./routes/clientes');
const vehiculosRoutes = require('./routes/vehiculos');
const tecnicosRoutes = require('./routes/tecnicos');
const alertasRoutes = require('./routes/alertas')(client, whatsappNumber);
const usuariosRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/login');

app.use('/clientes', clientesRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/tecnicos', tecnicosRoutes);
app.use('/alertas', alertasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/login', loginRoutes);

app.get('/', (req, res) => {
  res.send('Servidor Soft Automotriz funcionando correctamente en Railway');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
