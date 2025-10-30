const API_URL = 'http://localhost:3000';

// Logout
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

// Cargar usuarios
async function cargarUsuarios() {
    try {
        const res = await fetch(`${API_URL}/usuarios`);
        const usuarios = await res.json();
        const tbody = document.querySelector('#tablaUsuarios tbody');
        tbody.innerHTML = '';

        usuarios.forEach(u => {
            tbody.innerHTML += `
            <tr style="background-color: #f7f7f7;">
                <td style="color: #0d3b66;">${u.id_usuario}</td>
                <td style="color: #0d3b66;">${u.nombre_usuario}</td>
                <td style="color: #0d3b66;">${u.nombre_completo || ''}</td>
                <td style="color: #0d3b66;">${u.rol}</td>
                <td style="color: #0d3b66;">${u.fecha_registro ? new Date(u.fecha_registro).toLocaleString() : ''}</td>
                <td>
                    <button class="btnEliminar" data-id="${u.id_usuario}" style="background-color: #d63447; color: white; border: none; padding: 5px 10px; border-radius: 4px;">Eliminar</button>
                </td>
            </tr>`;
        });

        // Evento eliminar
        document.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('¿Desea eliminar este usuario?')) return;
                const id = btn.dataset.id;
                try {
                    await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
                    cargarUsuarios();
                } catch (err) {
                    console.error(err);
                    alert('Error al eliminar usuario');
                }
            });
        });

    } catch (err) {
        console.error(err);
    }
}

// Agregar usuario (sin bcrypt)
async function agregarUsuario() {
    const nombre_usuario = document.getElementById('nombreUsuario').value.trim();
    const nombre_completo = document.getElementById('nombreCompleto').value.trim();
    const contrasena = document.getElementById('contrasenaUsuario').value.trim();
    const rol = document.getElementById('rolUsuario').value;
    const mensaje = document.getElementById('mensajeUsuario');

    if (!nombre_usuario || !contrasena) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Complete los campos obligatorios';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre_usuario, nombre_completo, contrasena, rol })
        });

        const data = await res.json();

        if (res.ok) {
            mensaje.style.color = 'green';
            mensaje.textContent = data.message;
            document.getElementById('nombreUsuario').value = '';
            document.getElementById('nombreCompleto').value = '';
            document.getElementById('contrasenaUsuario').value = '';
            cargarUsuarios(); // refresca la tabla
        } else {
            mensaje.style.color = 'red';
            mensaje.textContent = data.message || 'Error al agregar usuario';
        }

    } catch (err) {
        console.error(err);
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error al conectarse con el servidor';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('usuario')) window.location.href = 'login.html';
    cargarUsuarios();
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnAgregarUsuario').addEventListener('click', agregarUsuario);
});
