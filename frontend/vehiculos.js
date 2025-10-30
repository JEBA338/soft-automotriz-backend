const API_URL = 'http://localhost:3000';
const CODIGO_AUTORIZACION = 'TICS2025'; // Código generado por TICS

// Validar sesión
function validarSesion() {
    if(!localStorage.getItem('usuario')) window.location.href = 'login.html';
}

// Logout
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

// Control de acceso a Usuarios
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

// === Cargar vehículos en tabla ===
async function cargarVehiculos() {
    try {
        const res = await fetch(`${API_URL}/vehiculos`);
        const vehiculos = await res.json();
        const tbody = document.querySelector('#tablaVehiculos tbody');
        tbody.innerHTML = '';

        vehiculos.forEach(v => {
            tbody.innerHTML += `<tr>
                <td>${v.id_vehiculo}</td>
                <td>${v.id_cliente}</td>
                <td>${v.marca}</td>
                <td>${v.modelo}</td>
                <td>${v.anio}</td>
                <td>${v.placa}</td>
                <td>${v.kilometraje_actual || 0}</td>
                <td><button class="btnEliminar" data-id="${v.id_vehiculo}">Eliminar</button></td>
            </tr>`;
        });

        // Event listener para eliminar vehículos
        document.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
                if(!confirm('¿Deseas eliminar este vehículo?')) return;
                const id = btn.dataset.id;
                try {
                    await fetch(`${API_URL}/vehiculos/${id}`, { method: 'DELETE' });
                    cargarVehiculos();
                } catch (err) {
                    console.error(err);
                    alert('Error al eliminar vehículo');
                }
            });
        });

    } catch (error) {
        console.error(error);
    }
}

// === Agregar vehículo ===
async function agregarVehiculo() {
    const vehiculo = {
        id_cliente: document.getElementById('idClienteVehiculo').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        anio: document.getElementById('anio').value,
        placa: document.getElementById('placa').value,
        kilometraje_actual: parseInt(document.getElementById('kilometrajeactual').value) || 0
    };

    try {
        const res = await fetch(`${API_URL}/vehiculos`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(vehiculo)
        });
        

        // Limpiar formulario
        document.getElementById('idClienteVehiculo').value = '';
        document.getElementById('marca').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('anio').value = '';
        document.getElementById('placa').value = '';
        document.getElementById('kilometrajeactual').value = '';

        cargarVehiculos();
    } catch (error) {
        console.error(error);
        alert('Error al agregar vehículo');
    }
}

// === Cargar clientes en datalist ===
async function cargarClientesDatalist() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const clientes = await res.json();
        const datalist = document.getElementById('clientesLista');
        datalist.innerHTML = '';
        clientes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id_cliente;
            opt.text = `${c.nombre} ${c.apellido}`;
            datalist.appendChild(opt);
        });
    } catch (error) {
        console.error(error);
    }
}

// === Cargar marcas, modelos y años ===
function cargarCatalogos() {
    const marcas = ['Toyota','Honda','Ford','Chevrolet','Nissan'];
    const modelos = ['Corolla','Civic','F-150','Cruze','Sentra'];
    const anios = Array.from({length: 2026 - 1995 + 1}, (_, i) => 1995 + i);

    const marcasLista = document.getElementById('marcasLista');
    marcas.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        marcasLista.appendChild(opt);
    });

    const modelosLista = document.getElementById('modelosLista');
    modelos.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        modelosLista.appendChild(opt);
    });

    const aniosLista = document.getElementById('aniosLista');
    anios.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        aniosLista.appendChild(opt);
    });
}

// === DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', () => {
    validarSesion();
    cargarVehiculos();
    cargarCatalogos();
    cargarClientesDatalist();
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnAgregarVehiculo').addEventListener('click', agregarVehiculo);
});
