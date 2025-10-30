const express = require('express');
const router = express.Router();
const db = require('../db');

async function actualizarAlertasPendientes(client, whatsappNumber) {
  try {
    // Primero actualiza el estado a 'enviada' si la fecha programada ya pasó
    const [alertas] = await db.query(`
      SELECT * FROM alertas
      WHERE estado = 'pendiente' AND fecha_programada <= NOW()
    `);

    for (const alerta of alertas) {
      // Enviar WhatsApp si tiene teléfono del cliente
      const [vehiculos] = await db.query(
        'SELECT v.*, c.telefono AS telefono_cliente FROM vehiculos v LEFT JOIN clientes c ON v.id_cliente = c.id_cliente WHERE v.id_vehiculo = ?',
        [alerta.id_vehiculo]
      );

      if (vehiculos.length && vehiculos[0].telefono_cliente) {
        const telefonoCliente = '+593' + vehiculos[0].telefono_cliente.replace(/^0/, '');

        const body = `Alerta para su vehículo (${vehiculos[0].placa || 'sin placa'}): ${alerta.descripcion}\nProgramada para: ${new Date(alerta.fecha_programada).toLocaleString('es-EC')}`;

        try {
          await client.messages.create({
            from: whatsappNumber,
            to: `whatsapp:${telefonoCliente}`,
            body
          });
        } catch (err) {
          console.error('Error enviando WhatsApp de alerta programada:', err);
        }
      }

      // Actualizar estado y fecha de envío
      await db.query(`
        UPDATE alertas
        SET estado = 'enviada', fecha_envio = NOW()
        WHERE id_alerta = ?
      `, [alerta.id_alerta]);
    }

  } catch (err) {
    console.error('Error actualizando alertas pendientes:', err);
  }
}

module.exports = (client, whatsappNumber) => {

  // Llamar a la función al iniciar el servidor
  actualizarAlertasPendientes(client, whatsappNumber);
  // Ejecutar automáticamente cada minuto
  setInterval(() => actualizarAlertasPendientes(client, whatsappNumber), 60000);

  // Obtener alertas
  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT a.*, v.placa, u.nombre_usuario AS usuario, t.nombre AS tecnico, c.telefono AS telefono_cliente
        FROM alertas a
        LEFT JOIN vehiculos v ON a.id_vehiculo = v.id_vehiculo
        LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
        LEFT JOIN tecnicos t ON a.id_tecnico = t.id_tecnico
        LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener alertas' });
    }
  });

  // Crear alerta y enviar WhatsApp
  router.post('/', async (req, res) => {
    const { id_vehiculo, id_tecnico, id_usuario, descripcion, fecha_programada, kilometraje_programado } = req.body;

    try {
      // Obtener teléfono del cliente
      const [vehiculos] = await db.query(
        'SELECT v.*, c.telefono AS telefono_cliente FROM vehiculos v LEFT JOIN clientes c ON v.id_cliente = c.id_cliente WHERE v.id_vehiculo = ?',
        [id_vehiculo]
      );

      if (!vehiculos.length || !vehiculos[0].telefono_cliente) {
        return res.status(400).json({ error: 'El vehículo no tiene un cliente con teléfono registrado' });
      }

      const telefonoCliente = vehiculos[0].telefono_cliente;

      // Fecha de creación / envío
      const fecha_envio = new Date(); // fecha actual
      const estado = 'pendiente';     // estado inicial

      // Registrar alerta en la BD
      const [result] = await db.query(`
        INSERT INTO alertas 
        (id_vehiculo, id_tecnico, id_usuario, descripcion, fecha_programada, fecha_envio, kilometraje_programado, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id_vehiculo,
        id_tecnico || null,
        id_usuario,
        descripcion,
        fecha_programada,
        fecha_envio,
        kilometraje_programado || null,
        estado
      ]);

      res.json({ message: 'Alerta creada correctamente.', id_alerta: result.insertId });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear alerta' });
    }
  });

  // Eliminar alerta
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM alertas WHERE id_alerta = ?', [id]);
      res.json({ message: 'Alerta eliminada correctamente.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar alerta' });
    }
  });

  return router;
};
