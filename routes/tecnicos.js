const express = require('express');
const router = express.Router();
const db = require('../db');

// ===== POST para agregar técnico =====
router.post('/', async (req, res) => {
    const { nombre, telefono, especialidad } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tecnicos(nombre, telefono, especialidad) VALUES (?, ?, ?)',
            [nombre, telefono, especialidad]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ===== GET para listar técnicos =====
router.get('/', async (req, res) => {
    try {
        const [tecnicos] = await db.query('SELECT * FROM tecnicos');
        res.json(tecnicos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar tecnico por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM tecnicos WHERE id_tecnico = ?', [id]);
        res.json({ message: 'Técnico eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar técnico' });
    }
});


module.exports = router;
