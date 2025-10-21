let menuAbierto = false;

function mostrarMenu() {
    const menu = document.querySelector('.subButton-container');
    const boton = document.querySelector('.menufloat');
    
    if (!menuAbierto) {
        // Abrir menú
        menu.classList.add('show');
        boton.classList.add('rotar45');
        menuAbierto = true;
        
        // Agregar event listener para cerrar al hacer clic fuera
        setTimeout(() => {
            document.addEventListener('click', cerrarMenuFuera);
        }, 100);
    } else {
        // Cerrar menú
        cerrarMenu();
    }
}

function cerrarMenu() {
    const menu = document.querySelector('.subButton-container');
    const boton = document.querySelector('.menufloat');
    
    menu.classList.remove('show');
    boton.classList.remove('rotar45');
    menuAbierto = false;
    
    document.removeEventListener('click', cerrarMenuFuera);
}

function cerrarMenuFuera(event) {
    const menu = document.querySelector('.subButton-container');
    const boton = document.querySelector('.menufloat');
    
    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        cerrarMenu();
    }
}

// Mejorar la navegación
function irAAdmin() {
    cerrarMenu();
    console.log('Comprobando sesión antes de ir al panel de administración...');
    // Incluir credenciales para enviar la cookie de sesión
    fetch('php/check_session.php', { cache: 'no-store', credentials: 'same-origin' })
        .then(res => {
            console.log('check_session HTTP status:', res.status, res.statusText);
            return res.json();
        })
        .then(data => {
            console.log('check_session respuesta:', data);
            if (data && data.logged_in) {
                console.log('Sesión activa para', data.usuario, '- redirigiendo a abm.php');
                try { window._skipAutoLogout = true; } catch(e) {}
                window.location.href = 'views/abm.php';
            } else {
                console.log('No hay sesión activa - redirigiendo a login');
                try { window._skipAutoLogout = true; } catch(e) {}
                window.location.href = 'views/login.php';
            }
        })
        .catch(err => {
            console.error('Error comprobando sesión:', err);
            // Fallback: ir al login
            window.location.href = 'views/login.php';
        });
}

function irAABM() {
    cerrarMenu();
    try { window._skipAutoLogout = true; } catch(e) {}
    window.location.href = 'views/abm.html';
}

function irATTS() {
    cerrarMenu();
    try { window._skipAutoLogout = true; } catch(e) {}
    window.location.href = 'views/tts.html';
}

function irALOGIN()
{
    cerrarMenu();
    try { window._skipAutoLogout = true; } catch(e) {}
    window.location.href = 'views/login.html';
}

function irAREGISTER()
{
    cerrarMenu();
    try { window._skipAutoLogout = true; } catch(e) {}
    window.location.href = 'views/register.html';
}

function irALOGOUT()
{
    cerrarMenu();
    try { window._skipAutoLogout = true; } catch(e) {}
    window.location.href = 'views/logout.php';
}