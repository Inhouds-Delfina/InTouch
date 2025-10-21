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
    fetch('/php/check_session.php', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
            console.log('check_session respuesta:', data);
            if (data && data.logged_in) {
                console.log('Sesión activa para', data.usuario, '- redirigiendo a abm.php');
                window.location.href = 'views/abm.php';
            } 
        })
        .catch(err => {
            console.error('Error comprobando sesión:', err);
            // Fallback: ir al login
            window.location.href = 'views/login.php';
        });
}

function irATTS() {
    cerrarMenu();
    window.location.href = 'views/tts.html';
}

function irALOGIN()
{
    cerrarMenu();
    window.location.href = 'views/login.php';
}

function irAREGISTER()
{
    cerrarMenu();
    window.location.href = 'views/register.php';
}

function irALOGOUT()
{
    cerrarMenu();
    window.location.href = 'views/logout.php';
}