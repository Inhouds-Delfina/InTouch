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
    window.location.href = 'abm.html';
}

function irATTS() {
    cerrarMenu();
    window.location.href = 'tts.html';
}