const express = require('express');
const router = express.Router();
const db = require('../db'); // conexión MySQL

// ===== Obtener todos los usuarios =====
router.get('/', async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios ORDER BY id_usuario DESC');
        res.json(usuarios);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// ===== Crear nuevo usuario =====
router.post('/', async (req, res) => {
    try {
        const { nombre_usuario, nombre_completo, contrasena, rol } = req.body;

        if (!nombre_usuario || !contrasena) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Verificar si el usuario ya existe
        const [existe] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
        if (existe.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }

        // Insertar nuevo usuario
        await db.query(
            `INSERT INTO usuarios (nombre_usuario, nombre_completo, contrasena, rol, fecha_registro)
             VALUES (?, ?, ?, ?, NOW())`,
            [nombre_usuario, nombre_completo || null, contrasena, rol || 'admin']
        );

        res.status(201).json({ message: 'Usuario creado correctamente' });

    } catch (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
});

// ===== Eliminar usuario =====
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });

    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});

module.exports = router;