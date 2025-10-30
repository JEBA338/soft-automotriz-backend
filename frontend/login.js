const API_URL = 'http://localhost:3000';

async function login() {
    const nombre_usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const mensaje = document.getElementById('mensaje');

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario, contrasena })
        });

        const data = await res.json();

        if (res.ok) {
            // Guardar usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            mensaje.style.color = 'green';
            mensaje.textContent = data.message;
            // Redirigir a alertas después de un pequeño delay
            setTimeout(() => {
                window.location.href = 'clientes.html';
            }, 500);
        } else {
            mensaje.style.color = 'red';
            mensaje.textContent = data.message;
        }
    } catch (error) {
        console.error('Error al conectarse con el servidor', error);
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error al conectarse con el servidor';
    }
}

document.getElementById('btnLogin').addEventListener('click', login);

// Opción: también permitir Enter en el formulario
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
