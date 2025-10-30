const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar clientes
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM clientes');
    res.json(rows);
});

// Agregar cliente
router.post('/', async (req, res) => {
    const { nombre, apellido, telefono, correo } = req.body;
    await db.query('INSERT INTO clientes(nombre, apellido, telefono, correo) VALUES (?, ?, ?, ?)',
        [nombre, apellido, telefono, correo]);
    res.json({ message: 'Cliente agregado' });
});

// Eliminar cliente por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
});


module.exports = router;
