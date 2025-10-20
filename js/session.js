// Cerrar sesión al cerrar la ventana o navegar fuera
window.addEventListener('beforeunload', function() {
    // Llamada síncrona para asegurar que se ejecute
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/php/auto_logout.php', false);
    xhr.send();
});

// También cerrar sesión si la pestaña queda inactiva por mucho tiempo
let inactivityTimeout;
const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutos

function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        window.location.href = '/php/logout.php';
    }, INACTIVITY_TIME);
}

// Reiniciar timer en cualquier actividad
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

// Iniciar el timer cuando carga la página
resetInactivityTimer();