// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ===== Login de usuario =====
router.post('/', async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;

        if (!nombre_usuario || !contrasena) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE nombre_usuario = ?',
            [nombre_usuario]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // Sin bcrypt: comparación directa
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const { id_usuario, nombre_usuario: nombre, nombre_completo, rol, fecha_registro } = usuario;

        res.json({
            message: 'Login exitoso',
            usuario: { id_usuario, nombre, nombre_completo, rol, fecha_registro }
        });

    } catch (err) {
        console.error('Error interno en /login:', err);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

module.exports = router;
