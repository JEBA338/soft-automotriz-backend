const API_URL = 'http://localhost:3000';

const CODIGO_AUTORIZACION = 'TICS2025'; // Código generado por TICS

// Validar sesión en cualquier página
function validarSesion() {
    if(!localStorage.getItem('usuario')) window.location.href = 'login.html';
}

// Logout
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

// Control de acceso a Usuarios desde el menú
const linkUsuarios = document.getElementById('linkUsuarios');
if (linkUsuarios) {
    linkUsuarios.addEventListener('click', () => {
        const codigo = prompt('Ingrese el código de autorización para acceder a Usuarios:');
        if (codigo === CODIGO_AUTORIZACION) {
            window.location.href = 'usuarios.html';
        } else {
            alert('Código incorrecto. No tiene acceso a Usuarios.');
        }
    });
}

function validarSesion() {
    if(!localStorage.getItem('usuario')) window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

async function cargarTecnicos() {
    try {
        const res = await fetch(`${API_URL}/tecnicos`);
        const tecnicos = await res.json();
        const tbody = document.querySelector('#tablaTecnicos tbody');
        tbody.innerHTML = '';

        tecnicos.forEach(t => {
            tbody.innerHTML += `<tr>
                <td>${t.id_tecnico}</td>
                <td>${t.nombre}</td>
                <td>${t.telefono}</td>
                <td>${t.especialidad || ''}</td>
                <td><button class="btnEliminar" data-id="${t.id_tecnico}">Eliminar</button></td>
            </tr>`;
        });

        document.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
                if(!confirm('¿Deseas eliminar este técnico?')) return;
                const id = btn.dataset.id;
                try {
                    await fetch(`${API_URL}/tecnicos/${id}`, { method: 'DELETE' });
                    cargarTecnicos();
                } catch (err) {
                    console.error(err);
                    alert('Error al eliminar técnico');
                }
            });
        });

    } catch (error) {
        console.error(error);
    }
}

async function agregarTecnico() {
    const tecnico = {
        nombre: document.getElementById('nombreTecnico').value,
        telefono: document.getElementById('telefonoTecnico').value,
        especialidad: document.getElementById('especialidadTecnico').value
    };
    try {
        const res = await fetch(`${API_URL}/tecnicos`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(tecnico)
        });
        if(res.ok){
            document.getElementById('nombreTecnico').value = '';
            document.getElementById('telefonoTecnico').value = '';
            document.getElementById('especialidadTecnico').value = '';
            cargarTecnicos();
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    validarSesion();
    cargarTecnicos();
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnAgregarTecnico').addEventListener('click', agregarTecnico);
});
