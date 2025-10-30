const express = require('express');
const router = express.Router();
const db = require('../db');

// === Listar vehículos ===
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehiculos');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener vehículos' });
    }
});

// === Agregar vehículo ===
router.post('/', async (req, res) => {
    const { id_cliente, marca, modelo, anio, placa, kilometraje_actual } = req.body;

    try {
        await db.query(
            'INSERT INTO vehiculos (id_cliente, marca, modelo, anio, placa, kilometraje_actual) VALUES (?, ?, ?, ?, ?, ?)',
            [id_cliente, marca, modelo, anio, placa, kilometraje_actual || 0]
        );
        res.json({ message: 'Vehículo agregado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar vehículo' });
    }
});

// === Eliminar vehículo por ID ===
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM vehiculos WHERE id_vehiculo = ?', [id]);
        res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar vehículo' });
    }
});

module.exports = router;
