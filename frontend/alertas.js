const API_URL = 'http://localhost:3000';
const CODIGO_AUTORIZACION = 'TICS2025';

// Validar sesión
function validarSesion() {
  if(!localStorage.getItem('usuario')) window.location.href = 'login.html';
}

// Logout
function logout() {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

// Acceso a Usuarios
const linkUsuarios = document.getElementById('linkUsuarios');
if (linkUsuarios) {
  linkUsuarios.addEventListener('click', () => {
    const codigo = prompt('Ingrese el código de autorización para acceder a Usuarios:');
    if (codigo === CODIGO_AUTORIZACION) window.location.href = 'usuarios.html';
    else alert('Código incorrecto. No tiene acceso a Usuarios.');
  });
}

// Cargar técnicos
async function cargarTecnicosSelect() {
  try {
    const res = await fetch(`${API_URL}/tecnicos`);
    const tecnicos = await res.json();
    const select = document.getElementById('idTecnico');
    select.innerHTML = '<option value="">Seleccione Técnico</option>';
    tecnicos.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id_tecnico;
      opt.textContent = t.nombre;
      select.appendChild(opt);
    });
  } catch (error) { console.error(error); }
}

// Cargar vehículos
async function cargarVehiculosDatalist() {
  try {
    const res = await fetch(`${API_URL}/vehiculos`);
    const vehiculos = await res.json();
    const datalist = document.getElementById('vehiculosLista');
    datalist.innerHTML = '';
    vehiculos.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id_vehiculo;
      opt.text = `${v.marca} ${v.modelo} - ${v.placa}`;
      datalist.appendChild(opt);
    });
  } catch (error) { console.error(error); }
}

// Cargar alertas
async function cargarAlertas() {
  try {
    const res = await fetch(`${API_URL}/alertas`);
    const alertas = await res.json();
    const tbody = document.querySelector('#tablaAlertas tbody');
    tbody.innerHTML = '';

    alertas.forEach(a => {
      const fechaProgramada = new Date(a.fecha_programada).toLocaleString('es-EC', { dateStyle:'short', timeStyle:'short' });
      const fechaEnvio = a.fecha_envio ? new Date(a.fecha_envio).toLocaleString('es-EC', { dateStyle:'short', timeStyle:'short' }) : '';

      tbody.innerHTML += `
        <tr>
          <td>${a.id_alerta}</td>
          <td>${a.placa || a.id_vehiculo}</td>
          <td>${a.tecnico || ''}</td>
          <td>${a.usuario || ''}</td>
          <td>${a.descripcion}</td>
          <td>${fechaProgramada}</td>
          <td>${fechaEnvio}</td>
          <td>${a.kilometraje_programado || ''}</td>
          <td>${a.estado}</td>
          <td><button class="btnEliminar" data-id="${a.id_alerta}">Eliminar</button></td>
        </tr>
      `;
    });

    document.querySelectorAll('.btnEliminar').forEach(btn => {
      btn.addEventListener('click', async () => {
        if(!confirm('¿Deseas eliminar esta alerta?')) return;
        const id = btn.dataset.id;
        try {
          await fetch(`${API_URL}/alertas/${id}`, { method: 'DELETE' });
          cargarAlertas();
        } catch (err) { console.error(err); alert('Error al eliminar alerta'); }
      });
    });

  } catch (error) { console.error(error); }
}

// Agregar alerta
async function agregarAlerta(e) {
  e.preventDefault();
  const idVehiculo = document.getElementById('idVehiculo').value;
  const fechaProgramada = document.getElementById('fechaProgramada').value;

  const alerta = {
    id_vehiculo: idVehiculo,
    id_tecnico: document.getElementById('idTecnico').value,
    id_usuario: JSON.parse(localStorage.getItem('usuario')).id_usuario,
    descripcion: document.getElementById('descripcion').value,
    fecha_programada: fechaProgramada,
    kilometraje_programado: document.getElementById('kilometrajeProgramado').value
  };

  try {
    const res = await fetch(`${API_URL}/alertas`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(alerta)
    });

    const result = await res.json();

    if(res.ok){
      document.getElementById('formAlerta').reset();
      cargarAlertas();
      // opcional: eliminar mensaje de éxito si no quieres mostrar nada
      // document.getElementById('mensajeAlerta').textContent = '';
    } else {
      console.error(result.error); // solo loguea el error real
    }
  } catch (error) { console.error(error); }
}

document.addEventListener('DOMContentLoaded', () => {
  validarSesion();
  cargarTecnicosSelect();
  cargarVehiculosDatalist();
  cargarAlertas();
  document.getElementById('btnLogout').addEventListener('click', logout);
  document.getElementById('formAlerta').addEventListener('submit', agregarAlerta);
});
