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

// Cargar clientes en tabla
async function cargarClientes() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const clientes = await res.json();
        const tbody = document.querySelector('#tablaClientes tbody');
        tbody.innerHTML = '';

        clientes.forEach(c => {
            tbody.innerHTML += `<tr>
                <td>${c.id_cliente}</td>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>${c.correo}</td>
                <td><button class="btnEliminar" data-id="${c.id_cliente}">Eliminar</button></td>
            </tr>`;
        });

        document.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
                if(!confirm('¿Deseas eliminar este cliente?')) return;
                const id = btn.dataset.id;
                try {
                    await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
                    cargarClientes();
                } catch (err) {
                    console.error(err);
                    alert('Error al eliminar cliente');
                }
            });
        });

    } catch (error) {
        console.error(error);
    }
}

// Agregar cliente
async function agregarCliente() {
    const cliente = {
        nombre: document.getElementById('nombreCliente').value,
        apellido: document.getElementById('apellidoCliente').value,
        telefono: document.getElementById('telefonoCliente').value,
        correo: document.getElementById('correoCliente').value
    };

    try {
        const res = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if(res.ok) {
            document.getElementById('nombreCliente').value = '';
            document.getElementById('apellidoCliente').value = '';
            document.getElementById('telefonoCliente').value = '';
            document.getElementById('correoCliente').value = '';
            cargarClientes();
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    validarSesion();
    cargarClientes();
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnAgregarCliente').addEventListener('click', agregarCliente);
});
